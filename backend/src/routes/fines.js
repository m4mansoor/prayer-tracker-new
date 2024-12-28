const express = require('express');
const auth = require('../middleware/auth');
const Prayer = require('../models/Prayer');
const FinePayment = require('../models/FinePayment');
const router = express.Router();

// Get fine summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const prayers = await Prayer.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    const payments = await FinePayment.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    const summary = {
      totalFines: 0,
      totalPaid: 0,
      balance: 0,
      dailyBreakdown: {}
    };

    prayers.forEach(prayer => {
      const dateStr = prayer.date.toISOString().split('T')[0];
      if (!summary.dailyBreakdown[dateStr]) {
        summary.dailyBreakdown[dateStr] = {
          fines: 0,
          paid: 0,
          balance: 0
        };
      }
      summary.dailyBreakdown[dateStr].fines += prayer.totalFineAmount;
      summary.totalFines += prayer.totalFineAmount;
    });

    payments.forEach(payment => {
      const dateStr = payment.date.toISOString().split('T')[0];
      if (!summary.dailyBreakdown[dateStr]) {
        summary.dailyBreakdown[dateStr] = {
          fines: 0,
          paid: 0,
          balance: 0
        };
      }
      summary.dailyBreakdown[dateStr].paid += payment.amount;
      summary.totalPaid += payment.amount;
    });

    summary.balance = summary.totalFines - summary.totalPaid;

    Object.keys(summary.dailyBreakdown).forEach(date => {
      const day = summary.dailyBreakdown[date];
      day.balance = day.fines - day.paid;
    });

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching fine summary' });
  }
});

// Record fine payment
router.post('/payment', auth, async (req, res) => {
  try {
    const { amount, date, prayerIds, notes, paymentMethod } = req.body;

    const payment = new FinePayment({
      userId: req.user._id,
      amount,
      currency: req.user.settings.currency,
      date: new Date(date),
      prayerIds,
      notes,
      paymentMethod
    });

    await payment.save();

    // Update prayer records to mark fines as paid
    if (prayerIds && prayerIds.length > 0) {
      await Prayer.updateMany(
        {
          _id: { $in: prayerIds },
          userId: req.user._id
        },
        {
          $inc: { totalFinePaid: amount / prayerIds.length },
          $set: { 'prayers.$[].finePaid': true }
        }
      );
    }

    res.status(201).json({ payment });
  } catch (error) {
    res.status(500).json({ error: 'Error recording payment' });
  }
});

// Get payment history
router.get('/payments', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const payments = await FinePayment.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .sort({ date: -1 })
    .populate('prayerIds');

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment history' });
  }
});

module.exports = router;
