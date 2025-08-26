const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// General authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Student-only authentication
const authenticateStudent = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.userRole !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Students only.'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Admin-only authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admins only.'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Club leader authentication (student who is a club head)
const authenticateClubLeader = async (req, res, next) => {
  try {
    await authenticate(req, res, async () => {
      if (req.userRole !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Students only.'
        });
      }

      // Check if student is a club head
      const Club = require('../models/Club');
      const club = await Club.findOne({ club_head_sid: req.user.sid });
      
      if (!club) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Club leaders only.'
        });
      }

      req.club = club;
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Permission-based authorization for admins
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.'
      });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authenticateStudent,
  authenticateAdmin,
  authenticateClubLeader,
  requirePermission
};
