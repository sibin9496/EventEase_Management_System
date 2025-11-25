import Subscription from '../models/Subscription.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscriptions/subscribe
// @access  Public
export const subscribe = async (req, res) => {
    try {
        const { email, source = 'footer', preferences = {} } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        // Check if already subscribed
        let subscription = await Subscription.findOne({ email: email.toLowerCase() });

        if (subscription) {
            // If already exists but unsubscribed, reactivate
            if (!subscription.isActive) {
                subscription.isActive = true;
                subscription.unsubscribedAt = null;
                subscription.subscribedAt = new Date();
                await subscription.save();

                return res.status(200).json({
                    status: 'success',
                    message: 'Welcome back! You have been resubscribed',
                    data: subscription
                });
            }

            return res.status(409).json({
                status: 'error',
                message: 'This email is already subscribed'
            });
        }

        // Create new subscription
        subscription = new Subscription({
            email: email.toLowerCase(),
            source,
            preferences: {
                eventUpdates: preferences.eventUpdates !== false,
                newEvents: preferences.newEvents !== false,
                promotions: preferences.promotions !== false
            }
        });

        await subscription.save();

        return res.status(201).json({
            status: 'success',
            message: 'Successfully subscribed to newsletter!',
            data: subscription
        });
    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error subscribing to newsletter'
        });
    }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/subscriptions/unsubscribe
// @access  Public
export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        const subscription = await Subscription.findOne({ email: email.toLowerCase() });

        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }

        subscription.isActive = false;
        subscription.unsubscribedAt = new Date();
        await subscription.save();

        return res.status(200).json({
            status: 'success',
            message: 'You have been unsubscribed from our newsletter'
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error unsubscribing'
        });
    }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/subscriptions
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '', 
            filter = 'all',
            sortBy = 'subscribedAt',
            order = 'desc'
        } = req.query;

        // Build filter
        let filterObj = {};

        if (filter === 'active') {
            filterObj.isActive = true;
        } else if (filter === 'inactive') {
            filterObj.isActive = false;
        }

        if (search) {
            filterObj.email = { $regex: search, $options: 'i' };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const sortOrder = order === 'desc' ? -1 : 1;

        // Get total count
        const total = await Subscription.countDocuments(filterObj);

        // Get paginated results
        const subscriptions = await Subscription.find(filterObj)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        return res.status(200).json({
            status: 'success',
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: subscriptions
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching subscribers'
        });
    }
};

// @desc    Get subscriber stats (Admin only)
// @route   GET /api/subscriptions/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    try {
        const total = await Subscription.countDocuments();
        const active = await Subscription.countDocuments({ isActive: true });
        const inactive = await Subscription.countDocuments({ isActive: false });

        const sourceStats = await Subscription.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 }
                }
            }
        ]);

        const preferenceStats = await Subscription.aggregate([
            {
                $group: {
                    _id: null,
                    eventUpdates: {
                        $sum: { $cond: ['$preferences.eventUpdates', 1, 0] }
                    },
                    newEvents: {
                        $sum: { $cond: ['$preferences.newEvents', 1, 0] }
                    },
                    promotions: {
                        $sum: { $cond: ['$preferences.promotions', 1, 0] }
                    }
                }
            }
        ]);

        return res.status(200).json({
            status: 'success',
            data: {
                total,
                active,
                inactive,
                bySource: sourceStats,
                preferences: preferenceStats[0] || {
                    eventUpdates: 0,
                    newEvents: 0,
                    promotions: 0
                }
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching subscriber stats'
        });
    }
};

// @desc    Delete subscriber (Admin only)
// @route   DELETE /api/subscriptions/:id
// @access  Private/Admin
export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByIdAndDelete(id);

        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Subscriber deleted successfully'
        });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error deleting subscriber'
        });
    }
};

// @desc    Update subscriber preferences (Admin only)
// @route   PUT /api/subscriptions/:id
// @access  Private/Admin
export const updateSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, preferences } = req.body;

        const subscription = await Subscription.findByIdAndUpdate(
            id,
            {
                isActive,
                preferences,
                ...(isActive === false && { unsubscribedAt: new Date() }),
                ...(isActive === true && { unsubscribedAt: null })
            },
            { new: true, runValidators: true }
        );

        if (!subscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Subscriber updated successfully',
            data: subscription
        });
    } catch (error) {
        console.error('Update subscriber error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating subscriber'
        });
    }
};

// @desc    Export subscribers (Admin only)
// @route   GET /api/subscriptions/export/csv
// @access  Private/Admin
export const exportSubscribers = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ isActive: true })
            .select('email preferences subscribedAt');

        let csv = 'Email,Event Updates,New Events,Promotions,Subscribed Date\n';

        subscriptions.forEach(sub => {
            const date = new Date(sub.subscribedAt).toLocaleDateString('en-IN');
            csv += `${sub.email},${sub.preferences.eventUpdates ? 'Yes' : 'No'},${sub.preferences.newEvents ? 'Yes' : 'No'},${sub.preferences.promotions ? 'Yes' : 'No'},${date}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
        return res.send(csv);
    } catch (error) {
        console.error('Export error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error exporting subscribers'
        });
    }
};
