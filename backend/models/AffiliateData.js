// models/AffiliateData.js (template for all tenant DBs)
module.exports = (connection) => {
  const schema = new mongoose.Schema({
    // Affiliate-specific data fields
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    // ... other affiliate-specific fields
  });
  return connection.model('AffiliateData', schema);
};