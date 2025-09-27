import unittest
import os
import sys
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Add the src directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.data_training.preprocess_data import preprocess_data

class TestPreprocessData(unittest.TestCase):

    def setUp(self):
        """Set up for the tests by creating a dummy CSV file."""
        self.input_file = "test_input_data.csv"
        self.train_file = "test_train_data.csv"
        self.val_file = "test_val_data.csv"

        # Create a dummy dataframe
        data = {
            'focus_session_length_minutes': [50, 20, 60, 30, 25, 35],
            'break_frequency_per_hour': [1, 0.2, 1.5, 0.5, 0.3, 0.6],
            'after_hours_activity_minutes': [10, 100, 5, 50, 90, 60],
            'communication_sentiment_score': [0.8, 0.3, 0.9, 0.5, 0.4, 0.6],
            'department': ['engineering', 'sales', 'engineering', 'hr', 'sales', 'hr'],
            'wellness_label': ['Healthy', 'Burnout', 'Healthy', 'Stressed', 'Burnout', 'Stressed']
        }
        df = pd.DataFrame(data)
        df.to_csv(self.input_file, index=False)

    def tearDown(self):
        """Clean up created files after tests."""
        for f in [self.input_file, self.train_file, self.val_file]:
            if os.path.exists(f):
                os.remove(f)

    def test_preprocess_data_creates_output_files(self):
        """Test that the preprocessing function creates the train and validation files."""
        preprocess_data(self.input_file, self.train_file, self.val_file, test_size=0.5)

        self.assertTrue(os.path.exists(self.train_file))
        self.assertTrue(os.path.exists(self.val_file))

    def test_output_file_shapes_and_content(self):
        """Test the shape and content of the output files."""
        preprocess_data(self.input_file, self.train_file, self.val_file, test_size=0.5, random_state=42)

        train_df = pd.read_csv(self.train_file)
        val_df = pd.read_csv(self.val_file)

        # With 6 records and a 50/50 split, we expect 3 records in each file
        self.assertEqual(len(train_df), 3)
        self.assertEqual(len(val_df), 3)

        # Check columns (features + target)
        expected_cols = [
            'focus_session_length_minutes',
            'break_frequency_per_hour',
            'after_hours_activity_minutes',
            'communication_sentiment_score',
            'department',
            'wellness_label'
        ]
        self.assertEqual(sorted(list(train_df.columns)), sorted(expected_cols))
        self.assertEqual(sorted(list(val_df.columns)), sorted(expected_cols))

    def test_label_encoding(self):
        """Test that categorical columns are properly encoded."""
        preprocess_data(self.input_file, self.train_file, self.val_file, test_size=0.5)

        train_df = pd.read_csv(self.train_file)
        val_df = pd.read_csv(self.val_file)

        # Check that 'department' and 'wellness_label' are numeric
        self.assertTrue(pd.api.types.is_numeric_dtype(train_df['department']))
        self.assertTrue(pd.api.types.is_numeric_dtype(train_df['wellness_label']))
        self.assertTrue(pd.api.types.is_numeric_dtype(val_df['department']))
        self.assertTrue(pd.api.types.is_numeric_dtype(val_df['wellness_label']))

if __name__ == '__main__':
    unittest.main()