import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

const TrendsCard = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v1/dashboard/trends')
      .then((response) => response.json())
      .then((data) => {
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
      })
      .catch(() => setError('Error fetching trends data.'));
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Wellness Trends (30 Days)
        </Typography>
        <div style={{ height: '300px' }}>
            {error && <Typography color="error">{error}</Typography>}
            {!error && !chartData && <Typography>Loading chart...</Typography>}
            {!error && chartData && <Line options={options} data={chartData} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsCard;