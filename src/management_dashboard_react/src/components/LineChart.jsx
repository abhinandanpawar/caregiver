import React, { useEffect, useRef } from 'react';

function LineChart({ data, options }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');

        // Destroy the previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart instance
        chartRef.current = new window.Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });

        // Cleanup function to destroy the chart on component unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options]); // Rerender chart if data or options change

    return <canvas ref={canvasRef}></canvas>;
}

export default LineChart;