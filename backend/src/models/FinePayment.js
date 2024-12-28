const mongoose = require('mongoose');

const finePaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  prayerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prayer'
  }],
  notes: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'other'],
    default: 'cash'
  }
}, {
  timestamps: true
});

// Index for efficient queries
finePaymentSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('FinePayment', finePaymentSchema);
