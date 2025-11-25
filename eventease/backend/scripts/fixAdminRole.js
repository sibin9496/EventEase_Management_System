import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Update admin role
    const result = await User.updateOne(
      { email: 'admin@eventease.com' },
      { role: 'admin' }
    );

    if (result.modifiedCount === 0) {
      console.log('⚠️  User not found or role already set to admin');
    } else {
      console.log('✅ Admin role updated successfully!');
    }

    // Verify the update
    const admin = await User.findOne({ email: 'admin@eventease.com' });
    console.log('Current role:', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixAdminRole();
