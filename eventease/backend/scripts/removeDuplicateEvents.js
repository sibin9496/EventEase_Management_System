import mongoose from 'mongoose';
import Event from '../models/Event.js';

async function removeDuplicates() {
    try {
        await mongoose.connect('mongodb+srv://meghacs2021_db_user:T0zJoiCMQeRpyutF@project.xl7gjbx.mongodb.net/eventease?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB\n');

        const duplicates = {};
        const toRemove = [];

        const events = await Event.find();

        // Find duplicates by title
        events.forEach(event => {
            if (!duplicates[event.title]) {
                duplicates[event.title] = [];
            }
            duplicates[event.title].push(event._id);
        });

        // Identify which ones to remove (keep first, remove rest)
        for (const [title, ids] of Object.entries(duplicates)) {
            if (ids.length > 1) {
                console.log(`⚠️  Found ${ids.length} duplicates of: "${title}"`);
                // Keep first, remove rest
                for (let i = 1; i < ids.length; i++) {
                    toRemove.push(ids[i]);
                }
            }
        }

        console.log(`\n📊 Total duplicates to remove: ${toRemove.length}\n`);

        if (toRemove.length > 0) {
            const result = await Event.deleteMany({ _id: { $in: toRemove } });
            console.log(`✅ Removed ${result.deletedCount} duplicate events\n`);
        }

        const finalCount = await Event.countDocuments();
        console.log(`📊 Final event count: ${finalCount}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

removeDuplicates();
