const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const Token = require('../models/Token');
const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const sendEmail = require('../utils/sendEmail');
const { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } = require('../config/constants');
const Affiliate = require('../models/Affiliate');

// ✅ JWT Helper
const signToken = id => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};
// ✅ Signup
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  console.log('📩 Received signup request:', { name, email });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('⚠️ Admin already exists with this email:', email);
    return next(new AppError('Admin with this email already exists', 400));
  }
  else{
    console.log('success');
  }

let newUser;
try {
  newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role: 'admin',
    isVerified: false
  });
  console.log('✅ New admin user created:', newUser._id);
} catch (err) {
  console.error('❌ Error during User.create():', err.message);
  return next(new AppError('Failed to create admin user', 500));
}

console.log('✅ New admin user created:', newUser._id);

  const tokenString = require('crypto').randomBytes(32).toString('hex');

  const verificationToken = await Token.create({
    userId: newUser._id,
    token: tokenString
  });

  console.log('🔐 Verification token created:', verificationToken.token);

  const verificationUrl = `${FRONTEND_URL}/admin/verify/${newUser._id}/${tokenString}`;

  // Send response first
  res.status(201).json({
    status: 'success',
    message: 'Verification email is being sent.'
  });

  // ✅ Send email in background
  setImmediate(() => {
    sendEmail({
      email: newUser.email,
      subject: 'Verify Your Admin Account',
      message: `Please click the link to verify your admin account: ${verificationUrl}`
    }).then(() => {
      console.log('📧 Verification email sent to:', newUser.email);
    }).catch((err) => {
      console.error('❌ Failed to send admin verification email:', err.message);
    });
  });

  console.log('📤 Signup handler finished processing request');
});

// ✅ Email Verification
exports.verifyEmail = catchAsync(async (req, res, next) => {
  console.log("📥 Verification route hit with:", req.params);

  const { userId, token } = req.params;

  const user = await User.findOne({
    _id: userId,
    role: 'admin',
    isVerified: false
  });

  if (!user) {
    console.log('❌ User not found or already verified');
    return res.status(400).json({ status: 'fail', message: 'Invalid or already verified' });
  }

  const verificationToken = await Token.findOne({ userId: user._id, token });

  if (!verificationToken) {
    console.log("❌ Token not found for:", token);
    return res.status(400).json({ status: 'fail', message: 'Invalid or expired token' });
  }

  console.log("🔍 Token found:", verificationToken.token);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { isVerified: true },
    { new: true }
  );

  console.log("✅ isVerified updated to:", updatedUser.isVerified);

  await Token.deleteMany({ userId: user._id });
  console.log("🧹 Token deleted");

  res.status(200).json({ status: 'success', message: 'Email verified successfully' });
});


// ✅ Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isVerified) {
    return next(new AppError('Please verify your email first', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

// ✅ Get Dashboard Stats
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalAffiliates = await Affiliate.countDocuments();
  const approvedAffiliates = await Affiliate.countDocuments({ isApproved: true });
  const pendingAffiliates = await Affiliate.countDocuments({ isApproved: false });

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalAffiliates,
        approvedAffiliates,
        pendingAffiliates
      }
    }
  });
});


// ✅ Protect Middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not logged in. Token missing.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed recently. Please login again.', 401));
  }

  if (currentUser.role !== 'admin') {
    return next(new AppError('Access denied. Admins only.', 403));
  }

  req.user = currentUser;
  next();
});

// ✅ Get All Pending Affiliates
// ✅ Get list of pending affiliates (for Admin Panel)
exports.getPendingAffiliates = catchAsync(async (req, res, next) => {
  const pending = await Affiliate.find({ isApproved: false });

  res.status(200).json({
    status: 'success',
    data: { affiliates: pending }
  });
});



// ✅ Approve Affiliate
exports.approveAffiliate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updated = await Affiliate.findByIdAndUpdate(id, { isApproved: true }, { new: true });

  if (!updated) {
    return res.status(404).json({ status: 'fail', message: 'Affiliate not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Affiliate approved',
    data: { affiliate: updated }
  });
});

// ✅ Delete Affiliate
exports.deleteAffiliate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await Affiliate.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ status: 'fail', message: 'Affiliate not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Affiliate removed'
  });
});
