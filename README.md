# AI-Powered Employee Wellbeing Monitoring System

This repository contains the complete source code, scripts, and documentation for the AI-Powered Employee Wellbeing Monitoring System. The system is designed to provide real-time, privacy-preserving insights into employee wellbeing by analyzing behavioral patterns using a classical machine learning model.

## 1. System Architecture

The system consists of two main components as outlined in the [Technical Implementation Report](./docs/Technical_Implementation_Report.md):

1.  **Individual AI Agent (Client-Side):** A lightweight, cross-platform agent that runs on an employee's machine. It collects work-related behavioral data, which can be sent to the central hub for analysis.
2.  **Central Analytics Hub (Server-Side):** A cloud-based platform that securely ingests, processes, and analyzes anonymized data from all agents. It uses a trained `RandomForestClassifier` to predict wellness levels and provides department-level insights to managers through a secure web dashboard.

## 2. Repository Structure

The project is organized into the following directories:

```
.
├── data/                  # Holds raw and processed datasets.
├── docs/                  # Project documentation.
├── models/                # Saved trained model artifacts (e.g., wellness_model.pkl).
├── scripts/               # Standalone scripts for training and validating the model.
├── src/                   # Main source code for the project.
│   ├── agent_ui/          # Employee-facing personal dashboard (Bottle).
│   ├── data_training/     # Scripts related to data generation and preprocessing.
│   ├── management_dashboard/ # Management dashboard (React).
│   └── server/            # Central FastAPI server.
├── tests/                 # Unit tests for the core modules.
└── validation_results/    # Output directory for validation artifacts (e.g., confusion matrix).
```

## 3. Technology Stack

-   **Core Language:** Python 3.10+
-   **AI Model:** `scikit-learn` RandomForestClassifier
-   **Data Handling:** pandas, scikit-learn
-   **API Framework:** FastAPI, Bottle
-   **Testing:** unittest

## 4. Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd employee-wellbeing-ai
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## 5. ML Model Usage Guide

### Step 1: Generate Synthetic Data

To create a synthetic dataset for training, run the data generator script. This will create `synthetic_wellness_data.csv` in the `data/` directory.

```bash
python src/data_training/synthetic_data_generator.py
```

### Step 2: Preprocess Data

Once you have the raw data, preprocess it to prepare for training. This script will normalize features, encode labels, and split the data into `train_data.csv` and `val_data.csv`.

```bash
python src/data_training/preprocess_data.py
```

### Step 3: Train the Model

Now, train the RandomForest model using the preprocessed data. This script will save the trained model to `models/wellness_model.pkl`.

```bash
python scripts/train_model.py
```

### Step 4: Validate the Model

To evaluate the performance of your trained model, run the validation script. This script uses the validation dataset (`val_data.csv`) to calculate key metrics and saves a confusion matrix plot to the `validation_results/` directory.

```bash
python scripts/validate_model.py
```

## 6. Running the UI and Servers

The application consists of three main services that need to be run: the Personal Dashboard, the Central Analytics Hub, and the Management Dashboard's dedicated API.

### 1. Personal Dashboard (Agent UI)

This is the employee-facing dashboard. It's a lightweight Bottle server.

1.  **Install Dependencies:**
    *Ensure your virtual environment is active.*
    ```bash
    pip install bottle
    ```
2.  **Run the Server:**
    ```bash
    python src/agent_ui/main.py
    ```
3.  Access the dashboard at `http://localhost:8080`.

### 2. Central Analytics Hub (Server)

This is the main FastAPI server for collecting data from agents and making predictions.

1.  **Install Dependencies:**
    ```bash
    pip install -r src/server/requirements.txt
    ```
2.  **Run the Server:**
    ```bash
    uvicorn src.server.main:app --reload --port 8000
    ```
3.  The API is available at `http://localhost:8000`.

### 3. Management Dashboard

The management dashboard is a data-driven application with its own backend. **Both the API server and the frontend must be running.**

**First, run the Management API Server:**

1.  **Install Dependencies:**
    ```bash
    pip install -r src/management_dashboard/requirements.txt
    ```
2.  **Run the Server:**
    ```bash
    python src/management_dashboard/server.py
    ```
3.  The Management API will run at `http://localhost:8001`.

**Then, open the Frontend:**

1.  Navigate to the `src/management_dashboard` directory in your file explorer.
2.  Open the `index.html` file in your web browser. The dashboard will fetch data from the Management API.

## 7. Testing

To ensure the integrity of the codebase, you can run the suite of unit tests.

```bash
python -m unittest discover tests
```

This will discover and run all tests in the `tests/` directory.