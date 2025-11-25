import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, interests } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { name, phone, location, interests },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile', error: error.message });
  }
});

// Get user settings
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      status: 'success',
      settings: user.settings || {
        emailNotifications: {
          eventUpdates: true,
          newEvents: true,
          registrationReminders: true,
          weeklyDigest: true,
          promotionalOffers: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
          allowMessages: true,
          showAttendedEvents: true
        }
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error while fetching settings', error: error.message });
  }
});

// Update email notifications settings
router.put('/settings/notifications', auth, async (req, res) => {
  try {
    const { eventUpdates, newEvents, registrationReminders, weeklyDigest, promotionalOffers } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      {
        'settings.emailNotifications': {
          eventUpdates: eventUpdates !== undefined ? eventUpdates : true,
          newEvents: newEvents !== undefined ? newEvents : true,
          registrationReminders: registrationReminders !== undefined ? registrationReminders : true,
          weeklyDigest: weeklyDigest !== undefined ? weeklyDigest : true,
          promotionalOffers: promotionalOffers !== undefined ? promotionalOffers : false
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Email notification settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update notifications settings error:', error);
    res.status(500).json({ message: 'Server error while updating settings', error: error.message });
  }
});

// Update privacy settings
router.put('/settings/privacy', auth, async (req, res) => {
  try {
    const { profileVisibility, showEmail, showPhone, allowMessages, showAttendedEvents } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      {
        'settings.privacy': {
          profileVisibility: profileVisibility || 'public',
          showEmail: showEmail !== undefined ? showEmail : false,
          showPhone: showPhone !== undefined ? showPhone : false,
          allowMessages: allowMessages !== undefined ? allowMessages : true,
          showAttendedEvents: showAttendedEvents !== undefined ? showAttendedEvents : true
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Privacy settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({ message: 'Server error while updating settings', error: error.message });
  }
});

// Get profile photo
router.get('/photo/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      status: 'success',
      profilePhoto: user.profilePhoto,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;