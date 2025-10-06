import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Alert, Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import SkeletonCard from './SkeletonCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface TrendsDataPoint {
  date: string;
  score: number;
}

const TrendsCard = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/api/v1/dashboard/trends');
        if (!response.ok) {
          throw new Error('Failed to fetch trends data');
        }
        const data: TrendsDataPoint[] = await response.json();
        const labels = data.map((d) => new Date(d.date).toLocaleDateString());
        const scores = data.map((d) => d.score);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Overall Wellness Score',
              data: scores,
              fill: true,
              backgroundColor: 'rgba(74, 144, 164, 0.2)',
              borderColor: 'rgb(74, 144, 164)',
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 100,
        title: { display: true, text: 'Wellness Score' },
      },
      x: { title: { display: true, text: 'Date' } },
    },
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Wellness Trends (30 Days)
        </Typography>
        <Box sx={{ height: '300px' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {!error && chartData && <Line options={options} data={chartData} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrendsCard;