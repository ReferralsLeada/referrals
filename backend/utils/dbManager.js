// utils/dbManager.js
const mongoose = require('mongoose');
const connections = {};

module.exports = {
  getConnection: async (dbName) => {
    if (!connections[dbName]) {
      // Get base connection string from environment
      const baseUri = process.env.MONGO_URI;
      
      // Validate connection string
      if (!baseUri.startsWith('mongodb://') && !baseUri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://');
      }

      // Create connection URL for tenant database
      const tenantUri = `${baseUri}/${dbName}`;
      
      connections[dbName] = await mongoose.createConnection(tenantUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        w: 'majority'
      });
    }
    return connections[dbName];
  }
};