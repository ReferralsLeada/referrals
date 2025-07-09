const Voucher = require('../models/Voucher');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * @desc    Create referral voucher by affiliate
 * @route   POST /api/vouchers
 * @access  Protected (Affiliate)
 */
exports.createVoucher = catchAsync(async (req, res, next) => {
  const {
    code,
    discountType = 'percentage', // Default type
    discountValue,
    usageLimit = 100,
    expiresAt
  } = req.body;

  if (!code || !discountValue) {
    return next(new AppError('Code and discountValue are required.', 400));
  }

  const existing = await Voucher.findOne({ code });
  if (existing) return next(new AppError('Voucher code already exists.', 400));

  const voucher = await Voucher.create({
    code,
    affiliateId: req.user._id,
    discountType,
    discountValue,
    usageLimit,
    expiresAt
  });

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

  if (!code) return next(new AppError('Voucher code is required', 400));

  const voucher = await Voucher.findOne({ code });
  if (!voucher) return next(new AppError('Invalid voucher code', 404));

  voucher.clicks = (voucher.clicks || 0) + 1;
  await voucher.save();

  const redirectUrl = `https://yourshop.myshopify.com/discount/${code}`;
  res.redirect(302, redirectUrl);
});

/**
 * @desc    List all vouchers created by the logged-in affiliate
 * @route   GET /api/vouchers/my
 * @access  Protected (Affiliate)
 */
exports.getMyVouchers = catchAsync(async (req, res, next) => {
  const vouchers = await Voucher.find({ affiliateId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: vouchers.length,
    data: { vouchers }
  });
});
