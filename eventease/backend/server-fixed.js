import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './models/Event.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eventease-secret-key-2025';

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ==================== DATABASE CONNECTION ====================

let dbConnected = false;

const connectDB = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority'
        });
        
        console.log('✅ MongoDB connected successfully');
        dbConnected = true;
        return true;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        dbConnected = false;
        console.log('⏳ Retrying in 5 seconds...');
        setTimeout(connectDB, 5000);
        return false;
    }
};

// Connect to database on startup
connectDB();

// ==================== MIDDLEWARE FUNCTIONS ====================

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await User.findById(req.user.id).lean();
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (err) {
        console.error('Admin check error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== PUBLIC ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
    try {
        res.json({
            status: 'ok',
            db: dbConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (err) {
        console.error('Health check error:', err);
        res.status(500).json({ error: 'Health check failed' });
    }
});

// Get all events with pagination and search
app.get('/api/events', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 12, 100);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const search = req.query.search || '';
        const category = req.query.category || '';

        if (!dbConnected) {
            return res.status(503).json({
                data: [],
                total: 0,
                page,
                limit,
                message: 'Database connecting'
            });
        }

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = { $regex: `^${category}$`, $options: 'i' };
        }

        const events = await Event.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const total = await Event.countDocuments(query).exec();

        res.json({
            data: events,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Events route error:', err);
        res.status(500).json({
            error: err.message,
            data: [],
            total: 0
        });
    }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findById(req.params.id).lean().exec();
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error('Get event error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).exec();

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name.trim(),
            role: 'user'
        });

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .lean()
            .exec();

        res.json({
            status: 'success',
            users,
            total: users.length
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all events (admin)
app.get('/api/admin/events', authMiddleware, adminOnly, async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);

        const events = await Event.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const total = await Event.countDocuments().exec();

        res.json({
            status: 'success',
            events,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create event
app.post('/api/admin/events', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { title, description, date, time, location, category, image, price, capacity } = req.body;

        if (!title || !description || !date || !location || !category) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newEvent = new Event({
            title: title.trim(),
            description: description.trim(),
            date: new Date(date),
            time: time || '10:00 AM',
            location: location.trim(),
            category: category.trim(),
            image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
            price: price || 0,
            capacity: capacity || 50,
            organizer: req.user.id
        });

        await newEvent.save();

        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update event
app.put('/api/admin/events/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const { title, description, date, time, location, category, image, price, capacity } = req.body;

        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (date) updateData.date = new Date(date);
        if (time) updateData.time = time;
        if (location) updateData.location = location.trim();
        if (category) updateData.category = category.trim();
        if (image) updateData.image = image;
        if (price !== undefined) updateData.price = price;
        if (capacity !== undefined) updateData.capacity = capacity;

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: false }
        ).exec();

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            status: 'success',
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete event
app.delete('/api/admin/events/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findByIdAndDelete(req.params.id).exec();

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            status: 'success',
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create admin
app.post('/api/admin/create-admin', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({
            status: 'success',
            message: 'Admin created successfully',
            user: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== ERROR HANDLERS ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Server running on http://localhost:${PORT}`);
    console.log(`🚀 Backend is ready to accept requests`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received, starting graceful shutdown...`);
    server.close(() => {
        console.log('Server closed');
        mongoose.disconnect().then(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
