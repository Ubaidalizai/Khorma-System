const Purchase = require('../models/purchase.model');
const Supplier = require('../models/supplier.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const {
  createPurchaseSchema,
  updatePurchaseSchema,
} = require('../validations/purchase.validation');

const mongoose = require('mongoose');
const PurchaseItem = require('../models/purchaseItem.model');
const Product = require('../models/product.model');
const Unit = require('../models/unit.model');
const AuditLog = require('../models/auditLog.model');
const Stock = require('../models/stock.model');
const Account = require('../models/account.model');
const AccountTransaction = require('../models/accountTransaction.model');

// @desc Create a complete purchase (with items, stock & accounts)
// @route POST /api/v1/purchases
exports.createPurchase = asyncHandler(async (req, res, next) => {
  const { error } = createPurchaseSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const { supplier, purchaseDate, items, paidAmount, paymentAccount } =
    req.body;

  // 1️⃣ Start transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2️⃣ Validate supplier
    const supplierAccount = await Account.findOne({
      refId: supplier,
      type: 'supplier',
    });
    if (!supplierAccount) throw new AppError('Supplier account not found', 404);

    // 3️⃣ Validate payment account (Cash / Safe / Saraf)
    const payAccount = await Account.findById(paymentAccount);
    if (!payAccount) throw new AppError('Invalid payment account', 400);

    // 4️⃣ Calculate totals
    let totalAmount = 0;

    for (const item of items) {
      totalAmount += item.unitPrice * item.quantity;
    }

    const dueAmount = totalAmount - paidAmount;

    // 5️⃣ Create main purchase
    const purchase = await Purchase.create(
      [{ supplier, purchaseDate, totalAmount, paidAmount, dueAmount }],
      { session }
    );

    // 6️⃣ Process purchase items
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new AppError('Invalid product ID', 400);

      const unit = await Unit.findById(item.unit).session(session);
      if (!unit) throw new AppError('Invalid unit ID', 400);

      const totalPrice = item.unitPrice * item.quantity;

      // ✅ Assign consistent batch number ONCE
      const batchNum = product.trackByBatch
        ? item.batchNumber || `AUTO-${Date.now()}-${product._id}`
        : 'DEFAULT';

      // ✅ Assign expiryDate correctly (even if product is not batch-tracked)
      const expiryDate = item.expiryDate || null;

      // Create purchase item
      await PurchaseItem.create(
        [
          {
            purchase: purchase[0]._id,
            product: product._id,
            unit: unit._id,
            batchNumber: batchNum,
            expiryDate,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice,
          },
        ],
        { session }
      );

      // Update Product latestPurchasePrice (converted to base)
      const basePrice = item.unitPrice / unit.conversion_to_base;
      product.latestPurchasePrice = basePrice;
      await product.save({ session });

      // ✅ Update or insert Stock
      await Stock.findOneAndUpdate(
        { product: product._id, batchNumber: batchNum, location: 'store' },
        {
          $inc: { quantity: item.quantity * unit.conversion_to_base },
          $set: {
            expiryDate,
            purchasePricePerBaseUnit: item.unitPrice / unit.conversion_to_base,
            batchNumber: batchNum,
            unit: item.unit,
          },
        },
        { upsert: true, new: true, session }
      );
    }

    // 7️⃣ ACCOUNT TRANSACTIONS

    // Supplier (Debit)
    await AccountTransaction.create(
      [
        {
          account: supplierAccount._id,
          transactionType: 'Purchase',
          amount: totalAmount,
          referenceType: 'purchase',
          referenceId: purchase[0]._id,
          created_by: req.user._id,
          description: `Purchase from supplier ${supplierAccount.name}`,
        },
      ],
      { session }
    );

    supplierAccount.currentBalance += totalAmount;
    await supplierAccount.save({ session });

    // Payment Account (Credit)
    if (paidAmount > 0) {
      await AccountTransaction.create(
        [
          {
            account: payAccount._id,
            transactionType: 'Payment',
            amount: -paidAmount,
            referenceType: 'purchase',
            referenceId: purchase[0]._id,
            created_by: req.user._id,
            description: 'Payment for purchase',
          },
        ],
        { session }
      );

      payAccount.currentBalance -= paidAmount;
      await payAccount.save({ session });
    }

    // 8️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      purchase: purchase[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to create purchase', 500);
  }
});

// @desc    Get all purchases (paginated, optional search)
// @route   GET /api/v1/purchases
exports.getAllPurchases = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const includeDeleted = req.query.includeDeleted === 'true';

  const filter = includeDeleted ? {} : { isDeleted: false };

  const total = await Purchase.countDocuments(filter);

  const purchases = await Purchase.find(filter)
    .populate('supplier', 'name contactInfo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    results: purchases.length,
    purchases,
  });
});

// @desc    Get single purchase
// @route   GET /api/v1/purchases/:id
exports.getPurchaseById = asyncHandler(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id).populate(
    'supplier',
    'name contactInfo'
  );

  if (!purchase || purchase.isDeleted)
    throw new AppError('Purchase not found', 404);

  // Fetch purchase items with populated product and unit
  const items = await PurchaseItem.find({ 
    purchase: purchase._id, 
    isDeleted: false 
  })
    .populate('product', 'name')
    .populate('unit', 'name conversion_to_base');

  res.status(200).json({ 
    success: true, 
    purchase: {
      ...purchase.toObject(),
      items
    }
  });
});

// @desc Update purchase with items + accounts + stock + audit (transactional)
// @route PUT /api/v1/purchases/:id
exports.updatePurchase = asyncHandler(async (req, res, next) => {
  const { error } = updatePurchaseSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplier, purchaseDate, paidAmount, items, reason } = req.body;

    // 1️⃣ Fetch existing purchase and items
    const purchase = await Purchase.findById(req.params.id).session(session);
    if (!purchase || purchase.isDeleted)
      throw new AppError('Purchase not found', 404);

    const oldItems = await PurchaseItem.find({
      purchase: purchase._id,
    }).session(session);

    const oldDataSnapshot = {
      purchase: { ...purchase.toObject() },
      items: oldItems.map((i) => i.toObject()),
    };

    // 2️⃣ Update purchase core fields
    if (supplier) {
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) throw new AppError('Invalid supplier ID', 400);
      purchase.supplier = supplier;
    }

    if (purchaseDate) purchase.purchaseDate = purchaseDate;
    if (paidAmount !== undefined) purchase.paidAmount = paidAmount;

    // Recalculate total and due
    let newTotalAmount = 0;

    // 3️⃣ Update purchase items (delete old + re-add new)
    if (items && items.length > 0) {
      // Reverse previous stock & product prices
      for (const old of oldItems) {
        const unit = await Unit.findById(old.unit).session(session);
        await Stock.findOneAndUpdate(
          {
            product: old.product,
            batchNumber: old.batchNumber || 'DEFAULT',
            location: 'store',
          },
          { $inc: { quantity: -old.quantity * unit.conversion_to_base } },
          { session }
        );
      }

      // Delete old items
      await PurchaseItem.deleteMany({ purchase: purchase._id }).session(
        session
      );

      // Add new items
      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) throw new AppError('Invalid product ID', 400);

        const unit = await Unit.findById(item.unit).session(session);
        if (!unit) throw new AppError('Invalid unit ID', 400);

        const totalPrice = item.unitPrice * item.quantity;
        newTotalAmount += totalPrice;

        // Add back new stock
        const newBatchNum = product.trackByBatch
          ? item.batchNumber || `AUTO-${Date.now()}-${product._id}`
          : 'DEFAULT';

        await Stock.findOneAndUpdate(
          {
            product: product._id,
            batchNumber: newBatchNum,
            location: 'store',
          },
          {
            $inc: { quantity: item.quantity * unit.conversion_to_base },
            $set: {
              expiryDate: item.expiryDate || null,
              purchasePricePerBaseUnit:
                item.unitPrice / unit.conversion_to_base,
              batchNumber: newBatchNum,
              unit: item.unit,
            },
          },
          { upsert: true, session }
        );

        // Update latest purchase price (converted to base)
        const basePrice = item.unitPrice / unit.conversion_to_base;
        product.latestPurchasePrice = basePrice;
        await product.save({ session });

        // Recreate purchase item
        await PurchaseItem.create(
          [
            {
              purchase: purchase._id,
              product: product._id,
              unit: unit._id,
              batchNumber: newBatchNum,
              expiryDate: item.expiryDate || null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice,
            },
          ],
          { session }
        );
      }
    } else {
      newTotalAmount = purchase.totalAmount; // keep previous if no items changed
    }

    purchase.totalAmount = newTotalAmount;
    purchase.dueAmount = newTotalAmount - purchase.paidAmount;
    await purchase.save({ session });

    // 4️⃣ Update Account Balances
    const supplierAccount = await Account.findOne({
      refId: purchase.supplier,
      type: 'supplier',
    }).session(session);
    if (!supplierAccount) throw new AppError('Supplier account not found', 404);

    const supplierTxn = await AccountTransaction.findOne({
      referenceType: 'purchase',
      referenceId: purchase._id,
      account: supplierAccount._id,
    }).session(session);

    if (supplierTxn) {
      const diff = newTotalAmount - supplierTxn.amount;
      supplierTxn.amount = newTotalAmount;
      await supplierTxn.save({ session });
      supplierAccount.currentBalance += diff;
      await supplierAccount.save({ session });
    }

    // Update payment transaction if exists
    const payTxn = await AccountTransaction.findOne({
      referenceType: 'purchase',
      referenceId: purchase._id,
      transactionType: 'Payment',
    }).session(session);

    if (payTxn) {
      const payAcc = await Account.findById(payTxn.account).session(session);
      const diff = paidAmount - Math.abs(payTxn.amount);
      payAcc.currentBalance -= diff;
      await payAcc.save({ session });
      payTxn.amount = -paidAmount;
      // ensure transactionType and created_by are consistent for payment records
      payTxn.transactionType = 'Payment';
      if (!payTxn.created_by)
        payTxn.created_by = req.user?._id || payTxn.created_by;
      await payTxn.save({ session });
    }

    // 5️⃣ Audit Log entry
    const newItems = await PurchaseItem.find({
      purchase: purchase._id,
    }).session(session);
    const newDataSnapshot = {
      purchase: { ...purchase.toObject() },
      items: newItems.map((i) => i.toObject()),
    };

    await AuditLog.create(
      [
        {
          tableName: 'Purchase',
          recordId: purchase._id,
          operation: 'UPDATE',
          oldData: oldDataSnapshot,
          newData: newDataSnapshot,
          reason: reason || 'Purchase updated',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    // 6️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully (transactional)',
      purchase,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to update purchase', 500);
  }
});

// @desc    Soft delete purchase (rollback-safe)
// @route   DELETE /api/v1/purchases/:id
exports.softDeletePurchase = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.findById(req.params.id).session(session);
    if (!purchase || purchase.isDeleted)
      throw new AppError('Purchase not found', 404);

    const items = await PurchaseItem.find({ purchase: purchase._id }).session(
      session
    );
    const supplierAccount = await Account.findOne({
      refId: purchase.supplier,
      type: 'supplier',
    }).session(session);

    if (!supplierAccount) throw new AppError('Supplier account not found', 404);

    // 1️⃣ Reverse Stock Quantities
    for (const item of items) {
      const unit = await Unit.findById(item.unit).session(session);
      const batchNum = item.batchNumber || 'DEFAULT';
      await Stock.findOneAndUpdate(
        {
          product: item.product,
          batchNumber: batchNum,
          location: 'store',
        },
        { $inc: { quantity: -item.quantity * unit.conversion_to_base } },
        { session }
      );
    }

    // 2️⃣ Reverse Supplier Account
    supplierAccount.currentBalance -= purchase.totalAmount;
    await supplierAccount.save({ session });

    // 3️⃣ Remove AccountTransactions related to this purchase
    await AccountTransaction.updateMany(
      { referenceType: 'purchase', referenceId: purchase._id },
      { isDeleted: true },
      { session }
    );

    // 4️⃣ Soft delete the purchase
    purchase.isDeleted = true;
    await purchase.save({ session });

    // 5️⃣ Log Audit
    await AuditLog.create(
      [
        {
          tableName: 'Purchase',
          recordId: purchase._id,
          operation: 'DELETE',
          oldData: { purchase, items },
          newData: null,
          reason: 'Purchase deleted (stock & accounts reversed)',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully (rollback-safe)',
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to delete purchase', 500);
  }
});

// @desc    Restore soft-deleted purchase (rollback-safe)
// @route   PATCH /api/v1/purchases/:id/restore
exports.restorePurchase = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.findById(req.params.id).session(session);
    if (!purchase || !purchase.isDeleted)
      throw new AppError('Purchase not found or not deleted', 404);

    const items = await PurchaseItem.find({ purchase: purchase._id }).session(
      session
    );
    const supplierAccount = await Account.findOne({
      refId: purchase.supplier,
      type: 'supplier',
    }).session(session);

    if (!supplierAccount) throw new AppError('Supplier account not found', 404);

    // 1️⃣ Restore Stock Quantities
    for (const item of items) {
      const unit = await Unit.findById(item.unit).session(session);
      // Use 'DEFAULT' for non-batch-tracked products so we match the original upsert behavior
      const batchNum = item.batchNumber || 'DEFAULT';
      await Stock.findOneAndUpdate(
        {
          product: item.product,
          batchNumber: batchNum,
          location: 'store',
        },
        {
          $inc: { quantity: item.quantity * unit.conversion_to_base },
          $set: {
            expiryDate: item.expiryDate || null,
            purchasePricePerBaseUnit: item.unitPrice / unit.conversion_to_base,
            batchNumber: batchNum,
            unit: item.unit,
          },
        },
        { upsert: true, session }
      );
    }

    // 2️⃣ Restore Supplier Account
    supplierAccount.currentBalance += purchase.totalAmount;
    await supplierAccount.save({ session });

    // 3️⃣ Restore AccountTransactions
    await AccountTransaction.updateMany(
      { referenceType: 'purchase', referenceId: purchase._id },
      { isDeleted: false },
      { session }
    );

    // 4️⃣ Restore purchase itself
    purchase.isDeleted = false;
    await purchase.save({ session });

    // 5️⃣ Audit Log
    await AuditLog.create(
      [
        {
          tableName: 'Purchase',
          recordId: purchase._id,
          operation: 'UPDATE',
          oldData: null,
          newData: { purchase, items },
          reason: 'Purchase restored (stock & accounts re-applied)',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Purchase restored successfully (rollback-safe)',
      purchase,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to restore purchase', 500);
  }
});
