import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Technology', 'Business', 'Music', 'Arts', 'Sports', 
      'Food & Drink', 'Education', 'Health', 'Marriage', 'Wedding',
      'Anniversary', 'Engagement', 'Bridal Shower', 'Bachelor Party', 'Mehendi', 
      'Weddings', 'Anniversaries', 'Corporate Events', 'Birthdays', 'Festivals',
      'Cultural Events', 'Sports Events', 'Educational Events', 'Religious Events', 
      'Award Ceremonies', 'Other'
    ]
  },
  type: {
    type: String,
    required: false,
    enum: [
      'Conference', 'Workshop', 'Seminar', 'Networking', 
      'Festival', 'Concert', 'Exhibition', 'Summit', 
      'Bootcamp', 'Retreat', 'Sports', 'Marathon', 'Wedding', 
      'Engagement', 'Bridal Shower', 'Bachelor Party', 'Mehendi', 'Other'
    ],
    default: 'Other'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  price: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  capacity: {
    type: Number,
    required: false,
    min: [1, 'Capacity must be at least 1'],
    default: 50
  },
  attendees: {
    type: Number,
    default: 0
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
EventSchema.index({ category: 1, date: 1 });
EventSchema.index({ location: 'text', title: 'text', description: 'text' });

export default mongoose.model('Event', EventSchema);