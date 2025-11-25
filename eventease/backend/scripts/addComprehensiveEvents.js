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
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://meghacs2021_db_user:T0zJoiCMQeRpyutF@project.xl7gjbx.mongodb.net/eventease?retryWrites=true&w=majority')
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        addEvents();
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

const organizerId = '691f0a27d9f0f02c63011fd9';

// Events organized by category - 10+ events per category
const eventsByCategory = {
    'Music': [
        {
            title: "Summer Music Festival",
            description: "Three-day music festival featuring top artists from around the world",
            type: "Festival",
            date: new Date('2025-06-15'),
            time: "10:00 AM",
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800",
            price: 2499,
            capacity: 5000,
            attendees: 3200,
            rating: 4.8,
            reviews: 450
        },
        {
            title: "Jazz Night Live",
            description: "Intimate jazz performance by renowned international jazz musicians",
            type: "Concert",
            date: new Date('2025-02-14'),
            time: "08:00 PM",
            location: "Delhi",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800",
            price: 1299,
            capacity: 800,
            attendees: 720,
            rating: 4.7,
            reviews: 320
        },
        {
            title: "Bollywood Nights",
            description: "Celebration of Bollywood music with live performances and dancing",
            type: "Concert",
            date: new Date('2025-03-20'),
            time: "07:00 PM",
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
            price: 899,
            capacity: 1200,
            attendees: 1050,
            rating: 4.6,
            reviews: 280
        },
        {
            title: "EDM Rave Party",
            description: "High-energy electronic dance music with world-class DJs",
            type: "Festival",
            date: new Date('2025-04-10'),
            time: "09:00 PM",
            location: "Pune",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
            price: 1599,
            capacity: 3000,
            attendees: 2800,
            rating: 4.5,
            reviews: 380
        },
        {
            title: "Classical Symphony Orchestra",
            description: "Grand orchestral performance of classical masterpieces",
            type: "Concert",
            date: new Date('2025-05-05'),
            time: "06:30 PM",
            location: "Hyderabad",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            price: 699,
            capacity: 600,
            attendees: 520,
            rating: 4.9,
            reviews: 250
        },
        {
            title: "Rock Festival 2025",
            description: "Ultimate rock music festival with legendary rock bands",
            type: "Festival",
            date: new Date('2025-07-20'),
            time: "12:00 PM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1501612780353-7e5432e52e15?w=800",
            price: 2299,
            capacity: 4000,
            attendees: 3600,
            rating: 4.7,
            reviews: 410
        },
        {
            title: "Indie Music Showcase",
            description: "Platform for emerging indie and alternative music artists",
            type: "Concert",
            date: new Date('2025-02-28'),
            time: "07:00 PM",
            location: "Kolkata",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            price: 499,
            capacity: 500,
            attendees: 450,
            rating: 4.4,
            reviews: 180
        },
        {
            title: "Pop Sensation Concert",
            description: "Live performance by international pop superstars",
            type: "Concert",
            date: new Date('2025-08-15'),
            time: "07:30 PM",
            location: "Chennai",
            image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
            price: 1999,
            capacity: 2000,
            attendees: 1850,
            rating: 4.6,
            reviews: 340
        },
        {
            title: "Reggae Beach Party",
            description: "Relaxed reggae music on the beach with international artists",
            type: "Festival",
            date: new Date('2025-03-10'),
            time: "06:00 PM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
            price: 799,
            capacity: 1500,
            attendees: 1200,
            rating: 4.5,
            reviews: 220
        },
        {
            title: "Country Music Night",
            description: "Evening of authentic country music performances",
            type: "Concert",
            date: new Date('2025-04-25'),
            time: "08:00 PM",
            location: "Jaipur",
            image: "https://images.unsplash.com/photo-1501612780353-7e5432e52e15?w=800",
            price: 699,
            capacity: 800,
            attendees: 680,
            rating: 4.3,
            reviews: 160
        },
        {
            title: "Folk Music Festival",
            description: "Celebration of traditional folk music from different regions",
            type: "Festival",
            date: new Date('2025-05-30'),
            time: "05:00 PM",
            location: "Ahmedabad",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            price: 599,
            capacity: 1000,
            attendees: 850,
            rating: 4.4,
            reviews: 200
        }
    ],
    'Sports': [
        {
            title: "Delhi Half Marathon 2025",
            description: "Annual 21km half marathon through the heart of Delhi",
            type: "Sports",
            date: new Date('2025-02-02'),
            time: "05:30 AM",
            location: "Delhi",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 499,
            capacity: 5000,
            attendees: 4200,
            rating: 4.6,
            reviews: 320
        },
        {
            title: "Mumbai Marathon Championship",
            description: "Premier 42km full marathon event in Mumbai",
            type: "Sports",
            date: new Date('2025-01-18'),
            time: "06:00 AM",
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 599,
            capacity: 3000,
            attendees: 2800,
            rating: 4.8,
            reviews: 450
        },
        {
            title: "Bangalore 10K Run",
            description: "Fun and fitness 10km community run event",
            type: "Sports",
            date: new Date('2025-03-15'),
            time: "06:30 AM",
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 299,
            capacity: 2000,
            attendees: 1800,
            rating: 4.5,
            reviews: 250
        },
        {
            title: "Cricket Tournament 2025",
            description: "Weekend cricket tournament with multiple matches",
            type: "Sports",
            date: new Date('2025-04-12'),
            time: "09:00 AM",
            location: "Pune",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 399,
            capacity: 1500,
            attendees: 1200,
            rating: 4.4,
            reviews: 180
        },
        {
            title: "Basketball Championship",
            description: "Professional basketball championship finals",
            type: "Sports",
            date: new Date('2025-05-20'),
            time: "07:00 PM",
            location: "Hyderabad",
            image: "https://images.unsplash.com/photo-1546519638-68711109bc3e?w=800",
            price: 799,
            capacity: 3000,
            attendees: 2600,
            rating: 4.7,
            reviews: 310
        },
        {
            title: "Badminton Masters",
            description: "International badminton tournament with top players",
            type: "Sports",
            date: new Date('2025-06-10'),
            time: "10:00 AM",
            location: "Chennai",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 599,
            capacity: 1000,
            attendees: 850,
            rating: 4.6,
            reviews: 220
        },
        {
            title: "Tennis Open 2025",
            description: "Grand tennis tournament featuring international players",
            type: "Sports",
            date: new Date('2025-07-08'),
            time: "09:00 AM",
            location: "Kolkata",
            image: "https://images.unsplash.com/photo-1554224311-beee415c15c9?w=800",
            price: 899,
            capacity: 2000,
            attendees: 1750,
            rating: 4.8,
            reviews: 380
        },
        {
            title: "Swimming Gala",
            description: "National swimming championship with multiple events",
            type: "Sports",
            date: new Date('2025-08-05'),
            time: "08:00 AM",
            location: "Jaipur",
            image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800",
            price: 349,
            capacity: 800,
            attendees: 700,
            rating: 4.5,
            reviews: 160
        },
        {
            title: "Cycling Adventure",
            description: "Long-distance cycling event through scenic routes",
            type: "Sports",
            date: new Date('2025-09-02'),
            time: "06:00 AM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 449,
            capacity: 1200,
            attendees: 1050,
            rating: 4.4,
            reviews: 200
        },
        {
            title: "Volleyball Championship",
            description: "Professional volleyball tournament with multiple teams",
            type: "Sports",
            date: new Date('2025-09-25'),
            time: "10:00 AM",
            location: "Ahmedabad",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            price: 499,
            capacity: 1500,
            attendees: 1300,
            rating: 4.6,
            reviews: 240
        }
    ],
    'Technology': [
        {
            title: "AI Summit 2025",
            description: "Conference on Artificial Intelligence and machine learning advancements",
            type: "Conference",
            date: new Date('2025-03-01'),
            time: "09:00 AM",
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 1999,
            capacity: 1500,
            attendees: 1200,
            rating: 4.8,
            reviews: 380
        },
        {
            title: "Cloud Computing Workshop",
            description: "Hands-on workshop on cloud infrastructure and deployment",
            type: "Workshop",
            date: new Date('2025-02-15'),
            time: "10:00 AM",
            location: "Delhi",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            price: 1299,
            capacity: 200,
            attendees: 180,
            rating: 4.7,
            reviews: 250
        },
        {
            title: "Blockchain Bootcamp",
            description: "Intensive bootcamp on blockchain technology and cryptocurrency",
            type: "Workshop",
            date: new Date('2025-04-05'),
            time: "09:00 AM",
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f9?w=800",
            price: 1499,
            capacity: 150,
            attendees: 140,
            rating: 4.6,
            reviews: 200
        },
        {
            title: "Data Science Masterclass",
            description: "Advanced data science techniques and real-world applications",
            type: "Workshop",
            date: new Date('2025-05-10'),
            time: "10:00 AM",
            location: "Pune",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            price: 1199,
            capacity: 250,
            attendees: 200,
            rating: 4.5,
            reviews: 180
        },
        {
            title: "Web Development Conference",
            description: "Latest trends in web development and frontend technologies",
            type: "Conference",
            date: new Date('2025-06-20'),
            time: "09:00 AM",
            location: "Hyderabad",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            price: 1099,
            capacity: 800,
            attendees: 650,
            rating: 4.6,
            reviews: 220
        },
        {
            title: "Cybersecurity Summit",
            description: "Expert discussions on cybersecurity threats and solutions",
            type: "Conference",
            date: new Date('2025-07-15'),
            time: "09:00 AM",
            location: "Chennai",
            image: "https://images.unsplash.com/photo-1550751827-4bd094aa049d?w=800",
            price: 1599,
            capacity: 600,
            attendees: 500,
            rating: 4.7,
            reviews: 280
        },
        {
            title: "Mobile App Development",
            description: "Workshop on building native and cross-platform mobile apps",
            type: "Workshop",
            date: new Date('2025-08-08'),
            time: "10:00 AM",
            location: "Kolkata",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            price: 999,
            capacity: 200,
            attendees: 160,
            rating: 4.4,
            reviews: 150
        },
        {
            title: "IoT Innovation Lab",
            description: "Explore Internet of Things applications and implementations",
            type: "Workshop",
            date: new Date('2025-09-12'),
            time: "10:00 AM",
            location: "Jaipur",
            image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f9?w=800",
            price: 1399,
            capacity: 180,
            attendees: 150,
            rating: 4.5,
            reviews: 170
        },
        {
            title: "DevOps Conference",
            description: "Best practices in DevOps, CI/CD pipelines and infrastructure",
            type: "Conference",
            date: new Date('2025-10-01'),
            time: "09:00 AM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            price: 1299,
            capacity: 500,
            attendees: 420,
            rating: 4.6,
            reviews: 200
        },
        {
            title: "Machine Learning Workshop",
            description: "Deep dive into machine learning algorithms and frameworks",
            type: "Workshop",
            date: new Date('2025-10-20'),
            time: "10:00 AM",
            location: "Ahmedabad",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            price: 1099,
            capacity: 220,
            attendees: 190,
            rating: 4.7,
            reviews: 240
        }
    ],
    'Arts': [
        {
            title: "Contemporary Art Exhibition",
            description: "Showcase of modern and contemporary art from renowned artists",
            type: "Exhibition",
            date: new Date('2025-02-01'),
            time: "10:00 AM",
            location: "Delhi",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            price: 299,
            capacity: 500,
            attendees: 350,
            rating: 4.6,
            reviews: 180
        },
        {
            title: "Painting Workshop",
            description: "Learn various painting techniques from professional artists",
            type: "Workshop",
            date: new Date('2025-03-08'),
            time: "02:00 PM",
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 599,
            capacity: 100,
            attendees: 85,
            rating: 4.5,
            reviews: 120
        },
        {
            title: "Street Art Festival",
            description: "Outdoor street art festival celebrating urban art culture",
            type: "Festival",
            date: new Date('2025-04-18'),
            time: "09:00 AM",
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            price: 199,
            capacity: 2000,
            attendees: 1600,
            rating: 4.4,
            reviews: 200
        },
        {
            title: "Digital Art Masterclass",
            description: "Advanced techniques in digital art and graphic design",
            type: "Workshop",
            date: new Date('2025-05-25'),
            time: "03:00 PM",
            location: "Pune",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 799,
            capacity: 80,
            attendees: 70,
            rating: 4.7,
            reviews: 140
        },
        {
            title: "Sculpture Exhibition",
            description: "Display of sculptures from classical to modern styles",
            type: "Exhibition",
            date: new Date('2025-06-30'),
            time: "10:00 AM",
            location: "Hyderabad",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            price: 349,
            capacity: 400,
            attendees: 300,
            rating: 4.5,
            reviews: 160
        },
        {
            title: "Photography Workshop",
            description: "Master photography fundamentals and advanced techniques",
            type: "Workshop",
            date: new Date('2025-07-22'),
            time: "01:00 PM",
            location: "Chennai",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 699,
            capacity: 120,
            attendees: 100,
            rating: 4.6,
            reviews: 180
        },
        {
            title: "Pottery & Ceramics Class",
            description: "Hands-on class to learn traditional pottery and ceramics",
            type: "Workshop",
            date: new Date('2025-08-16'),
            time: "02:00 PM",
            location: "Kolkata",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 549,
            capacity: 60,
            attendees: 50,
            rating: 4.4,
            reviews: 100
        },
        {
            title: "Graphic Design Bootcamp",
            description: "Intensive bootcamp on professional graphic design tools",
            type: "Workshop",
            date: new Date('2025-09-20'),
            time: "10:00 AM",
            location: "Jaipur",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 899,
            capacity: 100,
            attendees: 85,
            rating: 4.7,
            reviews: 150
        },
        {
            title: "Abstract Art Exploration",
            description: "Understanding and creating abstract art forms",
            type: "Workshop",
            date: new Date('2025-10-10'),
            time: "03:00 PM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800",
            price: 649,
            capacity: 90,
            attendees: 75,
            rating: 4.5,
            reviews: 130
        },
        {
            title: "Fashion Art Festival",
            description: "Celebration of fashion as an art form with designer showcase",
            type: "Festival",
            date: new Date('2025-11-05'),
            time: "04:00 PM",
            location: "Ahmedabad",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            price: 499,
            capacity: 800,
            attendees: 650,
            rating: 4.6,
            reviews: 200
        }
    ],
    'Education': [
        {
            title: "Digital Marketing Masterclass",
            description: "Comprehensive course on modern digital marketing strategies",
            type: "Workshop",
            date: new Date('2025-02-10'),
            time: "10:00 AM",
            location: "Delhi",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 1099,
            capacity: 300,
            attendees: 250,
            rating: 4.7,
            reviews: 220
        },
        {
            title: "Leadership & Management Training",
            description: "Develop leadership skills and management techniques",
            type: "Workshop",
            date: new Date('2025-03-18'),
            time: "09:00 AM",
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 899,
            capacity: 200,
            attendees: 170,
            rating: 4.6,
            reviews: 180
        },
        {
            title: "English Communication Skills",
            description: "Improve English speaking and professional communication",
            type: "Workshop",
            date: new Date('2025-04-25'),
            time: "04:00 PM",
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 699,
            capacity: 150,
            attendees: 130,
            rating: 4.5,
            reviews: 140
        },
        {
            title: "Yoga & Wellness Retreat",
            description: "3-day wellness retreat with yoga, meditation and wellness sessions",
            type: "Retreat",
            date: new Date('2025-05-15'),
            time: "06:00 AM",
            location: "Pune",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            price: 1599,
            capacity: 100,
            attendees: 85,
            rating: 4.8,
            reviews: 200
        },
        {
            title: "Creative Writing Workshop",
            description: "Learn fiction, poetry and creative writing techniques",
            type: "Workshop",
            date: new Date('2025-06-28'),
            time: "02:00 PM",
            location: "Hyderabad",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 599,
            capacity: 80,
            attendees: 65,
            rating: 4.4,
            reviews: 120
        },
        {
            title: "Financial Planning Seminar",
            description: "Learn investment and financial planning strategies",
            type: "Seminar",
            date: new Date('2025-07-20'),
            time: "03:00 PM",
            location: "Chennai",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 799,
            capacity: 200,
            attendees: 160,
            rating: 4.6,
            reviews: 170
        },
        {
            title: "Professional Development Summit",
            description: "Day-long summit on career growth and professional development",
            type: "Conference",
            date: new Date('2025-08-10'),
            time: "09:00 AM",
            location: "Kolkata",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 699,
            capacity: 400,
            attendees: 320,
            rating: 4.5,
            reviews: 160
        },
        {
            title: "Public Speaking Bootcamp",
            description: "Master public speaking and presentation skills",
            type: "Workshop",
            date: new Date('2025-09-15'),
            time: "10:00 AM",
            location: "Jaipur",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 499,
            capacity: 100,
            attendees: 85,
            rating: 4.7,
            reviews: 150
        },
        {
            title: "Stress Management Workshop",
            description: "Learn techniques to manage stress and anxiety effectively",
            type: "Workshop",
            date: new Date('2025-10-22'),
            time: "03:00 PM",
            location: "Goa",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            price: 549,
            capacity: 120,
            attendees: 100,
            rating: 4.6,
            reviews: 140
        },
        {
            title: "Time Management Seminar",
            description: "Effective time management techniques for professionals",
            type: "Seminar",
            date: new Date('2025-11-08'),
            time: "02:00 PM",
            location: "Ahmedabad",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            price: 399,
            capacity: 150,
            attendees: 130,
            rating: 4.5,
            reviews: 120
        }
    ]
};

async function addEvents() {
    try {
        console.log('\n🎯 Adding comprehensive events by category...\n');

        let totalAdded = 0;
        let categoryStats = {};

        for (const [category, events] of Object.entries(eventsByCategory)) {
            console.log(`\n📂 Processing Category: ${category} (${events.length} events)`);
            console.log('─'.repeat(60));

            let categoryCount = 0;

            for (const eventData of events) {
                // Check if event already exists
                const existingEvent = await Event.findOne({ 
                    title: eventData.title,
                    date: eventData.date
                });

                if (existingEvent) {
                    console.log(`  ⚠️  ${eventData.title} (already exists)`);
                    continue;
                }

                // Create new event
                const newEvent = new Event({
                    ...eventData,
                    category: category,
                    organizer: organizerId,
                    tags: [category.toLowerCase()],
                    isFeatured: false,
                    isTrending: Math.random() > 0.7,
                    isActive: true,
                    registeredUsers: []
                });

                const savedEvent = await newEvent.save();
                console.log(`  ✅ ${savedEvent.title}`);
                console.log(`     📍 ${savedEvent.location} | 💰 ₹${savedEvent.price} | 👥 ${savedEvent.attendees}/${savedEvent.capacity}`);
                
                categoryCount++;
                totalAdded++;
            }

            categoryStats[category] = categoryCount;
        }

        console.log('\n\n' + '═'.repeat(60));
        console.log('✅ COMPREHENSIVE EVENT IMPORT COMPLETE');
        console.log('═'.repeat(60) + '\n');

        // Display summary
        console.log('📊 Events Added by Category:\n');
        let totalEvents = 0;
        for (const [category, count] of Object.entries(categoryStats)) {
            const bar = '█'.repeat(Math.ceil(count / 2)) + ' '.repeat(Math.max(0, 25 - Math.ceil(count / 2)));
            console.log(`  ${category.padEnd(20)} ${bar} ${count} events`);
            totalEvents += count;
        }

        console.log(`\n  Total Added: ${totalAdded} new events`);

        // Get database statistics
        const totalInDb = await Event.countDocuments();
        const activeInDb = await Event.countDocuments({ isActive: true });
        const trendingInDb = await Event.countDocuments({ isTrending: true });

        console.log('\n📈 Database Statistics:');
        console.log(`  • Total Events: ${totalInDb}`);
        console.log(`  • Active Events: ${activeInDb}`);
        console.log(`  • Trending Events: ${trendingInDb}`);

        // Category breakdown
        const eventsByCat = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📂 Full Category Breakdown:');
        for (const cat of eventsByCat) {
            if (cat._id) console.log(`  • ${cat._id}: ${cat.count} events`);
        }

        console.log('\n✨ All events are ready to use!\n');

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
