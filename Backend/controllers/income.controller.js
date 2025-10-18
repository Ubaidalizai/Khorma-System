const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const Income = require('../models/income.model');
const Category = require('../models/category.model');
const AuditLog = require('../models/auditLog.model');

// @desc    Get all income records with filtering and pagination
// @route   GET /api/v1/income
exports.getAllIncome = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 50,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    source,
    createdBy,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  // Build filter object
  const filter = { isDeleted: false };

  if (category) filter.category = new mongoose.Types.ObjectId(category);
  if (createdBy) filter.createdBy = new mongoose.Types.ObjectId(createdBy);
  if (source) filter.source = { $regex: source, $options: 'i' };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = parseFloat(minAmount);
    if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query
  const [incomeRecords, total] = await Promise.all([
    Income.find(filter)
      .populate('category', 'name type color')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Income.countDocuments(filter),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: incomeRecords.length,
    total,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: incomeRecords,
  });
});

// @desc    Get income records by category
// @route   GET /api/v1/income/category/:categoryId
exports.getIncomeByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const {
    page = 1,
    limit = 50,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError('Invalid category ID', 400);
  }

  const filter = {
    category: new mongoose.Types.ObjectId(categoryId),
    isDeleted: false,
  };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [incomeRecords, total] = await Promise.all([
    Income.find(filter)
      .populate('category', 'name type color')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Income.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: incomeRecords.length,
    total,
    categoryId,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: incomeRecords,
  });
});

// @desc    Get income records by source
// @route   GET /api/v1/income/source/:source
exports.getIncomeBySource = asyncHandler(async (req, res, next) => {
  const { source } = req.params;
  const {
    page = 1,
    limit = 50,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  const filter = {
    source: { $regex: new RegExp(source, 'i') },
    isDeleted: false,
  };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [incomeRecords, total] = await Promise.all([
    Income.find(filter)
      .populate('category', 'name type color')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Income.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: incomeRecords.length,
    total,
    source,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: incomeRecords,
  });
});

// @desc    Get a specific income record by ID
// @route   GET /api/v1/income/:id
exports.getIncomeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid income ID', 400);
  }

  const income = await Income.findOne({ _id: id, isDeleted: false })
    .populate('category', 'name type color')
    .populate('createdBy', 'name')
    .lean();

  if (!income) {
    throw new AppError('Income record not found', 404);
  }

  res.status(200).json({
    success: true,
    data: income,
  });
});

// @desc    Create a new income record
// @route   POST /api/v1/income
exports.createIncome = asyncHandler(async (req, res, next) => {
  const { category, amount, date, description, source } = req.body;

  if (!category || !amount || !source) {
    throw new AppError('Category, amount, and source are required', 400);
  }

  if (amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  // Validate category exists and is for income
  const categoryDoc = await Category.findOne({
    _id: category,
    isDeleted: false,
    isActive: true,
    $or: [{ type: 'income' }, { type: 'both' }],
  });

  if (!categoryDoc) {
    throw new AppError(
      'Invalid category or category not available for income',
      400
    );
  }

  const income = await Income.create({
    category,
    amount,
    date: date ? new Date(date) : new Date(),
    description,
    source,
    createdBy: req.user._id,
  });

  await income.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Income',
    recordId: income._id,
    operation: 'INSERT',
    oldData: null,
    newData: income.toObject(),
    reason: `Income created: ${categoryDoc.name} - ${amount} from ${source}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: 'Income record created successfully',
    data: income,
  });
});

// @desc    Update an income record
// @route   PATCH /api/v1/income/:id
exports.updateIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { category, amount, date, description, source } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid income ID', 400);
  }

  const income = await Income.findOne({ _id: id, isDeleted: false });
  if (!income) {
    throw new AppError('Income record not found', 404);
  }

  // Validate amount if provided
  if (amount !== undefined && amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  // Validate category if provided
  if (category) {
    const categoryDoc = await Category.findOne({
      _id: category,
      isDeleted: false,
      isActive: true,
      $or: [{ type: 'income' }, { type: 'both' }],
    });

    if (!categoryDoc) {
      throw new AppError(
        'Invalid category or category not available for income',
        400
      );
    }
  }

  const oldData = income.toObject();

  // Update fields
  if (category !== undefined) income.category = category;
  if (amount !== undefined) income.amount = amount;
  if (date !== undefined) income.date = new Date(date);
  if (description !== undefined) income.description = description;
  if (source !== undefined) income.source = source;

  await income.save();
  await income.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Income',
    recordId: income._id,
    operation: 'UPDATE',
    oldData,
    newData: income.toObject(),
    reason: `Income updated: ${income.amount} from ${income.source}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Income record updated successfully',
    data: income,
  });
});

// @desc    Delete an income record (soft delete)
// @route   DELETE /api/v1/income/:id
exports.deleteIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid income ID', 400);
  }

  const income = await Income.findOne({ _id: id, isDeleted: false });
  if (!income) {
    throw new AppError('Income record not found', 404);
  }

  const oldData = income.toObject();

  // Soft delete
  income.isDeleted = true;
  await income.save();

  // Audit log
  await AuditLog.create({
    tableName: 'Income',
    recordId: income._id,
    operation: 'DELETE',
    oldData,
    newData: { isDeleted: true },
    reason: `Income deleted: ${income.amount} from ${income.source}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Income record deleted successfully',
  });
});

// @desc    Restore a deleted income record
// @route   PATCH /api/v1/income/:id/restore
exports.restoreIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid income ID', 400);
  }

  const income = await Income.findOne({ _id: id, isDeleted: true });
  if (!income) {
    throw new AppError('Deleted income record not found', 404);
  }

  // Validate category still exists and is active
  const categoryDoc = await Category.findOne({
    _id: income.category,
    isDeleted: false,
    isActive: true,
    $or: [{ type: 'income' }, { type: 'both' }],
  });

  if (!categoryDoc) {
    throw new AppError(
      'Cannot restore income: Category no longer exists or is inactive',
      400
    );
  }

  const oldData = income.toObject();

  // Restore income
  income.isDeleted = false;
  await income.save();

  await income.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Income',
    recordId: income._id,
    operation: 'UPDATE',
    oldData,
    newData: income.toObject(),
    reason: `Income restored: ${income.amount} from ${income.source}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Income record restored successfully',
    data: income,
  });
});

// @desc    Get income statistics
// @route   GET /api/v1/income/stats
exports.getIncomeStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, category, source } = req.query;

  const matchStage = { isDeleted: false };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  if (category) {
    matchStage.category = new mongoose.Types.ObjectId(category);
  }

  if (source) {
    matchStage.source = { $regex: source, $options: 'i' };
  }

  // Total income and count
  const totalStats = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        averageAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' },
      },
    },
  ]);

  // Income by category
  const categoryStats = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    {
      $unwind: '$categoryInfo',
    },
    {
      $project: {
        categoryName: '$categoryInfo.name',
        categoryColor: '$categoryInfo.color',
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  // Income by source
  const sourceStats = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$source',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  // Monthly income
  const monthlyStats = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { year: -1, month: -1 } },
  ]);

  const result = {
    summary: totalStats[0] || {
      totalAmount: 0,
      totalCount: 0,
      averageAmount: 0,
      minAmount: 0,
      maxAmount: 0,
    },
    byCategory: categoryStats,
    bySource: sourceStats,
    monthly: monthlyStats,
  };

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Get income summary by date range
// @route   GET /api/v1/income/summary
exports.getIncomeSummary = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, groupBy = 'day' } = req.query;

  if (!startDate || !endDate) {
    throw new AppError('Start date and end date are required', 400);
  }

  const matchStage = {
    isDeleted: false,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  let groupStage;
  switch (groupBy) {
    case 'day':
      groupStage = {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
        },
      };
      break;
    case 'week':
      groupStage = {
        _id: {
          year: { $year: '$date' },
          week: { $week: '$date' },
        },
      };
      break;
    case 'month':
      groupStage = {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
      };
      break;
    default:
      throw new AppError(
        'Invalid groupBy parameter. Must be day, week, or month',
        400
      );
  }

  const summary = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        ...groupStage,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      period: { startDate, endDate },
      groupBy,
      summary,
    },
  });
});
