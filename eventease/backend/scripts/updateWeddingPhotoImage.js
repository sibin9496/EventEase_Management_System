import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

const updateImage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');

    const result = await Event.findOneAndUpdate(
      { title: 'Wedding Photography & Videography Masterclass' },
      { 
        image: 'https://images.squarespace-cdn.com/content/v1/5ebc5b0285bdc72d1aee199d/1695198859989-6VIPLM7WQRJHM9S9DY3A/st-giles-house-wedding-14.jpg'
      },
      { new: true }
    );

    if (result) {
      console.log('\n✅ Event Updated Successfully!');
      console.log('📝 Title:', result.title);
      console.log('🖼️  New Image URL:', result.image);
    } else {
      console.log('❌ Event not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateImage();
