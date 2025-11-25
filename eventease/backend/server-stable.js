import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== DATABASE CONNECTION ====================
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        message: '🚀 EventEase API is running!',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Import and register routes
console.log('📍 Loading API routes...');
try {
    import('./routes/users.js').then(mod => {
        app.use('/api/users', mod.default);
        console.log('✅ Users route registered');
    });
    
    import('./routes/auth.js').then(mod => {
        app.use('/api/auth', mod.default);
        console.log('✅ Auth route registered');
    });
    
    import('./routes/events.js').then(mod => {
        app.use('/api/events', mod.default);
        console.log('✅ Events route registered');
    });
    
    import('./routes/admin.js').then(mod => {
        app.use('/api/admin', mod.default);
        console.log('✅ Admin route registered');
    });
    
    import('./routes/registrations.js').then(mod => {
        app.use('/api/registrations', mod.default);
        console.log('✅ Registrations route registered');
    });
    
    import('./routes/notifications.js').then(mod => {
        app.use('/api/notifications', mod.default);
        console.log('✅ Notifications route registered');
    });
} catch (err) {
    console.error('❌ Error loading routes:', err.message);
}

// ==================== ERROR HANDLERS ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err.message);
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// ==================== PROCESS HANDLERS ====================

process.on('uncaughtException', (err) => {
    console.error('🔴 UNCAUGHT EXCEPTION:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('🔴 UNHANDLED REJECTION:', reason);
});

// ==================== SERVER STARTUP ====================

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n✨ SERVER STARTED SUCCESSFULLY');
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
    console.log('✅ Ready to accept requests\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`🔴 Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        console.error(`🔴 Server error:`, err.message);
    }
});

// ==================== GRACEFUL SHUTDOWN ====================

let isShuttingDown = false;

const shutdown = () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    console.log('\n⏹️  Initiating graceful shutdown...');
    server.close(() => {
        console.log('✅ Server closed');
        mongoose.connection.close(false).then(() => {
            console.log('✅ Database connection closed');
            process.exit(0);
        }).catch(err => {
            console.error('❌ Error closing database:', err.message);
            process.exit(1);
        });
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Force shutting down...');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Only allow graceful shutdown after 5 seconds of running
let allowShutdown = false;
setTimeout(() => {
    allowShutdown = true;
    console.log('⏸️  Graceful shutdown is now enabled');
}, 5000);

const originalShutdown = shutdown;
const wrappedShutdown = () => {
    if (!allowShutdown) {
        console.log('⏸️  Shutdown requested but not yet allowed - server will stay running');
        return;
    }
    originalShutdown();
};

// Re-attach with wrapped shutdown
process.off('SIGINT', shutdown);
process.off('SIGTERM', shutdown);
process.on('SIGINT', wrappedShutdown);
process.on('SIGTERM', wrappedShutdown);

export default app;
