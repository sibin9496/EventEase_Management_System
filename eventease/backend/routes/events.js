import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { organizerOnly, userOnly } from '../middleware/roleAuth.js';
import { body, validationResult, query } from 'express-validator';

const router = express.Router();

// Get user's events (protected) - MUST be before /:id route
router.get('/user/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate('organizer', 'name email avatar role')
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      events,
      total: events.length
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Server error while fetching your events' });
  }
});

// Get user's registered events - MUST be before /:id route
router.get('/user/registered-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user.id })
      .populate('organizer', 'name email avatar role')
      .sort({ date: 1 })
      .exec();

    res.json({
      status: 'success',
      events,
      total: events.length
    });
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({ message: 'Server error while fetching registered events' });
  }
});

// Get all events with filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 500 }),
  query('category').optional().isString(),
  query('type').optional().isString(),
  query('location').optional().isString(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['popular', 'rating', 'newest', 'price-low', 'price-high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      type,
      location,
      search,
      sortBy = 'newest'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Location filtering - allows both exact and partial matches
    if (location && location !== 'all') {
      filter.location = new RegExp(location, 'i');
    }
    
    // Search query - searches in title, description, and location
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Build sort object
    let sort = { date: 1 };
    if (sortBy === 'popular') {
      sort = { attendees: -1 };
    } else if (sortBy === 'rating') {
      sort = { rating: -1 };
    } else if (sortBy === 'price-low') {
      sort = { price: 1 };
    } else if (sortBy === 'price-high') {
      sort = { price: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    console.log('📡 Backend /api/events - Filter:', JSON.stringify(filter));
    console.log('📡 Backend /api/events - Sort:', JSON.stringify(sort));
    console.log('📡 Backend /api/events - Pagination:', { page, limit });

    const events = await Event.find(filter)
      .populate('organizer', 'name email avatar')
      .sort(sort)
      .limit(parseInt(limit) || 12)
      .skip((parseInt(page) - 1) * (parseInt(limit) || 12))
      .lean()
      .exec();

    const total = await Event.countDocuments(filter);

    console.log(`📡 Backend /api/events - Results: ${events.length} events found, total: ${total}`);

    const response = {
      status: 'success',
      data: events,
      totalPages: Math.ceil(total / (parseInt(limit) || 12)),
      currentPage: parseInt(page),
      total
    };
    
    console.log('📤 Backend /api/events - Response format keys:', Object.keys(response));
    
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Get events error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error while fetching events',
      error: error.message
    });
  }
});

// Get user's favorite events (protected route) - MUST be before /:id route
router.get('/user/favorites', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with populated bookmarks
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      model: 'Event',
      select: 'title description category type date time location price capacity image organizer registeredUsers'
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const favorites = user.bookmarks || [];
    console.log(`✅ Retrieved ${favorites.length} favorite events for user ${userId}`);

    res.json({
      status: 'success',
      data: favorites,
      total: favorites.length
    });
  } catch (error) {
    console.error('❌ Error fetching favorites:', error);
    res.status(500).json({ status: 'error', message: 'Server error while fetching favorites' });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar role')
      .populate('registeredUsers', 'name email avatar');

    if (!event) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Event not found' 
      });
    }

    res.json({
      status: 'success',
      data: event
    });
  } catch (error) {
    console.error('❌ Get event error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        status: 'error',
        message: 'Event not found' 
      });
    }
    res.status(500).json({ 
      status: 'error',
      message: 'Server error while fetching event',
      error: error.message
    });
  }
});

// Create event (only admin and organizers can create)
router.post('/', [
  organizerOnly,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event({
      ...req.body,
      organizer: req.user.id
    });

    await event.save();
    await event.populate('organizer', 'name email avatar role');
    
    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while creating event' });
  }
});

// Register user for event (users can attend)
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is full
    if (event.attendees >= event.capacity) {
      return res.status(400).json({ message: 'Event is full. No more registrations allowed.' });
    }

    // Check if user already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Add user to registered users
    event.registeredUsers.push(req.user.id);
    event.attendees += 1;

    await event.save();
    await event.populate('organizer', 'name email avatar role');
    await event.populate('registeredUsers', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Successfully registered for event',
      event
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error while registering' });
  }
});

// Unregister user from event
router.post('/:id/unregister', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is registered
    const userIndex = event.registeredUsers.indexOf(req.user.id);
    if (userIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    // Remove user from registered users
    event.registeredUsers.splice(userIndex, 1);
    event.attendees = Math.max(0, event.attendees - 1);

    await event.save();
    await event.populate('organizer', 'name email avatar role');
    await event.populate('registeredUsers', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Successfully unregistered from event',
      event
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ message: 'Server error while unregistering' });
  }
});

// Check if user is registered for event
router.get('/:id/is-registered', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isRegistered = event.registeredUsers.includes(req.user.id);

    res.json({
      status: 'success',
      isRegistered,
      message: isRegistered ? 'User is registered' : 'User is not registered'
    });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Server error while checking registration' });
  }
});

// Update event (admin/organizer only)
router.put('/:id', auth, organizerOnly, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Event not found' 
      });
    }

    // Check if user is organizer of event or admin
    const user = await User.findById(req.user.id);
    if (event.organizer.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: 'You are not authorized to update this event' 
      });
    }

    // Update only provided fields
    const allowedFields = ['title', 'description', 'category', 'type', 'date', 'time', 'location', 'price', 'capacity', 'image', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();
    await event.populate('organizer', 'name email avatar role');

    res.json({
      status: 'success',
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('❌ Update event error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Server error while updating event',
      error: error.message
    });
  }
});

// Delete event (admin/organizer only)
router.delete('/:id', auth, organizerOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer of event or admin
    const user = await User.findById(req.user.id);
    if (event.organizer.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
});

// Add event to user's favorites (protected route)
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Check if already favorited
    if (user.bookmarks && user.bookmarks.includes(eventId)) {
      return res.status(400).json({ status: 'error', message: 'Event already in favorites' });
    }

    // Add to favorites
    if (!user.bookmarks) {
      user.bookmarks = [];
    }
    user.bookmarks.push(eventId);
    await user.save();

    console.log(`✅ Event ${eventId} added to favorites for user ${userId}`);

    res.json({
      status: 'success',
      message: 'Event added to favorites',
      data: {
        eventId,
        bookmarksCount: user.bookmarks.length
      }
    });
  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    res.status(500).json({ status: 'error', message: 'Server error while adding to favorites' });
  }
});

// Remove event from user's favorites (protected route)
router.delete('/:id/favorite', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Check if in favorites
    if (!user.bookmarks || !user.bookmarks.includes(eventId)) {
      return res.status(400).json({ status: 'error', message: 'Event not in favorites' });
    }

    // Remove from favorites
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== eventId.toString());
    await user.save();

    console.log(`✅ Event ${eventId} removed from favorites for user ${userId}`);

    res.json({
      status: 'success',
      message: 'Event removed from favorites',
      data: {
        eventId,
        bookmarksCount: user.bookmarks.length
      }
    });
  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    res.status(500).json({ status: 'error', message: 'Server error while removing from favorites' });
  }
});

// Check if event is in user's favorites (protected route)
router.get('/:id/is-favorite', auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isFavorite = user.bookmarks && user.bookmarks.includes(eventId);

    res.json({
      status: 'success',
      data: {
        eventId,
        isFavorite
      }
    });
  } catch (error) {
    console.error('❌ Error checking favorite status:', error);
    res.status(500).json({ status: 'error', message: 'Server error while checking favorite status' });
  }
});

export default router;