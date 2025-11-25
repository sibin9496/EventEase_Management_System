import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketType: {
    type: String,
    enum: ['standard', 'vip', 'premium'],
    default: 'standard'
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  attendeeInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    company: String,
    dietaryRestrictions: String,
    specialRequirements: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    default: 'card'
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  registrationStatus: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  cancellationReason: String,
  cancellationDate: Date,
  checkInStatus: {
    type: Boolean,
    default: false
  },
  checkInTime: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
RegistrationSchema.index({ user: 1, event: 1 });
RegistrationSchema.index({ event: 1 });
RegistrationSchema.index({ createdAt: -1 });

export default mongoose.model('Registration', RegistrationSchema);
