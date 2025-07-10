// File: models/Voucher.js

const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  usageLimit: { type: Number, default: 100 },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);

