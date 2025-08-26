const express = require('express');
const Club = require('../models/Club');
const Event = require('../models/Event');
const { authenticateAdmin, authenticateClubLeader } = require('../middleware/auth');

const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const clubs = await Club.find(query)
      .populate('clubHead', 'name email')
      .sort({ cname: 1 });

    res.json({
      success: true,
      data: clubs
    });

  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club events
router.get('/:cid/events', async (req, res) => {
  try {
    const events = await Event.find({ cid: parseInt(req.params.cid) })
      .sort({ date: -1 });

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get club events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
