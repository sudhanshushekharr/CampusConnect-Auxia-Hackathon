const express = require('express');
const Student = require('../models/Student');
const ActivityPoints = require('../models/ActivityPoints');
const { authenticateStudent, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    // Get activity points history
    const activityPoints = await ActivityPoints.find({ sid: student.sid })
      .populate('event', 'ename date')
      .populate('club', 'cname')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        student,
        recentActivity: activityPoints
      }
    });

  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all students (Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { branch, year, search, limit = 50 } = req.query;
    
    const query = {};
    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { usn: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .select('-password')
      .sort({ total_points: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
