from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import uvicorn
from datetime import date, timedelta
import random
from enum import Enum

# --- RBAC and User Models ---
class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class User(BaseModel):
    username: str
    role: UserRole

class UserInDB(User):
    hashed_password: str

from fastapi.security import OAuth2PasswordRequestForm

# Mock user database
fake_users_db = {
    "admin": {
        "username": "admin",
        "hashed_password": "password_admin",
        "role": UserRole.ADMIN,
    },
    "employee1": {
        "username": "employee1",
        "hashed_password": "password_employee",
        "role": UserRole.EMPLOYEE,
    },
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def fake_decode_token(token: str):
    # This is a fake token decoder. In a real app, you'd use JWT.
    user = get_user(fake_users_db, token)
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user


# --- Pydantic Models for API Responses ---
class Token(BaseModel):
    access_token: str
    token_type: str

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

class Announcement(BaseModel):
    id: int
    title: str
    content: str
    date: date

# --- Pydantic Models for Feedback Forms ---
class Question(BaseModel):
    id: int
    text: str
    question_type: str # e.g., 'text', 'multiple-choice'

class Form(BaseModel):
    id: int
    title: str
    description: str
    questions: List[Question]

class Answer(BaseModel):
    question_id: int
    value: str

class Submission(BaseModel):
    id: int
    form_id: int
    employee_id: str # In a real app, this would be a user ID
    answers: List[Answer]

# --- Mock Databases for Forms & Announcements ---
fake_forms_db: List[Form] = [
    Form(
        id=1,
        title="Quarterly Employee Satisfaction Survey",
        description="Please provide your anonymous feedback to help us improve.",
        questions=[
            Question(id=1, text="On a scale of 1-5, how satisfied are you with your work-life balance?", question_type="multiple-choice"),
            Question(id=2, text="What could we do to improve your experience at work?", question_type="text"),
        ]
    )
]
fake_submissions_db: List[Submission] = []

fake_announcements_db: List[Announcement] = [
    Announcement(id=1, title="Welcome to the New WAVES Platform!", content="We're excited to launch our new and improved wellbeing platform. Explore the new features and let us know what you think!", date=date.today()),
    Announcement(id=2, title="Upcoming Maintenance", content="The platform will be down for scheduled maintenance this Friday from 10 PM to 11 PM PST.", date=date.today() - timedelta(days=1)),
]

# --- FastAPI Application ---
app = FastAPI(
    title="Management Dashboard API",
    description="Serves data to the management wellness dashboard.",
    version="1.0.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173", # Personal Dashboard
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.post("/api/v1/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(fake_users_db, form_data.username)
    # In a real app, you would verify the password. Here we simulate it.
    if not user or form_data.password != user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # In a real app, the token would be a JWT. Here, we use the username as the token.
    access_token = user.username
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Fetches the current logged-in user's data."""
    return current_user

@app.get("/api/v1/dashboard/kpis", response_model=KPISnapshot, dependencies=[Depends(require_admin)])
async def get_kpi_snapshot():
    """Provides a high-level snapshot of organization-wide wellness metrics."""
    return KPISnapshot(
        overall_score=82,
        departments_at_risk=2,
        positive_trend="+3%"
    )

@app.get("/api/v1/dashboard/departments", response_model=List[DepartmentWellness], dependencies=[Depends(require_admin)])
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

@app.get("/api/v1/dashboard/heatmap", response_model=List[HeatmapDataPoint], dependencies=[Depends(require_admin)])
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

@app.get("/api/v1/dashboard/trends", response_model=List[TrendsDataPoint], dependencies=[Depends(require_admin)])
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

# --- Announcement Endpoints ---
@app.get("/api/v1/announcements", response_model=List[Announcement])
async def get_announcements():
    """Returns a list of all announcements. This is a public endpoint."""
    return sorted(fake_announcements_db, key=lambda x: x.date, reverse=True)

class AnnouncementCreate(BaseModel):
    title: str
    content: str

@app.post("/api/v1/announcements", response_model=Announcement, dependencies=[Depends(require_admin)])
async def create_announcement(announcement: AnnouncementCreate):
    """Creates a new announcement. (Admin only)"""
    new_id = max(ann.id for ann in fake_announcements_db) + 1 if fake_announcements_db else 1
    new_announcement = Announcement(
        id=new_id,
        title=announcement.title,
        content=announcement.content,
        date=date.today()
    )
    fake_announcements_db.append(new_announcement)
    return new_announcement

# --- Feedback Form Endpoints ---
class FormCreate(BaseModel):
    title: str
    description: str
    questions: List[Question]

@app.post("/api/v1/forms", response_model=Form, dependencies=[Depends(require_admin)])
async def create_form(form: FormCreate):
    """Creates a new feedback form. (Admin only)"""
    new_id = max(f.id for f in fake_forms_db) + 1 if fake_forms_db else 1
    new_form = Form(id=new_id, **form.dict())
    fake_forms_db.append(new_form)
    return new_form

@app.get("/api/v1/forms", response_model=List[Form])
async def get_forms(current_user: User = Depends(get_current_user)):
    """Returns a list of all available forms."""
    return fake_forms_db

@app.get("/api/v1/forms/{form_id}", response_model=Form)
async def get_form(form_id: int, current_user: User = Depends(get_current_user)):
    """Returns the details of a specific form."""
    form = next((f for f in fake_forms_db if f.id == form_id), None)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

class SubmissionCreate(BaseModel):
    form_id: int
    answers: List[Answer]

@app.post("/api/v1/submissions", response_model=Submission)
async def create_submission(submission: SubmissionCreate, current_user: User = Depends(get_current_user)):
    """Allows an employee to submit a form."""
    new_id = max(s.id for s in fake_submissions_db) + 1 if fake_submissions_db else 1
    new_submission = Submission(
        id=new_id,
        employee_id=current_user.username,
        **submission.dict()
    )
    fake_submissions_db.append(new_submission)
    return new_submission

@app.get("/api/v1/forms/{form_id}/submissions", response_model=List[Submission], dependencies=[Depends(require_admin)])
async def get_form_submissions(form_id: int):
    """Returns all submissions for a specific form. (Admin only)"""
    submissions = [s for s in fake_submissions_db if s.form_id == form_id]
    return submissions

@app.get("/")
def read_root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "Management Dashboard API is running."}

if __name__ == "__main__":
    print("Starting Management Dashboard API server...")
    print("Access the API docs at http://127.0.0.1:8001/docs")
    uvicorn.run(app, host="127.0.0.1", port=8001)