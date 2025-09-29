<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Goals</title>
    <link rel="stylesheet" href="/static/css/styles.css">
    <link rel="stylesheet" href="/static/css/goals.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>My Goals</h1>
            <nav>
                <a href="/">Dashboard</a>
                <a href="/kanban">Kanban Board</a>
                <a href="/goals">My Goals</a>
                <a href="/data-transparency">Data Transparency</a>
                <a href="/settings">Settings</a>
            </nav>
        </header>

        <main>
            <div class="card">
                <h2>Add a New Goal</h2>
                <form id="add-goal-form">
                    <div class="form-group">
                        <label for="goal-content">Goal:</label>
                        <input type="text" id="goal-content" placeholder="e.g., Take a 15-minute walk today" required>
                    </div>
                    <button type="submit" class="btn">Add Goal</button>
                </form>
            </div>

            <div class="card">
                <h2>Active Goals</h2>
                <ul id="active-goals-list" class="goals-list">
                    <!-- Goals will be dynamically inserted here -->
                </ul>
            </div>

            <div class="card">
                <h2>Completed Goals</h2>
                <ul id="completed-goals-list" class="goals-list">
                    <!-- Goals will be dynamically inserted here -->
                </ul>
            </div>
        </main>
    </div>

    <script src="/static/js/goals.js"></script>
</body>
</html>