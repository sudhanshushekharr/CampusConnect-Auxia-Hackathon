const express = require('express');
const Event = require('../models/Event');
const { authenticateStudent, authenticateAdmin, authenticateClubLeader } = require('../middleware/auth');

const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, search, limit = 50 } = req.query;
    
    const query = { isPublic: true };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { ename: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('club', 'cname category')
      .sort({ date: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event by ID
router.get('/:eid', async (req, res) => {
  try {
    const event = await Event.findOne({ eid: req.params.eid })
      .populate('club', 'cname category description');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register for event
router.post('/:eid/register', authenticateStudent, async (req, res) => {
  try {
    const event = await Event.findOne({ eid: req.params.eid });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.registeredStudents.includes(req.user.sid)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    if (event.registrations >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    const success = event.registerStudent(req.user.sid);
    if (success) {
      await event.save();
      res.json({
        success: true,
        message: 'Successfully registered for event'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Registration failed'
      });
    }

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unregister from event
router.delete('/:eid/register', authenticateStudent, async (req, res) => {
  try {
    const event = await Event.findOne({ eid: req.params.eid });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const success = event.unregisterStudent(req.user.sid);
    if (success) {
      await event.save();
      res.json({
        success: true,
        message: 'Successfully unregistered from event'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Not registered for this event'
      });
    }

  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create event (Club leaders only)
router.post('/', authenticateClubLeader, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      cid: req.club.cid
    };

    // Generate unique eid
    const lastEvent = await Event.findOne().sort({ eid: -1 });
    eventData.eid = lastEvent ? lastEvent.eid + 1 : 1;

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
