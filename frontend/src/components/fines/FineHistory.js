import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { getFinePayments, getRemainingFines } from '../../utils/prayerHistory';
import { useSettings } from '../../contexts/SettingsContext';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const FineHistory = () => {
  const { settings } = useSettings();
  const payments = getFinePayments();
  const remainingFines = getRemainingFines();

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          Fine Payment History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your fine payments and remaining balance
        </Typography>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Current Balance</Typography>
            </Box>
            <Typography variant="h4" color={remainingFines > 0 ? "error" : "success"}>
              {settings.currency} {remainingFines}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {remainingFines > 0 ? 'Remaining unpaid fines' : 'All fines paid'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Payments Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Remaining Balance</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No payment history available
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        {format(parseISO(payment.date), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="primary">
                      {settings.currency} {payment.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {settings.currency} {payment.remainingAfterPayment}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label="Paid"
                      color="success"
                      size="small"
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FineHistory;
