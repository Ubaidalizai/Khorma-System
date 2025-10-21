const Stock = require('../models/stock.model');
const Product = require('../models/product.model');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const {
  stockValidationSchema,
  updateStockValidationSchema,
} = require('../validations');

// @desc    Create new stock entry (e.g., during purchase)
// @route   POST /api/v1/stocks
exports.createStock = asyncHandler(async (req, res) => {
  // Validate the request body
  const { error } = stockValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const {
    product,
    batchNumber,
    expiry_date,
    location,
    quantity,
    unit,
    conversion_to_default,
    sale_price,
  } = req.body;

  // If stock exists for same product + batch + location → update it
  let stock = await Stock.findOne({
    product,
    batchNumber,
    location,
    isDeleted: false,
  });

  if (stock) {
    stock.quantity += quantity * conversion_to_default;
    await stock.save();
  } else {
    stock = await Stock.create({
      product,
      unit,
      batchNumber,
      purchasePricePerBaseUnit: sale_price || 0, // Use sale_price as purchase price
      expiryDate: expiry_date,
      location,
      quantity: quantity * conversion_to_default,
    });
  }

  res.status(201).json({ status: 'success', data: stock });
});

// @desc    Get all stocks (with pagination, location & search by product name)
// @route   GET /api/v1/stocks
exports.getAllStocks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, location, search } = req.query;

  const query = { isDeleted: false };
  if (location) query.location = location;

  // Build search filter (case-insensitive) for product name
  const searchFilter = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  // Step 1️⃣ — Find product IDs that match search (if search provided)
  let productIds = [];
  if (search) {
    const matchingProducts = await Product.find(searchFilter).select('_id');
    productIds = matchingProducts.map((p) => p._id);
    query.product = { $in: productIds };
  }

  // Step 2️⃣ — Fetch paginated stocks
  const stocks = await Stock.find(query)
    .populate('product', 'name')
    .populate('unit', 'name')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Stock.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: stocks.length,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    data: stocks,
  });
});


// @desc    Get single stock by ID
// @route   GET /api/v1/stocks/:id
exports.getStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ _id: req.params.id, isDeleted: false })
    .populate('product', 'name')
    .populate('unit', 'name');

  console.log(stock);
  if (!stock) throw new AppError('Stock not found', 404);

  res.status(200).json({ status: 'success', data: stock });
});

// @desc    Update stock (e.g., adjust quantity manually)
// @route   PATCH /api/v1/stocks/:id
exports.updateStock = asyncHandler(async (req, res) => {
  // Validate the request body
  const { error } = updateStockValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const stock = await Stock.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    req.body,
    { new: true, runValidators: true }
  );

  if (!stock) throw new AppError('Stock not found or already deleted', 404);

  res.status(200).json({ status: 'success', data: stock });
});

// @desc    Soft delete stock entry
// @route   DELETE /api/v1/stocks/:id
exports.deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!stock) throw new AppError('Stock not found or already deleted', 404);

  res
    .status(200)
    .json({ status: 'success', message: 'Stock deleted successfully (soft)' });
});

// Get all batches for a product at a specific location
exports.getBatchesByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { location } = req.query; // inventory / pharmacy

  if (!location) {
    throw new AppError('Location is required (inventory or pharmacy)', 400);
  }

  const batches = await Stock.find({
    product: productId,
    location,
    quantity: { $gt: 0 }, // only show batches with stock left
  })
    .select('batchNumber expiry_date quantity sale_price')
    .sort({ expiry_date: 1 }); // FEFO: first expiring first

  if (!batches || batches.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No batches found for this product in the selected location',
    });
  }

  res.status(200).json({
    success: true,
    count: batches.length,
    batches,
  });
});

// @desc    Get inventory statistics
// @route   GET /api/v1/stocks/stats
exports.getInventoryStats = asyncHandler(async (req, res) => {
  // Get total products count
  const totalProducts = await Product.countDocuments({ isDeleted: false });

  // Get warehouse stock stats
  const warehouseStats = await Stock.aggregate([
    { $match: { location: 'warehouse', isDeleted: false } },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$quantity', '$purchasePricePerBaseUnit'] } },
        uniqueProducts: { $addToSet: '$product' }
      }
    }
  ]);

  // Get store stock stats
  const storeStats = await Stock.aggregate([
    { $match: { location: 'store', isDeleted: false } },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$quantity', '$purchasePricePerBaseUnit'] } },
        uniqueProducts: { $addToSet: '$product' }
      }
    }
  ]);

  // Get low stock items (products below minimum level)
  const lowStockItems = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'stocks',
        let: { productId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$product', '$$productId'] },
              isDeleted: false
            }
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ],
        as: 'stockInfo'
      }
    },
    {
      $addFields: {
        currentStock: { $ifNull: [{ $arrayElemAt: ['$stockInfo.totalQuantity', 0] }, 0] }
      }
    },
    {
      $match: {
        $expr: { $lt: ['$currentStock', '$minLevel'] }
      }
    },
    {
      $project: {
        name: 1,
        minLevel: 1,
        currentStock: 1
      }
    }
  ]);

  const warehouseData = warehouseStats[0] || { totalQuantity: 0, totalValue: 0, uniqueProducts: [] };
  const storeData = storeStats[0] || { totalQuantity: 0, totalValue: 0, uniqueProducts: [] };

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      warehouse: {
        totalQuantity: warehouseData.totalQuantity,
        totalValue: warehouseData.totalValue,
        uniqueProducts: warehouseData.uniqueProducts.length
      },
      store: {
        totalQuantity: storeData.totalQuantity,
        totalValue: storeData.totalValue,
        uniqueProducts: storeData.uniqueProducts.length
      },
      lowStockItems: lowStockItems.length,
      lowStockDetails: lowStockItems
    }
  });
});
