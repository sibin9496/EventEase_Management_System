import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import stripe from 'stripe';

const router = express.Router();
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdefghijklmnop');

// ===== SPECIFIC ROUTES (MUST BE BEFORE /:id) =====

// Get user's registrations with event details
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title description image date time location price capacity organizer attendees rating reviews category'
      })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      status: 'success',
      registrations,
      total: registrations.length
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
});

// Check if user is registered for event
router.get('/check/:eventId', auth, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
      event: req.params.eventId,
      registrationStatus: 'active'
    });

    res.json({
      status: 'success',
      isRegistered: !!registration,
      registration: registration || null
    });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Server error while checking registration' });
  }
});

// Get event registrations count
router.get('/event/:eventId/count', async (req, res) => {
  try {
    const count = await Registration.countDocuments({
      event: req.params.eventId,
      registrationStatus: 'active'
    });

    res.json({
      status: 'success',
      count,
      eventId: req.params.eventId
    });
  } catch (error) {
    console.error('Get registrations count error:', error);
    res.status(500).json({ message: 'Server error while fetching registrations count' });
  }
});

// Get event registrations (admin/organizer only)
router.get('/event/:eventId/registrations', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view event registrations' });
    }

    const registrations = await Registration.find({ event: req.params.eventId, registrationStatus: 'active' })
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      registrations,
      total: registrations.length
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching event registrations' });
  }
});

// Process Stripe Payment
router.post('/payment/process', auth, async (req, res) => {
  try {
    const { amount, currency = 'inr', paymentToken, eventId, numberOfTickets, attendeeInfo } = req.body;

    if (!amount || !paymentToken) {
      return res.status(400).json({ message: 'Amount and payment token are required' });
    }

    // Create Stripe charge
    const charge = await stripeClient.charges.create({
      amount: Math.round(amount * 100), // Convert to paise for INR
      currency,
      source: paymentToken,
      description: `Event Registration - ${attendeeInfo?.fullName || 'Guest'}`,
      metadata: {
        eventId,
        numberOfTickets,
        userEmail: attendeeInfo?.email
      }
    });

    if (charge.status === 'succeeded') {
      res.json({
        status: 'success',
        message: 'Payment processed successfully',
        chargeId: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment processing failed'
      });
    }
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({
      message: 'Payment processing error',
      error: error.message
    });
  }
});

// Register for an event
router.post('/register', auth, async (req, res) => {
  try {
    const { eventId, ticketType = 'standard', numberOfTickets = 1, attendeeInfo, paymentMethod = 'card' } = req.body;

    // Validate input
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({ user: req.user.id, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check capacity
    const registrationCount = await Registration.countDocuments({ event: eventId, registrationStatus: 'active' });
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Calculate total price
    const totalPrice = event.price * numberOfTickets;

    // Create registration
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      ticketType,
      numberOfTickets,
      attendeeInfo,
      paymentMethod,
      totalPrice,
      paymentStatus: 'completed', // Assuming payment is completed
      registrationStatus: 'active'
    });

    await registration.save();

    // Update event with registered user and attendee count
    if (!event.registeredUsers.includes(req.user.id)) {
      event.registeredUsers.push(req.user.id);
      event.attendees = (event.attendees || 0) + numberOfTickets;
      await event.save();
    }

    // Populate and return
    const populatedRegistration = await Registration.findById(registration._id)
      .populate({
        path: 'event',
        select: 'title description image date time location price capacity organizer attendees rating reviews'
      })
      .populate('user', 'name email avatar');

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered for event',
      registration: populatedRegistration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ===== GENERIC ROUTES (MUST BE LAST) =====

// Get all registrations (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin access required.' });
    }

    const registrations = await Registration.find()
      .populate({
        path: 'event',
        select: 'title description image date time location price capacity organizer'
      })
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      status: 'success',
      registrations: registrations.map(reg => ({
        _id: reg._id,
        fullName: reg.user?.name || 'Unknown',
        email: reg.user?.email || 'N/A',
        phone: reg.user?.phone || 'N/A',
        eventTitle: reg.event?.title || 'Event Deleted',
        eventId: reg.event?._id,
        registrationDate: reg.createdAt,
        status: reg.registrationStatus,
        numberOfTickets: reg.numberOfTickets,
        totalPrice: reg.totalPrice,
        ticketType: reg.ticketType,
        paymentStatus: reg.paymentStatus,
        userId: reg.user?._id,
        notes: reg.notes,
        additionalInfo: reg.attendeeInfo
      })),
      total: registrations.length
    });
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
});

// Get specific registration by ID (MUST BE LAST)
router.get('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title description image date time location price capacity organizer'
      })
      .populate('user', 'name email avatar');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (registration.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this registration' });
    }

    res.json({
      status: 'success',
      registration
    });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error while fetching registration' });
  }
});

// Cancel registration
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    // Mark as cancelled instead of deleting
    registration.registrationStatus = 'cancelled';
    registration.cancellationDate = new Date();
    registration.cancellationReason = req.body.reason || 'User cancelled';
    await registration.save();

    // Update event - remove user from registered users if no other active registrations
    const event = await Event.findById(registration.event);
    const activeRegistrations = await Registration.countDocuments({
      event: registration.event,
      user: req.user.id,
      registrationStatus: 'active'
    });

    if (activeRegistrations === 0) {
      event.registeredUsers = event.registeredUsers.filter(id => id.toString() !== req.user.id);
      event.attendees = Math.max(0, (event.attendees || 0) - registration.numberOfTickets);
      await event.save();
    }

    res.json({
      status: 'success',
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error while cancelling registration' });
  }
});

// Update registration
router.put('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }

    // Update allowed fields
    const { attendeeInfo, ticketType, notes } = req.body;

    if (attendeeInfo) registration.attendeeInfo = { ...registration.attendeeInfo, ...attendeeInfo };
    if (ticketType) registration.ticketType = ticketType;
    if (notes) registration.notes = notes;

    await registration.save();

    const updatedRegistration = await Registration.findById(registration._id)
      .populate({
        path: 'event',
        select: 'title description image date time location price capacity organizer'
      })
      .populate('user', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Registration updated successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Server error while updating registration' });
  }
});

export default router;
