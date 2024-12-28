import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import History from './components/history/History';
import FineHistory from './components/fine/FineHistory';
import { SettingsProvider } from './contexts/SettingsContext';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
              <Route path="/fine-history" element={<FineHistory />} />
            </Routes>
          </Layout>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
