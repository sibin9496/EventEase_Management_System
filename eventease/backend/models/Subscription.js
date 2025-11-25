import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        subscribedAt: {
            type: Date,
            default: Date.now
        },
        unsubscribedAt: {
            type: Date,
            default: null
        },
        source: {
            type: String,
            enum: ['footer', 'homepage', 'event_page', 'manual'],
            default: 'footer'
        },
        preferences: {
            eventUpdates: { type: Boolean, default: true },
            newEvents: { type: Boolean, default: true },
            promotions: { type: Boolean, default: true }
        }
    },
    { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
