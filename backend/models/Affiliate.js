const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ REQUIRED

const affiliateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords must match'
    }
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ You had 'Admin' — change it to 'User' if you're using `User` model for admins
    required: true
  },
  referralId: {
    type: String,
    unique: true,
    default: function () {
      return Math.random().toString(36).substring(2, 15).toUpperCase();
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  commissionRate: {
    type: Number,
    default: 15
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
  type: Boolean,
  default: true
}

});

// ✅ Hash password before save
affiliateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// ✅ Password check method
affiliateSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('Affiliate', affiliateSchema);
