import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://10.66.21.36:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
console.log('🔌 Connecting to MongoDB...');
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

// Health route
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'ok', database: dbStatus });
});

// API Routes
console.log('📍 Registering API routes...');
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
console.log('✅ All API routes registered');

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('🔴 Server error:', err.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error', error: err.message });
});

// Start server
try {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n✨ SUCCESS! Server listening on http://localhost:${PORT}`);
        console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
        console.log(`📊 Database: Connected\n`);
    });
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
