const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync'); 
// const catchAsync = require('../middlewares/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  // 1. Get token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if super admin exists
  const currentAdmin = await Admin.findOne({
    _id: decoded.id,
    role: 'super-admin'
  });

  if (!currentAdmin) {
    return next(new AppError('Super admin access required', 403));
  }

  req.admin = currentAdmin;
  next();
});