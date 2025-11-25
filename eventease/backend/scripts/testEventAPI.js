import mongoose from 'mongoose';
import Event from '../models/Event.js';

async function testEventAPI() {
  try {
    await mongoose.connect('mongodb+srv://meghacs2021_db_user:T0zJoiCMQeRpyutF@project.xl7gjbx.mongodb.net/eventease?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB\n');

    const totalEvents = await Event.countDocuments();
    console.log(`📊 Total events in database: ${totalEvents}\n`);

    const events = await Event.find()
      .select('title category type date location')
      .limit(10)
      .exec();

    console.log('📋 Sample 10 events:\n');
    events.forEach((event, idx) => {
      console.log(`${idx + 1}. ${event.title}`);
      console.log(`   Category: ${event.category} | Type: ${event.type}`);
      console.log(`   Location: ${event.location}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Database test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testEventAPI();
