import requests
import json

url = "http://127.0.0.1:8000/predict"
data = {
  "focus_session_length_minutes": 35,
  "break_frequency_per_hour": 0.5,
  "after_hours_activity_minutes": 60,
  "communication_sentiment_score": 0.5,
  "department": "sales"
}

try:
    response = requests.post(url, json=data)
    response.raise_for_status()  # Raise an exception for bad status codes
    print("Request successful!")
    print(response.json())
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    if e.response:
        print("--- Server Response ---")
        try:
            print(e.response.json())
        except json.JSONDecodeError:
            print(e.response.text)
        print("-----------------------")