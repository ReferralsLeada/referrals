const express = require('express');
const router = express.Router();
const affiliateDashboardController = require('../controllers/affiliateDashboardController');
const affiliateProtect = require('../middlewares/affiliateProtect');

router.use(affiliateProtect);

router.get('/', affiliateDashboardController.getDashboard);

module.exports = router;