const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  cid: {
    type: Number,
    required: true,
    unique: true
  },
  cname: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  club_head_sid: {
    type: Number,
    ref: 'Student',
    required: true
  },
  aid: {
    type: Number,
    ref: 'Admin',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'cultural', 'sports', 'social', 'academic', 'other']
  },
  logo: {
    type: String,
    default: null
  },
  contact_email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contact_phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  established_date: {
    type: Date
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'pending_approval']
  },
  member_count: {
    type: Number,
    default: 0
  },
  total_events: {
    type: Number,
    default: 0
  },
  social_links: {
    website: String,
    instagram: String,
    twitter: String,
    linkedin: String
  }
}, {
  timestamps: true
});

// Index for better query performance
clubSchema.index({ cname: 1 });
clubSchema.index({ club_head_sid: 1 });
clubSchema.index({ category: 1 });
clubSchema.index({ status: 1 });

// Virtual for club head details
clubSchema.virtual('clubHead', {
  ref: 'Student',
  localField: 'club_head_sid',
  foreignField: 'sid',
  justOne: true
});

// Virtual for admin details
clubSchema.virtual('admin', {
  ref: 'Admin',
  localField: 'aid',
  foreignField: 'aid',
  justOne: true
});

// Ensure virtual fields are included in JSON output
clubSchema.set('toJSON', { virtuals: true });
clubSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Club', clubSchema);
