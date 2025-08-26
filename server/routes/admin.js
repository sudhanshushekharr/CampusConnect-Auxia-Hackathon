const express = require('express');
const Student = require('../models/Student');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const ActivityPoints = require('../models/ActivityPoints');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard analytics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalClubs = await Club.countDocuments({ status: 'active' });
    const totalEvents = await Event.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    // Recent activities
    const recentEvents = await Event.find()
      .populate('club', 'cname')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAttendance = await Attendance.find()
      .populate('student', 'name')
      .populate('event', 'ename')
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalClubs,
          totalEvents,
          totalAttendance
        },
        recentEvents,
        recentAttendance
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
