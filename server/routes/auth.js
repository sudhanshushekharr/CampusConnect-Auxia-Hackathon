const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Club = require('../models/Club');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user, role) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: role,
      sid: user.sid || undefined,
      aid: user.aid || undefined
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Student/Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Try to find user in Student collection first
    let user = await Student.findOne({ email: email.toLowerCase() });
    let role = 'student';
    let clubData = null;

    // If not found in students, try admin
    if (!user) {
      user = await Admin.findOne({ email: email.toLowerCase() });
      role = 'admin';
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account inactive'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // If student, check if they're a club leader
    if (role === 'student') {
      const club = await Club.findOne({ club_head_sid: user.sid });
      if (club) {
        role = 'club_leader';
        clubData = club;
      }
    }

    // Generate token
    const token = generateToken(user, role);

    // Prepare response
    const response = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          ...user.toJSON(),
          role
        }
      }
    };

    // Add club data if user is club leader
    if (clubData) {
      response.data.user.clubData = clubData;
    }

    res.json(response);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Student Registration
router.post('/register/student', async (req, res) => {
  try {
    const { name, usn, branch, email, password, phone, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { usn: usn.toUpperCase() }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or USN already exists'
      });
    }

    // Generate unique sid
    const lastStudent = await Student.findOne().sort({ sid: -1 });
    const sid = lastStudent ? lastStudent.sid + 1 : 1;

    // Create new student
    const student = new Student({
      sid,
      name,
      usn: usn.toUpperCase(),
      branch,
      email: email.toLowerCase(),
      password,
      phone,
      year
    });

    await student.save();

    // Generate token
    const token = generateToken(student, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        token,
        user: {
          ...student.toJSON(),
          role: 'student'
        }
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// Admin Registration (Protected - only super admins can create admins)
router.post('/register/admin', authenticate, async (req, res) => {
  try {
    // Check if user is super admin
    if (req.userRole !== 'admin' || req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const { name, email, password, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Generate unique aid
    const lastAdmin = await Admin.findOne().sort({ aid: -1 });
    const aid = lastAdmin ? lastAdmin.aid + 1 : 1;

    // Create new admin
    const admin = new Admin({
      aid,
      name,
      email: email.toLowerCase(),
      password,
      permissions: permissions || ['manage_students', 'manage_clubs', 'manage_events', 'view_analytics']
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user: admin.toJSON()
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    let clubData = null;
    let role = req.userRole;

    // If student, check if they're a club leader
    if (req.userRole === 'student') {
      const club = await Club.findOne({ club_head_sid: req.user.sid });
      if (club) {
        role = 'club_leader';
        clubData = club;
      }
    }

    const response = {
      success: true,
      data: {
        user: {
          ...req.user.toJSON(),
          role
        }
      }
    };

    if (clubData) {
      response.data.user.clubData = clubData;
    }

    res.json(response);

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this route
    delete updates.password;
    delete updates.email;
    delete updates.sid;
    delete updates.aid;
    delete updates.total_points;

    let updatedUser;
    if (req.userRole === 'student') {
      updatedUser = await Student.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );
    } else if (req.userRole === 'admin') {
      updatedUser = await Admin.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
