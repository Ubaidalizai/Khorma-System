const express = require('express');
const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  softDeletePurchase,
  restorePurchase,
  recordPurchasePayment,
} = require('../controllers/purchase.controller');

const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.route('/').post(createPurchase).get(getAllPurchases);

router
  .route('/:id')
  .get(getPurchaseById)
  .patch(updatePurchase)
  .delete(softDeletePurchase);

router.patch('/:id/restore', restorePurchase);
router.post('/:id/payment', recordPurchasePayment);

module.exports = router;
