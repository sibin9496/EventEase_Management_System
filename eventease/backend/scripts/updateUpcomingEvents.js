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

// Upcoming event images - single image per event
const upcomingEvents = [
    {
        title: 'AI & Machine Learning Workshop',
        description: 'Learn cutting-edge AI technologies and machine learning concepts with industry experts. Perfect for beginners to intermediate level developers.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 5),
        time: '09:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1677442d019cecf482f31a574b5bfd97?w=600&h=400&fit=crop',
        price: 2999,
        capacity: 100,
        tags: ['AI', 'Machine Learning', 'Python', 'Technology']
    },
    {
        title: 'Web Development Bootcamp 2025',
        description: 'Intensive 12-week bootcamp covering React, Node.js, and full-stack development. Build real-world projects and land your dream job.',
        category: 'Technology',
        type: 'Bootcamp',
        date: new Date(2025, 11, 10),
        time: '10:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
        price: 19999,
        capacity: 50,
        tags: ['Web Development', 'React', 'Node.js', 'Full Stack']
    },
    {
        title: 'Digital Marketing Summit 2025',
        description: 'Keynote speeches and workshops from leading digital marketing professionals. Learn SEO, social media strategy, and analytics.',
        category: 'Business',
        type: 'Summit',
        date: new Date(2025, 11, 15),
        time: '08:30 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        price: 4999,
        capacity: 200,
        tags: ['Marketing', 'Digital', 'Business', 'SEO']
    },
    {
        title: 'Mobile App Development Conference',
        description: 'Latest trends in iOS and Android development. Network with app developers and learn about app store optimization.',
        category: 'Technology',
        type: 'Conference',
        date: new Date(2025, 11, 18),
        time: '09:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
        price: 3499,
        capacity: 150,
        tags: ['Mobile', 'iOS', 'Android', 'Development']
    },
    {
        title: 'Cloud Infrastructure Masterclass',
        description: 'Deep dive into AWS, Azure, and GCP. Learn cloud architecture, deployment, and cost optimization.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 22),
        time: '02:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        price: 3299,
        capacity: 80,
        tags: ['Cloud', 'AWS', 'Azure', 'Infrastructure']
    },
    {
        title: 'Cybersecurity Awareness Program',
        description: 'Essential security practices for businesses. Learn about threats, protection strategies, and compliance requirements.',
        category: 'Technology',
        type: 'Seminar',
        date: new Date(2025, 11, 25),
        time: '11:00 AM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1550751827-4bd94c3e678e?w=600&h=400&fit=crop',
        price: 1999,
        capacity: 120,
        tags: ['Security', 'Cybersecurity', 'Protection', 'Compliance']
    },
    {
        title: 'Startup Pitch & Networking Event',
        description: 'Pitch your startup ideas to investors and venture capitalists. Network with entrepreneurs and get mentorship.',
        category: 'Business',
        type: 'Networking',
        date: new Date(2025, 11, 28),
        time: '06:00 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        price: 999,
        capacity: 200,
        tags: ['Startup', 'Investment', 'Networking', 'Entrepreneurship']
    },
    {
        title: 'UI/UX Design Workshop',
        description: 'Master the principles of user interface and user experience design. Learn Figma, prototyping, and user testing.',
        category: 'Education',
        type: 'Workshop',
        date: new Date(2025, 12, 2),
        time: '10:00 AM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 2499,
        capacity: 60,
        tags: ['Design', 'UI', 'UX', 'Figma']
    },
    {
        title: 'Data Science & Analytics Bootcamp',
        description: 'Learn data analysis, visualization, and predictive modeling using Python and R. Real projects included.',
        category: 'Technology',
        type: 'Bootcamp',
        date: new Date(2025, 12, 5),
        time: '09:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1527427337751-fdca2f128ce5?w=600&h=400&fit=crop',
        price: 14999,
        capacity: 70,
        tags: ['Data Science', 'Analytics', 'Python', 'R']
    },
    {
        title: 'Blockchain & Cryptocurrency Seminar',
        description: 'Understanding blockchain technology, cryptocurrencies, NFTs, and DeFi. Expert insights into the future of finance.',
        category: 'Technology',
        type: 'Seminar',
        date: new Date(2025, 12, 8),
        time: '03:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1642104704074-dda0f4ba2e40?w=600&h=400&fit=crop',
        price: 2299,
        capacity: 100,
        tags: ['Blockchain', 'Crypto', 'NFT', 'DeFi']
    },
    {
        title: 'DevOps & CI/CD Masterclass',
        description: 'Learn continuous integration and deployment practices. Docker, Kubernetes, and GitLab CI hands-on training.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 12, 12),
        time: '10:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1551565565-a7fb0f3fe67a?w=600&h=400&fit=crop',
        price: 3899,
        capacity: 90,
        tags: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes']
    },
    {
        title: 'Quantum Computing Introduction',
        description: 'Introduction to quantum computing concepts, quantum gates, and quantum algorithms. Perfect for curious minds.',
        category: 'Education',
        type: 'Seminar',
        date: new Date(2025, 12, 15),
        time: '02:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1635070041078-e3677b5133e7?w=600&h=400&fit=crop',
        price: 1999,
        capacity: 80,
        tags: ['Quantum', 'Computing', 'Science', 'Innovation']
    },
    {
        title: 'E-commerce Growth Strategies',
        description: 'Scale your online business with proven strategies. Conversion optimization, marketing, and customer retention.',
        category: 'Business',
        type: 'Workshop',
        date: new Date(2025, 12, 18),
        time: '11:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1563986768060-7efb67b3b6d5?w=600&h=400&fit=crop',
        price: 2799,
        capacity: 120,
        tags: ['E-commerce', 'Growth', 'Marketing', 'Business']
    },
    {
        title: 'Advanced Python Programming',
        description: 'Master advanced Python concepts including decorators, generators, metaclasses, and async programming.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 12, 22),
        time: '10:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
        price: 2199,
        capacity: 50,
        tags: ['Python', 'Programming', 'Advanced', 'Development']
    }
];

const updateEvents = async () => {
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

        // Delete old events
        const deleteResult = await Event.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old events`);

        // Add new upcoming events
        const eventPromises = upcomingEvents.map(event => 
            Event.create({
                ...event,
                organizer: adminUser._id
            })
        );

        const createdEvents = await Promise.all(eventPromises);
        console.log(`\n✅ Successfully created ${createdEvents.length} upcoming events\n`);

        // Display summary
        console.log('📊 Event Summary:');
        console.log('================');
        createdEvents.forEach((event, index) => {
            console.log(`${index + 1}. ${event.title}`);
            console.log(`   📅 Date: ${event.date.toLocaleDateString()}`);
            console.log(`   🏙️  Location: ${event.location}`);
            console.log(`   💰 Price: ₹${event.price}`);
            console.log('');
        });

        console.log('✨ All upcoming events updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating events:', error.message);
        process.exit(1);
    }
};

updateEvents();
