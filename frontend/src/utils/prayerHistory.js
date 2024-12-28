import { format, subDays } from 'date-fns';

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PAID_DATES_KEY = 'paidDates';
const PRAYER_HISTORY_KEY = 'prayerHistory';
const FINE_PAYMENTS_KEY = 'finePayments';

// Generate random prayer status (true/false) with higher probability of true
const getRandomStatus = () => Math.random() > 0.2; // 80% chance of true

export const savePrayerHistory = (date, prayerStatus, reasons = {}) => {
  const history = getPrayerHistory();
  const dateKey = format(date, 'yyyy-MM-dd');
  history[dateKey] = {
    status: prayerStatus,
    reasons: reasons,
    lastModified: new Date().toISOString()
  };
  localStorage.setItem(PRAYER_HISTORY_KEY, JSON.stringify(history));
};

export const getPrayerHistory = () => {
  const history = localStorage.getItem(PRAYER_HISTORY_KEY);
  return history ? JSON.parse(history) : {};
};

export const updatePrayerHistory = (dateKey, prayer, status, reason) => {
  const history = getPrayerHistory();
  if (!history[dateKey]) {
    history[dateKey] = {
      status: {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
      reasons: {}
    };
  }
  
  history[dateKey].status[prayer] = status;
  if (reason) {
    if (!history[dateKey].reasons) history[dateKey].reasons = {};
    history[dateKey].reasons[prayer] = reason;
  }
  history[dateKey].lastModified = new Date().toISOString();
  
  localStorage.setItem(PRAYER_HISTORY_KEY, JSON.stringify(history));
};

export const getLastNDaysHistory = (n = 30) => {
  const today = new Date();
  const history = [];
  const storedHistory = getPrayerHistory();

  for (let i = 0; i < n; i++) {
    const date = subDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = storedHistory[dateKey];
    
    // Use stored status if available, otherwise initialize as not completed
    const status = dayData?.status || {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false
    };

    history.push({
      date: dateKey,
      status,
      reasons: dayData?.reasons || {}
    });
  }

  return history;
};

export const saveFinePayment = (amount, date = new Date()) => {
  const payments = getFinePayments();
  
  // Add new payment
  payments.push({
    amount,
    date: date.toISOString(),
    id: Date.now().toString()
  });
  
  // Mark the date as paid
  markDateAsPaid(date);
  
  localStorage.setItem(FINE_PAYMENTS_KEY, JSON.stringify(payments));
  return payments;
};

export const getFinePayments = () => {
  const payments = localStorage.getItem(FINE_PAYMENTS_KEY);
  return payments ? JSON.parse(payments) : [];
};

export const getRemainingFines = () => {
  const history = getLastNDaysHistory(30);
  let totalFines = 0;

  history.forEach(day => {
    if (!isDatePaid(new Date(day.date))) {
      Object.entries(day.status).forEach(([prayer, completed]) => {
        if (!completed) {
          const settings = JSON.parse(localStorage.getItem('settings') || '{}');
          const fineAmounts = settings.fineAmounts || {
            fajr: 100,
            dhuhr: 100,
            asr: 100,
            maghrib: 100,
            isha: 100
          };
          totalFines += fineAmounts[prayer];
        }
      });
    }
  });

  return totalFines;
};

export const isDatePaid = (date) => {
  const paidDates = JSON.parse(localStorage.getItem(PAID_DATES_KEY) || '[]');
  const dateStr = format(new Date(date), 'yyyy-MM-dd');
  return paidDates.includes(dateStr);
};

export const markDateAsPaid = (date) => {
  const paidDates = JSON.parse(localStorage.getItem(PAID_DATES_KEY) || '[]');
  const dateStr = format(new Date(date), 'yyyy-MM-dd');
  
  if (!paidDates.includes(dateStr)) {
    paidDates.push(dateStr);
    localStorage.setItem(PAID_DATES_KEY, JSON.stringify(paidDates));
  }
};

export const updatePrayerStatus = (date, prayer, completed) => {
  const dateKey = format(new Date(date), 'yyyy-MM-dd');
  updatePrayerHistory(dateKey, prayer, completed);
  return {
    date: dateKey,
    status: {
      [prayer]: completed
    }
  };
};
