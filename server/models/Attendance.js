const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  attid: {
    type: Number,
    required: true,
    unique: true
  },
  sid: {
    type: Number,
    ref: 'Student',
    required: true
  },
  eid: {
    type: Number,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Geolocation data for verification
  studentLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    }
  },
  eventLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    required: true // Distance in meters
  },
  locationAddress: {
    country: String,
    state: String,
    city: String,
    road: String,
    display_name: String
  },
  verified: {
    type: Boolean,
    default: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    platform: String
  },
  // Fraud detection flags
  fraudFlags: [{
    type: String,
    enum: ['location_spoofing', 'time_anomaly', 'device_mismatch', 'multiple_attempts']
  }],
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per student per event
attendanceSchema.index({ sid: 1, eid: 1 }, { unique: true });

// Other indexes for performance
attendanceSchema.index({ sid: 1 });
attendanceSchema.index({ eid: 1 });
attendanceSchema.index({ timestamp: 1 });
attendanceSchema.index({ verified: 1 });
attendanceSchema.index({ riskScore: 1 });

// Virtual for student details
attendanceSchema.virtual('student', {
  ref: 'Student',
  localField: 'sid',
  foreignField: 'sid',
  justOne: true
});

// Virtual for event details
attendanceSchema.virtual('event', {
  ref: 'Event',
  localField: 'eid',
  foreignField: 'eid',
  justOne: true
});

// Method to calculate risk score based on various factors
attendanceSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Distance factor (higher distance = higher risk)
  if (this.distance > this.eventLocation.radius * 0.8) {
    score += 20;
  }
  
  // Accuracy factor (lower accuracy = higher risk)
  if (this.studentLocation.accuracy > 50) {
    score += 15;
  }
  
  // Fraud flags
  score += this.fraudFlags.length * 25;
  
  // Time factor (marking attendance too early or too late)
  const eventTime = new Date(this.event?.date + 'T' + this.event?.time);
  const timeDiff = Math.abs(this.timestamp - eventTime) / (1000 * 60); // minutes
  
  if (timeDiff > 60) { // More than 1 hour difference
    score += 10;
  }
  
  this.riskScore = Math.min(score, 100);
  return this.riskScore;
};

// Ensure virtual fields are included in JSON output
attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
