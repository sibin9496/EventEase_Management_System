import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import adminRoutes from './routes/admin.js';
import registrationRoutes from './routes/registrations.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

connectDB();

// Health check route
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        message: '🚀 EventEase API is running!',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes
console.log('📍 Registering API routes...');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('✅ All API routes registered');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err.message);
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Error handlers
process.on('uncaughtException', (err) => {
    console.error('🔴 UNCAUGHT EXCEPTION:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('🔴 UNHANDLED REJECTION:', reason);
});

const PORT = process.env.PORT || 5000;

console.log(`⏳ Starting server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✨ SUCCESS! Server listening on http://localhost:${PORT}`);
    console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Database: Connected\n`);
    console.log('📢 Server is now listening and accepting connections');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`🔴 Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        console.error(`🔴 Server error:`, err.message);
        process.exit(1);
    }
});

export default app;
