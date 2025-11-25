import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';

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
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch(err => {
        console.error('❌ MongoDB error:', err.message);
        // Don't exit, let server continue
    });

// Listen for connection errors
mongoose.connection.on('error', (err) => {
    console.error('🔴 MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB re-connected');
});

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Events route - simple stub
app.get('/api/events', async (req, res) => {
    try {
        // Try to get events from database
        const Event = mongoose.model('Event');
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
    console.log(`\n✨ Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Events: http://localhost:${PORT}/api/events\n`);
});

// Graceful shutdown
let isShuttingDown = false;
const shutdown = () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('\n⏹️  Shutting down...');
    server.close();
    mongoose.connection.close(false);
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Add event listeners to prevent process exit
process.on('exit', (code) => {
    console.log(`Process exiting with code ${code}`);
});

// Keep the process alive - prevents Node from exiting
if (os.platform() !== 'win32') {
    process.stdin.resume();
}

