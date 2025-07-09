const nodemailer = require('nodemailer');
const { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM } = require('../config/constants');

// Enhanced credential validation
if (!EMAIL_USERNAME || !EMAIL_PASSWORD) {
  console.error('❌ Email configuration error:', {
    EMAIL_USERNAME: EMAIL_USERNAME ? '*****' : 'MISSING',
    EMAIL_PASSWORD: EMAIL_PASSWORD ? '*****' : 'MISSING',
    EMAIL_FROM: EMAIL_FROM || 'MISSING'
  });
  throw new Error('Email credentials not configured');
}

// Validate email format
if (!EMAIL_FROM.includes(EMAIL_USERNAME)) {
  console.warn('⚠️ Warning: EMAIL_FROM does not match EMAIL_USERNAME');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  },
  logger: true,
  debug: true
});

// Connection test with timeout
const verifyConnection = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Failed:', {
          code: error.code,
          response: error.response || 'No response',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        reject(error);
      } else {
        console.log('✅ SMTP Connection Verified');
        resolve(success);
      }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('SMTP verification timeout'));
    }, 10000);
  });
};

const sendEmail = async (mailOptions) => {
  try {
    // Verify connection before sending
   // await verifyConnection();
    
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: mailOptions.email,
      subject: mailOptions.subject,
      text: mailOptions.message,
      html: mailOptions.html || mailOptions.message // Fallback to text if no HTML
    });
    
    console.log('📧 Email sent successfully', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return info;
  } catch (error) {
    console.error('❌ Email Send Failed:', {
      error: error.message,
      code: error.code,
      response: error.response,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    throw new Error(`Email failed to send: ${error.message}`);
  }
};

// Initial connection test when module loads
verifyConnection()
  .then(() => console.log('📧 Email service initialized'))
  .catch(err => console.error('❌ Email service initialization failed'));

module.exports = sendEmail;