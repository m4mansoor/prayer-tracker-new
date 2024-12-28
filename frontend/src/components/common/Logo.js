import React from 'react';
import { Box, Typography } from '@mui/material';
import MosqueIcon from '@mui/icons-material/Mosque';

const Logo = ({ size = 'medium', showText = true }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 24, text: '1.5rem' };
      case 'large':
        return { icon: 48, text: '3rem' };
      default:
        return { icon: 32, text: '2rem' };
    }
  };

  const dimensions = getSize();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 1,
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dimensions.icon * 1.5,
          height: dimensions.icon * 1.5,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        <MosqueIcon
          sx={{
            fontSize: dimensions.icon,
            color: '#fff',
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant="h1"
          sx={{
            fontSize: dimensions.text,
            fontFamily: "'Noto Nastaliq Urdu', serif",
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            flexShrink: 0,
            display: 'block',
            width: 'auto',
          }}
        >
          Qunoot
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
