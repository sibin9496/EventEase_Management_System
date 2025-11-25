
$readme = @"
# EventEase - Full Stack Event Management Application

A modern, full-stack event management platform built with React and Express.js, featuring user authentication, event management, and admin dashboard.

## 📋 Project Structure

\`\`\`
EventEase/
├── eventease/
│   ├── backend/               # Express.js API
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── scripts/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── frontend/              # React Frontend
│       └── eventease/
│           ├── src/
│           │   ├── pages/
│           │   ├── components/
│           │   ├── services/
│           │   ├── context/
│           │   ├── App.jsx
│           │   └── main.jsx
│           ├── public/
│           ├── package.json
│           ├── vite.config.js
│           └── .env.example
│
└── README.md
\`\`\`

## ✨ Features

### User Features
- 🔐 User authentication (signup/login/logout)
- 🎫 Browse and search events
- 📝 Register for events
- 👤 User profile management
- 📱 Mobile-responsive design
- 🔔 Real-time notifications

### Admin Features
- 👨‍💼 Comprehensive admin dashboard
- 📊 Manage events (CRUD operations)
- 👥 Manage users
- 📋 View event registrations
- 🎯 Event analytics

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **ORM**: Mongoose
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS-in-JS with MUI

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/EventEase.git
cd EventEase
\`\`\`

2. **Setup Backend**
\`\`\`bash
cd eventease/backend
npm install
\`\`\`

Create `.env` file:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/eventease
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
\`\`\`

3. **Setup Frontend**
\`\`\`bash
cd ../frontend/eventease
npm install
\`\`\`

Create `.env` file:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EventEase
\`\`\`

### Running the Application

**Terminal 1 - Start Backend**
\`\`\`bash
cd eventease/backend
npm start
\`\`\`

**Terminal 2 - Start Frontend**
\`\`\`bash
cd eventease/frontend/eventease
npm run dev
\`\`\`

Visit \`http://localhost:3000\`

### Test Credentials
\`\`\`
Email: admin@eventease.com
Password: admin123
\`\`\`

## 📚 API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/logout\` - Logout user

### Events
- \`GET /api/events\` - Get all events
- \`GET /api/events/:id\` - Get event details
- \`POST /api/admin/events\` - Create event (admin only)
- \`PUT /api/admin/events/:id\` - Update event (admin only)
- \`DELETE /api/admin/events/:id\` - Delete event (admin only)

### Registrations
- \`POST /api/registrations/register\` - Register for event
- \`GET /api/registrations/my-registrations\` - Get user registrations
- \`DELETE /api/registrations/:id\` - Cancel registration

### Users
- \`GET /api/users/profile\` - Get user profile
- \`PUT /api/users/profile\` - Update user profile
- \`GET /api/users/settings\` - Get user settings
- \`PUT /api/users/settings/notifications\` - Update notifications

### Admin
- \`GET /api/admin/users\` - Get all users (admin only)
- \`GET /api/admin/events\` - Get all events (admin only)

## 🗄️ Database Schema

### User Model
- Email (unique)
- Password (hashed)
- Full Name
- Profile Picture
- Phone
- Location
- Role (user/admin)
- Timestamps

### Event Model
- Title
- Description
- Category
- Location
- Start Date
- End Date
- Price
- Capacity
- Image
- Organizer
- Timestamps

### Registration Model
- User ID
- Event ID
- Number of Tickets
- Total Price
- Payment Status
- Registration Date
- Attendee Information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Material-UI for excellent UI components
- Express.js community
- MongoDB documentation
- React documentation
"@

