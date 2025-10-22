const Employee = require('../models/employee.model');
const Stock = require('../models/stock.model');
const StockTransfer = require('../models/stockTransfer.model');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Unit = require('../models/unit.model');
const AuditLog = require('../models/auditLog.model');
const EmployeeStock = require('../models/employeeStock.model');

// @desc    Transfer stock between locations (warehouse, store, employee)
// @route   POST /api/v1/stock-transfers
exports.transferStock = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product, fromLocation, toLocation, employee, quantity, notes } =
      req.body;

    if (fromLocation === toLocation)
      throw new AppError('From and To locations cannot be the same', 400);

    if (quantity <= 0)
      throw new AppError('Quantity must be greater than zero', 400);

    // 1️⃣ Handle deduction from source
    if (fromLocation === 'employee') {
      // deduct from employee stock
      const empStock = await EmployeeStock.findOne({
        employee,
        product,
        isDeleted: false,
      }).session(session);

      if (!empStock || empStock.quantity_in_hand < quantity) {
        throw new AppError('Insufficient stock in employee inventory', 400);
      }

      empStock.quantity_in_hand -= quantity;
      await empStock.save({ session });
    } else {
      // deduct from regular stock (warehouse or store)
      const fromStock = await Stock.findOne({
        product,
        location: fromLocation,
        isDeleted: false,
      }).session(session);
      
      if (!fromStock) {
        throw new AppError(`No stock found for this product in ${fromLocation}`, 404);
      }
      
      if (fromStock.quantity < quantity) {
        throw new AppError(`Insufficient stock in ${fromLocation}. Available: ${fromStock.quantity}, Requested: ${quantity}`, 400);
      }

      fromStock.quantity -= quantity;
      await fromStock.save({ session });
    }

    // 2️⃣ Handle addition to destination
    if (toLocation === 'employee') {
      // add to employee stock (EmployeeStock only tracks quantity, not detailed stock info)
      const empStock = await EmployeeStock.findOneAndUpdate(
        { employee, product, isDeleted: false },
        { $inc: { quantity_in_hand: quantity } },
        { upsert: true, new: true, session }
      );
    } else {
      // add to store/warehouse
      // First, get the source stock to copy its details (unit, batch, price, expiry)
      const sourceStock = await Stock.findOne({
        product,
        location: fromLocation,
        isDeleted: false,
      }).session(session);

      if (!sourceStock) {
        throw new AppError(`Source stock not found in ${fromLocation}`, 404);
      }

      // Check if destination stock already exists
      const existingToStock = await Stock.findOne({
        product,
        location: toLocation,
        isDeleted: false,
      }).session(session);

      if (existingToStock) {
        // Update existing stock with quantity only (preserve existing details)
        existingToStock.quantity += quantity;
        await existingToStock.save({ session });
      } else {
        // Create new stock record with all details from source
        // This preserves: unit, batchNumber, purchasePricePerBaseUnit, expiryDate
        await Stock.create(
          [
            {
              product: sourceStock.product,
              unit: sourceStock.unit,
              batchNumber: sourceStock.batchNumber,
              purchasePricePerBaseUnit: sourceStock.purchasePricePerBaseUnit,
              expiryDate: sourceStock.expiryDate,
              location: toLocation,
              quantity: quantity,
            },
          ],
          { session }
        );
      }
    }

    // 3️⃣ Log transfer
    const transfer = await StockTransfer.create(
      [
        {
          product,
          fromLocation,
          toLocation,
          employee: employee || null,
          quantity,
          transferredBy: req.user._id,
          notes,
        },
      ],
      { session }
    );

    // Audit log
    await AuditLog.create(
      [
        {
          tableName: 'StockTransfer',
          operation: 'INSERT',
          oldData: null,
          newData: transfer[0].toObject(),
          reason: notes || 'Stock transfer created',
          changedBy: req.user?.name || 'System',
          recordId: transfer[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Stock transferred successfully',
      transfer: transfer[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to transfer stock', 500);
  }
});

// @desc    Get all stock transfers (with pagination)
// @route   GET /api/v1/stock-transfers
exports.getAllStockTransfers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const transfers = await StockTransfer.find()
    .populate('product', 'name')
    .populate('employee', 'name') // optional, only if employee transfer
    .populate('transferredBy', 'name email')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await StockTransfer.countDocuments();

  res.status(200).json({
    status: 'success',
    results: transfers.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: transfers,
  });
});

// @desc    Get single transfer
// @route   GET /api/v1/stock-transfers/:id
exports.getStockTransfer = asyncHandler(async (req, res) => {
  const transfer = await StockTransfer.findById(req.params.id)
    .populate('product', 'name')
    .populate('employee', 'name')
    .populate('transferredBy', 'name email');

  if (!transfer) {
    throw new AppError('Stock transfer not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: transfer,
  });
});

// @desc    Update a stock transfer (rollback-safe)
// @route   PATCH /api/v1/stock-transfers/:id
exports.updateStockTransfer = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      product,
      fromLocation,
      toLocation,
      quantity,
      notes,
      employee,
      reason,
    } = req.body;
    const transfer = await StockTransfer.findById(req.params.id).session(
      session
    );

    if (!transfer || transfer.isDeleted)
      throw new AppError('Stock transfer not found', 404);

    // take snapshot for audit
    const oldData = { ...transfer.toObject() };

    // Reverse previous transfer effect first
    if (transfer.toLocation === 'employee') {
      const empStock = await EmployeeStock.findOne({
        employee: transfer.employee,
        product: transfer.product,
      }).session(session);

      if (empStock) {
        empStock.quantity_in_hand -= transfer.quantity;
        await empStock.save({ session });
      }
    } else {
      await Stock.findOneAndUpdate(
        { product: transfer.product, location: transfer.toLocation },
        { $inc: { quantity: -transfer.quantity } },
        { session }
      );
    }

    if (transfer.fromLocation === 'employee') {
      await EmployeeStock.findOneAndUpdate(
        { employee: transfer.employee, product: transfer.product },
        { $inc: { quantity_in_hand: transfer.quantity } },
        { session }
      );
    } else {
      await Stock.findOneAndUpdate(
        { product: transfer.product, location: transfer.fromLocation },
        { $inc: { quantity: transfer.quantity } },
        { session }
      );
    }

    // Apply new transfer effect
    const updatedProduct = product || transfer.product;
    const updatedEmployee = employee || transfer.employee;
    const newQty = quantity || transfer.quantity;
    const newFrom = fromLocation || transfer.fromLocation;
    const newTo = toLocation || transfer.toLocation;

    // Deduct from new source
    if (newFrom === 'employee') {
      const empStock = await EmployeeStock.findOne({
        employee: updatedEmployee,
        product: updatedProduct,
      }).session(session);
      if (!empStock || empStock.quantity_in_hand < newQty) {
        throw new AppError('Insufficient employee stock for update', 400);
      }
      empStock.quantity_in_hand -= newQty;
      await empStock.save({ session });
    } else {
      const srcStock = await Stock.findOne({
        product: updatedProduct,
        location: newFrom,
      }).session(session);
      if (!srcStock || srcStock.quantity < newQty) {
        throw new AppError('Insufficient stock in source location', 400);
      }
      srcStock.quantity -= newQty;
      await srcStock.save({ session });
    }

    // Add to new destination
    if (newTo === 'employee') {
      await EmployeeStock.findOneAndUpdate(
        { employee: updatedEmployee, product: updatedProduct },
        { $inc: { quantity_in_hand: newQty } },
        { upsert: true, session }
      );
    } else {
      // Check if destination stock already exists
      const existingToStock = await Stock.findOne({
        product: updatedProduct,
        location: newTo,
        isDeleted: false,
      }).session(session);

      if (existingToStock) {
        // Update existing stock with quantity only
        existingToStock.quantity += newQty;
        await existingToStock.save({ session });
      } else {
        // Get source stock details to copy
        const sourceStock = await Stock.findOne({
          product: updatedProduct,
          location: newFrom,
          isDeleted: false,
        }).session(session);

        if (sourceStock) {
          // Create new stock record with all details from source
          await Stock.create(
            [
              {
                product: sourceStock.product,
                unit: sourceStock.unit,
                batchNumber: sourceStock.batchNumber,
                purchasePricePerBaseUnit: sourceStock.purchasePricePerBaseUnit,
                expiryDate: sourceStock.expiryDate,
                location: newTo,
                quantity: newQty,
              },
            ],
            { session }
          );
        } else {
          // Fallback: create with basic info
          await Stock.findOneAndUpdate(
            { product: updatedProduct, location: newTo },
            { $inc: { quantity: newQty } },
            { upsert: true, session }
          );
        }
      }
    }

    // Update transfer record
    transfer.product = updatedProduct;
    transfer.employee = updatedEmployee;
    transfer.fromLocation = newFrom;
    transfer.toLocation = newTo;
    transfer.quantity = newQty;
    transfer.notes = notes || transfer.notes;
    await transfer.save({ session });

    // Audit log
    await AuditLog.create(
      [
        {
          tableName: 'StockTransfer',
          recordId: transfer._id,
          operation: 'UPDATE',
          oldData,
          newData: transfer.toObject(),
          reason: reason || 'Stock transfer updated',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stock transfer updated successfully',
      transfer,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to update stock transfer', 500);
  }
});

// @desc    Soft delete a stock transfer (rollback-safe)
// @route   DELETE /api/v1/stock-transfers/:id
exports.softDeleteStockTransfer = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transfer = await StockTransfer.findById(req.params.id).session(
      session
    );
    if (!transfer || transfer.isDeleted)
      throw new AppError('Stock transfer not found', 404);

    const oldData = { ...transfer.toObject() };

    // Reverse stock movement
    if (transfer.toLocation === 'employee') {
      const empStock = await EmployeeStock.findOne({
        employee: transfer.employee,
        product: transfer.product,
      }).session(session);

      if (!empStock || empStock.quantity_in_hand < transfer.quantity) {
        throw new AppError(
          'Insufficient employee stock to delete transfer',
          400
        );
      }
      empStock.quantity_in_hand -= transfer.quantity;
      await empStock.save({ session });
    } else {
      const destStock = await Stock.findOne({
        product: transfer.product,
        location: transfer.toLocation,
      }).session(session);

      if (!destStock || destStock.quantity < transfer.quantity) {
        throw new AppError(
          'Insufficient destination stock to delete transfer',
          400
        );
      }
      destStock.quantity -= transfer.quantity;
      await destStock.save({ session });
    }

    if (transfer.fromLocation === 'employee') {
      await EmployeeStock.findOneAndUpdate(
        { employee: transfer.employee, product: transfer.product },
        { $inc: { quantity_in_hand: transfer.quantity } },
        { upsert: true, session }
      );
    } else {
      await Stock.findOneAndUpdate(
        { product: transfer.product, location: transfer.fromLocation },
        { $inc: { quantity: transfer.quantity } },
        { upsert: true, session }
      );
    }

    // Mark deleted
    transfer.isDeleted = true;
    await transfer.save({ session });

    // Audit log
    await AuditLog.create(
      [
        {
          tableName: 'StockTransfer',
          recordId: transfer._id,
          operation: 'DELETE',
          oldData,
          newData: null,
          reason: req.body.reason || 'Stock transfer soft deleted',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stock transfer deleted successfully',
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to delete stock transfer', 500);
  }
});

// @desc    Restore a soft-deleted stock transfer (rollback-safe)
// @route   PATCH /api/v1/stock-transfers/:id/restore
exports.restoreStockTransfer = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transfer = await StockTransfer.findById(req.params.id).session(
      session
    );
    if (!transfer || !transfer.isDeleted)
      throw new AppError('Stock transfer not found or not deleted', 404);

    const oldData = { ...transfer.toObject() };

    const { product, fromLocation, toLocation, quantity, employee } = transfer;

    // Deduct again from the source (re-apply original movement)
    if (fromLocation === 'employee') {
      const empStock = await EmployeeStock.findOne({
        employee,
        product,
      }).session(session);

      if (!empStock || empStock.quantity_in_hand < quantity) {
        throw new AppError(
          'Insufficient employee stock to restore transfer',
          400
        );
      }

      empStock.quantity_in_hand -= quantity;
      await empStock.save({ session });
    } else {
      const sourceStock = await Stock.findOne({
        product,
        location: fromLocation,
      }).session(session);

      if (!sourceStock || sourceStock.quantity < quantity) {
        throw new AppError(
          'Insufficient source stock to restore transfer',
          400
        );
      }

      sourceStock.quantity -= quantity;
      await sourceStock.save({ session });
    }

    // Add again to the destination
    if (toLocation === 'employee') {
      await EmployeeStock.findOneAndUpdate(
        { employee, product },
        { $inc: { quantity_in_hand: quantity } },
        { upsert: true, session }
      );
    } else {
      // Check if destination stock already exists
      const existingToStock = await Stock.findOne({
        product,
        location: toLocation,
        isDeleted: false,
      }).session(session);

      if (existingToStock) {
        // Update existing stock with quantity only
        existingToStock.quantity += quantity;
        await existingToStock.save({ session });
      } else {
        // Get source stock details to copy
        const sourceStock = await Stock.findOne({
          product,
          location: fromLocation,
          isDeleted: false,
        }).session(session);

        if (sourceStock) {
          // Create new stock record with all details from source
          await Stock.create(
            [
              {
                product: sourceStock.product,
                unit: sourceStock.unit,
                batchNumber: sourceStock.batchNumber,
                purchasePricePerBaseUnit: sourceStock.purchasePricePerBaseUnit,
                expiryDate: sourceStock.expiryDate,
                location: toLocation,
                quantity: quantity,
              },
            ],
            { session }
          );
        } else {
          // Fallback: create with basic info
          await Stock.findOneAndUpdate(
            { product, location: toLocation },
            { $inc: { quantity } },
            { upsert: true, session }
          );
        }
      }
    }

    // Restore the record
    transfer.isDeleted = false;
    await transfer.save({ session });

    // Audit log
    await AuditLog.create(
      [
        {
          tableName: 'StockTransfer',
          recordId: transfer._id,
          operation: 'UPDATE',
          oldData: null,
          newData: transfer.toObject(),
          reason: 'Stock transfer restored',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stock transfer restored successfully',
      transfer,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to restore stock transfer', 500);
  }
});

// @desc Rollback a stock transfer (reverse)
// @route DELETE /api/v1/stock-transfers/:id
exports.rollbackStockTransfer = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transfer = await StockTransfer.findById(req.params.id).session(
      session
    );
    if (!transfer || transfer.isDeleted)
      throw new AppError('Transfer not found', 404);

    const { product, fromLocation, toLocation, quantity, employee } = transfer;

    // 🔹 STEP 1: Check destination has enough to reverse
    if (toLocation === 'employee') {
      const empStock = await EmployeeStock.findOne({
        employee,
        product,
        isDeleted: false,
      }).session(session);

      if (!empStock || empStock.quantity_in_hand < quantity) {
        throw new AppError(
          'Cannot rollback — insufficient employee stock',
          400
        );
      }

      empStock.quantity_in_hand -= quantity;
      await empStock.save({ session });
    } else {
      const toStock = await Stock.findOne({
        product,
        location: toLocation,
        isDeleted: false,
      }).session(session);

      if (!toStock || toStock.quantity < quantity) {
        throw new AppError(
          `Cannot rollback — insufficient ${toLocation} stock`,
          400
        );
      }

      toStock.quantity -= quantity;
      await toStock.save({ session });
    }

    // 🔹 STEP 2: Add quantity back to source
    if (fromLocation === 'employee') {
      await EmployeeStock.findOneAndUpdate(
        { employee, product, isDeleted: false },
        { $inc: { quantity_in_hand: quantity } },
        { upsert: true, session }
      );
    } else {
      // Check if source stock already exists
      const existingFromStock = await Stock.findOne({
        product,
        location: fromLocation,
        isDeleted: false,
      }).session(session);

      if (existingFromStock) {
        // Update existing stock with quantity only
        existingFromStock.quantity += quantity;
        await existingFromStock.save({ session });
      } else {
        // Get destination stock details to copy (since we're rolling back)
        const destStock = await Stock.findOne({
          product,
          location: toLocation,
          isDeleted: false,
        }).session(session);

        if (destStock) {
          // Create new stock record with all details from destination
          await Stock.create(
            [
              {
                product: destStock.product,
                unit: destStock.unit,
                batchNumber: destStock.batchNumber,
                purchasePricePerBaseUnit: destStock.purchasePricePerBaseUnit,
                expiryDate: destStock.expiryDate,
                location: fromLocation,
                quantity: quantity,
              },
            ],
            { session }
          );
        } else {
          // Fallback: create with basic info
          await Stock.findOneAndUpdate(
            { product, location: fromLocation, isDeleted: false },
            { $inc: { quantity } },
            { upsert: true, session }
          );
        }
      }
    }

    // 🔹 STEP 3: Mark as rolled back
    transfer.isDeleted = true;
    await transfer.save({ session });

    // 🔹 STEP 4: Audit log
    await AuditLog.create(
      [
        {
          tableName: 'StockTransfer',
          recordId: transfer._id,
          operation: 'DELETE',
          oldData: transfer,
          newData: null,
          reason: 'Stock transfer rolled back',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Stock transfer rolled back successfully',
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to rollback transfer', 500);
  }
});
