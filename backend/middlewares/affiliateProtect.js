const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Affiliate = require('../models/Affiliate');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

module.exports = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if affiliate still exists
  const currentAffiliate = await Affiliate.findById(decoded.id);
  if (!currentAffiliate) {
    return next(new AppError('The affiliate belonging to this token no longer exists.', 401));
  }

  // 4. Grant access to protected route
  req.affiliate = currentAffiliate;
  next();
});