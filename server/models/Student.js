const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  sid: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'ISE', 'BT', 'CH', 'Other']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  total_points: {
    type: Number,
    default: 0
  },
  profile_picture: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Note: email, usn, and sid indexes are already created by unique: true in schema definition

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output
studentSchema.methods.toJSON = function() {
  const student = this.toObject();
  delete student.password;
  return student;
};

module.exports = mongoose.model('Student', studentSchema);
