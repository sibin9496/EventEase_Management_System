import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const checkEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease');
        console.log('✅ MongoDB connected');
        
        const totalCount = await Event.countDocuments();
        console.log(`\n📊 Total Events: ${totalCount}\n`);
        
        // Count by category
        const byCategory = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        console.log('📋 Events by Category:');
        byCategory.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} events`);
        });
        
        // Count by type
        const byType = await Event.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        console.log('\n🏷️  Events by Type:');
        byType.forEach(t => {
            if (t.count > 0) console.log(`   ${t._id}: ${t.count} events`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkEvents();
