import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './models/Event.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let dbConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    dbConnected = true;
    console.log('✅ MongoDB connected successfully');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        server: 'running',
        db: dbConnected ? 'connected' : 'disconnected'
    });
});

// Get events endpoint
app.get('/api/events', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 12, 100);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;

        if (!dbConnected) {
            return res.status(503).json({ 
                data: [], 
                total: 0, 
                error: 'Database not connected' 
            });
        }

        const events = await Event.find({})
            .limit(limit)
            .skip(skip)
            .exec();

        const total = await Event.countDocuments();

        return res.status(200).json({
            data: events,
            total: total,
            page: page,
            limit: limit,
            success: true
        });

    } catch (error) {
        console.error('❌ API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch events',
            message: error.message,
            data: []
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✨ Server running on http://localhost:${PORT}`);
    console.log('🌐 CORS enabled');
    console.log('📍 Available endpoints:');
    console.log('   - GET /api/health');
    console.log('   - GET /api/events');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    mongoose.connection.close();
    process.exit(0);
});
