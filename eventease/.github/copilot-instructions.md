# EventEase - AI Agent Instructions

## Project Overview

EventEase is a **full-stack event management platform** built with **React (Vite) + Express.js + MongoDB**. It enables users to discover, register, and manage events across India with location-based filtering.

**Key URLs:**
- Frontend: `http://localhost:3000` (Vite)
- Backend: `http://localhost:5000` (Express)
- Database: MongoDB Atlas

---

## Architecture Overview

### System Design
```
User Browser (React)
      ↓
Vite Dev Server (3000)
      ↓
Vite Proxy → Express API (5000)
      ↓
MongoDB Atlas
      ↓
JWT Auth | Event CRUD | Registration System
```

### Three Main Modules

**1. Authentication & Authorization**
- Location: `backend/routes/auth.js`, `backend/models/User.js`
- Supports: Email/Password login, OTP-based signin/signup, JWT tokens
- Token stored in localStorage, 7-day expiration
- Role-based: `user`, `admin`, `organizer`

**2. Event Management**
- Location: `backend/routes/events.js`, `frontend/src/pages/Events.jsx`
- Features: CRUD operations, location filtering, search, sorting
- API: `GET /api/events` (with query params: `location`, `category`, `search`, `sortBy`)
- Frontend polls from `/api/demo/events` on MongoDB failure

**3. Registration System**
- Location: `backend/routes/registrations.js`, `frontend/src/pages/MyRegistrations.jsx`
- Data flow: User registers → Registration created → Listed in "My Registrations"
- Modal displays: Event details + User registration info

---

## Critical Workflows

### User Registration Flow
```
1. User clicks "Register Now" on event card
2. Navigate to /events/:id/register (EventRegistration.jsx)
3. 2-step form: User Info → Confirm Details
4. Submit POST to /api/registrations with userId + eventId
5. Success → Navigate to /my-registrations
```

### Location Filtering
```
1. User clicks location dropdown in Navbar
2. Select city (Delhi, Mumbai, Bangalore, etc.)
3. Navigate('/events', { state: { filterByLocation: 'Delhi' } })
4. Events.jsx receives state → Sets activeLocationFilter
5. useEffect filters: events.filter(e => e.location.includes(filter))
6. Display filtered results
```

### Event Data Flow
```
Backend:
  - GET /api/events → Fetch all events
  - Falls back to /api/demo/events if MongoDB disconnected
  
Frontend:
  - EventCard component displays individual events
  - Events.jsx manages state & filtering
  - MyRegistrations.jsx fetches user's registrations + fetches event details for each
```

---

## Key Developer Patterns

### 1. API Service Layer
**File:** `frontend/src/services/events.js` | `registration.js`

**Pattern:**
```javascript
export const eventService = {
  async getEvents(params = {}) {
    const response = await fetch(`${API_BASE_URL}/events?${new URLSearchParams(params)}`);
    return response.json();
  }
};
```

**Usage:** `const data = await eventService.getEvents({ location: 'Delhi' });`

### 2. React Context for Global State
**Files:** `AuthContext.jsx`, `LocationContext.jsx`, `ThemeContext.jsx`

**Pattern:**
```javascript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Context logic...
};

// Usage: const { user, login } = useAuth();
```

### 3. Protected Routes
**File:** `components/ProtectedRoute.jsx`

Routes requiring auth: `/dashboard`, `/my-registrations`, `/profile`, `/admin-panel`

### 4. Environment Variables
**Backend (.env):**
- `MONGODB_URI`: Atlas connection string
- `JWT_SECRET`: Token signing key
- `PORT`: Server port (5000)

**Frontend (.env):**
- `VITE_API_BASE_URL`: Backend API URL

### 5. Error Handling Pattern
- Try/catch with fallback to sample data
- User-friendly error messages via `setError()`
- Console.warn for non-critical failures

---

## Build & Run Commands

### Backend
```bash
cd backend
npm install
npm start              # Production mode (node server.js)
npm run dev           # Development mode (nodemon)
```

### Frontend
```bash
cd frontend/eventease
npm install
npm run dev           # Start Vite (port 3000 or 3001 if taken)
npm run build         # Production build
npm run lint          # ESLint check
```

### Testing API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get all events
curl http://localhost:5000/api/events

# Demo events (fallback)
curl http://localhost:5000/api/demo/events
```

---

## Database Schema

### User Collection
```javascript
{
  _id, name, email (unique), password (hashed),
  role: 'user' | 'admin' | 'organizer',
  phone, avatar, location: { city, state, country },
  interests: [String], bookmarks: [eventId],
  isActive: Boolean, createdAt
}
```

### Event Collection
```javascript
{
  _id, title, description, longDescription, category,
  date, time, location, venue, image, price,
  organizer: { name, email, phone, avatar },
  tags: [String], rating, reviews, attendees,
  maxAttendees, isTrending, isFeatured,
  includes: [String], requirements: [String],
  createdAt, updatedAt
}
```

### Registration Collection
```javascript
{
  _id, userId (ref: User), eventId (ref: Event),
  fullName, email, phone, additionalInfo,
  registrationDate, status: 'active' | 'cancelled'
}
```

---

## Frontend Architecture

### Page Structure
- `pages/` - Main page components (Events, EventDetail, MyRegistrations, etc.)
- `components/` - Reusable UI components (EventCard, Modal, Modal, etc.)
- `services/` - API calls (events.js, registration.js, auth.js)
- `context/` - Global state (Auth, Location, Theme)
- `styles/` - Tailored styling utilities

### Key Components
- **EventCard**: Displays single event with actions (Favorite, Register, View Details)
- **EventDetail**: Full event information page
- **MyRegistrations**: Grid of user's registered events with quick preview modal
- **RegistrationDetailModal**: Shows event + registration details in modal
- **Navbar**: Location selector, user dropdown, navigation links

### State Management
- **useAuth()** - Get current user, login/logout
- **useLocationContext()** - Get/set selected location
- **useTheme()** - Light/dark theme toggle

---

## Common Issues & Solutions

### Issue: Events Not Showing
**Root Cause:** Backend not running or API fails
**Solution:** 
- Check `npm start` in backend folder
- Events fallback to `sampleEvents` in Events.jsx
- Verify `/api/demo/events` returns data

### Issue: Location Filter Not Working
**Root Cause:** Navigation state not passed or filter logic broken
**Solution:**
- Check Navbar calls `navigate('/events', { state: { filterByLocation: location.name } })`
- Verify Events.jsx accesses `routerLocation.state?.filterByLocation`
- Confirm filter logic: `events.filter(e => e.location.includes(filter))`

### Issue: Registrations API Returns 500
**Root Cause:** Missing registration routes or MongoDB connection
**Solution:**
- Verify `registrationRoutes` imported in server.js
- Check `/api/registrations/` endpoint exists
- Ensure user authenticated (JWT token in headers)

### Port Already in Use
```bash
# Kill processes on ports 3000/5000
taskkill /F /IM node.exe        # Windows
lsof -ti:3000,5000 | xargs kill # Mac/Linux
```

---

## Testing Credentials

**Admin Account:**
```
Email: admin@eventease.com
Password: admin123
```

**Test Event Locations:** Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app setup, route mounting |
| `backend/routes/events.js` | Event CRUD, filtering, pagination |
| `backend/routes/registrations.js` | Registration endpoints |
| `backend/middleware/auth.js` | JWT verification |
| `frontend/App.jsx` | Route definitions, providers |
| `frontend/pages/Events.jsx` | Event list with filtering (1100+ lines) |
| `frontend/pages/MyRegistrations.jsx` | User registrations grid + modal |
| `frontend/services/events.js` | Event API calls |
| `frontend/context/AuthContext.jsx` | User auth state |

---

## Performance Tips

- Events page loads 15+ events; use pagination for prod (currently limit: 12)
- Images via Unsplash; replace with CDN in production
- Location filtering done client-side; move to backend for scale
- JWT tokens stored in localStorage; consider secure HTTP-only cookies

---

## Deployment Checklist

- [ ] Update `.env` with production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Build frontend: `npm run build`
- [ ] Serve frontend dist from Express static
- [ ] Enable CORS only for production domain
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API
- [ ] Add request logging middleware
- [ ] Set up error monitoring (Sentry, etc.)

---

## Next Steps for New Features

1. **Add Wishlist**: Create `Wishlist` model, add to UserSchema, implement UI toggle
2. **Email Notifications**: Setup Nodemailer, send confirmation on registration
3. **Payment Gateway**: Integrate Razorpay/Stripe for paid events
4. **Reviews/Ratings**: Create `Review` model, aggregate ratings on event
5. **Search Enhancement**: Move location filtering to backend query for performance

