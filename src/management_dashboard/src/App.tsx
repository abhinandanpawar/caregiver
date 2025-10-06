import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Grid, Typography, Box, Tab, Tabs } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './Layout';
import KPICard from './components/KPICard';
import HeatmapCard from './components/HeatmapCard';
import TrendsCard from './components/TrendsCard';
import DepartmentList from './components/DepartmentList';
import LoginPage from './components/LoginPage';
import AnnouncementsPanel from './components/AnnouncementsPanel';
import FormBuilder from './components/FormBuilder';

const AdminPanel = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin panel tabs">
          <Tab label="Announcements" />
          <Tab label="Feedback Forms" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 3 }}>
        {value === 0 && <AnnouncementsPanel />}
        {value === 1 && <FormBuilder />}
      </Box>
    </Box>
  );
};

const Dashboard = () => (
  <>
    <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
      Organization Wellness Dashboard
    </Typography>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <KPICard />
      </Grid>
      <Grid item xs={12} lg={7}>
        <TrendsCard />
      </Grid>
      <Grid item xs={12} lg={5}>
        <HeatmapCard />
      </Grid>
      <Grid item xs={12}>
        <DepartmentList />
      </Grid>
    </Grid>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;