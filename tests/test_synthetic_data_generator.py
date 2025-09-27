import unittest
import os
import sys
import pandas as pd

# Add the src directory to the Python path to import the module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.data_training.synthetic_data_generator import generate_synthetic_data, save_to_csv, DEPARTMENTS, WELLNESS_PROFILES

class TestSyntheticDataGenerator(unittest.TestCase):

    def setUp(self):
        """Set up for the tests."""
        self.num_records = 100
        self.data = generate_synthetic_data(self.num_records)
        self.test_filename = "test_synthetic_data.csv"

    def tearDown(self):
        """Clean up after tests."""
        if os.path.exists(self.test_filename):
            os.remove(self.test_filename)

    def test_generate_synthetic_data_returns_list(self):
        """Test that the function returns a list."""
        self.assertIsInstance(self.data, list)

    def test_generate_synthetic_data_record_count(self):
        """Test that the number of generated records is correct."""
        self.assertEqual(len(self.data), self.num_records)

    def test_record_structure_and_keys(self):
        """Test that each record is a dictionary with the correct keys."""
        required_keys = [
            "focus_session_length_minutes",
            "break_frequency_per_hour",
            "after_hours_activity_minutes",
            "communication_sentiment_score",
            "department",
            "wellness_label"
        ]
        for record in self.data:
            self.assertIsInstance(record, dict)
            self.assertEqual(sorted(record.keys()), sorted(required_keys))

    def test_data_value_ranges(self):
        """Test that the generated data values are within logical ranges."""
        for record in self.data:
            self.assertGreaterEqual(record["focus_session_length_minutes"], 0)
            self.assertGreaterEqual(record["break_frequency_per_hour"], 0)
            self.assertGreaterEqual(record["after_hours_activity_minutes"], 0)
            self.assertTrue(0 <= record["communication_sentiment_score"] <= 1)
            self.assertIn(record["department"], DEPARTMENTS)
            self.assertIn(record["wellness_label"], WELLNESS_PROFILES.keys())

    def test_save_to_csv(self):
        """Test saving the generated data to a CSV file."""
        save_to_csv(self.data, self.test_filename)

        # Check if the file was created
        self.assertTrue(os.path.exists(self.test_filename))

        # Check if the file has the correct number of rows + header
        df = pd.read_csv(self.test_filename)
        self.assertEqual(len(df), self.num_records)

        # Check for the header
        self.assertEqual(list(df.columns), list(self.data[0].keys()))

if __name__ == '__main__':
    unittest.main()