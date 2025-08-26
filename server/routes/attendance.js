const express = require('express');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const Student = require('../models/Student');
const ActivityPoints = require('../models/ActivityPoints');
const { authenticateStudent, authenticateAdmin, authenticateClubLeader } = require('../middleware/auth');

const router = express.Router();

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Mark attendance with geolocation
router.post('/mark', authenticateStudent, async (req, res) => {
  try {
    const { 
      eid, 
      studentLocation, 
      locationAddress,
      deviceInfo 
    } = req.body;

    if (!eid || !studentLocation) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and student location are required'
      });
    }

    // Get event details
    const event = await Event.findOne({ eid });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if student is registered for the event
    if (!event.registeredStudents.includes(req.user.sid)) {
      return res.status(403).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    // Check if attendance already marked
    const existingAttendance = await Attendance.findOne({ 
      sid: req.user.sid, 
      eid: eid 
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this event'
      });
    }

    // Calculate distance from event location
    const distance = calculateDistance(
      studentLocation.latitude,
      studentLocation.longitude,
      event.latitude,
      event.longitude
    );

    // Check if student is within the required radius
    if (distance > event.locationRadius) {
      return res.status(400).json({
        success: false,
        message: `You are ${Math.round(distance)}m away from the event location. Please move closer (within ${event.locationRadius}m).`,
        data: {
          distance: Math.round(distance),
          requiredRadius: event.locationRadius,
          tooFar: true
        }
      });
    }

    // Generate unique attendance ID
    const lastAttendance = await Attendance.findOne().sort({ attid: -1 });
    const attid = lastAttendance ? lastAttendance.attid + 1 : 1;

    // Create attendance record
    const attendance = new Attendance({
      attid,
      sid: req.user.sid,
      eid: eid,
      status: 'present',
      studentLocation: {
        latitude: studentLocation.latitude,
        longitude: studentLocation.longitude,
        accuracy: studentLocation.accuracy || 0
      },
      eventLocation: {
        latitude: event.latitude,
        longitude: event.longitude,
        radius: event.locationRadius
      },
      distance: Math.round(distance),
      locationAddress: locationAddress || {},
      verified: true,
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        platform: deviceInfo?.platform || 'unknown'
      }
    });

    // Calculate risk score
    attendance.calculateRiskScore();

    await attendance.save();

    // Award points for attendance
    const lastActivityPoints = await ActivityPoints.findOne().sort({ apid: -1 });
    const apid = lastActivityPoints ? lastActivityPoints.apid + 1 : 1;

    const activityPoints = new ActivityPoints({
      apid,
      sid: req.user.sid,
      eid: eid,
      cid: event.cid,
      point_count: event.points,
      reason: 'attendance',
      description: `Attendance marked for ${event.ename}`
    });

    await activityPoints.save();

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        attendance: attendance.toJSON(),
        pointsAwarded: event.points,
        distance: Math.round(distance),
        verified: true
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance for current user (no sid required)
router.get('/student', authenticateStudent, async (req, res) => {
  try {
    const sid = req.user.sid;
    
    const attendance = await Attendance.find({ sid })
      .populate('event', 'ename date time location points category')
      .populate('club', 'cname category')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance for a specific student (with sid parameter)
router.get('/student/:sid', authenticateStudent, async (req, res) => {
  try {
    const sid = req.params.sid;
    
    // Students can only view their own attendance
    if (req.user.sid !== parseInt(sid)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const attendance = await Attendance.find({ sid })
      .populate('event', 'ename date time location points category')
      .populate('club', 'cname category')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance for an event (Club leaders and admins only)
router.get('/event/:eid', async (req, res) => {
  try {
    const { eid } = req.params;

    // Get event to check permissions
    const event = await Event.findOne({ eid });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Authorization check would go here based on user role
    // For now, allowing all authenticated users

    const attendance = await Attendance.find({ eid })
      .populate('student', 'name usn branch email')
      .sort({ timestamp: -1 });

    const stats = {
      totalRegistered: event.registrations,
      totalAttended: attendance.length,
      attendanceRate: event.registrations > 0 ? 
        Math.round((attendance.length / event.registrations) * 100) : 0,
      averageRiskScore: attendance.length > 0 ? 
        Math.round(attendance.reduce((sum, att) => sum + att.riskScore, 0) / attendance.length) : 0
    };

    res.json({
      success: true,
      data: {
        attendance,
        stats
      }
    });

  } catch (error) {
    console.error('Get event attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance analytics (Admin only)
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate, clubId } = req.query;

    // Build query
    const query = {};
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get attendance data
    const attendance = await Attendance.find(query)
      .populate('event', 'ename cid category')
      .populate('student', 'name branch');

    // Calculate analytics
    const totalAttendance = attendance.length;
    const uniqueStudents = new Set(attendance.map(att => att.sid)).size;
    const averageRiskScore = attendance.length > 0 ? 
      Math.round(attendance.reduce((sum, att) => sum + att.riskScore, 0) / attendance.length) : 0;

    // High-risk attendance (risk score > 50)
    const highRiskAttendance = attendance.filter(att => att.riskScore > 50);

    // Attendance by category
    const categoryStats = {};
    attendance.forEach(att => {
      const category = att.event?.category || 'unknown';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    // Attendance by month
    const monthlyStats = {};
    attendance.forEach(att => {
      const month = att.timestamp.toISOString().slice(0, 7); // YYYY-MM
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalAttendance,
          uniqueStudents,
          averageRiskScore,
          highRiskCount: highRiskAttendance.length
        },
        categoryStats,
        monthlyStats,
        highRiskAttendance: highRiskAttendance.slice(0, 10) // Top 10 high-risk
      }
    });

  } catch (error) {
    console.error('Attendance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Fraud detection endpoint (Admin only)
router.get('/fraud-detection', authenticateAdmin, async (req, res) => {
  try {
    // Get suspicious attendance records
    const suspiciousAttendance = await Attendance.find({
      $or: [
        { riskScore: { $gt: 70 } },
        { 'fraudFlags.0': { $exists: true } },
        { 'studentLocation.accuracy': { $gt: 100 } },
        { distance: { $gt: 80 } } // Close to but not exceeding radius
      ]
    })
    .populate('student', 'name usn email')
    .populate('event', 'ename date location')
    .sort({ riskScore: -1, timestamp: -1 })
    .limit(50);

    // Group by fraud type
    const fraudTypes = {
      highRiskScore: suspiciousAttendance.filter(att => att.riskScore > 70),
      lowAccuracy: suspiciousAttendance.filter(att => att.studentLocation.accuracy > 100),
      suspiciousDistance: suspiciousAttendance.filter(att => att.distance > 80),
      flaggedAttendance: suspiciousAttendance.filter(att => att.fraudFlags.length > 0)
    };

    res.json({
      success: true,
      data: {
        suspiciousAttendance,
        fraudTypes,
        totalSuspicious: suspiciousAttendance.length
      }
    });

  } catch (error) {
    console.error('Fraud detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
