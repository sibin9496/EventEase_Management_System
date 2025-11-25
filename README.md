# EventEase - Full Stack Event Management System

A modern, full-stack event management platform built with React and Express.js. Features user authentication, event management, registration, and a comprehensive admin dashboard.

## 📋 Project Structure

```
EventEase/
├── eventease/
│   ├── backend/                    # Express.js REST API
│   │   ├── controllers/
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   ├── subscriptions.js
│   │   │   └── registrations.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Registration.js
│   │   │   ├── Session.js
│   │   │   └── Subscription.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   ├── admin.js
│   │   │   ├── users.js
│   │   │   ├── registrations.js
│   │   │   ├── subscriptions.js
│   │   │   ├── notifications.js
│   │   │   └── locations.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── roleAuth.js
│   │   ├── utils/
│   │   │   ├── emailService.js
│   │   │   └── errorResponse.js
│   │   ├── scripts/              # Database scripts
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── frontend/                 # React Frontend with Vite
│       └── eventease/
│           ├── src/
│           │   ├── pages/
│           │   │   ├── Home.jsx
│           │   │   ├── Events.jsx
│           │   │   ├── EventDetail.jsx
│           │   │   ├── Profile.jsx
│           │   │   ├── MyRegistrations.jsx
│           │   │   ├── AdminDashboard.jsx
│           │   │   └── auth/
│           │   │       ├── Login.jsx
│           │   │       └── Register.jsx
│           │   ├── components/
│           │   │   ├── Layout/
│           │   │   │   ├── Navbar.jsx
│           │   │   │   └── Footer.jsx
│           │   │   ├── SearchBar.jsx
│           │   │   ├── EventCard.jsx
│           │   │   ├── ImageUploader.jsx
│           │   │   ├── ProtectedRoute.jsx
│           │   │   └── UI/
│           │   ├── services/
│           │   │   ├── api.js
│           │   │   ├── events.js
│           │   │   └── auth.js
│           │   ├── context/
│           │   │   └── AuthContext.jsx
│           │   ├── App.jsx
│           │   ├── main.jsx
│           │   └── index.css
│           ├── public/
│           ├── package.json
│           ├── vite.config.js
│           ├── index.html
│           └── .env.example
│
├── .gitignore
└── README.md
```

## ✨ Features

### User Features
- 🔐 **User Authentication**: Secure signup and login with JWT tokens
- 🎫 **Browse Events**: View all upcoming events with detailed information
- 🔍 **Search Events**: Real-time search by event name, category, and location
- 📝 **Event Registration**: Register for events with ticket selection
- 👤 **User Profile**: Manage profile information and settings
- 📱 **Mobile Responsive**: Fully responsive design for mobile, tablet, and desktop
- 🔔 **Notifications**: Real-time notifications for registrations and updates

### Admin Features
- 👨‍💼 **Admin Dashboard**: Comprehensive dashboard with analytics
- 📊 **Manage Events**: Create, edit, and delete events
- 👥 **User Management**: View and manage user accounts
- 📋 **View Registrations**: Track event registrations
- 🎯 **Event Analytics**: View event statistics and attendance

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.5.14
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS-in-JS with MUI & Custom CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend communication
- **API**: RESTful architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sibin9496/EventEase_Management_System.git
cd EventEase_Management_System
```

2. **Setup Backend**

```bash
cd eventease/backend
npm install
```

Create `.env` file in `eventease/backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/eventease
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

3. **Setup Frontend**

```bash
cd ../frontend/eventease
npm install
```

Create `.env` file in `eventease/frontend/eventease/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EventEase
```

### Running the Application

**Terminal 1 - Start Backend Server (Port 5000)**
```bash
cd eventease/backend
npm start
```

You should see:
```
🔌 Connecting to MongoDB...
✨ Server running on http://localhost:5000
🚀 Backend is ready to accept requests
✅ MongoDB connected successfully
```

**Terminal 2 - Start Frontend Dev Server (Port 3000)**
```bash
cd eventease/frontend/eventease
npm run dev
```

Open your browser and visit: **http://localhost:3000**

## 🔐 Test Credentials

### Admin Account
- **Email**: admin@eventease.com
- **Password**: admin123

### Regular User Account
- **Email**: user@eventease.com
- **Password**: user123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user with credentials
- `POST /api/auth/logout` - Logout user

### Events Endpoints
- `GET /api/events` - Get all events (paginated, searchable)
- `GET /api/events?search=keyword` - Search events by keyword
- `GET /api/events/:id` - Get single event details
- `POST /api/admin/events` - Create new event (admin only)
- `PUT /api/admin/events/:id` - Update event (admin only)
- `DELETE /api/admin/events/:id` - Delete event (admin only)
- `GET /api/admin/events` - Get all events with pagination (admin only)

### Registration Endpoints
- `POST /api/registrations/register` - Register for an event
- `GET /api/registrations/my-registrations` - Get user's registrations
- `GET /api/registrations/check/:eventId` - Check if registered for event
- `DELETE /api/registrations/:id` - Cancel registration
- `GET /api/registrations` - Get all registrations (admin only)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings/notifications` - Update notification preferences

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/create-admin` - Create admin user (admin only)

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user, admin),
  phone: String,
  location: String,
  avatar: String (URL),
  settings: {
    emailNotifications: Boolean,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,
  time: String,
  price: Number,
  capacity: Number,
  image: String (URL),
  organizer: ObjectId (User),
  registrationCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (User),
  event: ObjectId (Event),
  ticketType: String,
  numberOfTickets: Number,
  attendeeInfo: Object,
  totalPrice: Number,
  paymentStatus: String (completed, pending),
  registrationStatus: String (active, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm start          # Start backend server
npm run dev        # Start with nodemon (auto-restart)
node scripts/checkDatabase.js  # Check database connection
```

### Frontend Scripts
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint (if configured)
```

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints for:
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

All pages include:
- Hamburger menu navigation
- Responsive grids and spacing
- Touch-friendly buttons and inputs
- Optimized images for mobile

## 🌐 Deployment

### Deploy Backend (Heroku)
```bash
cd eventease/backend
npm install
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd eventease/frontend/eventease
npm run build
# Deploy dist folder
```

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventease
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url/api
VITE_APP_NAME=EventEase
```

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Troubleshooting

### Issue: "Port 3000 is already in use"
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Issue: "MongoDB connection failed"
- Ensure MongoDB is running locally or check your connection string
- Verify MONGODB_URI in .env file

### Issue: "API calls returning 404"
- Ensure backend is running on port 5000
- Check that VITE_API_URL is correct in frontend .env

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Sibin Kumar**
- GitHub: [@sibin9496](https://github.com/sibin9496)
- Repository: [EventEase Management System](https://github.com/sibin9496/EventEase_Management_System)

## 🙏 Acknowledgments

- Material-UI for excellent UI components
- Express.js community for the robust framework
- MongoDB for the flexible database solution
- React community for the amazing library and ecosystem
- All contributors and users

## 📞 Support

For support, email sibin9496@gmail.com or open an issue on GitHub.

---

**Happy Event Managing! 🎉**
