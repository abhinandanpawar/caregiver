import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Alert, Box } from '@mui/material';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import SkeletonCard from './SkeletonCard';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface HeatmapDataPoint {
  x: number;
  y: number;
  r: number;
  label: string;
}

const HeatmapCard = () => {
  const [chartData, setChartData] = useState<ChartData<'bubble'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/dashboard/heatmap');
        if (!response.ok) {
          throw new Error('Failed to fetch heatmap data');
        }
        const data: HeatmapDataPoint[] = await response.json();
        const datasets = data.map((dept) => ({
          label: dept.label,
          data: [{ x: dept.x, y: dept.y, r: dept.r / 2 }], // Scale radius for better visualization
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
        }));
        setChartData({ datasets });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      x: {
        title: { display: true, text: 'Burnout Risk Score' },
        min: 0,
        max: 100,
      },
      y: {
        title: { display: true, text: 'Focus Score' },
        min: 40,
        max: 100,
      },
    },
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Department Wellness Heatmap
        </Typography>
        <Box sx={{ height: '300px' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {!error && chartData && <Bubble options={options} data={chartData} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HeatmapCard;