import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ Connection error:', error.message);
        process.exit(1);
    }
};

const checkEvents = async () => {
    try {
        await connectDB();

        // Check various wedding-related categories
        const categories = ['Weddings', 'Anniversaries', 'Marriage', 'Wedding', 'Corporate Events', 'Birthdays'];

        console.log('\n📊 Event Count by Category:');
        console.log('='.repeat(50));

        for (const category of categories) {
            const count = await Event.countDocuments({ category });
            console.log(`${category}: ${count} events`);

            if (count > 0) {
                const sample = await Event.findOne({ category });
                console.log(`   Sample: ${sample.title}\n`);
            }
        }

        const total = await Event.countDocuments();
        console.log('='.repeat(50));
        console.log(`Total Events: ${total}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkEvents();
