import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const createMoreEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get organizer
    const organizer = await User.findOne({ email: 'organizer@eventease.com' });
    if (!organizer) {
      console.error('❌ Organizer not found. Please run createTestData.js first');
      process.exit(1);
    }

    const events = [
      // Arts Events (5)
      {
        title: 'Contemporary Art Exhibition 2024',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date('2024-12-01'),
        time: '10:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800',
        description: 'Showcasing contemporary art from emerging Indian artists',
        price: 500,
        organizer: organizer._id,
        capacity: 500,
        attendees: 250,
        rating: 4.6,
        reviews: 120,
        isActive: true
      },
      {
        title: 'Traditional Indian Paintings Workshop',
        category: 'Arts',
        type: 'Workshop',
        date: new Date('2024-12-05'),
        time: '02:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        description: 'Learn traditional Indian painting techniques from master artists',
        price: 1500,
        organizer: organizer._id,
        capacity: 30,
        attendees: 28,
        rating: 4.8,
        reviews: 89,
        isActive: true
      },
      {
        title: 'Street Art Festival Bangalore',
        category: 'Arts',
        type: 'Festival',
        date: new Date('2024-12-10'),
        time: '09:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1578926078328-123454281e3f?w=800',
        description: 'Vibrant street art festival with live painting and performances',
        price: 300,
        organizer: organizer._id,
        capacity: 2000,
        attendees: 1500,
        rating: 4.7,
        reviews: 200,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Digital Art Masterclass',
        category: 'Arts',
        type: 'Workshop',
        date: new Date('2024-12-15'),
        time: '11:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        description: 'Master digital art tools and techniques with industry experts',
        price: 2000,
        organizer: organizer._id,
        capacity: 50,
        attendees: 35,
        rating: 4.9,
        reviews: 67,
        isActive: true
      },
      {
        title: 'Sculpture Exhibition',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date('2024-12-20'),
        time: '10:30 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1578926078328-123454281e3f?w=800',
        description: 'Modern and traditional sculptures from renowned artists',
        price: 400,
        organizer: organizer._id,
        capacity: 800,
        attendees: 600,
        rating: 4.5,
        reviews: 145,
        isActive: true
      },

      // Music Concert Events (5)
      {
        title: 'Indie Rock Night',
        category: 'Music',
        type: 'Concert',
        date: new Date('2024-11-25'),
        time: '07:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        description: 'Live indie rock performances from popular bands',
        price: 1299,
        organizer: organizer._id,
        capacity: 3000,
        attendees: 2800,
        rating: 4.8,
        reviews: 450,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Jazz Evening Kolkata',
        category: 'Music',
        type: 'Concert',
        date: new Date('2024-12-08'),
        time: '08:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800',
        description: 'Sophisticated jazz performances in an intimate venue',
        price: 999,
        organizer: organizer._id,
        capacity: 500,
        attendees: 450,
        rating: 4.7,
        reviews: 200,
        isActive: true
      },
      {
        title: 'Classical Fusion Concert',
        category: 'Music',
        type: 'Concert',
        date: new Date('2024-12-18'),
        time: '06:30 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1478697378023-34b87b23e776?w=800',
        description: 'Blend of classical Indian and western music traditions',
        price: 1599,
        organizer: organizer._id,
        capacity: 1500,
        attendees: 1200,
        rating: 4.9,
        reviews: 350,
        isFeatured: true,
        isActive: true
      },
      {
        title: 'Bollywood Music Night',
        category: 'Music',
        type: 'Festival',
        date: new Date('2024-12-28'),
        time: '07:30 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800',
        description: 'Live performances of Bollywood hits by popular singers',
        price: 1799,
        organizer: organizer._id,
        capacity: 5000,
        attendees: 4500,
        rating: 4.8,
        reviews: 600,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Acoustic Guitar Night',
        category: 'Music',
        type: 'Concert',
        date: new Date('2025-01-05'),
        time: '08:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        description: 'Intimate acoustic guitar performances in a beachside venue',
        price: 799,
        organizer: organizer._id,
        capacity: 800,
        attendees: 700,
        rating: 4.6,
        reviews: 180,
        isActive: true
      },

      // Other/Festival Events - Comedy & Magic (5)
      {
        title: 'Stand-up Comedy Night',
        category: 'Other',
        type: 'Festival',
        date: new Date('2024-11-30'),
        time: '08:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
        description: 'Hilarious stand-up comedy from top comedians',
        price: 599,
        organizer: organizer._id,
        capacity: 300,
        attendees: 280,
        rating: 4.7,
        reviews: 165,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Magic Show Extravaganza',
        category: 'Other',
        type: 'Festival',
        date: new Date('2024-12-12'),
        time: '07:00 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1574169208507-84007e0fcc97?w=800',
        description: 'Amazing magic tricks and illusions by world-renowned magicians',
        price: 899,
        organizer: organizer._id,
        capacity: 1000,
        attendees: 850,
        rating: 4.9,
        reviews: 280,
        isActive: true
      },
      {
        title: 'Theater Play: Modern Times',
        category: 'Other',
        type: 'Festival',
        date: new Date('2024-12-22'),
        time: '06:30 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800',
        description: 'Contemporary theater production exploring modern society',
        price: 699,
        organizer: organizer._id,
        capacity: 400,
        attendees: 350,
        rating: 4.8,
        reviews: 210,
        isActive: true
      },
      {
        title: 'Comedy Improv Show',
        category: 'Other',
        type: 'Festival',
        date: new Date('2025-01-10'),
        time: '08:30 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
        description: 'Interactive improv comedy with audience participation',
        price: 449,
        organizer: organizer._id,
        capacity: 250,
        attendees: 220,
        rating: 4.6,
        reviews: 95,
        isActive: true
      },
      {
        title: 'Dancer Performance Night',
        category: 'Music',
        type: 'Festival',
        date: new Date('2025-01-15'),
        time: '07:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1571303317730-e677910208d3?w=800',
        description: 'Contemporary dance performances from talented dancers',
        price: 649,
        organizer: organizer._id,
        capacity: 600,
        attendees: 500,
        rating: 4.7,
        reviews: 140,
        isActive: true
      },

      // Sports Events (5)
      {
        title: 'Delhi Half Marathon 2024',
        category: 'Sports',
        type: 'Sports',
        date: new Date('2024-12-03'),
        time: '06:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        description: 'Half marathon run through the streets of Delhi',
        price: 599,
        organizer: organizer._id,
        capacity: 10000,
        attendees: 8500,
        rating: 4.8,
        reviews: 450,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Mumbai Marathon Full Challenge',
        category: 'Sports',
        type: 'Sports',
        date: new Date('2024-12-16'),
        time: '05:30 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        description: 'Full marathon (42km) through Mumbai\'s iconic routes',
        price: 1299,
        organizer: organizer._id,
        capacity: 5000,
        attendees: 4200,
        rating: 4.9,
        reviews: 600,
        isFeatured: true,
        isActive: true
      },
      {
        title: 'Bangalore 10K Run',
        category: 'Sports',
        type: 'Sports',
        date: new Date('2025-01-12'),
        time: '06:30 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        description: '10km run perfect for beginners and intermediate runners',
        price: 399,
        organizer: organizer._id,
        capacity: 3000,
        attendees: 2500,
        rating: 4.7,
        reviews: 280,
        isActive: true
      },
      {
        title: 'Chennai Ultra Marathon',
        category: 'Sports',
        type: 'Sports',
        date: new Date('2025-01-20'),
        time: '05:00 AM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1451749507bbb-cc13995fac4f?w=800',
        description: 'Ultra marathon 50km challenge for experienced runners',
        price: 1599,
        organizer: organizer._id,
        capacity: 500,
        attendees: 400,
        rating: 4.8,
        reviews: 150,
        isActive: true
      },
      {
        title: 'Pune Fun Run 5K',
        category: 'Sports',
        type: 'Sports',
        date: new Date('2025-02-01'),
        time: '07:00 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=800',
        description: 'Family-friendly 5km fun run with entertainment',
        price: 299,
        organizer: organizer._id,
        capacity: 2000,
        attendees: 1800,
        rating: 4.6,
        reviews: 220,
        isActive: true
      },

      // Technology/Business Events (5)
      {
        title: 'AI Summit 2025',
        category: 'Technology',
        type: 'Summit',
        date: new Date('2024-12-07'),
        time: '10:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        description: 'Deep dive into AI and Machine Learning technologies',
        price: 3499,
        organizer: organizer._id,
        capacity: 1000,
        attendees: 850,
        rating: 4.9,
        reviews: 380,
        isTrending: true,
        isActive: true
      },
      {
        title: 'Cloud Computing Workshop',
        category: 'Technology',
        type: 'Workshop',
        date: new Date('2024-12-14'),
        time: '02:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        description: 'Hands-on workshop on AWS and Azure cloud platforms',
        price: 1999,
        organizer: organizer._id,
        capacity: 60,
        attendees: 50,
        rating: 4.8,
        reviews: 140,
        isActive: true
      },
      {
        title: 'Startup Pitch Competition',
        category: 'Business',
        type: 'Conference',
        date: new Date('2024-12-27'),
        time: '09:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        description: 'Showcase your startup idea and pitch to investors',
        price: 799,
        organizer: organizer._id,
        capacity: 500,
        attendees: 420,
        rating: 4.7,
        reviews: 200,
        isFeatured: true,
        isActive: true
      },
      {
        title: 'Blockchain Bootcamp',
        category: 'Technology',
        type: 'Bootcamp',
        date: new Date('2025-01-06'),
        time: '10:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        description: 'Intensive training on blockchain development',
        price: 4999,
        organizer: organizer._id,
        capacity: 40,
        attendees: 35,
        rating: 4.9,
        reviews: 90,
        isActive: true
      },
      {
        title: 'Data Science Masterclass',
        category: 'Technology',
        type: 'Workshop',
        date: new Date('2025-01-18'),
        time: '03:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=800',
        description: 'Learn advanced data science and analytics techniques',
        price: 2499,
        organizer: organizer._id,
        capacity: 50,
        attendees: 45,
        rating: 4.8,
        reviews: 170,
        isActive: true
      },

      // Education/Health Events (5)
      {
        title: 'Digital Marketing Masterclass',
        category: 'Education',
        type: 'Workshop',
        date: new Date('2024-12-11'),
        time: '02:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        description: 'Learn digital marketing strategies from industry experts',
        price: 2499,
        organizer: organizer._id,
        capacity: 100,
        attendees: 90,
        rating: 4.8,
        reviews: 280,
        isActive: true
      },
      {
        title: 'Photography Workshop',
        category: 'Education',
        type: 'Workshop',
        date: new Date('2024-12-19'),
        time: '09:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        description: 'Master photography basics and advanced techniques',
        price: 1999,
        organizer: organizer._id,
        capacity: 40,
        attendees: 35,
        rating: 4.7,
        reviews: 150,
        isActive: true
      },
      {
        title: 'Yoga & Wellness Retreat',
        category: 'Health',
        type: 'Retreat',
        date: new Date('2025-01-03'),
        time: '08:00 AM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        description: '3-day yoga and wellness retreat in a peaceful setting',
        price: 3499,
        organizer: organizer._id,
        capacity: 60,
        attendees: 55,
        rating: 4.9,
        reviews: 200,
        isFeatured: true,
        isActive: true
      },
      {
        title: 'Creative Writing Workshop',
        category: 'Education',
        type: 'Workshop',
        date: new Date('2025-01-22'),
        time: '03:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1455849318169-8728d338c3f7?w=800',
        description: 'Develop your writing skills with experienced authors',
        price: 1299,
        organizer: organizer._id,
        capacity: 30,
        attendees: 25,
        rating: 4.6,
        reviews: 110,
        isActive: true
      },
      {
        title: 'Leadership Development Program',
        category: 'Education',
        type: 'Seminar',
        date: new Date('2025-02-10'),
        time: '10:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        description: 'Develop leadership skills for career advancement',
        price: 1899,
        organizer: organizer._id,
        capacity: 80,
        attendees: 70,
        rating: 4.7,
        reviews: 130,
        isActive: true
      }
    ];

    // Create events
    let createdCount = 0;
    for (const eventData of events) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      if (!existingEvent) {
        const event = new Event(eventData);
        await event.save();
        console.log(`✅ Created event: ${eventData.title}`);
        createdCount++;
      } else {
        console.log(`⚠️  Event already exists: ${eventData.title}`);
      }
    }

    console.log(`\n✅ Successfully created ${createdCount} new events!`);
    console.log(`Total events processed: ${events.length}`);
    console.log('\nCategory Distribution:');
    console.log('- Arts: 5 events');
    console.log('- Music: 5 events');
    console.log('- Other (Comedy/Magic): 5 events');
    console.log('- Sports: 5 events');
    console.log('- Technology/Business: 5 events');
    console.log('- Education/Health: 5 events');
    console.log('Total: 30 new events');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating events:', error.message);
    process.exit(1);
  }
};

createMoreEvents();
