import React from 'react';
import Layout from './Layout';
import { Grid } from '@mui/material';
import KPICard from './components/KPICard';
import HeatmapCard from './components/HeatmapCard';
import TrendsCard from './components/TrendsCard';
import DepartmentList from './components/DepartmentList';

function App() {
  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <KPICard />
        </Grid>
        <Grid item xs={12} md={6}>
          <HeatmapCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendsCard />
        </Grid>
        <Grid item xs={12}>
          <DepartmentList />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default App;