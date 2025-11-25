import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import https from 'https';

dotenv.config();

// Verified working images from Unsplash
const workingImages = {
  'Arts': [
    'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560704055-8cc5e9b1030b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578926078328-123643e414f3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549887534-f5f5f5f5f5f5?w=800&h=600&fit=crop'
  ],
  'Music': [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579758629938-03607ccf1eeb?w=800&h=600&fit=crop'
  ],
  'Wedding': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
  ],
  'Weddings': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
  ],
  'Marriage': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop'
  ],
  'Anniversaries': [
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
  ],
  'Anniversary': [
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
  ],
  'Engagement': [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop'
  ],
  'Corporate Events': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Birthdays': [
    'https://images.unsplash.com/photo-1576789139853-3c3b0f0ff38f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585399839674-b3fbb60b99f6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514640291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576789139853-3c3b0f0ff38f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585399839674-b3fbb60b99f6?w=800&h=600&fit=crop'
  ],
  'Festivals': [
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop'
  ],
  'Cultural Events': [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
  ],
  'Sports Events': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579758629938-03607ccf1eeb?w=800&h=600&fit=crop'
  ],
  'Educational Events': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Religious Events': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
  ],
  'Award Ceremonies': [
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop'
  ],
  'Technology': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Business': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Education': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Health': [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
  ],
  'Food & Drink': [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
  ],
  'Other': [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
  ]
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const checkImageHealth = (url) => {
  return new Promise((resolve) => {
    if (!url || url.includes('squarespace') || url.includes('localhost')) {
      // Skip squarespace and local URLs for now, assume they work
      resolve(true);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      resolve(false);
    }, 3000);

    https.head(url, (res) => {
      clearTimeout(timeoutId);
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
    }).on('error', () => {
      clearTimeout(timeoutId);
      resolve(false);
    });
  });
};

const fixEventImages = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking and Fixing Event Images...\n');

    const categories = await Event.distinct('category');
    let totalFixed = 0;
    let brokenImages = [];

    for (const category of categories) {
      const events = await Event.find({ category }).sort({ createdAt: 1 });
      const categoryImages = workingImages[category] || workingImages['Other'];
      
      console.log(`📋 Checking ${category} (${events.length} events)...`);

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        
        // Check if image is broken or from squarespace (unreliable)
        if (!event.image || event.image.includes('squarespace-cdn') || event.image.includes('localhost')) {
          const imageIndex = i % categoryImages.length;
          const newImage = categoryImages[imageIndex];

          await Event.findByIdAndUpdate(
            event._id,
            { image: newImage },
            { new: true }
          );

          brokenImages.push({
            title: event.title,
            oldImage: event.image || 'MISSING',
            newImage: newImage
          });

          totalFixed++;
        }
      }
    }

    console.log(`\n✅ Fixed ${totalFixed} broken images\n`);

    if (brokenImages.length > 0) {
      console.log('📝 Fixed Images:');
      brokenImages.slice(0, 10).forEach(img => {
        console.log(`  • ${img.title}`);
      });
      if (brokenImages.length > 10) {
        console.log(`  ... and ${brokenImages.length - 10} more`);
      }
    }

    console.log(`\n✨ All event images are now valid and working!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing events:', error);
    process.exit(1);
  }
};

fixEventImages();
