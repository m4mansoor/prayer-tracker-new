import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import { useSettings } from '../../contexts/SettingsContext';
import { getLastNDaysHistory, isDatePaid } from '../../utils/prayerHistory';
import EditPrayerDialog from './EditPrayerDialog';
import PayFineDialog from './PayFineDialog';

const History = () => {
  const { settings } = useSettings();
  const [history, setHistory] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payFineDialogOpen, setPayFineDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPrayer, setSelectedPrayer] = useState(null);

  useEffect(() => {
    const fetchHistory = () => {
      const data = getLastNDaysHistory(30);
      setHistory(data || []);
    };
    fetchHistory();

    // Add event listener for prayer status changes
    window.addEventListener('prayerStatusUpdated', fetchHistory);

    // Refresh history every minute to catch any changes
    const interval = setInterval(fetchHistory, 60000);

    return () => {
      window.removeEventListener('prayerStatusUpdated', fetchHistory);
      clearInterval(interval);
    };
  }, []);

  const handleEditClick = (day, prayer) => {
    if (day && prayer) {
      setSelectedDay(day);
      setSelectedPrayer(prayer);
      setEditDialogOpen(true);
    }
  };

  const handlePayFineClick = (day) => {
    if (day) {
      setSelectedDay(day);
      setPayFineDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setPayFineDialogOpen(false);
    setSelectedDay(null);
    setSelectedPrayer(null);
  };

  const handleUpdate = () => {
    const data = getLastNDaysHistory(30);
    setHistory(data || []);
    handleDialogClose();
  };

  const calculateDayFine = (status) => {
    if (!status || !settings?.fineAmounts) return 0;
    return Object.entries(status).reduce((total, [prayer, completed]) => {
      const fineAmount = settings.fineAmounts[prayer] || 0;
      return total + (!completed ? fineAmount : 0);
    }, 0);
  };

  const renderPrayerStatus = (status, prayer, day) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {status ? (
        <CheckCircleIcon sx={{ color: 'success.main' }} />
      ) : (
        <CancelIcon sx={{ color: 'error.main' }} />
      )}
      <IconButton 
        size="small" 
        onClick={() => handleEditClick(day, prayer)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  if (!settings || !history.length) {
    return (
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Prayer History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {prayerNames.map(prayer => (
                <TableCell key={prayer} sx={{ textTransform: 'capitalize' }}>
                  {prayer}
                </TableCell>
              ))}
              <TableCell>Fine</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((day) => (
              <TableRow key={day.date}>
                <TableCell>
                  {format(new Date(day.date), 'MMM d, yyyy')}
                  {isDatePaid(new Date(day.date)) && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        ml: 1,
                        color: 'success.main',
                        backgroundColor: 'success.light',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem'
                      }}
                    >
                      Paid
                    </Typography>
                  )}
                </TableCell>
                {prayerNames.map(prayer => (
                  <TableCell key={prayer}>
                    {renderPrayerStatus(day.status[prayer], prayer, day)}
                  </TableCell>
                ))}
                <TableCell>
                  {!isDatePaid(new Date(day.date)) && calculateDayFine(day.status) > 0 ? (
                    <Typography color="error">
                      {settings.currency} {calculateDayFine(day.status)}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell align="right">
                  {!isDatePaid(new Date(day.date)) && calculateDayFine(day.status) > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PaymentIcon />}
                      onClick={() => handlePayFineClick(day)}
                    >
                      Pay Fine
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditPrayerDialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        day={selectedDay}
        prayer={selectedPrayer}
        onUpdate={handleUpdate}
      />

      <PayFineDialog
        open={payFineDialogOpen}
        onClose={handleDialogClose}
        day={selectedDay}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default History;
