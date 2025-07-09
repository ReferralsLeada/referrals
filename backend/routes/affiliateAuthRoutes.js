const express = require('express');
const router = express.Router();
const affiliateAuthController = require('../controllers/affiliateAuthController');

// Public routes
router.get('/admins', affiliateAuthController.getAdminList);
router.post('/signup', affiliateAuthController.signup);
router.post('/login', affiliateAuthController.login);

module.exports = router;