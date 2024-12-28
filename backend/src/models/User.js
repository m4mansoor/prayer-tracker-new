const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  settings: {
    currency: {
      type: String,
      default: 'USD'
    },
    timeZone: {
      type: String,
      default: 'UTC'
    },
    prayerTimeAdjustments: {
      fajr: { type: Number, default: 0 },
      dhuhr: { type: Number, default: 0 },
      asr: { type: Number, default: 0 },
      maghrib: { type: Number, default: 0 },
      isha: { type: Number, default: 0 }
    },
    fineAmounts: {
      fajr: { type: Number, default: 1 },
      dhuhr: { type: Number, default: 1 },
      asr: { type: Number, default: 1 },
      maghrib: { type: Number, default: 1 },
      isha: { type: Number, default: 1 }
    },
    notifications: {
      enabled: { type: Boolean, default: true },
      beforePrayer: { type: Number, default: 15 } // minutes
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
