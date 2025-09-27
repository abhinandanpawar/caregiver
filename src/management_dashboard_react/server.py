from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import uvicorn
from datetime import date, timedelta
import random

# --- Pydantic Models for API Responses ---
class KPISnapshot(BaseModel):
    overall_score: int = Field(..., example=82)
    departments_at_risk: int = Field(..., example=2)
    positive_trend: str = Field(..., example="+3%")

class DepartmentWellness(BaseModel):
    name: str = Field(..., example="Engineering")
    score: int = Field(..., example=88)
    headcount: int = Field(..., example=52)

class HeatmapDataPoint(BaseModel):
    x: int = Field(..., description="Burnout Risk Score (0-100)")
    y: int = Field(..., description="Focus Score (0-100)")
    r: int = Field(..., description="Department Headcount")
    label: str = Field(..., description="Department Name")

class TrendsDataPoint(BaseModel):
    date: date
    score: int

# --- FastAPI Application ---
app = FastAPI(
    title="Management Dashboard API",
    description="Serves data to the management wellness dashboard.",
    version="1.0.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/api/v1/dashboard/kpis", response_model=KPISnapshot)
async def get_kpi_snapshot():
    """Provides a high-level snapshot of organization-wide wellness metrics."""
    return KPISnapshot(
        overall_score=82,
        departments_at_risk=2,
        positive_trend="+3%"
    )

@app.get("/api/v1/dashboard/departments", response_model=List[DepartmentWellness])
async def get_department_wellness():
    """Returns a list of departments and their current wellness scores."""
    return [
        DepartmentWellness(name="Engineering", score=88, headcount=52),
        DepartmentWellness(name="Sales", score=75, headcount=31),
        DepartmentWellness(name="Marketing", score=81, headcount=18),
        DepartmentWellness(name="Human Resources", score=92, headcount=12),
        DepartmentWellness(name="Product", score=79, headcount=25),
        DepartmentWellness(name="Customer Support", score=72, headcount=45),
    ]

@app.get("/api/v1/dashboard/heatmap", response_model=List[HeatmapDataPoint])
async def get_heatmap_data():
    """Generates random data for the department wellness heatmap."""
    departments = ["Engineering", "Sales", "Marketing", "HR", "Product", "Support"]
    data = []
    for dept in departments:
        data.append(HeatmapDataPoint(
            x=random.randint(20, 80),  # Burnout risk
            y=random.randint(50, 95),  # Focus score
            r=random.randint(10, 50),   # Headcount
            label=dept
        ))
    return data

@app.get("/api/v1/dashboard/trends", response_model=List[TrendsDataPoint])
async def get_trends_data():
    """Generates random time-series data for the wellness trends chart."""
    data = []
    today = date.today()
    current_score = 80
    for i in range(30):  # Last 30 days
        d = today - timedelta(days=i)
        # Add some random fluctuation
        current_score += random.randint(-2, 2)
        current_score = max(70, min(90, current_score)) # Clamp between 70-90
        data.append(TrendsDataPoint(date=d, score=current_score))
    return list(reversed(data)) # Return in chronological order

@app.get("/")
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Management Dashboard API is running."}

if __name__ == "__main__":
    print("Starting Management Dashboard API server...")
    print("Access the API docs at http://127.0.0.1:8001/docs")
    uvicorn.run(app, host="127.0.0.1", port=8001)