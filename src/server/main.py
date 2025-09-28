import pickle
import json
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict

# --- Global objects to hold the model and other artifacts ---
ARTIFACTS = {}

# --- Pydantic Models ---
class PredictionInput(BaseModel):
    """Defines the structure for a single prediction request."""
    focus_session_length_minutes: float
    break_frequency_per_hour: float
    after_hours_activity_minutes: float
    communication_sentiment_score: float
    department: str

class Resource(BaseModel):
    """Defines the structure for a single wellness resource."""
    title: str
    description: str
    link: str

class PredictionOutput(BaseModel):
    """Defines the structure for the enhanced prediction response."""
    wellness_label: str
    recommended_resources: List[Resource]

# --- FastAPI Application ---
app = FastAPI(
    title="Employee Wellbeing Analytics Hub",
    description="A server for analyzing employee wellness data and providing personalized resources.",
    version="1.2.0"
)

# --- Startup Event Handler ---
@app.on_event("startup")
def load_artifacts():
    """Load the model, transformers, and resource library into memory."""
    print("Loading artifacts...")
    try:
        # Load ML model and transformers
        with open("models/wellness_model.pkl", "rb") as f:
            ARTIFACTS['model'] = pickle.load(f)
        with open("models/scaler.pkl", "rb") as f:
            ARTIFACTS['scaler'] = pickle.load(f)
        with open("models/department_encoder.pkl", "rb") as f:
            ARTIFACTS['department_encoder'] = pickle.load(f)
        with open("models/label_encoder.pkl", "rb") as f:
            ARTIFACTS['label_encoder'] = pickle.load(f)

        # Load the resource library
        with open("src/server/resource_library.json", "r") as f:
            ARTIFACTS['resource_library'] = json.load(f)

        print("Artifacts loaded successfully.")
    except FileNotFoundError as e:
        print(f"Error loading artifacts: {e}")
        raise RuntimeError("Could not load all required artifacts. Ensure training has been run and resource_library.json exists.")

# --- API Endpoints ---
@app.get("/")
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Analytics Hub is running."}

@app.post("/predict", response_model=PredictionOutput)
def predict_wellness(input_data: PredictionInput):
    """
    Predicts the wellness level and returns relevant resources.
    """
    required_artifacts = ['model', 'scaler', 'department_encoder', 'label_encoder', 'resource_library']
    if not all(k in ARTIFACTS for k in required_artifacts):
        raise HTTPException(status_code=503, detail="Artifacts are not loaded. The service is unavailable.")

    try:
        # 1. Convert input to a DataFrame and preprocess
        input_df = pd.DataFrame([input_data.dict()])
        input_df['department'] = ARTIFACTS['department_encoder'].transform(input_df['department'])
        numerical_cols = input_df.columns.drop('department')
        input_df[numerical_cols] = ARTIFACTS['scaler'].transform(input_df[numerical_cols])

        training_cols = ['focus_session_length_minutes', 'break_frequency_per_hour',
                         'after_hours_activity_minutes', 'communication_sentiment_score', 'department']
        input_df = input_df[training_cols]

        # 2. Make a prediction
        prediction_encoded = ARTIFACTS['model'].predict(input_df)
        prediction_label = ARTIFACTS['label_encoder'].inverse_transform(prediction_encoded)[0]

        # 3. Look up recommended resources
        resources = ARTIFACTS['resource_library'].get(prediction_label, [])

        return {
            "wellness_label": prediction_label,
            "recommended_resources": resources
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred during prediction: {e}")

# --- To run this server locally ---
# uvicorn src.server.main:app --reload
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Access the API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)