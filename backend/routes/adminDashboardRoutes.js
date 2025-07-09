const express = require('express');
const adminDashboardController = require('../controllers/adminDashboardController');
const adminProtect = require('../middlewares/adminProtect');

const router = express.Router();

// Protect all routes after this middleware
router.use(adminProtect);

router.get('/stats', adminDashboardController.getDashboardStats);

module.exports = router;