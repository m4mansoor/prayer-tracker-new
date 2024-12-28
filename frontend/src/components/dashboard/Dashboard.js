import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import { format, addMinutes } from 'date-fns';
import { useSettings } from '../../contexts/SettingsContext';
import { fetchPrayerTimes, formatDate } from '../../utils/prayerTimes';
import { 
  savePrayerHistory, 
  getPrayerHistory,
  saveFinePayment,
  getFinePayments,
  getRemainingFines,
  isDatePaid
} from '../../utils/prayerHistory';
import Logo from '../common/Logo';
import DailyHadith from '../common/DailyHadith';
import DailyZikr from '../common/DailyZikr';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const Dashboard = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  const [prayerTimes, setPrayerTimes] = useState(null);
  const [prayerStatus, setPrayerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payFineDialogOpen, setPayFineDialogOpen] = useState(false);
  const [remainingFines, setRemainingFines] = useState(0);
  const [dailyFine, setDailyFine] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setLoading(true);
        setError('');
        const today = new Date();
        const times = await fetchPrayerTimes(formatDate(today), settings.region);
        
        // Apply time adjustments from settings
        const adjustedTimes = {};
        Object.entries(times).forEach(([prayer, time]) => {
          adjustedTimes[prayer] = addMinutes(time, settings.prayerAdjustments[prayer] || 0);
        });
        
        setPrayerTimes(adjustedTimes);
      } catch (err) {
        setError('Failed to load prayer times. Please try again later.');
        console.error('Error loading prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    // Load today's prayer status
    const today = new Date();
    const history = getPrayerHistory();
    const todayKey = format(today, 'yyyy-MM-dd');
    const todayStatus = history[todayKey]?.status || {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false
    };
    setPrayerStatus(todayStatus);

    loadPrayerTimes();
  }, [settings.region, settings.prayerAdjustments]);

  useEffect(() => {
    if (prayerStatus && settings?.fineAmounts) {
      const totalDailyFine = Object.entries(prayerStatus).reduce((total, [prayer, completed]) => {
        const fineAmount = settings?.fineAmounts?.[prayer] || 0;
        return total + (!completed ? fineAmount : 0);
      }, 0);
      setDailyFine(totalDailyFine);

      // Update remaining fines
      const fines = getRemainingFines();
      setRemainingFines(fines);
    }
  }, [prayerStatus, settings]);

  const handlePrayerToggle = (prayer) => {
    const newStatus = { ...prayerStatus };
    newStatus[prayer] = !newStatus[prayer];
    setPrayerStatus(newStatus);
    savePrayerHistory(new Date(), newStatus);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('prayerStatusUpdated'));
  };

  const handlePaymentSubmit = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > dailyFine) {
      setPaymentError('Please enter a valid amount not exceeding the daily fine.');
      return;
    }

    try {
      // Add payment to fine history
      const payment = {
        date: new Date().toISOString(),
        amount: amount,
        remainingBalance: dailyFine - amount
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('fineHistory') || '[]');
      localStorage.setItem('fineHistory', JSON.stringify([...existingHistory, payment]));

      // Update daily fine
      setDailyFine(prev => prev - amount);
      
      // If fully paid, mark as paid for today
      if (amount >= dailyFine) {
        const paidDates = JSON.parse(localStorage.getItem('paidDates') || '[]');
        localStorage.setItem('paidDates', JSON.stringify([...paidDates, new Date().toISOString().split('T')[0]]));
      }

      setPayFineDialogOpen(false);
      setPaymentAmount('');
      setPaymentError('');
    } catch (error) {
      setPaymentError('Failed to process payment. Please try again.');
    }
  };

  const getFineForPrayer = (prayer) => {
    const fineAmount = settings?.fineAmounts?.[prayer] || 0;
    return !prayerStatus[prayer] && !isDatePaid(new Date()) ? fineAmount : 0;
  };

  const calculateDailyFine = () => {
    if (isDatePaid(new Date())) return 0;
    return Object.entries(prayerStatus).reduce((total, [prayer, completed]) => {
      return total + (!completed ? settings.fineAmounts[prayer] : 0);
    }, 0);
  };

  const calculateTotalFine = () => {
    return getRemainingFines() + calculateDailyFine();
  };

  const renderPrayerCard = (prayer) => {
    const completed = prayerStatus[prayer];

    return (
      <Grid item xs={12} sm={6} md={4} key={prayer}>
        <Card
          onClick={() => handlePrayerToggle(prayer)}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
            background: completed
              ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(27, 94, 32, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(183, 28, 28, 0.1) 100%)',
            border: `1px solid ${completed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  textTransform: 'capitalize',
                  fontFamily: "'Playfair Display', serif",
                  color: completed ? 'success.dark' : 'error.dark',
                  fontWeight: 600,
                }}
              >
                {prayer}
              </Typography>
              <Typography variant="h5">
                {completed ? '😊' : '😔'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {prayerTimes && format(prayerTimes[prayer], 'hh:mm a')}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: completed ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {completed ? 'Completed' : 'Missed'}
              </Typography>
            </Box>

            {!completed && getFineForPrayer(prayer) > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 500 }}>
                  Fine: {settings?.currency} {getFineForPrayer(prayer)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" gap={2} p={2}>
        <Alert severity="error">{error}</Alert>
        {prayerTimes && (
          <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {prayers.map((prayer) => renderPrayerCard(prayer))}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Logo and Date */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Logo size="large" />
        <Typography
          variant="h4"
          sx={{
            mt: 2,
            mb: 2,
            fontFamily: "'Playfair Display', serif",
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Typography>
      </Box>

      {/* Prayer Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {prayers.map((prayer) => renderPrayerCard(prayer))}
      </Grid>

      {/* Daily Hadith Section */}
      <Box sx={{ mb: 4 }}>
        <DailyHadith />
      </Box>

      {/* Daily Zikr Section */}
      <Box sx={{ mb: 4 }}>
        <DailyZikr />
      </Box>

      {/* Daily Fine Card */}
      {dailyFine > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card
            sx={{
              minWidth: '100%',
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(183, 28, 28, 0.1) 100%)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Today's Fine
              </Typography>
              <Typography variant="h4" color="error.dark" sx={{ mb: 2 }}>
                {settings?.currency} {dailyFine}
              </Typography>
              {!isDatePaid(new Date()) && dailyFine > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PaymentIcon />}
                  onClick={() => setPayFineDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049 0%, #184a18 100%)',
                    },
                  }}
                >
                  Pay Today's Fine
                </Button>
              )}
              {isDatePaid(new Date()) && (
                <Typography variant="body2" color="success.main">
                  Paid ✓
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Payment Dialog */}
      <Dialog open={payFineDialogOpen} onClose={() => setPayFineDialogOpen(false)}>
        <DialogTitle>Pay Today's Fine</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Total Fine Amount: {settings?.currency} {dailyFine}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Payment Amount"
              type="number"
              fullWidth
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              error={!!paymentError}
              helperText={paymentError}
              inputProps={{
                min: 0,
                max: dailyFine,
                step: 0.01
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayFineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained" color="primary">
            Pay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Islamic Pattern Decoration */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          opacity: 0.1,
          pointerEvents: 'none',
          background: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default Dashboard;
