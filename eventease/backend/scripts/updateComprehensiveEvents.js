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

// Comprehensive events with all requested types and categories
const upcomingEvents = [
    // CONCERT Events (10+)
    {
        title: 'Metallica Live in Concert',
        description: 'Experience the legendary Metallica performing their greatest hits live! A night of pure metal rock with incredible stage production.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 5),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        price: 4999,
        capacity: 5000,
        tags: ['Metal', 'Rock', 'Live Music', 'Concert']
    },
    {
        title: 'The Weeknd World Tour 2025',
        description: 'The Weeknd brings his world tour to India with spectacular performances and cutting-edge visuals.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 8),
        time: '06:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
        price: 5999,
        capacity: 8000,
        tags: ['Pop', 'R&B', 'Live Performance', 'Concert']
    },
    {
        title: 'Coldplay Live in India',
        description: 'Coldplay returns to India with an unforgettable concert experience featuring all their classic and new hits.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 12),
        time: '07:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
        price: 5499,
        capacity: 6000,
        tags: ['Alternative Rock', 'Live Concert', 'Music Festival']
    },
    {
        title: 'Ed Sheeran Mathematics Tour',
        description: 'Ed Sheeran\'s Mathematics Tour comes to India with his signature intimate performances and latest album tracks.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 15),
        time: '06:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
        price: 3999,
        capacity: 4000,
        tags: ['Singer-Songwriter', 'Pop', 'Live Concert']
    },
    {
        title: 'Beyoncé Renaissance Tour',
        description: 'Queen Beyoncé brings her groundbreaking Renaissance Tour to Indian fans with spectacular choreography and visuals.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 18),
        time: '07:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop',
        price: 7999,
        capacity: 10000,
        tags: ['Pop', 'R&B', 'Live Performance']
    },
    {
        title: 'AC/DC Rock Legends',
        description: 'Rock legends AC/DC deliver a powerful performance with classic tracks from their iconic catalog.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 22),
        time: '06:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1524368535623-f6e9f0b22cd4?w=600&h=400&fit=crop',
        price: 4499,
        capacity: 5000,
        tags: ['Hard Rock', 'Classic Rock', 'Live Music']
    },
    {
        title: 'Taylor Swift Eras Tour',
        description: 'The record-breaking Eras Tour featuring Taylor Swift\'s journey through all her musical eras and iconic moments.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 25),
        time: '07:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1516280318271-57d48ba2b947?w=600&h=400&fit=crop',
        price: 6999,
        capacity: 12000,
        tags: ['Pop', 'Country', 'Live Concert']
    },
    {
        title: 'Led Zeppelin Tribute Concert',
        description: 'Epic tribute to Led Zeppelin with masterful recreations of their legendary performances and timeless classics.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 28),
        time: '07:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
        price: 2999,
        capacity: 3000,
        tags: ['Rock Tribute', 'Classic Rock', 'Live Performance']
    },
    {
        title: 'Ariana Grande Sweetener Tour',
        description: 'Pop sensation Ariana Grande brings her powerful vocals and energetic performances to the stage.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2026, 0, 2),
        time: '06:30 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1516627318365-3d0c35bb96d1?w=600&h=400&fit=crop',
        price: 4999,
        capacity: 4500,
        tags: ['Pop', 'R&B', 'Live Performance']
    },
    {
        title: 'The Eagles Hotel California Tour',
        description: 'Legendary band The Eagles performs their iconic album Hotel California in its entirety with added concert experiences.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2026, 0, 5),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop',
        price: 3999,
        capacity: 5000,
        tags: ['Rock', 'Classic Rock', 'Live Concert']
    },
    {
        title: 'Dua Lipa Future Nostalgia Tour',
        description: 'British pop superstar Dua Lipa brings the Future Nostalgia experience with disco-infused pop performances.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2026, 0, 8),
        time: '07:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=400&fit=crop',
        price: 3499,
        capacity: 3500,
        tags: ['Pop', 'Disco', 'Live Performance']
    },
    
    // LIVE SHOWS Events (10+)
    {
        title: 'Comedy Show: Stand-up Specials',
        description: 'Live comedy show featuring top stand-up comedians performing hilarious sets and engaging with the audience.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 6),
        time: '08:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1514306688985-86a08131db31?w=600&h=400&fit=crop',
        price: 1299,
        capacity: 500,
        tags: ['Comedy', 'Entertainment', 'Live Performance']
    },
    {
        title: 'Magic Spectacular Live Show',
        description: 'Incredible magic performances with stunning illusions and interactive audience participation.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 9),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
        price: 999,
        capacity: 800,
        tags: ['Magic', 'Entertainment', 'Illusion']
    },
    {
        title: 'Cirque du Soleil Mystère',
        description: 'Stunning acrobatic and artistic performances by world-class performers from Cirque du Soleil.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 13),
        time: '07:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        price: 2999,
        capacity: 2000,
        tags: ['Circus Arts', 'Performance', 'Entertainment']
    },
    {
        title: 'Stand-up Comedy Night: International Comics',
        description: 'International comedians bring their unique humor and perspectives to the Indian stage.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 16),
        time: '08:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop',
        price: 1499,
        capacity: 600,
        tags: ['Comedy', 'International', 'Entertainment']
    },
    {
        title: 'Improv Comedy Show',
        description: 'Hilarious improvisational comedy where performers create scenes on the spot based on audience suggestions.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 19),
        time: '08:30 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1485095329183-d0daf6407e7f?w=600&h=400&fit=crop',
        price: 799,
        capacity: 400,
        tags: ['Comedy', 'Improv', 'Entertainment']
    },
    {
        title: 'Dance Fusion Live Performance',
        description: 'Contemporary dance fusion blending classical and modern dance forms in an electrifying live performance.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 23),
        time: '07:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
        price: 1299,
        capacity: 1000,
        tags: ['Dance', 'Performance', 'Art']
    },
    {
        title: 'Storytelling & Performance Art',
        description: 'Engaging storytelling combined with multimedia performances creating immersive theatrical experiences.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 26),
        time: '07:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
        price: 1099,
        capacity: 700,
        tags: ['Theater', 'Storytelling', 'Art']
    },
    {
        title: 'Classical Music & Vocal Performance',
        description: 'Exquisite classical Indian music performances featuring renowned musicians and vocalists.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 29),
        time: '06:30 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop',
        price: 599,
        capacity: 500,
        tags: ['Classical Music', 'Indian Arts', 'Performance']
    },
    {
        title: 'Jazz Night Live',
        description: 'Smooth jazz performances by talented musicians creating an intimate and sophisticated atmosphere.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2026, 0, 1),
        time: '08:00 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop',
        price: 1599,
        capacity: 300,
        tags: ['Jazz', 'Live Music', 'Performance']
    },
    {
        title: 'Theater Production: Modern Drama',
        description: 'Contemporary theater production exploring modern themes with powerful acting and direction.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2026, 0, 4),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1460661410884-5cdadc4e4a5d?w=600&h=400&fit=crop',
        price: 799,
        capacity: 600,
        tags: ['Theater', 'Drama', 'Performance']
    },
    
    // STAGE SHOW Events (10+)
    {
        title: 'Bollywood Grand Finale Stage Show',
        description: 'Spectacular stage production featuring Bollywood songs, dances, and elaborate costumes and sets.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 7),
        time: '07:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1503995066313-da53500fe8f8?w=600&h=400&fit=crop',
        price: 2499,
        capacity: 3000,
        tags: ['Bollywood', 'Stage Show', 'Entertainment']
    },
    {
        title: 'Disney on Ice Spectacular',
        description: 'Magical ice skating show featuring Disney characters and stories with stunning choreography.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 11),
        time: '06:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
        price: 1999,
        capacity: 2500,
        tags: ['Ice Skating', 'Disney', 'Family Entertainment']
    },
    {
        title: 'Laser Light Show & Concert',
        description: 'High-tech laser light show combined with live music creating a spectacular visual experience.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 14),
        time: '08:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1516595318391-a81e1e2f5ab4?w=600&h=400&fit=crop',
        price: 1699,
        capacity: 2000,
        tags: ['Laser Show', 'Music', 'Technology']
    },
    {
        title: 'Musical Theater: Les Misérables',
        description: 'Epic musical theater production of Les Misérables with world-class singers and production design.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 17),
        time: '07:30 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1460661410884-5cdadc4e4a5d?w=600&h=400&fit=crop',
        price: 2299,
        capacity: 1500,
        tags: ['Musical Theater', 'Drama', 'Stage Production']
    },
    {
        title: 'Kathak Dance Extravaganza',
        description: 'Traditional Indian classical Kathak dance performances by master dancers with live musicians.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 21),
        time: '06:30 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
        price: 899,
        capacity: 800,
        tags: ['Classical Dance', 'Indian Arts', 'Cultural']
    },
    {
        title: 'Rock Opera: The Who',
        description: 'Live rock opera performance featuring The Who\'s Tommy with elaborate stage production.',
        category: 'Music',
        type: 'Concert',
        date: new Date(2025, 11, 24),
        time: '07:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=400&fit=crop',
        price: 2599,
        capacity: 2000,
        tags: ['Rock Opera', 'Music', 'Theater']
    },
    {
        title: 'Phantom of the Opera Stage Show',
        description: 'Spectacular stage adaptation of Phantom of the Opera with stunning sets and vocal performances.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 27),
        time: '07:30 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        price: 1999,
        capacity: 1200,
        tags: ['Musical', 'Stage Production', 'Drama']
    },
    {
        title: 'Bharatanatyam Dance Performance',
        description: 'Graceful classical Indian dance form with intricate movements and spiritual storytelling.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2025, 11, 30),
        time: '06:30 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1485095329183-d0daf6407e7f?w=600&h=400&fit=crop',
        price: 799,
        capacity: 600,
        tags: ['Classical Dance', 'Indian Culture', 'Performance']
    },
    {
        title: 'Contemporary Stage Production',
        description: 'Modern theatrical production with experimental stage design and cutting-edge performances.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2026, 0, 3),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
        price: 1199,
        capacity: 700,
        tags: ['Contemporary', 'Theater', 'Modern Art']
    },
    {
        title: 'Comedy Extravaganza Stage Show',
        description: 'Multi-act comedy production with top comedians performing back-to-back hilarious sets.',
        category: 'Arts',
        type: 'Concert',
        date: new Date(2026, 0, 6),
        time: '08:00 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1514306688985-86a08131db31?w=600&h=400&fit=crop',
        price: 1399,
        capacity: 500,
        tags: ['Comedy', 'Entertainment', 'Stage Show']
    },
    
    // WORKSHOP Events (10+)
    {
        title: 'Advanced Web Development Workshop',
        description: 'Intensive hands-on workshop covering React, Node.js, and advanced full-stack development techniques.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 6),
        time: '09:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
        price: 3999,
        capacity: 50,
        tags: ['Web Development', 'React', 'Node.js']
    },
    {
        title: 'Digital Photography Masterclass',
        description: 'Learn professional photography techniques including composition, lighting, and post-processing.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 11, 10),
        time: '10:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1516035069371-29ad0abe9a06?w=600&h=400&fit=crop',
        price: 1999,
        capacity: 30,
        tags: ['Photography', 'Art', 'Creative']
    },
    {
        title: 'Machine Learning for Beginners',
        description: 'Introduction to machine learning concepts, algorithms, and implementation using Python and popular libraries.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 13),
        time: '09:30 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
        price: 2999,
        capacity: 40,
        tags: ['Machine Learning', 'AI', 'Python']
    },
    {
        title: 'UI/UX Design Workshop with Figma',
        description: 'Practical workshop on designing user interfaces and experiences using Figma and design principles.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 11, 16),
        time: '10:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 2299,
        capacity: 35,
        tags: ['Design', 'UI/UX', 'Figma']
    },
    {
        title: 'Cloud Computing with AWS',
        description: 'Comprehensive workshop on AWS cloud services including EC2, S3, Lambda, and deployment strategies.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 19),
        time: '09:00 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
        price: 3499,
        capacity: 45,
        tags: ['Cloud', 'AWS', 'DevOps']
    },
    {
        title: 'Creative Writing Workshop',
        description: 'Develop your creative writing skills through storytelling, character development, and narrative techniques.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 11, 22),
        time: '02:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
        price: 1299,
        capacity: 25,
        tags: ['Writing', 'Creative', 'Literature']
    },
    {
        title: 'Data Science with Python & SQL',
        description: 'Learn data analysis, manipulation, and visualization using Python, pandas, and SQL for real-world projects.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 25),
        time: '09:30 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8a0c5?w=600&h=400&fit=crop',
        price: 2799,
        capacity: 40,
        tags: ['Data Science', 'Python', 'SQL']
    },
    {
        title: 'Graphic Design Fundamentals',
        description: 'Master the fundamentals of graphic design including color theory, typography, and design composition.',
        category: 'Arts',
        type: 'Workshop',
        date: new Date(2025, 11, 28),
        time: '10:00 AM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 1899,
        capacity: 30,
        tags: ['Graphic Design', 'Art', 'Creative']
    },
    {
        title: 'Cybersecurity & Network Security Workshop',
        description: 'Hands-on workshop covering network security, ethical hacking, and security best practices.',
        category: 'Technology',
        type: 'Workshop',
        date: new Date(2025, 11, 31),
        time: '09:00 AM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1550751827-4bd94c3e678e?w=600&h=400&fit=crop',
        price: 2499,
        capacity: 35,
        tags: ['Security', 'Networking', 'Cybersecurity']
    },
    {
        title: 'Digital Marketing & SEO Workshop',
        description: 'Learn digital marketing strategies, SEO optimization, content marketing, and social media marketing.',
        category: 'Business',
        type: 'Workshop',
        date: new Date(2026, 0, 2),
        time: '10:00 AM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
        price: 1699,
        capacity: 40,
        tags: ['Marketing', 'Digital', 'SEO']
    },
    
    // MARATHON Events (10+)
    {
        title: 'Marathon 2025: 42K Challenge',
        description: 'Full marathon covering 42 kilometers through scenic routes with professional support and medical assistance.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 7),
        time: '05:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1552674852-7f9db63ce247?w=600&h=400&fit=crop',
        price: 1499,
        capacity: 2000,
        tags: ['Marathon', 'Running', 'Fitness']
    },
    {
        title: 'Half Marathon: City Race 2025',
        description: '21-kilometer half marathon with amazing views, hydration stations, and professional race management.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 10),
        time: '06:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 999,
        capacity: 3000,
        tags: ['Half Marathon', 'Running', 'Fitness']
    },
    {
        title: 'Ultra Marathon: 50K Endurance',
        description: 'Challenging 50-kilometer ultra marathon for experienced runners with challenging terrain and checkpoints.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 13),
        time: '04:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        price: 2499,
        capacity: 500,
        tags: ['Ultra Marathon', 'Endurance', 'Adventure']
    },
    {
        title: '10K Fun Run & Family Event',
        description: '10-kilometer community run with family participation, activities, and celebration for all fitness levels.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 15),
        time: '07:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1552674852-7f9db63ce247?w=600&h=400&fit=crop',
        price: 499,
        capacity: 5000,
        tags: ['10K Run', 'Family Event', 'Community']
    },
    {
        title: 'Beach Marathon 2025',
        description: 'Full marathon on scenic beach routes with unique experience, hydration stations, and beach entertainment.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 18),
        time: '05:30 AM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 1699,
        capacity: 1500,
        tags: ['Beach Marathon', 'Scenic', 'Adventure']
    },
    {
        title: 'Trail Marathon: Mountain Challenge',
        description: 'Exciting trail marathon through hilly terrain with panoramic views and nature immersion.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 21),
        time: '05:00 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        price: 1899,
        capacity: 800,
        tags: ['Trail Marathon', 'Mountain', 'Adventure']
    },
    {
        title: '5K Morning Jog Challenge',
        description: 'Casual 5-kilometer morning jog perfect for beginners and fitness enthusiasts to start their day active.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 24),
        time: '06:30 AM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 299,
        capacity: 2000,
        tags: ['5K Run', 'Morning Event', 'Fitness']
    },
    {
        title: 'Relay Marathon: Team Competition',
        description: 'Exciting team-based relay marathon where teams compete in different segments with prize money.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 27),
        time: '05:30 AM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1552674852-7f9db63ce247?w=600&h=400&fit=crop',
        price: 3999,
        capacity: 1000,
        tags: ['Relay Marathon', 'Team Event', 'Competition']
    },
    {
        title: 'Night Marathon: Lights & Run',
        description: 'Unique night marathon with LED lighting, night atmosphere, and after-run celebration party.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2025, 11, 29),
        time: '06:00 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
        price: 1299,
        capacity: 1500,
        tags: ['Night Marathon', 'Evening Event', 'Adventure']
    },
    {
        title: 'Charity Marathon: Run for a Cause',
        description: 'Marathon supporting charitable causes where registration fees contribute to community welfare programs.',
        category: 'Sports',
        type: 'Marathon',
        date: new Date(2026, 0, 1),
        time: '05:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 1199,
        capacity: 2500,
        tags: ['Charity', 'Marathon', 'Philanthropy']
    },
    
    // ARTS Events (10+)
    {
        title: 'Contemporary Art Exhibition 2025',
        description: 'Showcase of contemporary art works from emerging and established artists featuring paintings, sculptures, and installations.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 5),
        time: '10:00 AM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 299,
        capacity: 1000,
        tags: ['Art Exhibition', 'Contemporary', 'Paintings']
    },
    {
        title: 'Sculpture Exhibition: Modern Forms',
        description: 'Exhibition of modern sculpture featuring three-dimensional art installations and interactive exhibits.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 9),
        time: '11:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 399,
        capacity: 800,
        tags: ['Sculpture', 'Modern Art', 'Exhibition']
    },
    {
        title: 'Photography Exhibition: World Stories',
        description: 'International photography exhibition telling stories from around the world through powerful visual narratives.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 12),
        time: '10:30 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1516035069371-29ad0abe9a06?w=600&h=400&fit=crop',
        price: 299,
        capacity: 600,
        tags: ['Photography', 'Exhibition', 'World Culture']
    },
    {
        title: 'Street Art & Graffiti Fest',
        description: 'Festival celebrating street art, graffiti, and urban art forms with live artist performances and workshops.',
        category: 'Arts',
        type: 'Festival',
        date: new Date(2025, 11, 15),
        time: '09:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 499,
        capacity: 2000,
        tags: ['Street Art', 'Graffiti', 'Urban Art']
    },
    {
        title: 'Digital Art & NFT Showcase',
        description: 'Exhibition of digital art and NFT collections from creators worldwide with blockchain technology.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 18),
        time: '10:00 AM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 599,
        capacity: 500,
        tags: ['Digital Art', 'NFT', 'Technology']
    },
    {
        title: 'Watercolor Painting Exhibition',
        description: 'Beautiful collection of watercolor paintings showcasing landscapes, portraits, and abstract art.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 21),
        time: '11:00 AM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 299,
        capacity: 400,
        tags: ['Watercolor', 'Painting', 'Art']
    },
    {
        title: 'Ceramic & Pottery Exhibition',
        description: 'Exhibition of handcrafted ceramic and pottery artworks with traditional and modern techniques on display.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 24),
        time: '10:30 AM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 399,
        capacity: 600,
        tags: ['Pottery', 'Ceramic', 'Handcraft']
    },
    {
        title: 'Abstract Art & Installation',
        description: 'Immersive exhibition of abstract art and interactive installations challenging perception and creativity.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 27),
        time: '10:00 AM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 499,
        capacity: 700,
        tags: ['Abstract', 'Installation', 'Modern Art']
    },
    {
        title: 'Jewelry Art & Design Exhibition',
        description: 'Showcase of exquisite jewelry designs combining traditional and contemporary artistic approaches.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2025, 11, 30),
        time: '11:00 AM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 399,
        capacity: 500,
        tags: ['Jewelry', 'Design', 'Art']
    },
    {
        title: 'Mixed Media Art Experience',
        description: 'Exhibition combining various art mediums including paint, sculpture, video, and interactive elements.',
        category: 'Arts',
        type: 'Exhibition',
        date: new Date(2026, 0, 2),
        time: '10:00 AM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        price: 599,
        capacity: 800,
        tags: ['Mixed Media', 'Art', 'Exhibition']
    },
    
    // SPORTS Events (10+)
    {
        title: 'Cricket Tournament 2025',
        description: 'Exciting cricket tournament featuring matches between regional teams with exciting performances and prizes.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 6),
        time: '02:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1518611505868-d7b6b3ce2b27?w=600&h=400&fit=crop',
        price: 799,
        capacity: 1000,
        tags: ['Cricket', 'Sports', 'Tournament']
    },
    {
        title: 'Football Championship 2025',
        description: 'Premier football championship featuring top clubs competing for the trophy in thrilling matches.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 9),
        time: '04:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1461897104934-7a3546b8e8b3?w=600&h=400&fit=crop',
        price: 1099,
        capacity: 2000,
        tags: ['Football', 'Sports', 'Championship']
    },
    {
        title: 'Badminton National Championship',
        description: 'National-level badminton tournament featuring singles and doubles competitions with top players.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 12),
        time: '09:00 AM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 599,
        capacity: 800,
        tags: ['Badminton', 'Championship', 'Sports']
    },
    {
        title: 'Tennis Grand Slam 2025',
        description: 'Tennis championship tournament featuring international and national players competing in singles and doubles.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 15),
        time: '10:00 AM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1518611505868-d7b6b3ce2b27?w=600&h=400&fit=crop',
        price: 899,
        capacity: 1500,
        tags: ['Tennis', 'Grand Slam', 'Championship']
    },
    {
        title: 'Volleyball Tournament 2025',
        description: 'Exciting volleyball tournament with men\'s and women\'s categories featuring competitive matches.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 18),
        time: '03:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 699,
        capacity: 1000,
        tags: ['Volleyball', 'Tournament', 'Sports']
    },
    {
        title: 'Swimming & Diving Championship',
        description: 'National swimming and diving championship featuring multiple events and competitions for all age groups.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 21),
        time: '08:00 AM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1576610616656-570f080e6e69?w=600&h=400&fit=crop',
        price: 499,
        capacity: 500,
        tags: ['Swimming', 'Diving', 'Championship']
    },
    {
        title: 'Basketball League Finals',
        description: 'Thrilling basketball league finals featuring top teams competing for the championship trophy.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 24),
        time: '06:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1546519638-68711109efed?w=600&h=400&fit=crop',
        price: 999,
        capacity: 1200,
        tags: ['Basketball', 'League', 'Championship']
    },
    {
        title: 'Cycling Race & Mountain Biking',
        description: 'Exciting cycling event featuring road races and mountain biking competitions with challenging routes.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 27),
        time: '06:30 AM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=400&fit=crop',
        price: 799,
        capacity: 800,
        tags: ['Cycling', 'Mountain Biking', 'Sports']
    },
    {
        title: 'Athletics Track & Field Meet',
        description: 'National athletics championship featuring track and field events with Olympic-level performances.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2025, 11, 30),
        time: '07:00 AM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1552674852-7f9db63ce247?w=600&h=400&fit=crop',
        price: 599,
        capacity: 2000,
        tags: ['Athletics', 'Track & Field', 'Championship']
    },
    {
        title: 'Mixed Martial Arts (MMA) Championship',
        description: 'High-octane MMA championship featuring top fighters competing in multiple weight categories.',
        category: 'Sports',
        type: 'Sports',
        date: new Date(2026, 0, 3),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
        price: 1499,
        capacity: 3000,
        tags: ['MMA', 'Fighting', 'Championship']
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
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old events\n`);

        // Add new upcoming events
        const eventPromises = upcomingEvents.map(event => 
            Event.create({
                ...event,
                organizer: adminUser._id
            })
        );

        const createdEvents = await Promise.all(eventPromises);
        console.log(`✅ Successfully created ${createdEvents.length} upcoming events\n`);

        // Display summary by type
        const eventsByType = {};
        createdEvents.forEach(event => {
            if (!eventsByType[event.type]) {
                eventsByType[event.type] = [];
            }
            eventsByType[event.type].push(event);
        });

        console.log('📊 EVENT SUMMARY BY TYPE:');
        console.log('='.repeat(60));
        Object.entries(eventsByType).forEach(([type, events]) => {
            console.log(`\n${type.toUpperCase()}: ${events.length} events`);
            console.log('-'.repeat(60));
            events.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title}`);
                console.log(`   📅 ${event.date.toLocaleDateString()} at ${event.time}`);
                console.log(`   🏙️  ${event.location} | 💰 ₹${event.price}`);
            });
        });

        // Summary by category
        console.log('\n\n📋 EVENT SUMMARY BY CATEGORY:');
        console.log('='.repeat(60));
        const eventsByCategory = {};
        createdEvents.forEach(event => {
            if (!eventsByCategory[event.category]) {
                eventsByCategory[event.category] = 0;
            }
            eventsByCategory[event.category]++;
        });

        Object.entries(eventsByCategory).forEach(([category, count]) => {
            console.log(`${category}: ${count} events`);
        });

        console.log('\n✨ All upcoming events updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating events:', error.message);
        process.exit(1);
    }
};

updateEvents();
