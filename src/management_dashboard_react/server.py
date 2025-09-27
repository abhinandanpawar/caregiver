from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import uvicorn

# --- Pydantic Models for API Responses ---
class KPISnapshot(BaseModel):
    overall_score: int = Field(..., example=82)
    departments_at_risk: int = Field(..., example=2)
    positive_trend: str = Field(..., example="+3%")

class DepartmentWellness(BaseModel):
    name: str = Field(..., example="Engineering")
    score: int = Field(..., example=88)
    headcount: int = Field(..., example=52)

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

@app.get("/")
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Management Dashboard API is running."}

if __name__ == "__main__":
    print("Starting Management Dashboard API server...")
    print("Access the API docs at http://127.0.0.1:8001/docs")
    uvicorn.run(app, host="127.0.0.1", port=8001)