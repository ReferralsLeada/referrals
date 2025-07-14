const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Commission = require('../models/Commission');
const Affiliate = require('../models/Affiliate'); // Add this if missing


exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  const totalAffiliates = await Affiliate.countDocuments();
  const approvedAffiliates = await Affiliate.countDocuments({ isApproved: true });
  const pendingAffiliates = await Affiliate.countDocuments({ isApproved: false });

  const totalReferrals = await Referral.countDocuments();

  const totalCommissions = await Commission.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalAdmins,
        totalAffiliates,
        approvedAffiliates,
        pendingAffiliates,
        totalReferrals,
        totalCommissions: totalCommissions[0]?.total || 0
      }
    }
  });
});

exports.getAffiliateStats = catchAsync(async (req, res) => {
  const totalAffiliates = await Affiliate.countDocuments();

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
        email: 1,
        referralId: 1,
        commission: { $sum: '$commissions.amount' }
      }
    }
  ]);

  const totalCommission = commissionData.reduce(
    (sum, affiliate) => sum + affiliate.commission,
    0
  );

  res.status(200).json({
    status: 'success',
    data: {
      totalAffiliates,
      totalCommission,
      commissionData
    }
  });
});

// ✅ Get Approved Affiliate List
exports.getApprovedAffiliates = catchAsync(async (req, res, next) => {
  const approvedAffiliates = await Affiliate.find({ isApproved: true });

  res.status(200).json({
    status: 'success',
    data: {
      affiliates: approvedAffiliates
    }
  });
});
