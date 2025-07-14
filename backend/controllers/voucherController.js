const Voucher = require('../models/Voucher');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const axios = require('axios');

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

  try {
    const shop = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

    // Create Price Rule
    const priceRuleRes = await axios.post(
      `https://${shop}/admin/api/2023-07/price_rules.json`,
      {
        price_rule: {
          title: code,
          target_type: 'line_item',
          target_selection: 'all',
          allocation_method: 'across',
          value_type: discountType === 'percentage' ? 'percentage' : 'fixed_amount',
          value: `-${discountValue}`,
          customer_selection: 'all',
          usage_limit: usageLimit,
          starts_at: new Date().toISOString(),
          ends_at: new Date(expiresAt).toISOString()
        }
      },
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        }
      }
    );

    const ruleId = priceRuleRes.data.price_rule.id;

    // Create Discount Code
    await axios.post(
      `https://${shop}/admin/api/2023-07/price_rules/${ruleId}/discount_codes.json`,
      { discount_code: { code } },
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('🛒 [Shopify] Discount synced successfully');
  } catch (err) {
    console.error('❌ [Shopify Sync Failed]', err.response?.data || err.message);
    return next(new AppError('Failed to sync voucher to Shopify.', 500));
  }

  console.log('✅ [createVoucher] Creating new voucher...');
  const voucher = await Voucher.create({
    code,
    discountType,
    discountValue,
    usageLimit,
    expiresAt,
    
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
