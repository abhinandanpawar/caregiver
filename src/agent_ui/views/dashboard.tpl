<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personal Wellness Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>Your Personal Wellness Dashboard</h1>
            <nav>
                <a href="/" class="active">Dashboard</a>
                <a href="/kanban">Kanban Board</a>
                <a href="/goals">My Goals</a>
                <a href="/data-transparency">Data Transparency</a>
                <a href="/settings">Settings</a>
            </nav>
        </header>

        <main class="dashboard-grid">
            <div class="card wellness-score-card">
                <h2>Wellness Score</h2>
                <div class="score-circle" data-score="{{data.get('wellness_score', 0)}}">
                    <span class="score-number">{{data.get('wellness_score', 0)}}</span>
                </div>
                <p>A score based on your recent work patterns. Higher is better!</p>
            </div>

            <div class="card">
                <h2>Today's Activity</h2>
                <div class="activity-metrics">
                    <div class="metric">
                        <span class="metric-value">{{data.get('focus_today', 'N/A')}}</span>
                        <span class="metric-label">Focus Time</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">{{data.get('breaks_today', 'N/A')}}</span>
                        <span class="metric-label">Breaks Taken</span>
                    </div>
                </div>
            </div>

            <div class="card trends-card">
                <h2>Your 7-Day Wellness Trend</h2>
                <canvas id="wellnessTrendChart"></canvas>
            </div>

            <div class="card insights-card">
                <h2>Insights & Tips</h2>
                <p>Great focus sessions today! Remember to take short breaks to stay refreshed.</p>
                <p>Your after-hours activity has been low this week. Great job maintaining work-life balance!</p>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="/static/app.js"></script>
</body>
</html>