const express = require('express');
const {
  createAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  restoreAccount,
} = require('../controllers/account.controller');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  getAccountLedger,
} = require('../controllers/accountTransaction.controller');

const router = express.Router();

// protect all account routes
router.use(authenticate);

router.route('/').post(createAccount).get(getAllAccounts);
router.route('/:id').get(getAccount).patch(updateAccount).delete(deleteAccount);
router.patch('/:id/restore', restoreAccount);
router.get('/:id/ledger', getAccountLedger);

module.exports = router;
