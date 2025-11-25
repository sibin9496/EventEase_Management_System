import express from 'express';
import auth from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleAuth.js';
import {
    subscribe,
    unsubscribe,
    getSubscribers,
    getStats,
    deleteSubscriber,
    updateSubscriber,
    exportSubscribers
} from '../controllers/subscriptions.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', auth, adminOnly, getSubscribers);
router.get('/stats', auth, adminOnly, getStats);
router.delete('/:id', auth, adminOnly, deleteSubscriber);
router.put('/:id', auth, adminOnly, updateSubscriber);
router.get('/export/csv', auth, adminOnly, exportSubscribers);

export default router;
