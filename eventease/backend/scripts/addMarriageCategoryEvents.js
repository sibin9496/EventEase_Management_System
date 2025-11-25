import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

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

// Events for different marriage categories
const marriageCategoryEvents = [
    // ANNIVERSARY Events (15 events)
    {
        title: 'Silver Anniversary Celebration - 25 Years Together',
        description: 'Elegant celebration for 25 years of marriage. Premium venue, champagne toast, romantic dinner, live music, and memorable moments for the celebrating couple and guests.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 8),
        time: '06:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 150,
        tags: ['Anniversary', 'Silver', 'Celebration', 'Marriage']
    },
    {
        title: 'Golden Anniversary Party - 50 Years of Love',
        description: 'Grand celebration for 50 years of marriage. Luxury venue, gourmet catering, family gathering, photo slideshow, and special tribute to the golden couple.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 11),
        time: '05:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 300000,
        capacity: 250,
        tags: ['Anniversary', 'Golden', 'Celebration', 'Milestone']
    },
    {
        title: 'Pearl Anniversary Celebration - 30 Years Together',
        description: 'Beautiful pearl anniversary celebration featuring elegant decorations, pearl theme elements, champagne reception, dancing, and heartfelt speeches.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 14),
        time: '06:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 150000,
        capacity: 120,
        tags: ['Anniversary', 'Pearl', '30 Years', 'Celebration']
    },
    {
        title: 'Diamond Anniversary Gala - 60 Years of Marriage',
        description: 'Spectacular diamond anniversary celebration with luxury accommodations for guests, gourmet dinner, jewelry gifts, live orchestra, and grand ceremony for this rare milestone.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 17),
        time: '07:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 500000,
        capacity: 300,
        tags: ['Anniversary', 'Diamond', '60 Years', 'Milestone']
    },
    {
        title: 'Romantic Anniversary Dinner - 10 Year Celebration',
        description: 'Intimate anniversary dinner at premium restaurant. Multi-course gourmet meal, wine pairing, rose petals, candlelight, and personalized service for the couple.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 20),
        time: '07:30 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 80000,
        capacity: 10,
        tags: ['Anniversary', 'Romantic Dinner', 'Intimate', 'Celebration']
    },
    {
        title: 'Destination Anniversary Getaway - Couple Retreat',
        description: 'Romantic destination anniversary retreat including luxury resort stay, couples spa, private dinner, sunset beach walk, and all-inclusive amenities.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 23),
        time: '02:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 250000,
        capacity: 30,
        tags: ['Anniversary', 'Destination', 'Romantic Retreat', 'Couple']
    },
    {
        title: 'Anniversary Party - Rooftop Celebration',
        description: 'Modern rooftop anniversary party with city views, DJ, dancing, catering, cocktails, and celebration with family and friends under the stars.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 26),
        time: '06:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 120000,
        capacity: 100,
        tags: ['Anniversary', 'Rooftop', 'Party', 'Celebration']
    },
    {
        title: 'Garden Anniversary Tea Party - Vintage Elegance',
        description: 'Elegant garden anniversary celebration with vintage decor, afternoon tea, classical music, floral arrangements, and nostalgic celebration of years together.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 11, 29),
        time: '03:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 90000,
        capacity: 80,
        tags: ['Anniversary', 'Garden Tea', 'Vintage', 'Elegant']
    },
    {
        title: 'Renewal of Vows - 20 Year Anniversary Ceremony',
        description: 'Meaningful renewal of vows ceremony for couples celebrating 20 years. Professional coordination, ceremonial setup, vow renewal ritual, and celebration party.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 2),
        time: '05:30 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 180000,
        capacity: 150,
        tags: ['Anniversary', 'Vow Renewal', '20 Years', 'Ceremony']
    },
    {
        title: 'Luxury Anniversary Celebration - 5 Star Hotel',
        description: 'Ultimate luxury anniversary celebration at 5-star hotel with grand ballroom, gourmet catering, live band, professional photography, and complete event management.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 5),
        time: '07:00 PM',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 350000,
        capacity: 200,
        tags: ['Anniversary', 'Luxury', '5-Star', 'Celebration']
    },
    {
        title: 'Surprise Anniversary Party - Couple Celebration',
        description: 'Surprise anniversary party planning and execution. Decorations, catering, entertainment, guest coordination, and all surprises arranged professionally.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 8),
        time: '06:30 PM',
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 110000,
        capacity: 80,
        tags: ['Anniversary', 'Surprise', 'Party', 'Celebration']
    },
    {
        title: 'Intimate Anniversary Dinner - Just for Two',
        description: 'Private intimate anniversary dinner setup at scenic location. Candlelit table, flowers, champagne, personalized menu, and romantic ambiance.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 11),
        time: '07:30 PM',
        location: 'Manali',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 60000,
        capacity: 2,
        tags: ['Anniversary', 'Intimate', 'Romantic', 'Dinner']
    },
    {
        title: 'Beachside Anniversary Celebration - Sunset Theme',
        description: 'Beautiful beachside anniversary celebration with sunset views, beach setup, seafood catering, live music, bonfire, and romantic beach ambiance.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 14),
        time: '04:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 140000,
        capacity: 100,
        tags: ['Anniversary', 'Beach', 'Sunset', 'Romantic']
    },
    {
        title: 'Adventure Anniversary Celebration - Active Couple',
        description: 'Anniversary celebration combining adventure activities. Outdoor adventures, team activities, picnic, celebration moments for active and adventurous couples.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 17),
        time: '06:00 AM',
        location: 'Ooty',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 130000,
        capacity: 50,
        tags: ['Anniversary', 'Adventure', 'Active', 'Celebration']
    },
    {
        title: 'Family Anniversary Celebration - Multi-Generation',
        description: 'Large family anniversary celebration with all family members. Group activities, family dining, photo sessions, games, and celebration of decades of togetherness.',
        category: 'Anniversary',
        type: 'Other',
        date: new Date(2025, 12, 20),
        time: '05:00 PM',
        location: 'Udaipur',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 220000,
        capacity: 200,
        tags: ['Anniversary', 'Family', 'Celebration', 'Multi-Generation']
    },
    
    // WEDDING ANNIVERSARY Events (10 events)
    {
        title: '1st Wedding Anniversary - Paper Anniversary',
        description: 'Celebration of first year of marriage. Paper theme decorations, intimate gathering, personalized touches, and special gifts for the newlyweds.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 9),
        time: '05:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 50000,
        capacity: 80,
        tags: ['Wedding Anniversary', '1st Year', 'Celebration', 'New Marriage']
    },
    {
        title: '5th Wedding Anniversary - Wood Anniversary Party',
        description: 'Wood-themed celebration for 5 years of marriage. Wood decorations, rustic setup, catering, and gathering to celebrate early milestone of marriage.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 12),
        time: '06:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 80000,
        capacity: 100,
        tags: ['Wedding Anniversary', '5 Years', 'Wood Theme', 'Celebration']
    },
    {
        title: '10th Wedding Anniversary - Tin Anniversary Bash',
        description: 'Tin-themed celebration for 10 years of marriage. Metallic decorations, grand party, special dinner, entertainment, and celebration of a decade together.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 15),
        time: '06:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 120000,
        capacity: 150,
        tags: ['Wedding Anniversary', '10 Years', 'Milestone', 'Celebration']
    },
    {
        title: '15th Wedding Anniversary - Crystal Anniversary',
        description: 'Crystal anniversary celebration for 15 years. Crystal-themed decorations, elegant venue, gourmet dining, and meaningful celebration of 15 years together.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 18),
        time: '07:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 150000,
        capacity: 180,
        tags: ['Wedding Anniversary', '15 Years', 'Crystal', 'Elegant']
    },
    {
        title: 'Wedding Anniversary Couples Event - Singles to Couples',
        description: 'Celebration event bringing together married couples. Networking, dancing, dining, games, and fun celebration specifically for married couples only.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 21),
        time: '06:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 70000,
        capacity: 200,
        tags: ['Wedding Anniversary', 'Couples Event', 'Networking', 'Social']
    },
    {
        title: '3rd Wedding Anniversary - Leather Anniversary',
        description: 'Leather-themed celebration for 3 years of marriage. Leather decorations, leather gifts, romantic dinner, and intimate celebration with loved ones.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 24),
        time: '06:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 75000,
        capacity: 90,
        tags: ['Wedding Anniversary', '3 Years', 'Leather Theme', 'Celebration']
    },
    {
        title: '7th Wedding Anniversary - Wool Anniversary Party',
        description: 'Wool-themed celebration for 7 years of marriage. Cozy and warm atmosphere, wool decorations, comfort food, and gathering with family and friends.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 27),
        time: '05:30 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 85000,
        capacity: 110,
        tags: ['Wedding Anniversary', '7 Years', 'Wool Theme', 'Cozy']
    },
    {
        title: '2nd Wedding Anniversary - Cotton Anniversary',
        description: 'Cotton anniversary celebration for 2 years. Cotton-themed decorations, soft and comfortable atmosphere, romantic dinner, and intimate gathering.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 11, 30),
        time: '06:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 70000,
        capacity: 85,
        tags: ['Wedding Anniversary', '2 Years', 'Cotton', 'Celebration']
    },
    {
        title: '4th Wedding Anniversary - Iron Anniversary',
        description: 'Strong and enduring celebration for 4 years of marriage. Iron-themed decor, solid and strong message, celebration party, and special moments.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 12, 3),
        time: '06:30 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 80000,
        capacity: 95,
        tags: ['Wedding Anniversary', '4 Years', 'Iron Theme', 'Strong']
    },
    {
        title: '6th Wedding Anniversary - Iron Candy Anniversary',
        description: 'Sweet celebration for 6 years of marriage. Candy and iron theme, sweet treats, celebration party, and fun gathering with loved ones.',
        category: 'Wedding',
        type: 'Other',
        date: new Date(2025, 12, 6),
        time: '05:00 PM',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 75000,
        capacity: 100,
        tags: ['Wedding Anniversary', '6 Years', 'Candy Theme', 'Sweet']
    },
    
    // ENGAGEMENT ANNIVERSARY Events (5 events)
    {
        title: 'Engagement Day Celebration - Anniversary',
        description: 'Celebration of engagement day anniversary. Romantic decorations, couple activities, champagne toast, and meaningful moment to celebrate getting engaged.',
        category: 'Engagement',
        type: 'Other',
        date: new Date(2025, 12, 9),
        time: '05:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 50000,
        capacity: 60,
        tags: ['Engagement Anniversary', 'Romantic', 'Celebration', 'Couple']
    },
    {
        title: '1 Year Engagement Anniversary Party',
        description: 'Celebration of one year since getting engaged. Pre-wedding countdown party, excitement building activities, romantic dinner, and celebration countdown.',
        category: 'Engagement',
        type: 'Other',
        date: new Date(2025, 12, 12),
        time: '06:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 80000,
        capacity: 100,
        tags: ['Engagement Anniversary', 'One Year', 'Pre-Wedding', 'Celebration']
    },
    {
        title: '6 Month Engagement Celebration',
        description: 'Half-year engagement celebration. Fun party, couple activities, games, catering, and celebration of halfway through engagement period.',
        category: 'Engagement',
        type: 'Other',
        date: new Date(2025, 12, 15),
        time: '05:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 60000,
        capacity: 80,
        tags: ['Engagement Anniversary', '6 Months', 'Milestone', 'Celebration']
    },
    {
        title: 'Engagement Anniversary Dinner - Private',
        description: 'Private engagement anniversary dinner. Candlelit dinner, romantic ambiance, special menu, and intimate celebration of engagement journey.',
        category: 'Engagement',
        type: 'Other',
        date: new Date(2025, 12, 18),
        time: '07:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 45000,
        capacity: 2,
        tags: ['Engagement Anniversary', 'Romantic Dinner', 'Private', 'Couple']
    },
    {
        title: 'Engagement Anniversary Group Celebration',
        description: 'Group celebration of engagement anniversary with family and friends. Party games, dancing, catering, and fun gathering around the engaged couple.',
        category: 'Engagement',
        type: 'Other',
        date: new Date(2025, 12, 21),
        time: '06:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 90000,
        capacity: 120,
        tags: ['Engagement Anniversary', 'Group', 'Party', 'Celebration']
    }
];

const addMarriageCategoryEvents = async () => {
    try {
        await connectDB();

        // Find or create admin user
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@eventease.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        // Add new marriage category events
        const eventPromises = marriageCategoryEvents.map(event => 
            Event.create({
                ...event,
                organizer: adminUser._id
            })
        );

        const createdEvents = await Promise.all(eventPromises);
        console.log(`\n✅ Successfully added ${createdEvents.length} marriage category events\n`);

        // Get total count
        const totalEvents = await Event.countDocuments();
        console.log(`📊 Total events in database: ${totalEvents}\n`);

        // Display summary by category
        const eventsByCategory = {};
        createdEvents.forEach(event => {
            if (!eventsByCategory[event.category]) {
                eventsByCategory[event.category] = [];
            }
            eventsByCategory[event.category].push(event);
        });

        console.log('🎊 MARRIAGE CATEGORY EVENTS ADDED:');
        console.log('='.repeat(70));
        Object.entries(eventsByCategory).forEach(([category, events]) => {
            console.log(`\n${category.toUpperCase()}: ${events.length} events`);
            console.log('-'.repeat(70));
            events.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title}`);
                console.log(`   📅 ${event.date.toLocaleDateString()} at ${event.time}`);
                console.log(`   🏙️  ${event.location} | 💰 ₹${event.price.toLocaleString()}`);
            });
        });

        console.log('\n\n✨ All marriage category events added successfully!');
        console.log(`🎉 Total database events: ${totalEvents}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding marriage category events:', error.message);
        process.exit(1);
    }
};

addMarriageCategoryEvents();
