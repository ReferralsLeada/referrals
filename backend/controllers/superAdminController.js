const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const jwt = require('jsonwebtoken');
// Only for super admin
exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  const newAdmin = await Admin.create({
    name,
    email,
    role: 'admin'
  });

  res.status(201).json({
    status: 'success',
    data: {
      admin: newAdmin
    }
  });
});

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find({ role: 'admin' });

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
});