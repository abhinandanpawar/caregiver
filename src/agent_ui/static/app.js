document.addEventListener('DOMContentLoaded', function () {
    // --- Wellness Score Circle ---
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        const score = scoreCircle.dataset.score;
        // Use a CSS custom property to animate the conic-gradient
        setTimeout(() => {
            scoreCircle.style.setProperty('--score', `${score}%`);
        }, 100);
    }

    // --- Wellness Trend Chart ---
    const wellnessChartCanvas = document.getElementById('wellnessTrendChart');
    if (wellnessChartCanvas) {
        const ctx = wellnessChartCanvas.getContext('2d');

        // Placeholder data for the chart
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Your 7-Day Wellness Trend',
                data: [65, 59, 80, 81, 56, 55, 75], // Sample data
                fill: true,
                backgroundColor: 'rgba(74, 144, 164, 0.2)',
                borderColor: 'rgba(74, 144, 164, 1)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(74, 144, 164, 1)',
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide the legend for a cleaner look
                    }
                }
            }
        });
    }
});