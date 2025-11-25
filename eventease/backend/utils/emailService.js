import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Try to verify email connection, but don't fail if it doesn't work
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email service not fully configured (using console fallback)');
    console.warn('   To fix: Update Gmail credentials in .env with an app-specific password');
    console.warn('   See: https://support.google.com/accounts/answer/185833');
  } else {
    console.log('✅ Email service verified and ready');
  }
});


export const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};
