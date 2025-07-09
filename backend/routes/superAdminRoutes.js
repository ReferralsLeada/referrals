const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const superAdminProtect = require('../middlewares/superAdminProtect');

router.use(superAdminProtect);

router.post('/admins', superAdminController.createAdmin);
router.get('/admins', superAdminController.getAllAdmins);

module.exports = router;