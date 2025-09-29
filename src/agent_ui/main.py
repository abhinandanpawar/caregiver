import os
import json
import time
from bottle import route, run, template, static_file, request, TEMPLATE_PATH, response

# --- Configuration ---
HOST = 'localhost'
PORT = 8080
STATIC_PATH = os.path.join(os.path.dirname(__file__), 'static')
VIEWS_PATH = os.path.join(os.path.dirname(__file__), 'views')
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
SETTINGS_FILE = os.path.join(DATA_PATH, 'settings.json')
KANBAN_DATA_FILE = os.path.join(DATA_PATH, 'kanban_board.json')
GOALS_DATA_FILE = os.path.join(DATA_PATH, 'goals.json')

# Add the views path to Bottle's template search path
TEMPLATE_PATH.insert(0, VIEWS_PATH)

# --- Data Helper Functions ---
def load_json_data(file_path, default_data):
    """Generic function to load data from a JSON file."""
    if not os.path.exists(file_path):
        return default_data
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError):
        return default_data

def save_json_data(file_path, data):
    """Generic function to save data to a JSON file."""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
    except IOError as e:
        print(f"Error saving data to {file_path}: {e}")

# --- Static File Server ---
@route('/static/<filepath:path>')
def server_static(filepath):
    """Serves static files from the 'static' directory."""
    return static_file(filepath, root=STATIC_PATH)

# --- Page Routes ---
@route('/')
def index():
    return template('dashboard.tpl', data={})

@route('/data-transparency')
def data_transparency():
    return template('transparency.tpl', info={})

@route('/settings', method=['GET', 'POST'])
def settings_route():
    if request.method == 'POST':
        settings = {
            'data_collection': request.forms.get('data_collection'),
            'notification_level': request.forms.get('notification_level')
        }
        save_json_data(SETTINGS_FILE, settings)
        return template('settings.tpl', settings=settings, message="Settings saved successfully!")
    settings = load_json_data(SETTINGS_FILE, {'data_collection': 'enabled', 'notification_level': 'all'})
    return template('settings.tpl', settings=settings, message=None)

@route('/kanban')
def kanban_page():
    return template('kanban.tpl')

@route('/goals')
def goals_page():
    """Serves the Goals page."""
    return template('goals.tpl')

# --- API Routes ---
@route('/api/board', method='GET')
def get_board_data():
    response.content_type = 'application/json'
    return load_json_data(KANBAN_DATA_FILE, {"columns": []})

@route('/api/board', method='POST')
def save_board_data():
    data = request.json
    if data is None:
        response.status = 400
        return {"status": "error", "message": "Invalid JSON payload."}
    save_json_data(KANBAN_DATA_FILE, data)
    return {"status": "success"}

# --- Goals API ---
@route('/api/goals', method='GET')
def get_goals():
    """API endpoint to fetch all goals."""
    response.content_type = 'application/json'
    return load_json_data(GOALS_DATA_FILE, {"goals": []})

@route('/api/goals', method='POST')
def add_goal():
    """API endpoint to add a new goal."""
    data = request.json
    if not data or 'content' not in data:
        response.status = 400
        return {"status": "error", "message": "Payload must include 'content'."}

    goals_data = load_json_data(GOALS_DATA_FILE, {"goals": []})
    new_goal = {
        "id": f"goal-{int(time.time())}",
        "content": data['content'],
        "status": "active"
    }
    goals_data['goals'].append(new_goal)
    save_json_data(GOALS_DATA_FILE, goals_data)
    response.status = 201
    return new_goal

@route('/api/goals/<goal_id>', method='PUT')
def update_goal_status(goal_id):
    """API endpoint to update a goal's status."""
    data = request.json
    if not data or 'status' not in data:
        response.status = 400
        return {"status": "error", "message": "Payload must include 'status'."}

    goals_data = load_json_data(GOALS_DATA_FILE, {"goals": []})
    goal_found = False
    for goal in goals_data['goals']:
        if goal['id'] == goal_id:
            goal['status'] = data['status']
            goal_found = True
            break

    if not goal_found:
        response.status = 404
        return {"status": "error", "message": "Goal not found."}

    save_json_data(GOALS_DATA_FILE, goals_data)
    return {"status": "success"}

@route('/api/goals/<goal_id>', method='DELETE')
def delete_goal(goal_id):
    """API endpoint to delete a goal."""
    goals_data = load_json_data(GOALS_DATA_FILE, {"goals": []})
    initial_len = len(goals_data['goals'])
    goals_data['goals'] = [g for g in goals_data['goals'] if g['id'] != goal_id]

    if len(goals_data['goals']) == initial_len:
        response.status = 404
        return {"status": "error", "message": "Goal not found."}

    save_json_data(GOALS_DATA_FILE, goals_data)
    return {"status": "success"}

# --- Main Execution ---
if __name__ == '__main__':
    print(f"Starting the Employee Wellness Dashboard at http://{HOST}:{PORT}")
    run(host=HOST, port=PORT, debug=True)