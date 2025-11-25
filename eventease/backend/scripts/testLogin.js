import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@eventease.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Stored Hash:', admin.password.substring(0, 50) + '...');

    // Test password
    const testPassword = 'admin123';
    const isMatch = await admin.comparePassword(testPassword);
    
    console.log('');
    console.log('Testing password: admin123');
    console.log('Password match result:', isMatch);

    if (isMatch) {
      console.log('✅ Password verification works!');
    } else {
      console.log('❌ Password verification failed!');
      console.log('Trying to re-hash and update password...');
      
      // Re-hash the password
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Password updated. Try logging in again.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
