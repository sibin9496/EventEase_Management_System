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

const comprehensiveCategories = [
    // WEDDINGS - 8 events
    {
        category: 'Weddings',
        events: [
            {
                title: 'Traditional Hindu Wedding Ceremony',
                description: 'Complete traditional Hindu wedding celebration with rituals, mantras, and cultural ceremonies. Includes Mehendi, Sangeet, and Shaadi celebrations.',
                type: 'Wedding',
                date: new Date(2025, 11, 15),
                time: '05:00 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 450000,
                capacity: 500,
                tags: ['Hindu Wedding', 'Traditional', 'Ceremony']
            },
            {
                title: 'Christian White Wedding Reception',
                description: 'Elegant Christian wedding with church ceremony followed by grand reception with dinner, dancing, and celebrations.',
                type: 'Wedding',
                date: new Date(2025, 11, 22),
                time: '06:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 350000,
                capacity: 300,
                tags: ['Christian Wedding', 'Reception', 'Church']
            },
            {
                title: 'Muslim Nikah & Walima',
                description: 'Islamic wedding ceremony with Nikah rituals and Walima reception. Includes Qawwali performances and traditional feast.',
                type: 'Wedding',
                date: new Date(2026, 0, 5),
                time: '07:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1530627869732-ba9f6a2e1af5?w=800&h=600&fit=crop',
                price: 400000,
                capacity: 400,
                tags: ['Islamic Wedding', 'Nikah', 'Cultural']
            },
            {
                title: 'Sikh Anand Karaj Wedding',
                description: 'Sikh wedding ceremony at Gurdwara with Anand Karaj rituals. Includes langar feast and community celebrations.',
                type: 'Wedding',
                date: new Date(2026, 0, 12),
                time: '04:00 PM',
                location: 'Amritsar',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 250000,
                capacity: 600,
                tags: ['Sikh Wedding', 'Anand Karaj', 'Gurdwara']
            },
            {
                title: 'Jewish Wedding Ceremony',
                description: 'Traditional Jewish wedding with chuppah, ketubah signing, and breaking of glass. Includes festive reception and hora dancing.',
                type: 'Wedding',
                date: new Date(2026, 0, 19),
                time: '05:30 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 320000,
                capacity: 250,
                tags: ['Jewish Wedding', 'Ceremony', 'Traditional']
            },
            {
                title: 'Destination Beach Wedding',
                description: 'Romantic beach wedding ceremony with sunset views, ocean backdrop, and intimate reception. Perfect for eloping couples.',
                type: 'Wedding',
                date: new Date(2026, 0, 26),
                time: '06:30 PM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1520854577233-3d6d4a5d4e9d?w=800&h=600&fit=crop',
                price: 280000,
                capacity: 150,
                tags: ['Beach Wedding', 'Destination', 'Romantic']
            },
            {
                title: 'Grand Palace Wedding',
                description: 'Luxurious palace wedding with royal ambiance, multiple venues, and elaborate decoration. Includes pre-wedding events and celebrations.',
                type: 'Wedding',
                date: new Date(2026, 1, 2),
                time: '07:00 PM',
                location: 'Udaipur',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 800000,
                capacity: 1000,
                tags: ['Luxury Wedding', 'Palace', 'Grand Event']
            },
            {
                title: 'Intimate Garden Wedding',
                description: 'Small, intimate garden wedding ceremony surrounded by flowers and nature. Perfect for couples wanting close-knit celebrations.',
                type: 'Wedding',
                date: new Date(2026, 1, 9),
                time: '05:00 PM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1532712346076-5ec94738d911?w=800&h=600&fit=crop',
                price: 150000,
                capacity: 80,
                tags: ['Garden Wedding', 'Intimate', 'Nature']
            }
        ]
    },

    // ANNIVERSARIES - 8 events
    {
        category: 'Anniversaries',
        events: [
            {
                title: '1st Year Anniversary - Paper',
                description: 'Celebrate your first anniversary with paper-themed decorations, scrapbooking activities, and romantic dinner experiences.',
                type: 'Other',
                date: new Date(2025, 11, 10),
                time: '06:00 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
                price: 25000,
                capacity: 50,
                tags: ['Anniversary', 'Paper', 'Romantic']
            },
            {
                title: '5th Year Anniversary - Wood',
                description: 'Wood-themed anniversary celebration with rustic decorations, wooden crafts, and nature-inspired activities.',
                type: 'Other',
                date: new Date(2025, 11, 18),
                time: '06:30 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
                price: 45000,
                capacity: 100,
                tags: ['Anniversary', 'Wood', '5 Years']
            },
            {
                title: '10th Year Anniversary - Silver',
                description: 'Elegant silver-themed anniversary celebration with silver decorations, fine dining, and special performances.',
                type: 'Other',
                date: new Date(2025, 11, 25),
                time: '07:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
                price: 75000,
                capacity: 150,
                tags: ['Anniversary', 'Silver', '10 Years']
            },
            {
                title: '25th Year Anniversary - Golden',
                description: 'Grand golden anniversary celebration with luxurious gold decorations, live music, and grand feast for family and friends.',
                type: 'Other',
                date: new Date(2026, 0, 8),
                time: '06:00 PM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 150000,
                capacity: 300,
                tags: ['Anniversary', 'Gold', '25 Years']
            },
            {
                title: '50th Year Anniversary - Pearl',
                description: 'Precious pearl anniversary celebration honoring 50 years of marriage. Includes family gathering, speeches, and festive dinner.',
                type: 'Other',
                date: new Date(2026, 0, 15),
                time: '05:30 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
                price: 200000,
                capacity: 250,
                tags: ['Anniversary', 'Pearl', '50 Years']
            },
            {
                title: 'Romantic Dinner Anniversary Night',
                description: 'Intimate candlelit dinner anniversary celebration with specially prepared menu, live music, and personalized decorations.',
                type: 'Other',
                date: new Date(2026, 0, 22),
                time: '08:00 PM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
                price: 35000,
                capacity: 30,
                tags: ['Anniversary', 'Dinner', 'Romantic']
            },
            {
                title: 'Vow Renewal Ceremony',
                description: 'Renew your wedding vows in a beautiful ceremony with family and close friends. Includes blessing ritual and celebration.',
                type: 'Other',
                date: new Date(2026, 1, 5),
                time: '05:00 PM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 80000,
                capacity: 200,
                tags: ['Anniversary', 'Vow Renewal', 'Ceremony']
            },
            {
                title: 'Destination Anniversary Getaway',
                description: 'Celebrate your anniversary in a exotic destination with resort stay, activities, and special couple packages.',
                type: 'Other',
                date: new Date(2026, 1, 12),
                time: '12:00 PM',
                location: 'Thailand',
                image: 'https://images.unsplash.com/photo-1520854577233-3d6d4a5d4e9d?w=800&h=600&fit=crop',
                price: 120000,
                capacity: 2,
                tags: ['Anniversary', 'Destination', 'Getaway']
            }
        ]
    },

    // CORPORATE EVENTS - 8 events
    {
        category: 'Corporate Events',
        events: [
            {
                title: 'Annual Corporate Conference 2025',
                description: 'Large-scale corporate conference with keynote speakers, panel discussions, workshops, and networking sessions for industry professionals.',
                type: 'Conference',
                date: new Date(2025, 11, 12),
                time: '09:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 5000,
                capacity: 1000,
                tags: ['Corporate', 'Conference', 'Business']
            },
            {
                title: 'Team Building Corporate Retreat',
                description: 'Off-site corporate retreat with team-building activities, outdoor adventures, workshops, and team bonding exercises.',
                type: 'Other',
                date: new Date(2025, 11, 20),
                time: '08:00 AM',
                location: 'Rishikesh',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 15000,
                capacity: 200,
                tags: ['Corporate', 'Team Building', 'Retreat']
            },
            {
                title: 'Business Networking Gala',
                description: 'Exclusive networking event with business leaders, entrepreneurs, and investors. Includes cocktails, dinner, and business opportunity sessions.',
                type: 'Other',
                date: new Date(2025, 12, 5),
                time: '06:30 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
                price: 8000,
                capacity: 300,
                tags: ['Corporate', 'Networking', 'Business']
            },
            {
                title: 'Product Launch Event',
                description: 'Grand product launch event with live demonstrations, media coverage, influencer invitations, and product showcase booths.',
                type: 'Exhibition',
                date: new Date(2025, 12, 10),
                time: '05:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=800&h=600&fit=crop',
                price: 50000,
                capacity: 500,
                tags: ['Product Launch', 'Corporate', 'Exhibition']
            },
            {
                title: 'Annual Awards Ceremony',
                description: 'Corporate awards ceremony honoring outstanding employees, achievements, and contributions with recognition and celebration.',
                type: 'Other',
                date: new Date(2025, 12, 15),
                time: '07:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 20000,
                capacity: 400,
                tags: ['Corporate', 'Awards', 'Recognition']
            },
            {
                title: 'Executive Leadership Seminar',
                description: 'Intensive leadership seminar with industry experts, case studies, training workshops, and executive networking opportunities.',
                type: 'Seminar',
                date: new Date(2026, 0, 10),
                time: '09:00 AM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 12000,
                capacity: 150,
                tags: ['Corporate', 'Leadership', 'Seminar']
            },
            {
                title: 'Corporate Expo & Trade Show',
                description: 'Large-scale trade show with vendor booths, live demonstrations, workshops, and business opportunities for B2B networking.',
                type: 'Exhibition',
                date: new Date(2026, 0, 18),
                time: '10:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=800&h=600&fit=crop',
                price: 25000,
                capacity: 2000,
                tags: ['Corporate', 'Expo', 'Trade Show']
            },
            {
                title: 'Sales Summit & Client Appreciation',
                description: 'Annual sales summit with performance recognition, client appreciation dinner, and strategic planning sessions.',
                type: 'Other',
                date: new Date(2026, 0, 25),
                time: '06:00 PM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 18000,
                capacity: 350,
                tags: ['Corporate', 'Sales', 'Summit']
            }
        ]
    },

    // BIRTHDAYS - 8 events
    {
        category: 'Birthdays',
        events: [
            {
                title: 'Kids Birthday Party - Cartoon Theme',
                description: 'Fun-filled kids birthday party with cartoon character mascots, games, activities, cake, and entertainment for children.',
                type: 'Other',
                date: new Date(2025, 11, 8),
                time: '03:00 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1530627869732-ba9f6a2e1af5?w=800&h=600&fit=crop',
                price: 15000,
                capacity: 50,
                tags: ['Birthday', 'Kids', 'Party']
            },
            {
                title: 'Teen Birthday Bash - DJ & Dancing',
                description: 'Exciting teen birthday celebration with DJ, dancing, games, photo booth, and trendy decorations.',
                type: 'Other',
                date: new Date(2025, 11, 16),
                time: '06:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
                price: 25000,
                capacity: 100,
                tags: ['Birthday', 'Teen', 'DJ Party']
            },
            {
                title: '21st Birthday Celebration',
                description: 'Grand 21st birthday party with special theme, premium beverages, live music, dancing, and birthday surprises.',
                type: 'Other',
                date: new Date(2025, 11, 23),
                time: '07:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
                price: 35000,
                capacity: 150,
                tags: ['Birthday', 'Adult', 'Celebration']
            },
            {
                title: 'Milestone Birthday - 50th Birthday Gala',
                description: 'Elegant 50th birthday celebration with family, friends, live band, premium dinner, and nostalgic memories slideshow.',
                type: 'Other',
                date: new Date(2025, 12, 2),
                time: '06:30 PM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 60000,
                capacity: 200,
                tags: ['Birthday', 'Milestone', 'Gala']
            },
            {
                title: 'Outdoor Adventure Birthday',
                description: 'Thrilling outdoor birthday celebration with adventure activities, trekking, camping, bonfire, and BBQ dinner.',
                type: 'Other',
                date: new Date(2025, 12, 9),
                time: '08:00 AM',
                location: 'Manali',
                image: 'https://images.unsplash.com/photo-1520854577233-3d6d4a5d4e9d?w=800&h=600&fit=crop',
                price: 40000,
                capacity: 80,
                tags: ['Birthday', 'Adventure', 'Outdoor']
            },
            {
                title: 'Luxury Spa Birthday Retreat',
                description: 'Pampering spa birthday celebration with spa treatments, wellness activities, gourmet meals, and relaxation.',
                type: 'Other',
                date: new Date(2025, 12, 16),
                time: '09:00 AM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
                price: 50000,
                capacity: 30,
                tags: ['Birthday', 'Spa', 'Luxury']
            },
            {
                title: 'Themed Birthday Costume Party',
                description: 'Unique themed birthday party where all guests wear costumes. Includes contests, games, music, and special themed dinner.',
                type: 'Other',
                date: new Date(2025, 12, 23),
                time: '07:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1514575273085-e911d1ee1200?w=800&h=600&fit=crop',
                price: 30000,
                capacity: 120,
                tags: ['Birthday', 'Costume', 'Themed']
            },
            {
                title: 'Surprise Birthday Gathering',
                description: 'Planned surprise birthday celebration with secret venue, decorated space, friends and family, and special birthday cake.',
                type: 'Other',
                date: new Date(2026, 0, 6),
                time: '06:00 PM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 25000,
                capacity: 100,
                tags: ['Birthday', 'Surprise', 'Party']
            }
        ]
    },

    // FESTIVALS - 8 events
    {
        category: 'Festivals',
        events: [
            {
                title: 'Diwali Festival Celebration',
                description: 'Grand Diwali celebration with rangoli, fireworks, light decorations, traditional food, music, and family gatherings.',
                type: 'Festival',
                date: new Date(2025, 10, 1),
                time: '06:00 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 5000,
                capacity: 500,
                tags: ['Festival', 'Diwali', 'Celebration']
            },
            {
                title: 'Holi Festival - Color Festival',
                description: 'Vibrant Holi celebration with colored powder play, water games, traditional sweets, music, and festive fun.',
                type: 'Festival',
                date: new Date(2026, 2, 15),
                time: '10:00 AM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
                price: 3000,
                capacity: 1000,
                tags: ['Festival', 'Holi', 'Colors']
            },
            {
                title: 'Navratri Garba & Dandiya Night',
                description: 'Traditional Navratri festival with Garba and Dandiya dance, traditional costumes, music, and festive dinner.',
                type: 'Festival',
                date: new Date(2025, 9, 25),
                time: '07:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1514575273085-e911d1ee1200?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 800,
                tags: ['Festival', 'Navratri', 'Garba']
            },
            {
                title: 'Onam Festival Celebration',
                description: 'Kerala Onam festival with flower decorations, traditional dance, Kathakali performances, and festive meals.',
                type: 'Festival',
                date: new Date(2025, 8, 10),
                time: '05:00 PM',
                location: 'Kochi',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
                price: 4000,
                capacity: 600,
                tags: ['Festival', 'Onam', 'Kerala']
            },
            {
                title: 'Pongal/Makar Sankranti Festival',
                description: 'Tamil harvest festival with traditional cooking, kite flying, cattle decoration, and community celebrations.',
                type: 'Festival',
                date: new Date(2026, 0, 14),
                time: '06:00 AM',
                location: 'Chennai',
                image: 'https://images.unsplash.com/photo-1520854577233-3d6d4a5d4e9d?w=800&h=600&fit=crop',
                price: 3500,
                capacity: 700,
                tags: ['Festival', 'Pongal', 'Harvest']
            },
            {
                title: 'Baisakhi Festival Celebration',
                description: 'Punjabi harvest festival with traditional Bhangra dance, folk music, traditional food, and cultural performances.',
                type: 'Festival',
                date: new Date(2026, 3, 13),
                time: '05:00 PM',
                location: 'Amritsar',
                image: 'https://images.unsplash.com/photo-1514575273085-e911d1ee1200?w=800&h=600&fit=crop',
                price: 2500,
                capacity: 1000,
                tags: ['Festival', 'Baisakhi', 'Harvest']
            },
            {
                title: 'Eid Festival - Eid ul-Fitr',
                description: 'Islamic Eid celebration with special prayers, festive clothing, traditional sweets, family gatherings, and feast.',
                type: 'Festival',
                date: new Date(2025, 11, 30),
                time: '06:00 AM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 4000,
                capacity: 1200,
                tags: ['Festival', 'Eid', 'Islamic']
            },
            {
                title: 'Christmas Festival Celebration',
                description: 'Christmas celebration with decoration, carol singing, gift exchange, traditional feast, and family gathering.',
                type: 'Festival',
                date: new Date(2025, 11, 25),
                time: '05:00 PM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
                price: 8000,
                capacity: 400,
                tags: ['Festival', 'Christmas', 'Celebration']
            }
        ]
    },

    // CULTURAL EVENTS - 8 events
    {
        category: 'Cultural Events',
        events: [
            {
                title: 'Indian Classical Music Concert',
                description: 'Live classical Indian music performance featuring Hindustani or Carnatic music with sitar, tabla, and vocal artists.',
                type: 'Concert',
                date: new Date(2025, 11, 14),
                time: '07:00 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
                price: 2500,
                capacity: 300,
                tags: ['Cultural', 'Music', 'Classical']
            },
            {
                title: 'Kathakali Dance Performance',
                description: 'Traditional Kerala Kathakali dance performance with elaborate costumes, makeup, and dramatic storytelling.',
                type: 'Concert',
                date: new Date(2025, 11, 21),
                time: '06:30 PM',
                location: 'Kochi',
                image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
                price: 1500,
                capacity: 200,
                tags: ['Cultural', 'Dance', 'Kathakali']
            },
            {
                title: 'Bharatanatyam Dance Recital',
                description: 'Traditional South Indian Bharatanatyam dance performance with intricate movements and spiritual themes.',
                type: 'Concert',
                date: new Date(2025, 12, 5),
                time: '07:00 PM',
                location: 'Chennai',
                image: 'https://images.unsplash.com/photo-1485095329183-d0daf6407e7f?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 250,
                tags: ['Cultural', 'Dance', 'Bharatanatyam']
            },
            {
                title: 'Puppet Show & Traditional Theater',
                description: 'Traditional puppet show or shadow puppet theater performance with storytelling and cultural elements.',
                type: 'Concert',
                date: new Date(2025, 12, 12),
                time: '06:00 PM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
                price: 1200,
                capacity: 150,
                tags: ['Cultural', 'Theater', 'Performance']
            },
            {
                title: 'Art & Craft Exhibition',
                description: 'Cultural art exhibition showcasing traditional Indian art forms, handicrafts, paintings, and sculptures from local artists.',
                type: 'Exhibition',
                date: new Date(2025, 12, 19),
                time: '10:00 AM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                price: 500,
                capacity: 500,
                tags: ['Cultural', 'Art', 'Exhibition']
            },
            {
                title: 'Poetry Recitation & Literature Night',
                description: 'Cultural evening with poetry recitation, literature readings, spoken word performances, and author discussions.',
                type: 'Concert',
                date: new Date(2025, 12, 26),
                time: '07:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1514306688985-86a08131db31?w=800&h=600&fit=crop',
                price: 800,
                capacity: 200,
                tags: ['Cultural', 'Literature', 'Poetry']
            },
            {
                title: 'Traditional Crafts Workshop',
                description: 'Interactive workshop teaching traditional crafts like pottery, weaving, painting, or sculpture with hands-on practice.',
                type: 'Workshop',
                date: new Date(2026, 0, 9),
                time: '02:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1578926078328-123454281e3f?w=800&h=600&fit=crop',
                price: 1500,
                capacity: 50,
                tags: ['Cultural', 'Workshop', 'Crafts']
            },
            {
                title: 'Cultural Heritage Walking Tour',
                description: 'Guided tour of historical and cultural heritage sites with expert explanations and cultural storytelling.',
                type: 'Other',
                date: new Date(2026, 0, 16),
                time: '09:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1499856871957-5b8620a32237?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 100,
                tags: ['Cultural', 'Tour', 'Heritage']
            }
        ]
    },

    // SPORTS EVENTS - 8 events
    {
        category: 'Sports Events',
        events: [
            {
                title: 'Marathon Race - Full 42K',
                description: 'Full marathon running event with professional race management, hydration stations, medical support, and finish line celebration.',
                type: 'Marathon',
                date: new Date(2025, 11, 7),
                time: '05:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                price: 1500,
                capacity: 2000,
                tags: ['Sports', 'Marathon', 'Running']
            },
            {
                title: 'Half Marathon - 21K Fun Run',
                description: 'Half marathon event for runners of all levels with scenic route, aid stations, and post-race refreshments.',
                type: 'Marathon',
                date: new Date(2025, 11, 14),
                time: '06:00 AM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1552674852-7f9db63ce247?w=800&h=600&fit=crop',
                price: 1000,
                capacity: 3000,
                tags: ['Sports', 'Half Marathon', 'Running']
            },
            {
                title: 'Cricket Tournament Championship',
                description: 'Multi-day cricket tournament with professional teams, live commentary, food stalls, and sports merchandise.',
                type: 'Other',
                date: new Date(2025, 12, 1),
                time: '09:00 AM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                price: 500,
                capacity: 10000,
                tags: ['Sports', 'Cricket', 'Tournament']
            },
            {
                title: 'Football League Championship',
                description: 'Football tournament with multiple teams, stadium seating, professional commentary, and awards ceremony.',
                type: 'Other',
                date: new Date(2025, 12, 8),
                time: '04:00 PM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1516575334481-f410a11e3861?w=800&h=600&fit=crop',
                price: 800,
                capacity: 5000,
                tags: ['Sports', 'Football', 'Championship']
            },
            {
                title: 'Badminton Tournament',
                description: 'Professional badminton tournament with singles and doubles categories, seeded matches, and trophy awards.',
                type: 'Other',
                date: new Date(2025, 12, 15),
                time: '09:00 AM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                price: 300,
                capacity: 1000,
                tags: ['Sports', 'Badminton', 'Tournament']
            },
            {
                title: 'Cycling Sports Event',
                description: 'Organized cycling event with multiple routes for different skill levels, safety support, and refreshment stations.',
                type: 'Other',
                date: new Date(2025, 12, 22),
                time: '07:00 AM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                price: 800,
                capacity: 1500,
                tags: ['Sports', 'Cycling', 'Event']
            },
            {
                title: 'Tennis Doubles Championship',
                description: 'Professional tennis championship featuring doubles matches, seeded tournaments, and professional coaching seminars.',
                type: 'Other',
                date: new Date(2026, 0, 5),
                time: '09:00 AM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 2000,
                tags: ['Sports', 'Tennis', 'Championship']
            },
            {
                title: 'Swimming Competition Meet',
                description: 'Professional swimming competition with multiple categories, professional timing, judges, and awards for winners.',
                type: 'Other',
                date: new Date(2026, 0, 12),
                time: '08:00 AM',
                location: 'Chennai',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 500,
                capacity: 1000,
                tags: ['Sports', 'Swimming', 'Competition']
            }
        ]
    },

    // EDUCATIONAL EVENTS - 8 events
    {
        category: 'Educational Events',
        events: [
            {
                title: 'Web Development Bootcamp',
                description: 'Intensive web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and deployment with hands-on projects.',
                type: 'Workshop',
                date: new Date(2025, 11, 2),
                time: '09:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 25000,
                capacity: 50,
                tags: ['Education', 'Web Development', 'Bootcamp']
            },
            {
                title: 'Data Science & Analytics Workshop',
                description: 'Practical workshop on data science, machine learning, Python programming, and real-world analytics applications.',
                type: 'Workshop',
                date: new Date(2025, 11, 9),
                time: '10:00 AM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 20000,
                capacity: 40,
                tags: ['Education', 'Data Science', 'Analytics']
            },
            {
                title: 'Digital Marketing Certification Course',
                description: 'Comprehensive digital marketing course covering SEO, SEM, social media marketing, content marketing, and analytics.',
                type: 'Workshop',
                date: new Date(2025, 11, 16),
                time: '02:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 15000,
                capacity: 60,
                tags: ['Education', 'Digital Marketing', 'Certification']
            },
            {
                title: 'Leadership & Management Seminar',
                description: 'Executive seminar on leadership skills, team management, decision-making, and organizational development.',
                type: 'Seminar',
                date: new Date(2025, 11, 23),
                time: '09:00 AM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 18000,
                capacity: 75,
                tags: ['Education', 'Leadership', 'Management']
            },
            {
                title: 'English Language & Communication Workshop',
                description: 'Intensive English language training with focus on communication skills, presentation, and professional English.',
                type: 'Workshop',
                date: new Date(2025, 11, 30),
                time: '03:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 12000,
                capacity: 35,
                tags: ['Education', 'Language', 'Communication']
            },
            {
                title: 'Photography Masterclass',
                description: 'Professional photography masterclass covering composition, lighting, editing, and different photography genres.',
                type: 'Workshop',
                date: new Date(2025, 12, 7),
                time: '10:00 AM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 16000,
                capacity: 25,
                tags: ['Education', 'Photography', 'Masterclass']
            },
            {
                title: 'Financial Planning & Investment Seminar',
                description: 'Seminar on personal finance, investment strategies, wealth management, and financial independence planning.',
                type: 'Seminar',
                date: new Date(2025, 12, 14),
                time: '02:00 PM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 10000,
                capacity: 100,
                tags: ['Education', 'Finance', 'Investment']
            },
            {
                title: 'AI & Machine Learning Conference',
                description: 'Conference on artificial intelligence, machine learning, deep learning, and AI applications in industry.',
                type: 'Conference',
                date: new Date(2025, 12, 21),
                time: '09:00 AM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                price: 8000,
                capacity: 500,
                tags: ['Education', 'AI', 'Machine Learning']
            }
        ]
    },

    // RELIGIOUS EVENTS - 8 events
    {
        category: 'Religious Events',
        events: [
            {
                title: 'Hanuman Jayanti Celebration',
                description: 'Hindu religious celebration honoring Lord Hanuman with prayers, bhajans, prasad distribution, and spiritual discourses.',
                type: 'Other',
                date: new Date(2025, 10, 18),
                time: '06:00 AM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 1000,
                tags: ['Religious', 'Hindu', 'Hanuman']
            },
            {
                title: 'Krishna Janmashtami Celebration',
                description: 'Hindu festival celebrating Lord Krishna\'s birth with aarti, bhajans, midnight celebration, and traditional sweets.',
                type: 'Other',
                date: new Date(2025, 8, 7),
                time: '12:00 AM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 3000,
                capacity: 1500,
                tags: ['Religious', 'Hindu', 'Krishna']
            },
            {
                title: 'Durga Puja Celebration',
                description: 'Major Hindu festival with elaborate idol installation, daily prayers, cultural performances, and community feast.',
                type: 'Festival',
                date: new Date(2025, 9, 10),
                time: '05:00 AM',
                location: 'Kolkata',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 5000,
                capacity: 2000,
                tags: ['Religious', 'Hindu', 'Durga']
            },
            {
                title: 'Guru Nanak Jayanti',
                description: 'Sikh religious celebration of Guru Nanak\'s birth with langar, prayer sessions, kirtan, and spiritual teachings.',
                type: 'Other',
                date: new Date(2025, 10, 25),
                time: '06:00 AM',
                location: 'Amritsar',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 3000,
                capacity: 800,
                tags: ['Religious', 'Sikh', 'Guru Nanak']
            },
            {
                title: 'Eid ul-Adha Celebration',
                description: 'Islamic festival with prayers, animal sacrifice ritual, feasting, and community gatherings with family.',
                type: 'Festival',
                date: new Date(2025, 12, 20),
                time: '06:00 AM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 2500,
                capacity: 1200,
                tags: ['Religious', 'Islamic', 'Eid']
            },
            {
                title: 'Easter Sunday Service & Celebration',
                description: 'Christian religious service commemorating resurrection with prayer, singing, Easter feast, and community celebration.',
                type: 'Other',
                date: new Date(2026, 3, 5),
                time: '06:00 AM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 2000,
                capacity: 500,
                tags: ['Religious', 'Christian', 'Easter']
            },
            {
                title: 'Buddhist Meditation Retreat',
                description: 'Multi-day Buddhist spiritual retreat with meditation sessions, teachings, mindfulness practices, and peaceful environment.',
                type: 'Retreat',
                date: new Date(2025, 11, 10),
                time: '06:00 AM',
                location: 'Rishikesh',
                image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
                price: 10000,
                capacity: 50,
                tags: ['Religious', 'Buddhist', 'Meditation']
            },
            {
                title: 'Jewish Hanukkah Celebration',
                description: 'Jewish festival of lights with menorah lighting, prayers, traditional food, and gift exchange celebrations.',
                type: 'Festival',
                date: new Date(2025, 11, 27),
                time: '06:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=800&h=600&fit=crop',
                price: 1500,
                capacity: 300,
                tags: ['Religious', 'Jewish', 'Hanukkah']
            }
        ]
    },

    // AWARD CEREMONIES - 8 events
    {
        category: 'Award Ceremonies',
        events: [
            {
                title: 'National Excellence Awards 2025',
                description: 'Prestigious national awards recognizing excellence across various industries with celebrity guests and live entertainment.',
                type: 'Other',
                date: new Date(2025, 11, 20),
                time: '06:30 PM',
                location: 'Delhi',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 15000,
                capacity: 800,
                tags: ['Awards', 'Excellence', 'Ceremony']
            },
            {
                title: 'Entertainment Industry Awards Night',
                description: 'Awards ceremony honoring excellence in film, television, music, and entertainment with live performances and celebrations.',
                type: 'Other',
                date: new Date(2025, 12, 3),
                time: '07:00 PM',
                location: 'Mumbai',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 20000,
                capacity: 1000,
                tags: ['Awards', 'Entertainment', 'Ceremony']
            },
            {
                title: 'Sports Achievement Awards',
                description: 'Awards ceremony honoring sports personalities and athletes for their achievements and contributions to sports.',
                type: 'Other',
                date: new Date(2025, 12, 10),
                time: '06:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 12000,
                capacity: 600,
                tags: ['Awards', 'Sports', 'Achievement']
            },
            {
                title: 'Business Leadership Awards',
                description: 'Annual awards celebrating outstanding business leaders, entrepreneurs, and corporate achievements with networking.',
                type: 'Other',
                date: new Date(2025, 12, 17),
                time: '07:00 PM',
                location: 'Pune',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 18000,
                capacity: 700,
                tags: ['Awards', 'Business', 'Leadership']
            },
            {
                title: 'Academic Excellence Awards',
                description: 'Awards ceremony honoring academic achievements, scholarships, and educational excellence with student performances.',
                type: 'Other',
                date: new Date(2025, 12, 24),
                time: '05:00 PM',
                location: 'Hyderabad',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 10000,
                capacity: 500,
                tags: ['Awards', 'Academic', 'Excellence']
            },
            {
                title: 'Environmental Sustainability Awards',
                description: 'Awards recognizing organizations and individuals contributing to environmental conservation and sustainability.',
                type: 'Other',
                date: new Date(2026, 0, 7),
                time: '06:00 PM',
                location: 'Goa',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 8000,
                capacity: 400,
                tags: ['Awards', 'Environmental', 'Sustainability']
            },
            {
                title: 'Social Impact Awards Gala',
                description: 'Prestigious awards ceremony honoring NGOs, social workers, and organizations making positive social impact.',
                type: 'Other',
                date: new Date(2026, 0, 14),
                time: '06:30 PM',
                location: 'Jaipur',
                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop',
                price: 12000,
                capacity: 600,
                tags: ['Awards', 'Social Impact', 'Charity']
            },
            {
                title: 'Tech Innovation Awards',
                description: 'Awards celebrating technological innovation, startups, and innovative solutions in tech industry with investor networking.',
                type: 'Other',
                date: new Date(2026, 0, 21),
                time: '07:00 PM',
                location: 'Bangalore',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                price: 16000,
                capacity: 900,
                tags: ['Awards', 'Tech', 'Innovation']
            }
        ]
    }
];

const addEvents = async () => {
    try {
        await connectDB();
        
        let totalAdded = 0;
        let categoryBreakdown = {};

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

        // Process each category
        for (const categoryData of comprehensiveCategories) {
            const category = categoryData.category;
            categoryBreakdown[category] = categoryData.events.length;

            for (const eventData of categoryData.events) {
                try {
                    const newEvent = await Event.create({
                        ...eventData,
                        category: category,
                        organizer: organizer._id,
                        attendees: Math.floor(Math.random() * (eventData.capacity / 2)),
                        rating: (Math.random() * 1 + 4).toFixed(1),
                        reviews: Math.floor(Math.random() * 500),
                        isActive: true
                    });
                    totalAdded++;
                    console.log(`✅ Added: ${eventData.title}`);
                } catch (error) {
                    console.error(`❌ Error adding ${eventData.title}:`, error.message);
                }
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('🎉 COMPREHENSIVE CATEGORY EVENTS ADDED SUCCESSFULLY!');
        console.log('='.repeat(80));
        console.log(`\n📊 Total Events Added: ${totalAdded}`);
        console.log('\n📋 Breakdown by Category:');
        Object.entries(categoryBreakdown).forEach(([category, count]) => {
            console.log(`   • ${category}: ${count} events`);
        });
        
        const totalEvents = await Event.countDocuments();
        console.log(`\n🌟 Total Events in Database: ${totalEvents}`);
        
        console.log('\n✨ All events added to MongoDB successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding events:', error);
        process.exit(1);
    }
};

addEvents();
