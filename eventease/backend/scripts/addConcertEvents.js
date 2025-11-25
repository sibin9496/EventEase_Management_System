import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const concertEvents = [
  {
    title: 'Classical Symphony Orchestra Performance',
    description: 'Experience the timeless beauty of classical music with our grand symphony orchestra performance featuring masterpieces from Mozart, Beethoven, and Tchaikovsky. An unforgettable evening of world-class orchestral music.',
    category: 'Music',
    type: 'Concert',
    date: new Date(2025, 11, 15),
    time: '06:00 PM',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    price: 999,
    capacity: 1500,
    tags: ['Classical', 'Orchestra', 'Symphony']
  },
  {
    title: 'Rock Legends Live Concert',
    description: 'Join us for an epic rock concert featuring legendary rock bands performing their greatest hits. High energy, spectacular light shows, and unforgettable performances that will rock your world.',
    category: 'Music',
    type: 'Concert',
    date: new Date(2025, 11, 20),
    time: '07:00 PM',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    price: 1499,
    capacity: 2500,
    tags: ['Rock', 'Concert', 'Live']
  },
  {
    title: 'Indie Music Festival 2025',
    description: 'Discover emerging and established indie artists at our annual music festival. Multiple stages, food vendors, and immersive musical experiences spanning the entire day.',
    category: 'Music',
    type: 'Festival',
    date: new Date(2025, 11, 22),
    time: '04:00 PM',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&h=600&fit=crop',
    price: 799,
    capacity: 3000,
    tags: ['Indie', 'Music', 'Festival']
  },
  {
    title: 'Bollywood Nights - Retro & Modern Hits',
    description: 'Celebrate Hindi cinema with live performances of iconic Bollywood songs. Featuring renowned playback singers and dancers performing classic and contemporary tracks with live orchestra.',
    category: 'Music',
    type: 'Concert',
    date: new Date(2026, 0, 10),
    time: '08:00 PM',
    location: 'Pune',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    price: 1299,
    capacity: 2000,
    tags: ['Bollywood', 'Concert', 'Music']
  },
  {
    title: 'Jazz & Blues Night Extravaganza',
    description: 'Immerse yourself in smooth jazz and soulful blues music with live performances by international and Indian jazz musicians. Perfect for music enthusiasts and dancers alike.',
    category: 'Music',
    type: 'Concert',
    date: new Date(2026, 0, 15),
    time: '09:00 PM',
    location: 'Goa',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
    price: 1799,
    capacity: 800,
    tags: ['Jazz', 'Blues', 'Concert']
  },
  {
    title: 'Electronic Dance Music (EDM) Festival',
    description: 'High-energy electronic dance music festival featuring international DJ superstars. State-of-the-art sound systems, LED displays, and immersive visual effects for an unforgettable experience.',
    category: 'Music',
    type: 'Festival',
    date: new Date(2026, 0, 20),
    time: '10:00 PM',
    location: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
    price: 2499,
    capacity: 5000,
    tags: ['EDM', 'Festival', 'Electronic']
  }
];

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

const addConcertEvents = async () => {
  try {
    await connectDB();

    console.log('\n🎵 Adding Concert Events...');
    let addedCount = 0;

    // Get admin user to use as organizer
    const adminUser = await User.findOne({ role: 'admin' }).select('_id');
    const organizerId = adminUser ? adminUser._id : null;

    for (const eventData of concertEvents) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      
      if (!existingEvent) {
        // Add organizer if admin exists
        if (organizerId) {
          eventData.organizer = organizerId;
        }
        
        const newEvent = new Event(eventData);
        await newEvent.save();
        console.log(`✅ Added: ${eventData.title}`);
        addedCount++;
      } else {
        console.log(`⏭️  Skipped: ${eventData.title} (already exists)`);
      }
    }

    const musicCount = await Event.countDocuments({ category: 'Music' });
    const totalCount = await Event.countDocuments();

    console.log(`\n📊 Summary:`);
    console.log(`   • Concert Events Added: ${addedCount}`);
    console.log(`   • Total Music Category Events: ${musicCount}`);
    console.log(`   • Total Events in Database: ${totalCount}`);
    console.log(`\n✨ All concert events added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding events:', error);
    process.exit(1);
  }
};

addConcertEvents();
