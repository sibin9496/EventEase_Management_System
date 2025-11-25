import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Send notification to a user (admin only)
router.post('/send', auth, async (req, res) => {
  try {
    const { userId, subject, message, type = 'general' } = req.body;

    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin access required.' });
    }

    // Validate input
    if (!userId || !subject || !message) {
      return res.status(400).json({ message: 'userId, subject, and message are required' });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create notification object (store in user's notifications array)
    const notification = {
      id: new Date().getTime().toString(),
      subject,
      message,
      type,
      sender: adminUser.name,
      senderId: req.user.id,
      createdAt: new Date(),
      read: false
    };

    // Initialize notifications array if it doesn't exist
    if (!targetUser.notifications) {
      targetUser.notifications = [];
    }

    // Add notification to user's notifications array
    targetUser.notifications.push(notification);

    // Save user with new notification
    await targetUser.save();

    res.status(200).json({
      status: 'success',
      message: `Notification sent to ${targetUser.name} successfully`,
      notification
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Server error while sending notification' });
  }
});

// Get all notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = user.notifications || [];

    res.json({
      status: 'success',
      notifications,
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = user.notifications?.find(n => n.id === notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.json({
      status: 'success',
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
});

// Delete notification
router.delete('/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications = user.notifications?.filter(n => n.id !== notificationId) || [];
    await user.save();

    res.json({
      status: 'success',
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error while deleting notification' });
  }
});

export default router;
