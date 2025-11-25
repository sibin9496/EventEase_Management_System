import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Event from './models/Event.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Events route - simple stub
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({}).limit(parseInt(req.query.limit) || 10).lean();
        const total = await Event.countDocuments();
        res.json({ data: events, total });
    } catch (err) {
        res.json({ data: [], total: 0, error: err.message });
    }
});

// 404
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Server running on http://localhost:${PORT}`);
});

// DO NOT ADD SIGNAL HANDLERS - Let's see if this keeps running
console.log('⚠️ No signal handlers attached - server will run indefinitely');
