const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eid: {
    type: Number,
    required: true,
    unique: true
  },
  ename: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  cid: {
    type: Number,
    ref: 'Club',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  // Geolocation data for attendance
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  locationRadius: {
    type: Number,
    default: 100, // meters
    min: 10,
    max: 1000
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registrations: {
    type: Number,
    default: 0
  },
  registeredStudents: [{
    type: Number,
    ref: 'Student'
  }],
  category: {
    type: String,
    required: true,
    enum: ['technical', 'cultural', 'sports', 'social', 'academic', 'workshop', 'seminar', 'competition', 'other']
  },
  status: {
    type: String,
    default: 'upcoming',
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled']
  },
  requirements: {
    type: String,
    trim: true
  },
  prizes: [{
    position: String,
    reward: String,
    points: Number
  }],
  images: [{
    type: String
  }],
  registration_deadline: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ ename: 1 });
eventSchema.index({ cid: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ registeredStudents: 1 });

// Virtual for club details
eventSchema.virtual('club', {
  ref: 'Club',
  localField: 'cid',
  foreignField: 'cid',
  justOne: true
});

// Virtual to check if event is full
eventSchema.virtual('isFull').get(function() {
  return this.registrations >= this.capacity;
});

// Virtual to get registration percentage
eventSchema.virtual('registrationPercentage').get(function() {
  return Math.round((this.registrations / this.capacity) * 100);
});

// Method to register a student
eventSchema.methods.registerStudent = function(studentId) {
  if (!this.registeredStudents.includes(studentId) && this.registrations < this.capacity) {
    this.registeredStudents.push(studentId);
    this.registrations += 1;
    return true;
  }
  return false;
};

// Method to unregister a student
eventSchema.methods.unregisterStudent = function(studentId) {
  const index = this.registeredStudents.indexOf(studentId);
  if (index > -1) {
    this.registeredStudents.splice(index, 1);
    this.registrations -= 1;
    return true;
  }
  return false;
};

// Ensure virtual fields are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
