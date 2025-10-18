const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const Expense = require('../models/expense.model');
const Category = require('../models/category.model');
const AuditLog = require('../models/auditLog.model');

// @desc    Get all expenses with filtering and pagination
// @route   GET /api/v1/expenses
exports.getAllExpenses = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 50,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    createdBy,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  // Build filter object
  const filter = { isDeleted: false };

  if (category) filter.category = new mongoose.Types.ObjectId(category);
  if (createdBy) filter.createdBy = new mongoose.Types.ObjectId(createdBy);

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
  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('category', 'name type color')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Expense.countDocuments(filter),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: expenses.length,
    total,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: expenses,
  });
});

// @desc    Get expenses by category
// @route   GET /api/v1/expenses/category/:categoryId
exports.getExpensesByCategory = asyncHandler(async (req, res, next) => {
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

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('category', 'name type color')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Expense.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: expenses.length,
    total,
    categoryId,
    pagination: {
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum,
    },
    data: expenses,
  });
});

// @desc    Get a specific expense by ID
// @route   GET /api/v1/expenses/:id
exports.getExpenseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense ID', 400);
  }

  const expense = await Expense.findOne({ _id: id, isDeleted: false })
    .populate('category', 'name type color')
    .populate('createdBy', 'name')
    .lean();

  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Create a new expense
// @route   POST /api/v1/expenses
exports.createExpense = asyncHandler(async (req, res, next) => {
  const { category, amount, date, description } = req.body;

  if (!category || !amount) {
    throw new AppError('Category and amount are required', 400);
  }

  if (amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  // Validate category exists and is for expenses
  const categoryDoc = await Category.findOne({
    _id: category,
    isDeleted: false,
    isActive: true,
    $or: [{ type: 'expense' }, { type: 'both' }],
  });

  if (!categoryDoc) {
    throw new AppError(
      'Invalid category or category not available for expenses',
      400
    );
  }

  const expense = await Expense.create({
    category,
    amount,
    date: date ? new Date(date) : new Date(),
    description,
    createdBy: req.user._id,
  });

  await expense.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Expense',
    recordId: expense._id,
    operation: 'INSERT',
    oldData: null,
    newData: expense.toObject(),
    reason: `Expense created: ${categoryDoc.name} - ${amount}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: 'Expense created successfully',
    data: expense,
  });
});

// @desc    Update an expense
// @route   PATCH /api/v1/expenses/:id
exports.updateExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { category, amount, date, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense ID', 400);
  }

  const expense = await Expense.findOne({ _id: id, isDeleted: false });
  if (!expense) {
    throw new AppError('Expense not found', 404);
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
      $or: [{ type: 'expense' }, { type: 'both' }],
    });

    if (!categoryDoc) {
      throw new AppError(
        'Invalid category or category not available for expenses',
        400
      );
    }
  }

  const oldData = expense.toObject();

  // Update fields
  if (category !== undefined) expense.category = category;
  if (amount !== undefined) expense.amount = amount;
  if (date !== undefined) expense.date = new Date(date);
  if (description !== undefined) expense.description = description;

  await expense.save();
  await expense.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Expense',
    recordId: expense._id,
    operation: 'UPDATE',
    oldData,
    newData: expense.toObject(),
    reason: `Expense updated: ${expense.amount}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Expense updated successfully',
    data: expense,
  });
});

// @desc    Delete an expense (soft delete)
// @route   DELETE /api/v1/expenses/:id
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense ID', 400);
  }

  const expense = await Expense.findOne({ _id: id, isDeleted: false });
  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  const oldData = expense.toObject();

  // Soft delete
  expense.isDeleted = true;
  await expense.save();

  // Audit log
  await AuditLog.create({
    tableName: 'Expense',
    recordId: expense._id,
    operation: 'DELETE',
    oldData,
    newData: { isDeleted: true },
    reason: `Expense deleted: ${expense.amount}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Expense deleted successfully',
  });
});

// @desc    Restore a deleted expense
// @route   PATCH /api/v1/expenses/:id/restore
exports.restoreExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense ID', 400);
  }

  const expense = await Expense.findOne({ _id: id, isDeleted: true });
  if (!expense) {
    throw new AppError('Deleted expense not found', 404);
  }

  // Validate category still exists and is active
  const categoryDoc = await Category.findOne({
    _id: expense.category,
    isDeleted: false,
    isActive: true,
    $or: [{ type: 'expense' }, { type: 'both' }],
  });

  if (!categoryDoc) {
    throw new AppError(
      'Cannot restore expense: Category no longer exists or is inactive',
      400
    );
  }

  const oldData = expense.toObject();

  // Restore expense
  expense.isDeleted = false;
  await expense.save();

  await expense.populate([
    { path: 'category', select: 'name type color' },
    { path: 'createdBy', select: 'name' },
  ]);

  // Audit log
  await AuditLog.create({
    tableName: 'Expense',
    recordId: expense._id,
    operation: 'UPDATE',
    oldData,
    newData: expense.toObject(),
    reason: `Expense restored: ${expense.amount}`,
    changedBy: req.user?.name || 'System',
    changedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Expense restored successfully',
    data: expense,
  });
});

// @desc    Get expense statistics
// @route   GET /api/v1/expenses/stats
exports.getExpenseStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, category } = req.query;

  const matchStage = { isDeleted: false };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  if (category) {
    matchStage.category = new mongoose.Types.ObjectId(category);
  }

  // Total expenses and count
  const totalStats = await Expense.aggregate([
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

  // Expenses by category
  const categoryStats = await Expense.aggregate([
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

  // Monthly expenses
  const monthlyStats = await Expense.aggregate([
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
    monthly: monthlyStats,
  };

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Get expense summary by date range
// @route   GET /api/v1/expenses/summary
exports.getExpenseSummary = asyncHandler(async (req, res, next) => {
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

  const summary = await Expense.aggregate([
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
