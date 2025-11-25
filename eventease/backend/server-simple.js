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

app.use(cors());
app.use(express.json());

// Database connection
let dbConnected = false;
console.log('🔌 Connecting to MongoDB...');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
        dbConnected = true;
    } catch (err) {
        console.error('❌ MongoDB error:', err.message);
        dbConnected = false;
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: dbConnected ? 'connected' : 'disconnected' });
});

// Events endpoint - WITH SEARCH AND PAGINATION
app.get('/api/events', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';
        
        if (!dbConnected) {
            return res.json({ data: [], total: 0, page, limit, message: 'Database connecting...' });
        }
        
        let query = {};
        
        // If search query provided, search in title and description
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
        console.error('❌ Error in events route:', err.message);
        res.status(500).json({ error: err.message, data: [] });
    }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting...' });
        }
        
        const event = await Event.findById(req.params.id).lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('❌ Error in get event route:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting...' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
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
        console.error('❌ Login error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (!dbConnected) {
            return res.status(503).json({ message: 'Database connecting...' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role: 'user'
        });

        await user.save();

        // Generate token
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
        console.error('❌ Signup error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 404 handler
app.use((req, res) => {
    console.log('⚠️ 404 - Route not found:', req.method, req.path);
    res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Simple server running on http://localhost:${PORT}`);
});

// Handle process signals
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    server.close();
});

process.on('SIGINT', () => {
    console.log('SIGINT received');
    server.close();
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
