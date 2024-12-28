import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { format } from 'date-fns';
import { updatePrayerHistory } from '../../utils/prayerHistory';

const EditPrayerDialog = ({ open, onClose, day, prayer, date, initialStatus, initialReason, onUpdate }) => {
  const [status, setStatus] = useState(initialStatus);
  const [reason, setReason] = useState(initialReason || '');

  useEffect(() => {
    if (day && prayer) {
      setStatus(day.status[prayer]);
      setReason(day.reasons?.[prayer] || '');
    }
  }, [day, prayer]);

  const handleSave = () => {
    if (day && prayer) {
      const dateKey = format(new Date(day.date), 'yyyy-MM-dd');
      updatePrayerHistory(dateKey, prayer, status, reason);
      if (onUpdate) onUpdate();
      onClose();
    }
  };

  if (!day || !prayer) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Prayer Status - {prayer?.charAt(0).toUpperCase() + prayer?.slice(1)}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {prayer.charAt(0).toUpperCase() + prayer.slice(1)} Prayer
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {date}
          </Typography>
        </Box>
        <Box sx={{ pt: 2 }}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  color="primary"
                />
              }
              label={status ? 'Completed' : 'Missed'}
            />
          </FormControl>
          <TextField
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPrayerDialog;
