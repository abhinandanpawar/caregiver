<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>Settings</h1>
            <nav>
                <a href="/">Dashboard</a>
                <a href="/kanban">Kanban Board</a>
                <a href="/goals">My Goals</a>
                <a href="/data-transparency">Data Transparency</a>
                <a href="/settings" class="active">Settings</a>
            </nav>
        </header>

        <main>
            <div class="card settings-card">
                <h2>Configuration</h2>
                % if defined('message') and message:
                <div class="success-message">{{ message }}</div>
                % end
                <form action="/settings" method="post">
                    <div class="form-group">
                        <label for="data-collection">Data Collection</label>
                        <select id="data-collection" name="data_collection">
                            <option value="enabled" {{'selected' if settings.get('data_collection') == 'enabled' else ''}}>Enabled</option>
                            <option value="disabled" {{'selected' if settings.get('data_collection') == 'disabled' else ''}}>Disabled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="notification-level">Notification Level</label>
                        <select id="notification-level" name="notification_level">
                            <option value="all" {{'selected' if settings.get('notification_level') == 'all' else ''}}>All</option>
                            <option value="important" {{'selected' if settings.get('notification_level') == 'important' else ''}}>Important Only</option>
                            <option value="none" {{'selected' if settings.get('notification_level') == 'none' else ''}}>None</option>
                        </select>
                    </div>
                    <button type="submit">Save Settings</button>
                </form>
            </div>
        </main>
    </div>

</body>
</html>