import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to check if user has specific role
export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${user.role}` 
        });
      }

      req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error in role authentication' });
    }
  };
};

// Middleware for admin only
export const adminOnly = checkRole(['admin']);

// Middleware for organizer (admin or organizer role)
export const organizerOnly = checkRole(['admin', 'organizer']);

// Middleware for users
export const userOnly = checkRole(['user', 'admin', 'organizer']);

export default checkRole;
