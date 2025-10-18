const express = require('express');
const {
  createManualTransaction,
  transferBetweenAccounts,
  reverseTransaction,
} = require('../controllers/accountTransaction.controller');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all account transaction routes
router.use(authenticate);

// Create a manual transaction (Credit/Debit/Expense)
router.post('/', createManualTransaction);

// Transfer between two accounts (double-entry)
router.post('/transfer', transferBetweenAccounts);

// Reverse a transaction
router.post('/:id/reverse', reverseTransaction);

module.exports = router;
