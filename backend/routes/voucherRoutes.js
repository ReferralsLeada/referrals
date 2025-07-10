const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
  createVoucher,
  trackClick,
  getMyVouchers
} = require('../controllers/voucherController');

// 🧪 Middleware to log incoming requests on this route file
router.use((req, res, next) => {
  console.log(`🌐 [Voucher Route] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Voucher creation by affiliate
router.post('/create', (req, res, next) => {
  console.log('➡️ [POST] /api/vouchers/create hit');
  createVoucher(req, res, next);
});

// ✅ Get vouchers created by logged-in affiliate
router.get('/my-vouchers', protect, restrictTo('affiliate'), (req, res, next) => {
  console.log('➡️ [GET] /api/vouchers/my-vouchers hit');
  getMyVouchers(req, res, next);
});

// ✅ Track click & redirect
router.get('/track', (req, res, next) => {
  console.log('➡️ [GET] /api/vouchers/track hit with query:', req.query);
  trackClick(req, res, next);
});

module.exports = router;
