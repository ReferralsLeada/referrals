require('dotenv').config(); // This must be at the top

// Debug: Check if .env is loading
console.log('Environment variables loaded:', {
  EMAIL_USERNAME: process.env.EMAIL_USERNAME ? '*****' : 'MISSING',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '*****' : 'MISSING'
});

module.exports = {
  // JWT Config
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Email Config (with fallbacks for development)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 465,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || '1307vijay200@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-app-password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Admin <1307vijay200@gmail.com>',
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};