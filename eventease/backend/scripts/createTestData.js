import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';

dotenv.config();

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create test users - DO NOT hash password, mongoose will do it
    const users = [
      {
        name: 'John Organizer',
        email: 'organizer@eventease.com',
        password: 'password123',  // Plain text, will be hashed by mongoose
        role: 'organizer',
        phone: '+91 9876543211'
      },
      {
        name: 'Jane User',
        email: 'user@eventease.com',
        password: 'password123',  // Plain text, will be hashed by mongoose
        role: 'user',
        phone: '+91 9876543212'
      },
      {
        name: 'Bob User',
        email: 'bob@eventease.com',
        password: 'password123',  // Plain text, will be hashed by mongoose
        role: 'user',
        phone: '+91 9876543213'
      }
    ];

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    // Get the organizer user
    const organizer = await User.findOne({ email: 'organizer@eventease.com' });

    // Create test events
    const events = [
      {
        title: 'Tech Summit Delhi 2024',
        category: 'Technology',
        type: 'Summit',
        date: new Date('2024-02-15'),
        time: '09:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        description: 'Annual technology conference featuring AI, blockchain and cloud computing',
        price: 2999,
        organizer: organizer._id,
        capacity: 3000,
        attendees: 2500,
        tags: ['technology', 'conference', 'AI', 'blockchain', 'cloud'],
        rating: 4.7,
        reviews: 342,
        isTrending: true,
        isFeatured: true,
        isActive: true
      },
      {
        title: 'Mumbai Music Festival',
        category: 'Music',
        type: 'Concert',
        date: new Date('2024-03-20'),
        time: '06:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        description: 'Three-day music festival featuring top Indian artists',
        price: 1999,
        organizer: organizer._id,
        capacity: 20000,
        attendees: 15000,
        tags: ['music', 'festival', 'live', 'bollywood', 'concerts'],
        rating: 4.8,
        reviews: 567,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Bangalore Startup Expo',
        category: 'Business',
        type: 'Exhibition',
        date: new Date('2024-04-10'),
        time: '10:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
        description: 'Showcasing innovative startups from across India',
        price: 1499,
        organizer: organizer._id,
        capacity: 5000,
        attendees: 3000,
        tags: ['startup', 'business', 'innovation', 'entrepreneurship'],
        rating: 4.5,
        reviews: 234,
        isFeatured: true,
        isActive: true
      }
    ];

    // Create events
    for (const eventData of events) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      if (!existingEvent) {
        const event = new Event(eventData);
        await event.save();
        console.log(`✅ Created event: ${eventData.title}`);
      } else {
        console.log(`⚠️  Event already exists: ${eventData.title}`);
      }
    }

    console.log('\n✅ Test data created successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@eventease.com / admin123');
    console.log('Organizer: organizer@eventease.com / password123');
    console.log('User: user@eventease.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
    process.exit(1);
  }
};

createTestData();
