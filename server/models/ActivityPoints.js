const mongoose = require('mongoose');

const activityPointsSchema = new mongoose.Schema({
  apid: {
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
  cid: {
    type: Number,
    ref: 'Club',
    required: true
  },
  point_count: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    enum: ['attendance', 'participation', 'winner', 'runner_up', 'completion', 'bonus', 'penalty']
  },
  description: {
    type: String,
    trim: true
  },
  awarded_by: {
    type: Number,
    ref: 'Admin'
  },
  status: {
    type: String,
    default: 'approved',
    enum: ['pending', 'approved', 'rejected']
  },
  // Additional metadata
  metadata: {
    position: String, // For competitions (1st, 2nd, 3rd, etc.)
    category: String, // Competition category
    certificate_issued: {
      type: Boolean,
      default: false
    },
    certificate_url: String
  }
}, {
  timestamps: true
});

// Compound index for unique points per student per event
activityPointsSchema.index({ sid: 1, eid: 1 }, { unique: true });

// Other indexes for performance
activityPointsSchema.index({ sid: 1 });
activityPointsSchema.index({ eid: 1 });
activityPointsSchema.index({ cid: 1 });
activityPointsSchema.index({ reason: 1 });
activityPointsSchema.index({ status: 1 });
activityPointsSchema.index({ createdAt: -1 });

// Virtual for student details
activityPointsSchema.virtual('student', {
  ref: 'Student',
  localField: 'sid',
  foreignField: 'sid',
  justOne: true
});

// Virtual for event details
activityPointsSchema.virtual('event', {
  ref: 'Event',
  localField: 'eid',
  foreignField: 'eid',
  justOne: true
});

// Virtual for club details
activityPointsSchema.virtual('club', {
  ref: 'Club',
  localField: 'cid',
  foreignField: 'cid',
  justOne: true
});

// Virtual for admin details (who awarded the points)
activityPointsSchema.virtual('awardedByAdmin', {
  ref: 'Admin',
  localField: 'awarded_by',
  foreignField: 'aid',
  justOne: true
});

// Pre-save middleware to update student's total points
activityPointsSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'approved') {
    try {
      const Student = mongoose.model('Student');
      await Student.updateOne(
        { sid: this.sid },
        { $inc: { total_points: this.point_count } }
      );
    } catch (error) {
      console.error('Error updating student points:', error);
    }
  }
  next();
});

// Post-save middleware to handle point updates when status changes
activityPointsSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && this.getUpdate().$set && this.getUpdate().$set.status) {
    const newStatus = this.getUpdate().$set.status;
    const oldDoc = await this.model.findOne(this.getQuery());
    
    if (oldDoc && oldDoc.status !== newStatus) {
      try {
        const Student = mongoose.model('Student');
        
        if (newStatus === 'approved' && oldDoc.status !== 'approved') {
          // Add points
          await Student.updateOne(
            { sid: doc.sid },
            { $inc: { total_points: doc.point_count } }
          );
        } else if (oldDoc.status === 'approved' && newStatus !== 'approved') {
          // Remove points
          await Student.updateOne(
            { sid: doc.sid },
            { $inc: { total_points: -doc.point_count } }
          );
        }
      } catch (error) {
        console.error('Error updating student points on status change:', error);
      }
    }
  }
});

// Ensure virtual fields are included in JSON output
activityPointsSchema.set('toJSON', { virtuals: true });
activityPointsSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ActivityPoints', activityPointsSchema);
