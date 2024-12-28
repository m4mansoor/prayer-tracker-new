import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { format } from 'date-fns';

const FineHistory = () => {
  const fineHistory = JSON.parse(localStorage.getItem('fineHistory') || '[]');
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');

  if (fineHistory.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              No payment history available
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontFamily: "'Playfair Display', serif" }}>
        Fine Payment History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'rgba(0, 0, 0, 0.04)' }}>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount Paid</TableCell>
              <TableCell align="right">Remaining Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fineHistory.map((payment, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {format(new Date(payment.date), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                  {settings.currency} {payment.amount}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: payment.remainingBalance > 0 ? 'error.main' : 'success.main',
                    fontWeight: 500
                  }}
                >
                  {settings.currency} {payment.remainingBalance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FineHistory;
