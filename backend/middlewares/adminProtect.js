const adminAuthController = require('../controllers/adminAuthController');


// Just re-export the protect middleware from auth controller
module.exports = adminAuthController.protect;