import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
    },
  },
  palette: {
    primary: {
      main: '#1B5E20',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FFC107',
      light: '#FFE082',
      dark: '#FFA000',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
