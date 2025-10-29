const mongoose = require('mongoose');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const Account = require('../models/account.model');
const AccountTransaction = require('../models/accountTransaction.model');
const AuditLog = require('../models/auditLog.model');

// @desc Get all account transactions with pagination and filters
// @route GET /api/v1/account-transactions
exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'desc',
    accountId,
    transactionType,
    referenceType,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    isReversed,
    search,
  } = req.query;

  // Build query object
  const query = { isDeleted: false };

  // Filter by account
  if (accountId) {
    query.account = accountId;
  }

  // Filter by transaction type
  if (transactionType) {
    query.transactionType = transactionType;
  }

  // Filter by reference type
  if (referenceType) {
    query.referenceType = referenceType;
  }

  // Filter by date range
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.date = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.date = { $lte: new Date(endDate) };
  }

  // Filter by amount range
  if (minAmount !== undefined || maxAmount !== undefined) {
    query.amount = {};
    if (minAmount !== undefined) query.amount.$gte = parseFloat(minAmount);
    if (maxAmount !== undefined) query.amount.$lte = parseFloat(maxAmount);
  }

  // Filter by reversal status
  if (isReversed !== undefined) {
    query.reversed = isReversed === 'true';
  }

  // Search in description
  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const transactions = await AccountTransaction.find(query)
    .populate('account', 'name type')
    .populate('created_by', 'name')
    .populate('reversedBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const totalTransactions = await AccountTransaction.countDocuments(query);
  const totalPages = Math.ceil(totalTransactions / limitNum);

  // Calculate summary statistics
  const summaryPipeline = [
    { $match: query },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCredit: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
        totalDebit: { $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] } },
        avgAmount: { $avg: '$amount' },
        maxAmount: { $max: '$amount' },
        minAmount: { $min: '$amount' },
      },
    },
  ];

  const summary = await AccountTransaction.aggregate(summaryPipeline);

  res.status(200).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTransactions,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      summary: summary[0] || {
        totalAmount: 0,
        totalCredit: 0,
        totalDebit: 0,
        avgAmount: 0,
        maxAmount: 0,
        minAmount: 0,
      },
      filters: {
        accountId,
        transactionType,
        referenceType,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        isReversed,
        search,
      },
    },
  });
});

// @desc Get Ledger of a specific account
// @route GET /api/v1/accounts/:id/ledger
exports.getAccountLedger = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { startDate, endDate, type } = req.query;

  const account = await Account.findById(id);
  if (!account || account.isDeleted)
    throw new AppError('Account not found', 404);

  const query = { account: id, isDeleted: false };

  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  if (type) query.transactionType = type;

  const transactions = await AccountTransaction.find(query)
    .populate('created_by', 'name')
    .sort({ date: 1 });

  let runningBalance = (account.openingBalance);
  const ledger = transactions.map((txn) => {
    runningBalance += txn.amount;
    return {
      date: txn.date,
      type: txn.transactionType,
      amount: txn.amount,
      description: txn.description,
      balanceAfter: runningBalance,
      referenceType: txn.referenceType,
      referenceId: txn.referenceId,
      transactionId: txn._id,
    };
  });

  res.status(200).json({
    success: true,
    account: account.name,
    accountType: account.type,
    openingBalance: account.openingBalance,
    currentBalance: account.currentBalance,
    totalTransactions: transactions.length,
    ledger,
  });
});

// Helper function to validate account balance
const validateAccountBalance = async (accountId, requiredAmount, session) => {
  const account = await Account.findById(accountId).session(session);
  if (!account) throw new AppError('Account not found', 404);
  
  if (requiredAmount > 0) {
    // Only validate cashier and safe accounts - they cannot go negative
    if (account.type === 'cashier' || account.type === 'safe') {
      if (account.currentBalance < requiredAmount) {
        throw new AppError(
          `موجودی ناکافی! در حساب ${account.name} موجودی: ${account.currentBalance.toLocaleString()} افغانی، مبلغ مورد نیاز: ${requiredAmount.toLocaleString()} افغانی`,
          400
        );
      }
    }
    // Saraf account can go negative (credit account), so no validation needed
  }
  
  return account;
};

// @desc Add manual transaction (Credit/Debit/Expense etc.)
// @route POST /api/v1/account-transactions
exports.createManualTransaction = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accountId, transactionType, amount, description } = req.body;

    if (!accountId || !transactionType || !amount)
      throw new AppError('All required fields must be provided', 400);

    const account = await Account.findById(accountId).session(session);
    if (!account) throw new AppError('Account not found', 404);

    // Determine the actual amount to add to balance based on transaction type
    let actualAmount = amount;
    if (transactionType === 'Debit' || transactionType === 'Expense') {
      actualAmount = -amount; // Debit and Expense should decrease balance
      
      // Validate that the account has enough balance before decreasing it
      await validateAccountBalance(accountId, amount, session);
    }

    // Create transaction
    const transaction = await AccountTransaction.create(
      [
        {
          account: account._id,
          transactionType,
          amount: actualAmount, // Store the actual amount (positive/negative)
          description,
          created_by: req.user._id,
        },
      ],
      { session }
    );

    // Update account balance
    account.currentBalance += actualAmount;
    await account.save({ session });

    // After saving account
    await AuditLog.create(
      [
        {
          tableName: 'AccountTransaction',
          recordId: transaction[0]._id,
          operation: 'INSERT',
          oldData: null,
          newData: transaction[0].toObject(),
          reason: description || 'Manual transaction created',
          changedBy: req.user?.name || 'System',
          changedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      transaction: transaction[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message, 500);
  }
});

// @desc Transfer money between two accounts (Double-entry)
// @route POST /api/v1/account-transactions/transfer
exports.transferBetweenAccounts = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;

    if (!fromAccountId || !toAccountId || !amount)
      throw new AppError('From, To, and Amount are required', 400);

    if (fromAccountId === toAccountId)
      throw new AppError('Cannot transfer between the same account', 400);

    const fromAccount = await Account.findById(fromAccountId).session(session);
    const toAccount = await Account.findById(toAccountId).session(session);

    if (!fromAccount || fromAccount.isDeleted)
      throw new AppError('Source account not found', 404);
    if (!toAccount || toAccount.isDeleted)
      throw new AppError('Destination account not found', 404);

    // Validate that source account has enough balance (only for cashier/safe accounts)
    if (fromAccount.type === 'cashier' || fromAccount.type === 'safe') {
      if (fromAccount.currentBalance < amount) {
        throw new AppError(
          `موجودی ناکافی! در حساب ${fromAccount.name} موجودی: ${fromAccount.currentBalance.toLocaleString()} افغانی، مبلغ مورد نیاز: ${amount.toLocaleString()} افغانی`,
          400
        );
      }
    } else if (fromAccount.currentBalance < amount) {
      // For other account types, still check but with generic message
      throw new AppError('Insufficient balance in source account', 400);
    }

    // Create a shared reference id to link both sides of this transfer
    const transferGroupId = new mongoose.Types.ObjectId();

    // 1️⃣ Create Debit Transaction for source account
    const debitTx = await AccountTransaction.create(
      [
        {
          account: fromAccount._id,
          transactionType: 'Transfer',
          amount: -Math.abs(amount), // debit
          referenceType: 'transfer',
          referenceId: transferGroupId,
          description:
            description ||
            `Transfer to ${toAccount.name || toAccount.type.toUpperCase()}`,
          created_by: req.user._id,
        },
      ],
      { session }
    );

    // 2️⃣ Create Credit Transaction for destination account
    const creditTx = await AccountTransaction.create(
      [
        {
          account: toAccount._id,
          transactionType: 'Transfer',
          amount: Math.abs(amount), // credit
          referenceType: 'transfer',
          referenceId: transferGroupId,
          description:
            description ||
            `Received from ${fromAccount.name || fromAccount.type.toUpperCase()}`,
          created_by: req.user._id,
        },
      ],
      { session }
    );

    // 3️⃣ Update Balances
    fromAccount.currentBalance -= amount;
    toAccount.currentBalance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    // 4️⃣ Audit Log for both entries
    await AuditLog.create(
      [
        {
          tableName: 'AccountTransaction',
          recordId: debitTx[0]._id,
          operation: 'INSERT',
          oldData: null,
          newData: debitTx[0].toObject(),
          reason: description || 'Account-to-account transfer',
          changedBy: req.user?.name || 'System',
          changedAt: new Date(),
        },
        {
          tableName: 'AccountTransaction',
          recordId: creditTx[0]._id,
          operation: 'INSERT',
          oldData: null,
          newData: creditTx[0].toObject(),
          reason: description || 'Account-to-account transfer',
          changedBy: req.user?.name || 'System',
          changedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      transfer: {
        from: fromAccount.name,
        to: toAccount.name,
        amount,
        debitTransaction: debitTx[0],
        creditTransaction: creditTx[0],
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to transfer funds', 500);
  }
});

// @desc    Reverse an account transaction (safe rollback)
// @route   POST /api/v1/account-transactions/:id/reverse
exports.reverseTransaction = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const txnId = req.params.id;
    const reason = req.body.reason || `Reversal of transaction ${txnId}`;

    const orig = await AccountTransaction.findById(txnId).session(session);
    if (!orig || orig.isDeleted)
      throw new AppError('Transaction not found', 404);

    if (orig.reversed === true)
      throw new AppError('Transaction already reversed', 400);

    // Collect transactions to reverse: original and its paired transfer (if any)
    let transactionsToReverse = [orig];

    // If it's a transfer, try to find its paired side
    if (orig.transactionType === 'Transfer') {
      let paired = null;

      if (orig.referenceType === 'transfer' && orig.referenceId) {
        // Both sides should share the same referenceId
        const pairedCandidates = await AccountTransaction.find({
          _id: { $ne: orig._id },
          referenceType: 'transfer',
          referenceId: orig.referenceId,
          isDeleted: false,
        }).session(session);
        if (pairedCandidates && pairedCandidates.length > 0) {
          paired = pairedCandidates[0];
        }
      }

      // Fallback matcher for legacy transfers without referenceId
      if (!paired) {
        paired = await AccountTransaction.findOne({
          _id: { $ne: orig._id },
          transactionType: 'Transfer',
          isDeleted: false,
          created_by: orig.created_by,
          amount: { $eq: -orig.amount },
        })
          .sort({ createdAt: 1 })
          .session(session);
      }

      if (paired && paired.reversed === true) {
        throw new AppError('Paired transfer already reversed', 400);
      }

      if (paired) {
        transactionsToReverse = [orig, paired];
      }
    }

    const reversals = [];

    for (const tx of transactionsToReverse) {
      const acc = await Account.findById(tx.account).session(session);
      if (!acc || acc.isDeleted) throw new AppError('Account not found', 404);

      const revAmount = -tx.amount;
      const rev = await AccountTransaction.create(
        [
          {
            account: acc._id,
            date: new Date(),
            transactionType: revAmount < 0 ? 'Debit' : 'Credit',
            amount: revAmount,
            referenceType:
              tx.referenceType ||
              (tx.transactionType === 'Transfer' ? 'transfer' : undefined),
            referenceId: tx.referenceId || undefined,
            description: `Reversal: ${reason}`,
            created_by: req.user._id,
            isDeleted: false,
          },
        ],
        { session }
      );

      // Apply to account balance
      acc.currentBalance += -tx.amount;
      await acc.save({ session });

      // Mark original transaction as reversed (metadata)
      tx.reversed = true;
      tx.reversalTransaction = rev[0]._id;
      tx.reversedBy = req.user._id;
      tx.reversedAt = new Date();
      await tx.save({ session });

      // Audit log per reversal
      await AuditLog.create(
        [
          {
            tableName: 'AccountTransaction',
            recordId: tx._id,
            operation: 'DELETE',
            oldData: tx.toObject(),
            newData: { reversed: true, reversalTransaction: rev[0]._id },
            reason,
            changedBy: req.user?.name || 'System',
          },
        ],
        { session }
      );

      reversals.push(rev[0]);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Transaction reversed successfully',
      reversals,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(err.message || 'Failed to reverse transaction', 500);
  }
});
