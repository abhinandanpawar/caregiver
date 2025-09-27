<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Transparency</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>Data Transparency & Privacy</h1>
            <nav>
                <a href="/">Dashboard</a>
                <a href="/data-transparency" class="active">Data Transparency</a>
                <a href="/settings">Settings</a>
            </nav>
        </header>

        <main>
            <div class="card transparency-card">
                <h2>Our Commitment to Your Privacy</h2>
                <p>We believe in radical transparency. This page explains exactly what data is collected, how it's used, and the safeguards in place to protect your privacy. You are always in control.</p>
            </div>

            <div class="card transparency-card">
                <h3>What Data Is Collected?</h3>
                <p>The agent only collects metadata related to your work patterns. It **never** records screen content, keystrokes, or personal information.</p>
                <ul>
                    % for item in info.get('data_collected', []):
                        <li>{{item}}</li>
                    % end
                </ul>
            </div>

            <div class="card transparency-card">
                <h3>How Are Insights Generated?</h3>
                <p>{{info.get('how_insights_are_generated', 'Information not available.')}}</p>
            </div>

            <div class="card transparency-card">
                <h3>Data Retention Policy</h3>
                <p>{{info.get('data_retention', 'Information not available.')}}</p>
            </div>
        </main>
    </div>

</body>
</html>