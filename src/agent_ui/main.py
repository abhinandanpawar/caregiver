import os
from bottle import route, run, template, static_file

# --- Configuration ---
HOST = 'localhost'
PORT = 8080
STATIC_PATH = os.path.join(os.path.dirname(__file__), 'static')
VIEWS_PATH = os.path.join(os.path.dirname(__file__), 'views')

# --- Static File Server ---
@route('/static/<filepath:path>')
def server_static(filepath):
    """Serves static files from the 'static' directory."""
    return static_file(filepath, root=STATIC_PATH)

# --- Routes ---
@route('/')
def index():
    """Serves the main dashboard page."""
    # Placeholder data for the template
    # In a real application, this data would come from the agent's core logic.
    dashboard_data = {
        'wellness_score': 75,
        'focus_today': "3h 45m",
        'breaks_today': 4
    }
    return template(os.path.join(VIEWS_PATH, 'dashboard.tpl'), data=dashboard_data)

@route('/data-transparency')
def data_transparency():
    """Serves the data transparency page."""
    transparency_info = {
        "data_collected": [
            "Active application window title",
            "CPU and memory usage",
            "Keystroke and mouse movement frequency (not content)",
            "Sentiment from work-related communications (e.g., Slack, Teams)"
        ],
        "how_insights_are_generated": "Our AI model analyzes patterns in the collected data to identify trends related to focus, burnout, and stress. For example, a decrease in focus session length combined with increased after-hours activity might indicate a risk of burnout. Your data is always anonymized before being sent to the central hub.",
        "data_retention": "All raw data is stored locally on your machine and deleted after 72 hours. Anonymized, aggregated data is stored on the central server for a maximum of 90 days."
    }
    return template(os.path.join(VIEWS_PATH, 'transparency.tpl'), info=transparency_info)

# --- Main Execution ---
if __name__ == '__main__':
    print("Starting the Employee Wellness Dashboard...")
    print("Access the dashboard at http://{}:{}".format(HOST, PORT))
    print("Press Ctrl+C to exit.")
    run(host=HOST, port=PORT, debug=True)