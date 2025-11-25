import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

// Comprehensive category-specific images from Unsplash
const categoryImages = {
  // Arts Category
  'Arts': [
    'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&h=600&fit=crop', // Art gallery
    'https://images.unsplash.com/photo-1578926078328-123643e414f3?w=800&h=600&fit=crop', // Digital art
    'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&h=600&fit=crop', // Watercolor painting
    'https://images.unsplash.com/photo-1549887534-f5f5f5f5f5f5?w=800&h=600&fit=crop', // Sculpture
    'https://images.unsplash.com/photo-1560704055-8cc5e9b1030b?w=800&h=600&fit=crop', // Modern art
    'https://images.unsplash.com/photo-1578926078328-123643e414f3?w=800&h=600&fit=crop'  // Contemporary art
  ],
  // Music/Concert Category
  'Music': [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', // Rock concert
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop', // Bollywood stage
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop', // Jazz performance
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop', // DJ/Electronic
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop', // Music festival
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'  // Classical music
  ],
  // Sports Category
  'Sports': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop', // Marathon runners
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop', // Football/Soccer
    'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=600&fit=crop', // Sports action
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', // Basketball
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop', // Sports event
    'https://images.unsplash.com/photo-1579758629938-03607ccf1eeb?w=800&h=600&fit=crop'  // Yoga/Fitness
  ],
  // Wedding Category
  'Wedding': [
    'https://images.squarespace-cdn.com/content/v1/5ebc5b0285bdc72d1aee199d/1695198859989-6VIPLM7WQRJHM9S9DY3A/st-giles-house-wedding-14.jpg', // Wedding venue
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', // Wedding dress
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', // Wedding ceremony
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop', // Wedding decorations
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop', // Wedding couple
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'  // Bridal
  ],
  // Marriage Related (Weddings, Anniversaries, Engagement, etc.)
  'Weddings': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', // Wedding
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', // Ceremony
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop', // Decorations
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop', // Couple
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop', // Wedding rings
    'https://images.squarespace-cdn.com/content/v1/5ebc5b0285bdc72d1aee199d/1695198859989-6VIPLM7WQRJHM9S9DY3A/st-giles-house-wedding-14.jpg'
  ],
  'Marriage': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', // Wedding dress
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', // Couple
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop', // Rings
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop', // Flowers
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop', // Celebration
    'https://images.squarespace-cdn.com/content/v1/5ebc5b0285bdc72d1aee199d/1695198859989-6VIPLM7WQRJHM9S9DY3A/st-giles-house-wedding-14.jpg'
  ],
  'Anniversaries': [
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop', // Couple together
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop', // Romantic flowers
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop', // Happy couple
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop', // Rings
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop'
  ],
  'Engagement': [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop', // Ring
    'https://images.unsplash.com/photo-1469371670836-33267e1e34ca?w=800&h=600&fit=crop', // Couple joy
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1528148343865-15218429a779?w=800&h=600&fit=crop', // Romantic
    'https://images.unsplash.com/photo-1537281274475-9666b5267eac?w=800&h=600&fit=crop', // Flowers
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
  ],
  // Corporate Category
  'Corporate Events': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Conference
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Business meeting
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Office event
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Team building
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Product launch
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  // Birthdays Category
  'Birthdays': [
    'https://images.unsplash.com/photo-1576789139853-3c3b0f0ff38f?w=800&h=600&fit=crop', // Party balloons
    'https://images.unsplash.com/photo-1585399839674-b3fbb60b99f6?w=800&h=600&fit=crop', // Birthday cake
    'https://images.unsplash.com/photo-1576789139853-3c3b0f0ff38f?w=800&h=600&fit=crop', // Party celebration
    'https://images.unsplash.com/photo-1514640291840-2e0a9bf2a9ae?w=800&h=600&fit=crop', // Party setup
    'https://images.unsplash.com/photo-1585399839674-b3fbb60b99f6?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1576789139853-3c3b0f0ff38f?w=800&h=600&fit=crop'
  ],
  // Festivals Category
  'Festivals': [
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop', // Festival crowd
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop', // Festival lights
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop', // People
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop', // Festival atmosphere
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop'
  ],
  // Cultural Events Category
  'Cultural Events': [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Cultural performance
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Traditional art
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Dance
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Heritage
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Cultural show
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
  ],
  // Sports Events Category
  'Sports Events': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop', // Running
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop', // Soccer
    'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=600&fit=crop', // Sports action
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', // Basketball
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop', // Marathon
    'https://images.unsplash.com/photo-1579758629938-03607ccf1eeb?w=800&h=600&fit=crop'
  ],
  // Educational Events Category
  'Educational Events': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Workshop/Class
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Training
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Seminar
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Learning
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Conference
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  // Religious Events Category
  'Religious Events': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Spiritual
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Temple/Ceremony
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Religious gathering
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Meditation
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
  ],
  // Award Ceremonies Category
  'Award Ceremonies': [
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop', // Awards stage
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop', // Trophy
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop', // Celebration
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop', // Winner
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop', // Stage
    'https://images.unsplash.com/photo-1514604612983-09f863c90bbe?w=800&h=600&fit=crop'
  ],
  // Default categories
  'Technology': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
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
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
  ],
  'Education': [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
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
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
  ],
  'Food & Drink': [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
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
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const updateEventImages = async () => {
  try {
    await connectDB();

    console.log('\n🎨 Updating Event Images by Category...\n');

    const categoryStats = {};
    let totalUpdated = 0;

    // Get all events grouped by category
    const categories = await Event.distinct('category');
    console.log(`📊 Found ${categories.length} unique categories\n`);

    for (const category of categories) {
      const events = await Event.find({ category }).sort({ createdAt: 1 });
      const categoryImageList = categoryImages[category] || categoryImages['Other'];
      
      categoryStats[category] = { total: events.length, updated: 0 };

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        // Distribute images across events in the category
        const imageIndex = i % categoryImageList.length;
        const newImage = categoryImageList[imageIndex];

        await Event.findByIdAndUpdate(
          event._id,
          { image: newImage },
          { new: true }
        );

        categoryStats[category].updated++;
        totalUpdated++;
      }

      console.log(`✅ ${category}: Updated ${categoryStats[category].updated}/${categoryStats[category].total} events`);
    }

    console.log(`\n📈 Summary:`);
    console.log(`   • Total Categories: ${categories.length}`);
    console.log(`   • Total Events Updated: ${totalUpdated}`);
    console.log(`\n✨ All event images updated with relevant category-specific images!`);

    // Verify updates
    const eventWithoutImage = await Event.findOne({ image: { $exists: false } });
    const eventWithOldImage = await Event.findOne({ image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop' });
    
    console.log(`\n🔍 Verification:`);
    console.log(`   • Events without images: ${eventWithoutImage ? 'Found' : 'None ✅'}`);
    console.log(`   • Old default images remaining: ${eventWithOldImage ? 'Found' : 'None ✅'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating events:', error);
    process.exit(1);
  }
};

updateEventImages();
