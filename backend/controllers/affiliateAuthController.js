const Affiliate = require('../models/Affiliate');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/User');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// ✅ Get admin list for affiliate signup
exports.getAdminList = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: 'admin' }).select('name email');

  res.status(200).json({
    status: 'success',
    data: {
      admins
    }
  });
});

// ✅ Affiliate signup
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, adminId } = req.body;
  console.log('Request body:', req.body);

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  const existingAffiliate = await Affiliate.findOne({ email });
  if (existingAffiliate) {
    return next(new AppError('An affiliate with this email already exists', 400));
  }

  const admin = await User.findOne({ _id: adminId, role: 'admin', isVerified: true });
  if (!admin) {
    return next(new AppError('The selected admin is invalid or not verified', 400));
  }

  const newAffiliate = await Affiliate.create({
    name,
    email,
    password,
    passwordConfirm,
    role: 'affiliate',
    adminId,
    isApproved: false // pending approval
  });

    const token = signToken(newAffiliate._id);

  res.status(201).json({
    status: 'Success',
    message: 'Signup successful. Your account is pending admin approval.'
    //  token,
    // data: {
    //   // affiliate: {
    //   //   id: newAffiliate._id,
    //   //   name: newAffiliate.name,
    //   //   email: newAffiliate.email,
    //   // }
    // }
  });
});

// ✅ Affiliate login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Received login request:', email);

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const affiliate = await Affiliate.findOne({ email }).select('+password +active');
  console.log('Found affiliate:', affiliate);

  if (!affiliate || !(await affiliate.correctPassword(password, affiliate.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!affiliate.active) {
    return next(new AppError('Your account is not active. Please contact support.', 403));
  }

  if (!affiliate.isApproved) {
    return next(new AppError('Your account is not yet approved by the admin.', 403));
  }

  const token = signToken(affiliate._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      affiliate: {
        id: affiliate._id,
        name: affiliate.name,
        email: affiliate.email,
        referralId: affiliate.referralId
      }
    }
  });
});

// ✅ Get list of pending affiliates (for Admin Panel)
exports.getPendingAffiliates = catchAsync(async (req, res, next) => {
  const pending = await Affiliate.find({ isApproved: false });

  res.status(200).json({
    status: 'success',
    data: { affiliates: pending }
  });
});
