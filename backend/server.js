const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

// Route imports
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const affiliateAuthRoutes = require('./routes/affiliateAuthRoutes');
const affiliateDashboardRoutes = require('./routes/affiliateDashboardRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const voucherRoutes = require('./routes/voucherRoutes');


// Utility imports
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const sendEmail = require('./utils/sendEmail');

// 1. Load env vars - MUST be first
dotenv.config({ path: './.env' });

// Debug env vars
console.log('Environment variables:', {
  EMAIL_USERNAME: process.env.EMAIL_USERNAME ? '*****' : 'MISSING',
  NODE_ENV: process.env.NODE_ENV
});

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. Database connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ DB connection successful!'))
.catch(err => console.error('❌ DB connection error:', err));

// 3. Routes
// Admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/vouchers', voucherRoutes);

// Affiliate routes
app.use('/api/affiliate/auth', affiliateAuthRoutes);
app.use('/api/affiliate/dashboard', affiliateDashboardRoutes);
app.use('/api/admin', adminAuthRoutes);

// Super admin routes
app.use('/api/super-admin', superAdminRoutes);

// Test email endpoint
app.get('/test-email', async (req, res) => {
  try {
    if (!process.env.EMAIL_USERNAME) {
      throw new Error('Email credentials not configured');
    }
    
    await sendEmail({
      email: 'recipient@example.com', // Change to actual email
      subject: 'Test Email from Server',
      message: 'If you receive this, email is working!',
      html: '<p>If you receive this, email is working!</p>'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully!'
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// 4. Error handling
// Handle 404
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// 5. Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});