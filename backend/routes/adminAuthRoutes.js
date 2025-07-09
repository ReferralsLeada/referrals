const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/signup', adminAuthController.signup);
router.get('/verify/:userId([a-f0-9]{24})/:token([a-f0-9]+)', adminAuthController.verifyEmail);

router.post('/login', adminAuthController.login);

// Dashboard stats route
router.get('/dashboard/stats', protect, restrictTo('admin'), adminAuthController.getDashboardStats);


router.get('/affiliates/pending', protect, restrictTo('admin'), adminAuthController.getPendingAffiliates);
router.put('/affiliates/approve/:id', protect, restrictTo('admin'), adminAuthController.approveAffiliate);
router.delete('/affiliates/remove/:id', protect, restrictTo('admin'), adminAuthController.deleteAffiliate);

module.exports = router;