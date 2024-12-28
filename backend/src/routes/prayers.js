const express = require('express');
const fetch = require('node-fetch');
const auth = require('../middleware/auth');
const Prayer = require('../models/Prayer');
const router = express.Router();

// Get prayer times for a specific date
router.get('/times/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const { latitude, longitude } = req.query;

    // Fetch prayer times from API
    const response = await fetch(
      `http://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    const data = await response.json();

    // Apply user's prayer time adjustments
    const adjustedTimes = {};
    const { prayerTimeAdjustments } = req.user.settings;

    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
      const apiTime = new Date(`${date}T${data.data.timings[prayer.toUpperCase()]}`);
      adjustedTimes[prayer] = new Date(apiTime.getTime() + (prayerTimeAdjustments[prayer] * 60000));
    });

    res.json({ times: adjustedTimes });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching prayer times' });
  }
});

// Get prayer records for a date range
router.get('/records', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const prayers = await Prayer.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });

    res.json({ prayers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching prayer records' });
  }
});

// Update prayer status
router.patch('/status/:date/:prayer', auth, async (req, res) => {
  try {
    const { date, prayer } = req.params;
    const { completed, reason } = req.body;

    let prayerRecord = await Prayer.findOne({
      userId: req.user._id,
      date: new Date(date)
    });

    if (!prayerRecord) {
      prayerRecord = new Prayer({
        userId: req.user._id,
        date: new Date(date)
      });
    }

    const prayerData = prayerRecord.prayers[prayer];
    prayerData.completed = completed;
    prayerData.completedAt = completed ? new Date() : null;
    prayerData.reason = reason;

    // Calculate fine if prayer is missed
    if (!completed) {
      prayerData.fineAmount = req.user.settings.fineAmounts[prayer];
      prayerRecord.totalFineAmount += prayerData.fineAmount;
    } else {
      if (prayerData.fineAmount) {
        prayerRecord.totalFineAmount -= prayerData.fineAmount;
      }
      prayerData.fineAmount = 0;
    }

    await prayerRecord.save();
    res.json({ prayer: prayerRecord });
  } catch (error) {
    res.status(500).json({ error: 'Error updating prayer status' });
  }
});

// Get prayer statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const prayers = await Prayer.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    const stats = {
      total: 0,
      completed: 0,
      missed: 0,
      totalFines: 0,
      byPrayer: {
        fajr: { completed: 0, missed: 0 },
        dhuhr: { completed: 0, missed: 0 },
        asr: { completed: 0, missed: 0 },
        maghrib: { completed: 0, missed: 0 },
        isha: { completed: 0, missed: 0 }
      }
    };

    prayers.forEach(prayer => {
      Object.entries(prayer.prayers).forEach(([name, data]) => {
        stats.total++;
        if (data.completed) {
          stats.completed++;
          stats.byPrayer[name].completed++;
        } else {
          stats.missed++;
          stats.byPrayer[name].missed++;
        }
      });
      stats.totalFines += prayer.totalFineAmount;
    });

    res.json({ statistics: stats });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching prayer statistics' });
  }
});

module.exports = router;
