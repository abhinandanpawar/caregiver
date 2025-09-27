import React, { useState, useEffect } from 'react';
import BubbleChart from './BubbleChart.jsx';

const API_BASE_URL = 'http://localhost:8001';

const PALETTE = [
    'rgba(74, 144, 164, 0.7)',   // --secondary-color
    'rgba(255, 159, 64, 0.7)',   // Orange
    'rgba(255, 99, 132, 0.7)',    // Red
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(153, 102, 255, 0.7)',  // Purple
    'rgba(255, 206, 86, 0.7)',   // Yellow
];

function HeatmapCard() {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/dashboard/heatmap`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for heatmap data');
                }
                return response.json();
            })
            .then(data => {
                const datasets = data.map((dept, index) => ({
                    label: dept.label,
                    data: [{
                        x: dept.x, // Burnout Risk
                        y: dept.y, // Focus Score
                        r: dept.r / 2 // Scale radius for better visualization
                    }],
                    backgroundColor: PALETTE[index % PALETTE.length],
                }));

                setChartData({
                    datasets: datasets
                });
            })
            .catch(error => {
                console.error('Error fetching heatmap data:', error);
                setError('Could not load heatmap data.');
            });
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        if (label) {
                            return `${label}: (Burnout: ${context.parsed.x}, Focus: ${context.parsed.y}, Headcount: ${context.parsed.r * 2})`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Burnout Risk Score'
                },
                min: 0,
                max: 100
            },
            y: {
                title: {
                    display: true,
                    text: 'Focus Score'
                },
                min: 40,
                max: 100
            }
        }
    };

    return (
        <div className="card half-width">
            <h2>Department Wellness Heatmap</h2>
            <div className="chart-container">
                {error && <p className="error-message">{error}</p>}
                {!error && !chartData && <p>Loading chart...</p>}
                {!error && chartData && <BubbleChart data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
}

export default HeatmapCard;