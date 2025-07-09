const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
  createVoucher,
  trackClick,
  getMyVouchers
} = require('../controllers/voucherController');

// ✅ FIX: Do NOT invoke the controller function, just pass the reference
router.post('/create', protect, restrictTo('affiliate'), createVoucher);
router.get('/my-vouchers', protect, restrictTo('affiliate'), getMyVouchers);
router.get('/track',  trackClick);

module.exports = router;
