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
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// Database connection
let dbConnected = false;
console.log('🔌 Connecting to MongoDB...');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected');
        dbConnected = true;
    } catch (err) {
        console.error('❌ MongoDB error:', err.message);
        dbConnected = false;
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Auth middleware
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

// Admin middleware
const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== PUBLIC ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
    try {
        res.json({ 
            status: 'ok', 
            db: dbConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Health check error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all events with search and pagination
app.get('/api/events', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';

        if (!dbConnected) {
            return res.status(503).json({ 
                data: [], 
                total: 0, 
                page, 
                limit, 
                message: 'Database connecting...' 
            });
        }

        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const events = await Event.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Event.countDocuments(query);

        res.json({ data: events, total, page, limit });
    } catch (err) {
        console.error('❌ Error in events route:', err);
        res.status(500).json({ error: err.message, data: [] });
    }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findById(req.params.id).lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('❌ Error in get event route:', err);
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
            return res.status(503).json({ message: 'Database connecting...' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
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
        console.error('❌ Login error:', err);
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

        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting...' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role: 'user'
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
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
        console.error('❌ Signup error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            status: 'success',
            users,
            total: users.length
        });
    } catch (error) {
        console.error('❌ Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all events (admin)
app.get('/api/admin/events', authMiddleware, adminOnly, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const events = await Event.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
        
        const total = await Event.countDocuments();
        
        res.json({
            status: 'success',
            events,
            total,
            page,
            limit
        });
    } catch (error) {
        console.error('❌ Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create event
app.post('/api/admin/events', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { title, description, date, time, location, category, image } = req.body;

        if (!title || !description || !date || !location || !category) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            time: time || '10:00 AM',
            location,
            category,
            image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
        });

        await newEvent.save();

        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error('❌ Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update event
app.put('/api/admin/events/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { title, description, date, time, location, category, image } = req.body;

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, time, location, category, image },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            status: 'success',
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error('❌ Update event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete event
app.delete('/api/admin/events/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            status: 'success',
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete event error:', error);
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

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            name,
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
        console.error('❌ Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== ERROR HANDLERS ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Server running on http://localhost:${PORT}`);
});

// Simple signal handlers (don't close immediately)
process.on('SIGTERM', () => {
    console.log('⏹ SIGTERM signal received');
});

process.on('SIGINT', () => {
    console.log('⏹ SIGINT signal received');
});

export default app;
