const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  prayers: {
    fajr: {
      time: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      reason: String,
      fineAmount: Number,
      finePaid: { type: Boolean, default: false }
    },
    dhuhr: {
      time: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      reason: String,
      fineAmount: Number,
      finePaid: { type: Boolean, default: false }
    },
    asr: {
      time: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      reason: String,
      fineAmount: Number,
      finePaid: { type: Boolean, default: false }
    },
    maghrib: {
      time: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      reason: String,
      fineAmount: Number,
      finePaid: { type: Boolean, default: false }
    },
    isha: {
      time: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      reason: String,
      fineAmount: Number,
      finePaid: { type: Boolean, default: false }
    }
  },
  totalFineAmount: {
    type: Number,
    default: 0
  },
  totalFinePaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
prayerSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Prayer', prayerSchema);
