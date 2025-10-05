import pickle
import json
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# --- CORS Middleware ---
# Allow requests from the React frontend
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # The default for Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# --- Mock Dashboard Data Models ---
class KPI(BaseModel):
    title: str
    value: str
    change: str

class TrendDataPoint(BaseModel):
    date: str
    score: float

class HeatmapDataPoint(BaseModel):
    department: str
    wellness_score: float
    burnout_risk: float

class DepartmentData(BaseModel):
    name: str
    wellness_score: float
    trend: str

# --- Mock API Endpoints for Dashboard ---
@app.get("/api/v1/dashboard/kpis", response_model=List[KPI])
def get_kpis():
    """Returns mock KPI data for the dashboard."""
    return [
        {"title": "Overall Wellness Score", "value": "78/100", "change": "+5%"},
        {"title": "Departments at Risk", "value": "3", "change": "-1"},
        {"title": "Positive Trend", "value": "82%", "change": "+2%"},
    ]

@app.get("/api/v1/dashboard/trends", response_model=List[TrendDataPoint])
def get_trends():
    """Returns mock wellness trend data for the last 30 days."""
    return [
        {"date": "2023-09-01", "score": 72}, {"date": "2023-09-08", "score": 75},
        {"date": "2023-09-15", "score": 74}, {"date": "2023-09-22", "score": 78},
        {"date": "2023-09-29", "score": 80},
    ]

@app.get("/api/v1/dashboard/heatmap", response_model=List[HeatmapDataPoint])
def get_heatmap_data():
    """Returns mock heatmap data for department wellness vs. burnout."""
    return [
        {"department": "Engineering", "wellness_score": 85, "burnout_risk": 15},
        {"department": "Marketing", "wellness_score": 72, "burnout_risk": 28},
        {"department": "Sales", "wellness_score": 68, "burnout_risk": 32},
        {"department": "HR", "wellness_score": 90, "burnout_risk": 10},
    ]

@app.get("/api/v1/dashboard/departments", response_model=List[DepartmentData])
def get_department_data():
    """Returns a mock list of departments and their wellness scores."""
    return [
        {"name": "Engineering", "wellness_score": 85, "trend": "up"},
        {"name": "Marketing", "wellness_score": 72, "trend": "down"},
        {"name": "Sales", "wellness_score": 68, "trend": "down"},
        {"name": "HR", "wellness_score": 90, "trend": "up"},
        {"name": "Customer Support", "wellness_score": 78, "trend": "stable"},
    ]

# --- To run this server locally ---
# uvicorn src.server.main:app --reload
if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("Access the API docs at http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000)