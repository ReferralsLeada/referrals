const express = require('express');
const adminDashboardController = require('../controllers/adminDashboardController');
const { getApprovedAffiliates } = require('../controllers/adminDashboardController');
const adminProtect = require('../middlewares/adminProtect');

const router = express.Router();

// Apply adminProtect middleware to all routes
router.use(adminProtect);

// Routes
router.get('/stats', adminDashboardController.getDashboardStats);
router.get('/affiliates/approved', getApprovedAffiliates);

module.exports = router;
