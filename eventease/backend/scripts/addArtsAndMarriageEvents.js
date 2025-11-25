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

const newArtsEvents = [
    {
        title: 'Contemporary Digital Art Exhibition',
        description: 'Showcase of cutting-edge digital art, NFTs, and multimedia installations by contemporary artists.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 28),
        time: '10:00 AM',
        location: 'Bangalore',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMwMC39HLuM_mSG73dSrsZSpx3sVruucf6KA&s',
        price: 499,
        capacity: 600,
        tags: ['Digital Art', 'Exhibition', 'Contemporary']
    },
    {
        title: 'Watercolor Painting Workshop',
        description: 'Hands-on watercolor painting workshop with professional artists teaching various techniques and styles.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 12, 5),
        time: '02:00 PM',
        location: 'Mumbai',
        image: 'https://s3-ap-southeast-2.amazonaws.com/ish-oncourse-scc/c5c28551-ca27-4aa5-ae4b-7549c90ec6de?versionId=OBxlAOz_WTMyy3WyINZ0qYnDbW.He7QY',
        price: 1999,
        capacity: 40,
        tags: ['Painting', 'Workshop', 'Art']
    },
    {
        title: 'Sculpture & 3D Art Masterclass',
        description: 'Advanced masterclass in sculpture techniques, 3D modeling, and contemporary sculpture creation.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 12, 12),
        time: '03:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1578926078328-123454281e3f?w=800&h=600&fit=crop',
        price: 2499,
        capacity: 30,
        tags: ['Sculpture', 'Masterclass', 'Art']
    },
    {
        title: 'Street Art & Mural Festival',
        description: 'Large-scale street art festival featuring live mural painting, graffiti art, and urban art performances.',
        category: 'Arts',
        type: 'Festival',
        date: new Date(2025, 12, 19),
        time: '09:00 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        price: 799,
        capacity: 2000,
        tags: ['Street Art', 'Festival', 'Mural']
    },
    {
        title: 'Photography Art Exhibition & Awards',
        description: 'Prestigious photography exhibition showcasing award-winning photographic works and artistic photography.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 12, 26),
        time: '10:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        price: 399,
        capacity: 800,
        tags: ['Photography', 'Exhibition', 'Art']
    },
    {
        title: 'Mixed Media Art Creation Workshop',
        description: 'Innovative workshop combining multiple art mediums like painting, collage, digital art, and sculpture.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2026, 0, 9),
        time: '02:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1578926078328-123454281e3f?w=800&h=600&fit=crop',
        price: 1499,
        capacity: 50,
        tags: ['Mixed Media', 'Workshop', 'Art']
    }
];

const newMarriageEvents = [
    {
        title: 'Engagement Ring Selection & Design Workshop',
        description: 'Expert guidance on selecting and designing the perfect engagement ring with jewelers and designers.',
        category: 'Marriage',
        type: 'Workshop',
        date: new Date(2025, 11, 11),
        time: '03:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop',
        price: 2000,
        capacity: 100,
        tags: ['Engagement', 'Ring', 'Wedding Planning']
    },
    {
        title: 'Pre-Wedding Fitness & Wellness Program',
        description: 'Comprehensive fitness, yoga, and wellness program to look and feel best before the wedding.',
        category: 'Marriage',
        type: 'Workshop',
        date: new Date(2025, 11, 13),
        time: '06:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        price: 8000,
        capacity: 50,
        tags: ['Wellness', 'Fitness', 'Wedding']
    },
    {
        title: 'Wedding Venue Showcase & Selection Fair',
        description: 'Exclusive fair showcasing top wedding venues, venues tours, and booking deals from various locations.',
        category: 'Marriage',
        type: 'Exhibition',
        date: new Date(2025, 11, 17),
        time: '11:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
        price: 500,
        capacity: 2000,
        tags: ['Venue', 'Wedding', 'Fair']
    },
    {
        title: 'Bridal & Groom Fashion Show & Shopping',
        description: 'Spectacular bridal and groom fashion show featuring top designers with live shopping and bookings.',
        category: 'Marriage',
        type: 'Concert',
        date: new Date(2025, 11, 20),
        time: '06:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        price: 1999,
        capacity: 800,
        tags: ['Fashion', 'Bridal', 'Shopping']
    },
    {
        title: 'Wedding Catering & Menu Tasting Event',
        description: 'Explore diverse catering options with food tasting, menu customization, and vendor connections.',
        category: 'Marriage',
        type: 'Other',
        date: new Date(2025, 11, 24),
        time: '12:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1568885213209-42f3fb6ecf60?w=800&h=600&fit=crop',
        price: 3000,
        capacity: 200,
        tags: ['Catering', 'Food', 'Wedding']
    },
    {
        title: 'Wedding Photography & Videography Masterclass',
        description: 'Professional training in wedding photography and videography techniques from award-winning professionals.',
        category: 'Marriage',
        type: 'Workshop',
        date: new Date(2025, 12, 1),
        time: '10:00 AM',
        location: 'Goa',
        image: 'https://images.squarespace-cdn.com/content/v1/5ebc5b0285bdc72d1aee199d/1695198859989-6VIPLM7WQRJHM9S9DY3A/st-giles-house-wedding-14.jpg',
        price: 5000,
        capacity: 40,
        tags: ['Photography', 'Videography', 'Wedding']
    }
];

const addEvents = async () => {
    try {
        await connectDB();

        // Get or create default organizer
        let organizer = await User.findOne({ role: 'organizer' });
        if (!organizer) {
            organizer = await User.create({
                name: 'EventEase Organizer',
                email: 'organizer@eventease.com',
                password: 'hashed_password',
                role: 'organizer'
            });
        }

        let artsAdded = 0;
        let marriageAdded = 0;

        // Add Arts events
        console.log('\n📌 Adding Arts Events...');
        console.log('='.repeat(70));
        for (const eventData of newArtsEvents) {
            try {
                await Event.create({
                    ...eventData,
                    organizer: organizer._id,
                    attendees: Math.floor(Math.random() * (eventData.capacity / 2)),
                    rating: (Math.random() * 1 + 4).toFixed(1),
                    reviews: Math.floor(Math.random() * 500),
                    isActive: true
                });
                artsAdded++;
                console.log(`✅ Added: ${eventData.title}`);
            } catch (error) {
                console.error(`❌ Error adding ${eventData.title}:`, error.message);
            }
        }

        // Add Marriage events
        console.log('\n💒 Adding Marriage Events...');
        console.log('='.repeat(70));
        for (const eventData of newMarriageEvents) {
            try {
                await Event.create({
                    ...eventData,
                    organizer: organizer._id,
                    attendees: Math.floor(Math.random() * (eventData.capacity / 2)),
                    rating: (Math.random() * 1 + 4).toFixed(1),
                    reviews: Math.floor(Math.random() * 500),
                    isActive: true
                });
                marriageAdded++;
                console.log(`✅ Added: ${eventData.title}`);
            } catch (error) {
                console.error(`❌ Error adding ${eventData.title}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log('🎉 EVENTS ADDED SUCCESSFULLY!');
        console.log('='.repeat(70));
        console.log(`\n📊 Summary:`);
        console.log(`   • Arts Events Added: ${artsAdded}`);
        console.log(`   • Marriage Events Added: ${marriageAdded}`);
        console.log(`   • Total New Events: ${artsAdded + marriageAdded}`);

        // Get updated counts
        const artsCount = await Event.countDocuments({ category: 'Arts' });
        const marriageCount = await Event.countDocuments({ category: 'Marriage' });
        const totalCount = await Event.countDocuments();

        console.log(`\n📈 Updated Totals in Database:`);
        console.log(`   • Arts Events: ${artsCount}`);
        console.log(`   • Marriage Events: ${marriageCount}`);
        console.log(`   • Total Events: ${totalCount}`);

        console.log('\n✨ All events added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addEvents();
