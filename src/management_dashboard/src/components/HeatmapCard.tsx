import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const HeatmapCard = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v1/dashboard/heatmap')
      .then((response) => response.json())
      .then((data) => {
        const datasets = data.map((dept) => ({
          label: dept.label,
          data: [{ x: dept.x, y: dept.y, r: dept.r / 2 }],
          backgroundColor: `rgba(${Math.random() * 255}, ${
            Math.random() * 255
          }, ${Math.random() * 255}, 0.7)`,
        }));
        setChartData({ datasets });
      })
      .catch(() => setError('Error fetching heatmap data.'));
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Department Wellness Heatmap
        </Typography>
        <div style={{ height: '300px' }}>
          {error && <Typography color="error">{error}</Typography>}
          {!error && !chartData && <Typography>Loading chart...</Typography>}
          {!error && chartData && <Bubble options={options} data={chartData} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapCard;