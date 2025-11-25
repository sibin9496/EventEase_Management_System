import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LocationProvider } from './context/LocationContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import LoginChoice from './pages/auth/LoginChoice'
import AdminLogin from './pages/auth/AdminLogin'
import UserLogin from './pages/auth/UserLogin'
import Register from './pages/auth/Register'
import Events from './pages/Events'
import Dashboard from './pages/Dashboard'
import EventDetail from './pages/EventDetail'
import EventRegistration from './pages/EventRegistration'
import CreateEvent from './pages/CreateEvent'
import MyEvents from './pages/MyEvents'
import MyRegistrations from './pages/MyRegistrations'
import Profile from './pages/Profile'
import LocationPage from './pages/LocationPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminPanel from './pages/AdminPanel'
import UserDashboard from './pages/UserDashboard'
import Notifications from './pages/Notifications'

// Placeholder pages
const CategoriesPage = () => <div style={{ padding: '20px' }}><h2>Categories</h2><p>Browse events by category</p></div>
const FeaturedPage = () => <div style={{ padding: '20px' }}><h2>Featured Events</h2><p>Featured events coming soon</p></div>

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <LocationProvider>
          <AuthProvider>
            <div style={styles.app}>
              <Navbar />
              <main style={styles.main}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/login-choice" element={<LoginChoice />} />
                  <Route path="/login-admin" element={<AdminLogin />} />
                  <Route path="/login-user" element={<UserLogin />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/events/:id/register" element={<EventRegistration />} />
                  <Route path="/location" element={<LocationPage />} />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/featured" element={<FeaturedPage />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-event" element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-events" element={
                    <ProtectedRoute>
                      <MyEvents />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-registrations" element={
                    <ProtectedRoute>
                      <MyRegistrations />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-panel" element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-dashboard" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LocationProvider>
      </ThemeProvider>
    </Router>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc'
  },
  main: {
    flex: 1
  }
}


export default App