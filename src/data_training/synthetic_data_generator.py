import csv
import random
import numpy as np

# Define the wellness profiles with statistical parameters for each metric.
# These profiles represent different employee wellbeing states.
WELLNESS_PROFILES = {
    "Healthy": {
        "focus_session_length_minutes": {"mean": 50, "std": 10},
        "break_frequency_per_hour": {"mean": 1.2, "std": 0.3},
        "after_hours_activity_minutes": {"mean": 15, "std": 10},
        "communication_sentiment_score": {"mean": 0.8, "std": 0.1},
    },
    "Stressed": {
        "focus_session_length_minutes": {"mean": 35, "std": 15},
        "break_frequency_per_hour": {"mean": 0.5, "std": 0.2},
        "after_hours_activity_minutes": {"mean": 60, "std": 25},
        "communication_sentiment_score": {"mean": 0.5, "std": 0.15},
    },
    "Burnout": {
        "focus_session_length_minutes": {"mean": 20, "std": 8},
        "break_frequency_per_hour": {"mean": 0.2, "std": 0.1},
        "after_hours_activity_minutes": {"mean": 90, "std": 40},
        "communication_sentiment_score": {"mean": 0.3, "std": 0.1},
    },
}

# List of departments for generating more varied data.
DEPARTMENTS = ["engineering", "sales", "marketing", "hr", "product"]

def generate_synthetic_data(num_records):
    """
    Generates a list of synthetic employee wellness records.

    Each record is a dictionary containing randomly generated metrics based on
    pre-defined wellness profiles.

    Args:
        num_records (int): The number of data records to generate.

    Returns:
        list: A list of dictionaries, where each dictionary is a data record.
    """
    data = []
    for _ in range(num_records):
        profile_name = random.choice(list(WELLNESS_PROFILES.keys()))
        profile = WELLNESS_PROFILES[profile_name]

        # Helper to generate a value and ensure it stays within a logical range
        def get_value(param, min_val=0):
            val = np.random.normal(profile[param]["mean"], profile[param]["std"])
            return max(min_val, val)

        record = {
            "focus_session_length_minutes": round(get_value("focus_session_length_minutes"), 1),
            "break_frequency_per_hour": round(get_value("break_frequency_per_hour"), 2),
            "after_hours_activity_minutes": round(get_value("after_hours_activity_minutes"), 1),
            "communication_sentiment_score": round(np.clip(get_value("communication_sentiment_score", -1), 0, 1), 3),
            "department": random.choice(DEPARTMENTS),
            "wellness_label": profile_name,
        }
        data.append(record)
    return data

def save_to_csv(data, filename):
    """
    Saves the generated data to a CSV file.

    Args:
        data (list): A list of data record dictionaries.
        filename (str): The path to the output CSV file.
    """
    if not data:
        print("No data to save.")
        return

    fieldnames = data[0].keys()
    with open(filename, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print("Successfully generated and saved {} records to {}".format(len(data), filename))

if __name__ == "__main__":
    NUM_RECORDS_TO_GENERATE = 5000
    OUTPUT_FILENAME = "synthetic_wellness_data.csv"

    synthetic_data = generate_synthetic_data(NUM_RECORDS_TO_GENERATE)
    save_to_csv(synthetic_data, OUTPUT_FILENAME)