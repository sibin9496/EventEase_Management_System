import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Session from '../models/Session.js';
import { checkRole, adminOnly } from '../middleware/roleAuth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
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

// Create a new admin (admin only)
router.post('/create-admin', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new admin
    const newUser = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error during admin creation' });
  }
});

// Create a new organizer (admin only)
router.post('/create-organizer', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new organizer
    const newUser = new User({
      name,
      email,
      password,
      role: 'organizer'
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'Organizer created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create organizer error:', error);
    res.status(500).json({ message: 'Server error during organizer creation' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'organizer', 'admin'];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be user, organizer, or admin' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      status: 'success',
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      status: 'success',
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active sessions (who is logged in)
router.get('/sessions', auth, adminOnly, async (req, res) => {
  try {
    const activeSessions = await Session.find({ isActive: true })
      .populate('userId', 'name email role avatar')
      .sort({ loginTime: -1 });

    res.json({
      status: 'success',
      sessions: activeSessions,
      total: activeSessions.length
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get login history
router.get('/login-history', auth, adminOnly, async (req, res) => {
  try {
    const history = await Session.find()
      .populate('userId', 'name email role avatar')
      .sort({ loginTime: -1 })
      .limit(50);

    res.json({
      status: 'success',
      history,
      total: history.length
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user login activity
router.get('/user-activity/:userId', auth, adminOnly, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ loginTime: -1 });

    const user = await User.findById(req.params.userId);

    res.json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      sessions,
      totalLogins: sessions.length
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== EVENT ADMIN ENDPOINTS =====

// Get all events (admin only)
router.get('/events', auth, adminOnly, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      events,
      total: events.length
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
});

// Create event (admin only)
router.post('/events', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, date, time, location, price, capacity, category, image } = req.body;

    // Validate input
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      price: price || 0,
      capacity: capacity || 100,
      category,
      image,
      organizer: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newEvent.save();

    const populatedEvent = await Event.findById(newEvent._id)
      .populate('organizer', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
});

// Update event (admin only)
router.put('/events/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, date, time, location, price, capacity, category, image } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (price !== undefined) event.price = price;
    if (capacity) event.capacity = capacity;
    if (category) event.category = category;
    if (image) event.image = image;

    event.updatedAt = new Date();
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email');

    res.json({
      status: 'success',
      message: 'Event updated successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
});

// Delete event (admin only)
router.delete('/events/:id', auth, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      status: 'success',
      message: 'Event deleted successfully',
      deletedEvent: {
        id: event._id,
        title: event.title
      }
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
});

export default router;
