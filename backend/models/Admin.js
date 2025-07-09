const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
   password: {
    type: String,
    required: function() { return this.role === 'admin'; }, // Only required for regular admins
    select: false
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin'],
    default: 'admin'
  },
 isVerified: {
    type: Boolean,
    default: function() { return this.role === 'super-admin'; } // Super admin is auto-verified
  },
    emailToken: {
    type: String,
    select: false
  }
});

adminSchema.statics.getEligibleAdmins = function() {
  return this.find({ role: 'admin' }).select('name email');
};

const Admin = mongoose.model('Admin', adminSchema);

// Create super admin if not exists
const createSuperAdmin = async () => {
  const superAdminExists = await Admin.findOne({ role: 'super-admin' });
  if (!superAdminExists) {
    await Admin.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      role: 'super-admin'
    });
    console.log('Super admin created');
  }
};

createSuperAdmin();

module.exports = mongoose.model('Admin', adminSchema);