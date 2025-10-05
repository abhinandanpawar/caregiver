import React from 'react';
import Layout from './Layout';
import { Grid, Typography } from '@mui/material';
import KPICard from './components/KPICard';
import HeatmapCard from './components/HeatmapCard';
import TrendsCard from './components/TrendsCard';
import DepartmentList from './components/DepartmentList';

function App() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default App;