import React, { useState, useEffect } from 'react';
import LineChart from './LineChart.jsx';

const API_BASE_URL = 'http://localhost:8001';

function TrendsCard() {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/dashboard/trends`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok for trends data');
                }
                return response.json();
            })
            .then(data => {
                const labels = data.map(d => new Date(d.date).toLocaleDateString());
                const scores = data.map(d => d.score);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Overall Wellness Score',
                        data: scores,
                        fill: true,
                        backgroundColor: 'rgba(74, 144, 164, 0.2)', // Use theme color
                        borderColor: 'rgb(74, 144, 164)',      // Use theme color
                        tension: 0.4
                    }]
                });
            })
            .catch(error => {
                console.error('Error fetching trends data:', error);
                setError('Could not load trends data.');
            });
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 60,
                max: 100,
                title: {
                    display: true,
                    text: 'Wellness Score'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                }
            }
        }
    };

    return (
        <div className="card half-width">
            <h2>Wellness Trends (30 Days)</h2>
            <div className="chart-container">
                {error && <p className="error-message">{error}</p>}
                {!error && !chartData && <p>Loading chart...</p>}
                {!error && chartData && <LineChart data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
}

export default TrendsCard;