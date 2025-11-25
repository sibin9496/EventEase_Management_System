import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://user:user123@cluster0.a1b2c.mongodb.net/eventease?retryWrites=true&w=majority')
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        addEvents();
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Get or create organizer ID
const organizerId = '691f0a27d9f0f02c63011fd9';

const newEvents = [
    {
        title: "Acoustic Guitar Night",
        description: "Intimate acoustic guitar performances in a beachside venue",
        category: "Music",
        type: "Concert",
        date: new Date('2025-01-05'),
        time: "08:00 PM",
        location: "Goa",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
        organizer: organizerId,
        price: 799,
        capacity: 800,
        attendees: 700,
        rating: 4.6,
        reviews: 180,
        tags: [],
        isFeatured: false,
        isTrending: false,
        isActive: true,
        registeredUsers: []
    },
    {
        title: "Stand-up Comedy Night",
        description: "Hilarious stand-up comedy from top comedians",
        category: "Other",
        type: "Festival",
        date: new Date('2024-11-30'),
        time: "08:00 PM",
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800",
        organizer: organizerId,
        price: 599,
        capacity: 300,
        attendees: 280,
        rating: 4.7,
        reviews: 165,
        tags: [],
        isFeatured: false,
        isTrending: true,
        isActive: true,
        registeredUsers: []
    },
    {
        title: "Magic Show Extravaganza",
        description: "Amazing magic tricks and illusions by world-renowned magicians",
        category: "Other",
        type: "Festival",
        date: new Date('2024-12-12'),
        time: "07:00 PM",
        location: "Bangalore",
        image: "https://images.unsplash.com/photo-1574169208507-84007e0fcc97?w=800",
        organizer: organizerId,
        price: 899,
        capacity: 1000,
        attendees: 850,
        rating: 4.9,
        reviews: 280,
        tags: [],
        isFeatured: false,
        isTrending: false,
        isActive: true,
        registeredUsers: []
    }
];

async function addEvents() {
    try {
        console.log('\n📝 Adding new events to database...\n');

        for (const eventData of newEvents) {
            // Check if event already exists
            const existingEvent = await Event.findOne({ 
                title: eventData.title,
                date: eventData.date
            });

            if (existingEvent) {
                console.log(`⚠️  Event "${eventData.title}" already exists (ID: ${existingEvent._id})`);
                continue;
            }

            // Create new event
            const newEvent = new Event(eventData);
            const savedEvent = await newEvent.save();
            console.log(`✅ Added: "${savedEvent.title}" (ID: ${savedEvent._id})`);
            console.log(`   📍 Location: ${savedEvent.location}`);
            console.log(`   💰 Price: ₹${savedEvent.price}`);
            console.log(`   👥 Capacity: ${savedEvent.capacity} | Attendees: ${savedEvent.attendees}\n`);
        }

        console.log('✅ All new events added successfully!');

        // Display total events count
        const totalEvents = await Event.countDocuments();
        console.log(`\n📊 Total events in database: ${totalEvents}`);

        // Display events by category
        const eventsByCategory = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📂 Events by Category:');
        eventsByCategory.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} events`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding events:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⏹️  Script interrupted');
    mongoose.connection.close();
    process.exit(0);
});
