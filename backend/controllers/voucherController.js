const Voucher = require('../models/Voucher');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * @desc    Create referral voucher by affiliate
 * @route   POST /api/vouchers
 * @access  Protected (Affiliate)
 */
exports.createVoucher = catchAsync(async (req, res, next) => {
  console.log('📥 [createVoucher] Request received:', req.body);

  const {
    code,
    discountType = 'percentage', // Default type
    discountValue,
    usageLimit = 100,
    expiresAt
  } = req.body;

  if (!code || !discountValue) {
    console.log('❌ [createVoucher] Missing code or discountValue');
    return next(new AppError('Code and discountValue are required.', 400));
  }

  console.log('🔍 [createVoucher] Checking for existing voucher...');
  const existing = await Voucher.findOne({ code });

  if (existing) {
    console.log('⚠️ [createVoucher] Code already exists:', code);
    return next(new AppError('Voucher code already exists.', 400));
  }

  console.log('✅ [createVoucher] Creating new voucher...');
  const voucher = await Voucher.create({
    code,
    discountType,
    discountValue,
    usageLimit,
    expiresAt
  });

  console.log('🎉 [createVoucher] Voucher successfully created:', voucher);

  res.status(201).json({
    status: 'success',
    message: 'Voucher created successfully',
    data: { voucher }
  });
});

/**
 * @desc    Track clicks on referral voucher and redirect
 * @route   GET /api/vouchers/track?code=ABC123
 * @access  Public
 */
exports.trackClick = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  console.log('📥 [trackClick] Request with code:', code);

  if (!code) {
    console.log('❌ [trackClick] No code provided');
    return next(new AppError('Voucher code is required', 400));
  }

  const voucher = await Voucher.findOne({ code });
  if (!voucher) {
    console.log('❌ [trackClick] Voucher not found for code:', code);
    return next(new AppError('Invalid voucher code', 404));
  }

  console.log('👀 [trackClick] Voucher found. Incrementing clicks...');
  voucher.clicks = (voucher.clicks || 0) + 1;
  await voucher.save();
  console.log('🔢 [trackClick] Updated clicks:', voucher.clicks);

  const redirectUrl = `https://referrals-leada.myshopify.com/discount/${code}?redirect=/products/white-sneakers`;
  console.log('🔁 [trackClick] Redirecting to:', redirectUrl);
  res.redirect(302, redirectUrl);
});

/**
 * @desc    List all vouchers created by the logged-in affiliate
 * @route   GET /api/vouchers/my
 * @access  Protected (Affiliate)
 */
exports.getMyVouchers = catchAsync(async (req, res, next) => {
  console.log('📥 [getMyVouchers] Request from user:', req.user?._id);

  const vouchers = await Voucher.find({ affiliateId: req.user._id }).sort({ createdAt: -1 });
  console.log(`📦 [getMyVouchers] Found ${vouchers.length} vouchers`);

  res.status(200).json({
    status: 'success',
    results: vouchers.length,
    data: { vouchers }
  });
});
