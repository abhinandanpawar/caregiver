import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List

# --- Global objects to hold the model and transformers ---
MODEL_OBJECTS = {}

# --- Pydantic Models ---
class PredictionInput(BaseModel):
    """Defines the structure for a single prediction request."""
    focus_session_length_minutes: float
    break_frequency_per_hour: float
    after_hours_activity_minutes: float
    communication_sentiment_score: float
    department: str

class PredictionOutput(BaseModel):
    """Defines the structure for a prediction response."""
    wellness_label: str

# --- FastAPI Application ---
app = FastAPI(
    title="Employee Wellbeing Analytics Hub",
    description="A server for analyzing employee wellness data using a RandomForest model.",
    version="1.1.0"
)

# --- Startup Event Handler ---
@app.on_event("startup")
def load_model_artifacts():
    """Load the model, scaler, and encoders into memory when the app starts."""
    print("Loading model artifacts...")
    try:
        with open("models/wellness_model.pkl", "rb") as f:
            MODEL_OBJECTS['model'] = pickle.load(f)
        with open("models/scaler.pkl", "rb") as f:
            MODEL_OBJECTS['scaler'] = pickle.load(f)
        with open("models/department_encoder.pkl", "rb") as f:
            MODEL_OBJECTS['department_encoder'] = pickle.load(f)
        with open("models/label_encoder.pkl", "rb") as f:
            MODEL_OBJECTS['label_encoder'] = pickle.load(f)
        print("Artifacts loaded successfully.")
    except FileNotFoundError as e:
        print(f"Error loading artifacts: {e}")
        # In a real app, you might want to prevent startup if artifacts are missing.
        raise RuntimeError("Could not load model artifacts. Ensure training has been run.")

# --- API Endpoints ---
@app.get("/")
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Analytics Hub is running."}

@app.post("/predict", response_model=PredictionOutput)
def predict_wellness(input_data: PredictionInput):
    """
    Predicts the wellness level based on input behavioral data.
    """
    if not all(k in MODEL_OBJECTS for k in ['model', 'scaler', 'department_encoder', 'label_encoder']):
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded. The service is unavailable.")

    try:
        # 1. Convert input to a DataFrame
        input_df = pd.DataFrame([input_data.dict()])

        # 2. Preprocess the data
        # Encode department
        department_encoded = MODEL_OBJECTS['department_encoder'].transform(input_df['department'])
        input_df['department'] = department_encoded

        # Scale numerical features
        numerical_cols = input_df.columns.drop('department')
        input_df[numerical_cols] = MODEL_OBJECTS['scaler'].transform(input_df[numerical_cols])

        # Reorder columns to match training order if necessary
        # This is crucial if the DataFrame's column order is not guaranteed
        training_cols = ['focus_session_length_minutes', 'break_frequency_per_hour',
                         'after_hours_activity_minutes', 'communication_sentiment_score', 'department']
        input_df = input_df[training_cols]


        # 3. Make a prediction
        prediction_encoded = MODEL_OBJECTS['model'].predict(input_df)

        # 4. Decode the prediction
        prediction_label = MODEL_OBJECTS['label_encoder'].inverse_transform(prediction_encoded)

        return {"wellness_label": prediction_label[0]}

    except Exception as e:
        # Catch potential errors during transformation or prediction
        raise HTTPException(status_code=400, detail=f"An error occurred during prediction: {e}")

# --- To run this server locally ---
# uvicorn src.server.main:app --reload
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Access the API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)