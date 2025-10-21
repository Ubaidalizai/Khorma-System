const mongoose = require('mongoose');
const Account = require('../models/account.model');
const AuditLog = require('../models/auditLog.model');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Create a new account
// @route   POST /api/v1/accounts
exports.createAccount = asyncHandler(async (req, res, next) => {
  const { type, refId, name, openingBalance, currency } = req.body;

  // Validation
  if (!type || !name) throw new AppError('Type and Name are required', 400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Ensure no duplicate account for same type + refId
    const existing = await Account.findOne({
      type,
      refId,
      isDeleted: false,
    }).session(session);
    if (existing)
      throw new AppError('Account already exists for this entity', 400);

    const account = await Account.create(
      [
        {
          type,
          refId: refId || null,
          name,
          openingBalance: openingBalance || 0,
          currentBalance: openingBalance || 0,
          currency: currency || 'AFN',
        },
      ],
      { session }
    );

    // Audit log
    await AuditLog.create(
      [
        {
          tableName: 'Account',
          recordId: account[0]._id,
          operation: 'INSERT',
          oldData: null,
          newData: account[0],
          reason: 'Account created',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      account: account[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to create account', 500);
  }
});

// @desc    Get all accounts
// @route   GET /api/v1/accounts
exports.getAllAccounts = asyncHandler(async (req, res, next) => {
  const { type, search, page = 1, limit = 10 } = req.query;

  const query = { isDeleted: false };
  if (type) query.type = type;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [accounts, total] = await Promise.all([
    Account.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Account.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    accounts,
  });
});

// @desc    Get system accounts (cashier, safe, saraf)
// @route   GET /api/v1/accounts/system
exports.getSystemAccounts = asyncHandler(async (req, res, next) => {
  const systemTypes = ['cashier', 'safe', 'saraf'];
  
  const accounts = await Account.find({
    type: { $in: systemTypes },
    isDeleted: false
  }).sort({ type: 1, name: 1 });

  res.status(200).json({
    success: true,
    accounts,
  });
});

// @desc    Get single account
// @route   GET /api/v1/accounts/:id
exports.getAccount = asyncHandler(async (req, res, next) => {
  const accountId = req.params.id;
  const account = await Account.findOne({ _id: accountId, isDeleted: false });
  if (!account) throw new AppError('Account not found', 404);

  res.status(200).json({ success: true, account });
});

// @desc    Update account details
// @route   PATCH /api/v1/accounts/:id
exports.updateAccount = asyncHandler(async (req, res, next) => {
  const { name, openingBalance, currency } = req.body;
  const accountId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findById(accountId).session(session);
    if (!account || account.isDeleted)
      throw new AppError('Account not found', 404);

    const oldData = { ...account.toObject() };

    if (name) account.name = name;
    if (openingBalance !== undefined) account.openingBalance = openingBalance;
    if (currency) account.currency = currency;

    await account.save({ session });

    await AuditLog.create(
      [
        {
          tableName: 'Account',
          recordId: account._id,
          operation: 'UPDATE',
          oldData,
          newData: account.toObject(),
          reason: req.body.reason || 'Account updated',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      account,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to update account', 500);
  }
});

// @desc    Soft delete an account
// @route   DELETE /api/v1/accounts/:id
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const accountId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findById(accountId).session(session);
    if (!account || account.isDeleted)
      throw new AppError('Account not found', 404);

    const oldData = { ...account.toObject() };
    account.isDeleted = true;
    await account.save({ session });

    await AuditLog.create(
      [
        {
          tableName: 'Account',
          recordId: account._id,
          operation: 'DELETE',
          oldData,
          reason: req.body.reason || 'Account soft deleted',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Account soft deleted successfully',
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to delete account', 500);
  }
});

// @desc    Restore a soft-deleted account
// @route   PATCH /api/v1/accounts/:id/restore
exports.restoreAccount = asyncHandler(async (req, res, next) => {
  const accountId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findById(accountId).session(session);
    if (!account) throw new AppError('Account not found', 404);
    if (!account.isDeleted)
      throw new AppError('Account is already active', 400);

    account.isDeleted = false;
    await account.save({ session });

    await AuditLog.create(
      [
        {
          tableName: 'Account',
          recordId: account._id,
          operation: 'RESTORE',
          oldData: null,
          newData: account.toObject(),
          reason: req.body.reason || 'Account restored',
          changedBy: req.user?.name || 'System',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Account restored successfully',
      account,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to restore account', 500);
  }
});
