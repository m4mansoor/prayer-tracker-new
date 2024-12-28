import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { format } from 'date-fns';
import { saveFinePayment } from '../../utils/prayerHistory';
import { useSettings } from '../../contexts/SettingsContext';

const PayFineDialog = ({ open, onClose, day, onUpdate }) => {
  const { settings } = useSettings();

  if (!day) {
    return null;
  }

  const calculateDayFine = (status) => {
    return Object.entries(status).reduce((total, [prayer, completed]) => {
      return total + (!completed ? settings.fineAmounts[prayer] : 0);
    }, 0);
  };

  const handlePayment = () => {
    const amount = calculateDayFine(day.status);
    if (amount > 0) {
      saveFinePayment(amount, new Date(day.date));
      if (onUpdate) onUpdate();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay Fine</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Fine Amount: {settings.currency} {calculateDayFine(day.status)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will mark all fines for this day as paid.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handlePayment} 
          variant="contained" 
          color="primary"
          disabled={calculateDayFine(day.status) === 0}
        >
          Pay Fine
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayFineDialog;
