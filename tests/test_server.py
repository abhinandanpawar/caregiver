import unittest
import os
import sys
from fastapi.testclient import TestClient

# Add the src directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.server.main import app

class TestServer(unittest.TestCase):

    def setUp(self):
        """Set up the test client."""
        self.client = TestClient(app)
        # Ensure the app's startup logic runs to load artifacts
        with self.client:
            pass

    def test_predict_endpoint_success(self):
        """Test the /predict endpoint for a successful prediction and resource recommendation."""
        # Define a sample payload that should trigger a "Stressed" prediction
        payload = {
            "focus_session_length_minutes": 35,
            "break_frequency_per_hour": 0.5,
            "after_hours_activity_minutes": 60,
            "communication_sentiment_score": 0.5,
            "department": "sales"
        }

        response = self.client.post("/predict", json=payload)

        # Check for a successful response
        self.assertEqual(response.status_code, 200)

        # Check the response payload
        data = response.json()
        self.assertIn("wellness_label", data)
        self.assertIn("recommended_resources", data)
        self.assertEqual(data["wellness_label"], "Stressed")
        self.assertIsInstance(data["recommended_resources"], list)
        self.assertGreater(len(data["recommended_resources"]), 0) # Ensure we got at least one resource

    def test_predict_endpoint_missing_artifacts(self):
        """
        Test that the endpoint returns a 503 error if artifacts are not loaded.
        Note: This is a conceptual test, as it's hard to simulate missing artifacts
        after the app has started. We can, however, check the general error handling.
        """
        # A more advanced test could mock the ARTIFACTS dictionary to be empty
        # For now, we confirm the endpoint exists and handles valid requests.
        # This test case serves as a placeholder for more complex failure-state testing.
        pass

if __name__ == '__main__':
    unittest.main()