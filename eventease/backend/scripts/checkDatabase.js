import mongoose from 'mongoose';
import Event from '../models/Event.js';

async function checkDatabase() {
    try {
        await mongoose.connect('mongodb+srv://meghacs2021_db_user:T0zJoiCMQeRpyutF@project.xl7gjbx.mongodb.net/eventease?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB\n');

        const totalEvents = await Event.countDocuments();
        console.log(`📊 Total Events in Database: ${totalEvents}\n`);

        const categories = {};
        const events = await Event.find().select('title category type');

        events.forEach(event => {
            if (!categories[event.category]) {
                categories[event.category] = [];
            }
            categories[event.category].push({
                title: event.title,
                type: event.type
            });
        });

        console.log('📋 Events by Category:\n');
        for (const [category, eventList] of Object.entries(categories)) {
            console.log(`\n${category} (${eventList.length} events):`);
            eventList.forEach(e => {
                console.log(`  - ${e.title}`);
            });
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
