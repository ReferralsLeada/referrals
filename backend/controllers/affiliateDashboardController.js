const Affiliate = require('../models/Affiliate');
const catchAsync = require('../middlewares/catchAsync');

exports.getDashboard = catchAsync(async (req, res) => {
  const affiliate = await Affiliate.findById(req.affiliate._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      affiliate: {
        name: affiliate.name,
        email: affiliate.email,
        referralId: affiliate.referralId,
        commissionRate: affiliate.commissionRate
      }
    }
  });
});