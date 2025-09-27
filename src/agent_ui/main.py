import os
import json
from bottle import route, run, template, static_file, request, TEMPLATE_PATH

# --- Configuration ---
HOST = 'localhost'
PORT = 8080
STATIC_PATH = os.path.join(os.path.dirname(__file__), 'static')
VIEWS_PATH = os.path.join(os.path.dirname(__file__), 'views')
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), 'settings.json')

# Add the views path to Bottle's template search path
TEMPLATE_PATH.insert(0, VIEWS_PATH)

# --- Settings Helpers ---
def load_settings():
    """Loads settings from settings.json, returns defaults if not found."""
    defaults = {
        'data_collection': 'enabled',
        'notification_level': 'all'
    }
    if not os.path.exists(SETTINGS_FILE):
        return defaults
    try:
        with open(SETTINGS_FILE, 'r') as f:
            settings = json.load(f)
            # Ensure all keys are present, in case the file is old
            defaults.update(settings)
            return defaults
    except (json.JSONDecodeError, IOError):
        return defaults

def save_settings(settings_data):
    """Saves settings to settings.json."""
    try:
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings_data, f, indent=4)
    except IOError as e:
        print(f"Error saving settings: {e}")

# --- Static File Server ---
@route('/static/<filepath:path>')
def server_static(filepath):
    """Serves static files from the 'static' directory."""
    return static_file(filepath, root=STATIC_PATH)

# --- Routes ---
@route('/')
def index():
    """Serves the main dashboard page."""
    dashboard_data = {
        'wellness_score': 75,
        'focus_today': "3h 45m",
        'breaks_today': 4
    }
    return template('dashboard.tpl', data=dashboard_data)

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
    return template('transparency.tpl', info=transparency_info)

@route('/settings', method=['GET', 'POST'])
def settings_route():
    """Serves the settings page and handles form submission."""
    message = None
    if request.method == 'POST':
        current_settings = load_settings()
        current_settings['data_collection'] = request.forms.get('data_collection')
        current_settings['notification_level'] = request.forms.get('notification_level')

        save_settings(current_settings)
        message = "Settings saved successfully!"

    current_settings = load_settings()
    return template('settings.tpl', settings=current_settings, message=message)

# --- Main Execution ---
if __name__ == '__main__':
    print("Starting the Employee Wellness Dashboard...")
    print("Access the dashboard at http://{}:{}".format(HOST, PORT))
    print("Press Ctrl+C to exit.")
    run(host=HOST, port=PORT, debug=True)