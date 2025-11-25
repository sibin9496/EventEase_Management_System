import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://meghacs2021_db_user:T0zJoiCMQeRpyutF@project.xl7gjbx.mongodb.net/eventease?retryWrites=true&w=majority')
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        updateEvents();
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// High-quality image URLs for different event categories
const imagesByCategory = {
    'Music': [
        'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
        'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&q=80',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        'https://images.unsplash.com/photo-1501612780353-7e5432e52e15?w=800&q=80',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
        'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80'
    ],
    'Sports': [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        'https://images.unsplash.com/photo-1546519638-68711109bc3e?w=800&q=80',
        'https://images.unsplash.com/photo-1554224311-beee415c15c9?w=800&q=80',
        'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    ],
    'Technology': [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f70d504f9?w=800&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd094aa049d?w=800&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f70d504f9?w=800&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    ],
    'Arts': [
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800&q=80',
        'https://images.unsplash.com/photo-1578062097602-8ffeceea59fd?w=800&q=80',
        'https://images.unsplash.com/photo-1496705388051-c8c1e1e6e5c4?w=800&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03bf1a6275?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1578062097602-8ffeceea59fd?w=800&q=80'
    ],
    'Education': [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    ],
    'Other': [
        'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
        'https://images.unsplash.com/photo-1574169208507-84007e0fcc97?w=800&q=80',
        'https://images.unsplash.com/photo-1485579149c02-123dd146185c?w=800&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
    ],
    'Business': [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    ],
    'Health': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
    ],
    'Food & Drink': [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
    ],
    'Wellness': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
    ],
    'Conference': [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    ],
    'Competition': [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    ]
};

async function updateEvents() {
    try {
        console.log('\n🔄 Updating all events with proper images and upcoming dates...\n');

        const events = await Event.find({});
        console.log(`📊 Found ${events.length} events to update\n`);

        let updated = 0;
        let skipped = 0;
        const imageIndex = {};

        for (const event of events) {
            try {
                const category = event.category || 'Other';
                
                // Initialize image index for category
                if (!imageIndex[category]) {
                    imageIndex[category] = 0;
                }

                // Get available images for this category
                const categoryImages = imagesByCategory[category] || imagesByCategory['Other'];
                
                // Assign image
                const imageUrl = categoryImages[imageIndex[category] % categoryImages.length];
                imageIndex[category]++;

                // Update to upcoming date (add 30-90 days from now)
                const upcomingDate = new Date();
                upcomingDate.setDate(upcomingDate.getDate() + Math.floor(Math.random() * 60) + 30);

                // Only update image and date fields
                event.image = imageUrl;
                event.date = upcomingDate;
                
                // Ensure required fields exist
                if (!event.title || !event.description || !event.location || !event.time) {
                    console.log(`  ⚠️  Skipped: ${event.title} (missing required fields)`);
                    skipped++;
                    continue;
                }

                await event.save();
                updated++;

                console.log(`  ✅ ${event.title}`);
                console.log(`     📅 Date: ${upcomingDate.toLocaleDateString()}`);
                console.log(`     🖼️  Image: ${imageUrl.substring(0, 60)}...`);
            } catch (err) {
                console.log(`  ⚠️  Skipped: ${event.title || 'Unknown'} (${err.message.substring(0, 50)})`);
                skipped++;
                continue;
            }
        }

        console.log(`\n✨ Updated ${updated} events successfully!`);
        console.log(`⚠️  Skipped ${skipped} events\n`);

        // Display statistics
        const stats = await Event.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('📈 Events by Category:');
        for (const stat of stats) {
            console.log(`  • ${stat._id}: ${stat.count} events`);
        }

        console.log('\n✅ All events are now upcoming and have proper images!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating events:', error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n⏹️  Script interrupted');
    mongoose.connection.close();
    process.exit(0);
});
