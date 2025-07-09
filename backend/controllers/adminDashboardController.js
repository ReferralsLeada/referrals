const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Commission = require('../models/Commission');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // Example stats - customize based on your needs
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalReferrals = await Referral.countDocuments();
  const totalCommissions = await Commission.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalAdmins,
        totalReferrals,
        totalCommissions: totalCommissions[0]?.total || 0
      }
    }
  });
});
exports.getAffiliateStats = catchAsync(async (req, res) => {
  // 1. Get total affiliates
  const totalAffiliates = await Affiliate.countDocuments();

  // 2. Get commission data
  const commissionData = await Affiliate.aggregate([
    {
      $lookup: {
        from: 'commissions',
        localField: '_id',
        foreignField: 'affiliateId',
        as: 'commissions'
      }
    },
    {
      $project: {
        name: 1,
        commission: { $sum: '$commissions.amount' }
      }
    }
  ]);

  // 3. Calculate total commission
  const totalCommission = commissionData.reduce(
    (sum, affiliate) => sum + affiliate.commission, 0
  );

  res.status(200).json({
    status: 'success',
    data: {
      totalAffiliates,
      commissionData,
      totalCommission
    }
  });
});