import unittest
import webtest
import json
import os
import bottle
from src.agent_ui import main as agent_ui_app

class TestIdUniqueness(unittest.TestCase):

    def setUp(self):
        # Ensure data files are clean before each test
        self.cleanup_data_files()
        self.app = webtest.TestApp(bottle.default_app())

    def tearDown(self):
        self.cleanup_data_files()

    def cleanup_data_files(self):
        """Removes the data files to ensure a clean state."""
        if os.path.exists(agent_ui_app.GOALS_DATA_FILE):
            os.remove(agent_ui_app.GOALS_DATA_FILE)
        if os.path.exists(agent_ui_app.MOOD_JOURNAL_FILE):
            os.remove(agent_ui_app.MOOD_JOURNAL_FILE)

    def test_add_goal_generates_unique_ids(self):
        """
        Verify that calling the /api/goals POST endpoint multiple times in
        succession creates goals with unique IDs.
        """
        num_requests = 5
        goal_ids = set()

        for i in range(num_requests):
            response = self.app.post_json('/api/goals', {'content': f'Test Goal {i}'})
            self.assertEqual(response.status_int, 201)
            goal_ids.add(response.json['id'])

        # Check that all generated IDs were unique
        self.assertEqual(len(goal_ids), num_requests)

        # Additionally, verify that the data file contains the correct number of goals
        with open(agent_ui_app.GOALS_DATA_FILE, 'r') as f:
            data = json.load(f)
            self.assertEqual(len(data['goals']), num_requests)

    def test_add_mood_entry_generates_unique_ids(self):
        """
        Verify that calling the /api/mood-journal POST endpoint multiple times
        in succession creates entries with unique IDs.
        """
        num_requests = 5
        entry_ids = set()

        for i in range(num_requests):
            response = self.app.post_json('/api/mood-journal', {
                'mood': 'happy',
                'notes': f'Test Note {i}'
            })
            self.assertEqual(response.status_int, 201)
            entry_ids.add(response.json['id'])

        # Check that all generated IDs were unique
        self.assertEqual(len(entry_ids), num_requests)

        # Additionally, verify that the data file contains the correct number of entries
        with open(agent_ui_app.MOOD_JOURNAL_FILE, 'r') as f:
            data = json.load(f)
            self.assertEqual(len(data['entries']), num_requests)

if __name__ == '__main__':
    unittest.main()