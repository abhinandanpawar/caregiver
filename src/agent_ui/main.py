import os
import json
import time
from bottle import route, run, static_file, request, response

# --- Configuration ---
HOST = 'localhost'
PORT = 8080

# Define paths for the new React frontend
# Assumes the React app is built into the 'frontend/dist' directory
FRONTEND_PATH = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')
ASSETS_PATH = os.path.join(FRONTEND_PATH, 'assets')

# Define paths for data files
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
SETTINGS_FILE = os.path.join(DATA_PATH, 'settings.json')
KANBAN_DATA_FILE = os.path.join(DATA_PATH, 'kanban_board.json')
GOALS_DATA_FILE = os.path.join(DATA_PATH, 'goals.json')


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

# --- Static File Server for React App ---
# Serves the static assets (JS, CSS, images) from the 'dist/assets' directory
@route('/assets/<filepath:path>')
def server_assets(filepath):
    return static_file(filepath, root=ASSETS_PATH)

# --- API Routes ---
# These routes provide the backend functionality for the frontend application.

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

# --- SPA Catch-all Route ---
# This route serves the main index.html for any non-API, non-asset request.
# It allows React Router to handle the routing on the client side.
@route('/')
@route('/<path:path>')
def serve_react_app(path=None):
    return static_file('index.html', root=FRONTEND_PATH)

# --- Main Execution ---
if __name__ == '__main__':
    print(f"Starting the WAVES backend server at http://{HOST}:{PORT}")
    print(f"For development, run the React dev server from 'src/agent_ui/frontend' (npm run dev).")
    print(f"For production, build the React app and this server will serve the static files.")
    run(host=HOST, port=PORT, debug=True)