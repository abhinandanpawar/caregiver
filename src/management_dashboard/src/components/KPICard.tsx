import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const KPICard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v1/dashboard/kpis')
      .then((res) => res.json())
      .then((data) => setKpiData(data))
      .catch(() => setError('Could not load KPI data.'));
  }, []);

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!kpiData) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading KPIs...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Organization-Wide Snapshot
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h4" component="div">
              {kpiData.overall_score}
            </Typography>
            <Typography color="text.secondary">Overall Wellness Score</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" component="div">
              {kpiData.departments_at_risk}
            </Typography>
            <Typography color="text.secondary">Departments at Risk</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" component="div">
              {kpiData.positive_trend}
            </Typography>
            <Typography color="text.secondary">Positive Trend</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default KPICard;