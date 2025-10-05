import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Alert } from '@mui/material';
import SkeletonCard from './SkeletonCard';

interface KpiData {
  overall_score: number;
  departments_at_risk: number;
  positive_trend: string;
}

const KPICard = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/dashboard/kpis');
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }
        const data = await response.json();
        setKpiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!kpiData) {
    return null;
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