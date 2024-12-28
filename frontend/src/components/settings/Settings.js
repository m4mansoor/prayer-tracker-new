import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useSettings } from '../../contexts/SettingsContext';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [successMessage, setSuccessMessage] = useState('');
  
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const currencies = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'SAR'];
  const regions = [
    'Asia/Karachi',
    'Asia/Riyadh',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Europe/London',
    'America/New_York',
    'Australia/Sydney'
  ];

  const handleCurrencyChange = (event) => {
    updateSettings({
      ...settings,
      currency: event.target.value
    });
  };

  const handleRegionChange = (event) => {
    updateSettings({
      ...settings,
      region: event.target.value
    });
  };

  const handlePrayerAdjustment = (prayer, value) => {
    updateSettings({
      ...settings,
      prayerAdjustments: {
        ...settings.prayerAdjustments,
        [prayer]: parseInt(value) || 0
      }
    });
  };

  const handleFineAmount = (prayer, value) => {
    updateSettings({
      ...settings,
      fineAmounts: {
        ...settings.fineAmounts,
        [prayer]: parseFloat(value) || 0
      }
    });
  };

  const handleSave = () => {
    setSuccessMessage('Settings saved successfully!');
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          Prayer Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Customize your prayer times, fines, and preferences
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Location and Currency Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Location & Currency
                </Typography>
                <Tooltip title="These settings affect prayer times and fine calculations">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={settings.region}
                      label="Region"
                      onChange={handleRegionChange}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.currency}
                      label="Currency"
                      onChange={handleCurrencyChange}
                    >
                      {currencies.map((currency) => (
                        <MenuItem key={currency} value={currency}>
                          {currency}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Prayer Time Adjustments */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Prayer Time Adjustments
                </Typography>
                <Tooltip title="Add or subtract minutes from calculated prayer times">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {prayers.map((prayer) => (
                  <Grid item xs={12} key={`adjustment-${prayer}`}>
                    <TextField
                      fullWidth
                      label={`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} Adjustment (minutes)`}
                      type="number"
                      value={settings.prayerAdjustments[prayer]}
                      onChange={(e) => handlePrayerAdjustment(prayer, e.target.value)}
                      InputProps={{ 
                        inputProps: { min: -60, max: 60 },
                        sx: { backgroundColor: 'white' }
                      }}
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fine Amounts */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Fine Settings
                </Typography>
                <Tooltip title="Set fine amounts for missed prayers">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {prayers.map((prayer) => (
                  <Grid item xs={12} sm={6} md={4} key={`fine-${prayer}`}>
                    <TextField
                      fullWidth
                      label={`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} Fine (${settings.currency})`}
                      type="number"
                      value={settings.fineAmounts[prayer]}
                      onChange={(e) => handleFineAmount(prayer, e.target.value)}
                      InputProps={{ 
                        inputProps: { min: 0, step: 0.1 },
                        sx: { backgroundColor: 'white' }
                      }}
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
          startIcon={<SaveIcon />}
          sx={{ 
            minWidth: 200,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Save Settings
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
