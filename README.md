# AI-Powered Employee Wellbeing & Productivity Platform

This repository contains the complete source code for an AI-Powered Employee Wellbeing and Productivity Platform. The system is designed with a dual purpose: to provide a practical, ready-to-use wellbeing monitoring system and to serve as a template for advanced Large Language Model (LLM) experimentation.

## 1. System Architecture

The application is built on a client-server model and features a dual-model approach to AI, along with a suite of productivity tools.

#### Core Components
1.  **Management Dashboard (Client-Side):** A modern, professional dashboard built with **React, TypeScript, and MUI**. It provides managers with an overview of organization-wide wellness analytics.
2.  **Personal Dashboard (Client-Side):** A lightweight, local dashboard built with **Bottle** that runs on an employee's machine. It serves as the user's private interface for all features, including the Kanban Board and Goal Setting tools.
3.  **Central Analytics Hub (Server-Side):** A robust **FastAPI** server that uses a trained machine learning model to provide real-time wellness predictions.

#### The Dual-Model Approach
To cater to different user needs, this project includes two distinct machine learning models:

1.  **Production-Ready Model (`scikit-learn`):** A `RandomForestClassifier` that is fast, efficient, and highly accurate (**95.6% accuracy** on our synthetic dataset). It trains in seconds on a standard CPU and is the default model for the application's prediction service.
2.  **Experimental LLM (`microsoft/Phi-3-mini`):** For advanced users and researchers, we provide a complete toolchain to fine-tune a powerful LLM on a GPU-enabled environment (like Google Colab). This allows for experimentation with state-of-the-art natural language models.

#### Productivity & Wellbeing Tools
To make the application more actionable, we've integrated the following UI features:
-   **Personal Kanban Board:** A drag-and-drop task board to help users organize their work, reduce cognitive load, and track progress.
-   **Goal Setting & Tracking:** A tool for users to create, manage, and track their personal wellness goals, promoting proactive self-improvement.

## 2. Repository Structure
```
.
├── data/                  # Holds raw/processed datasets and UI data (goals, kanban).
├── docs/                  # Project documentation.
├── models/                # Saved scikit-learn model artifacts (wellness_model.pkl).
├── scripts/               # Standalone scripts for training, validation, and LLM export.
├── src/                   # Main source code for the project.
│   ├── agent_ui/          # Employee-facing personal dashboard (Bottle).
│   ├── data_training/     # Scripts for data generation and preprocessing.
│   ├── management_dashboard/ # NEW: Modern UI for management (React, Vite, MUI).
│   └── server/            # Central FastAPI prediction server.
├── tests/                 # Unit tests for the core modules.
└── validation_results/    # Output from the model validation script.
```

## 3. Setup and Installation

This project has two setup paths: one for **end-users** who just want to run the application, and one for **developers** who want to contribute or experiment with the models.

### For End-Users (Running the Application)

This setup uses the pre-trained `scikit-learn` model and is the fastest way to get started.

1.  **Clone the repository and set up the environment:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install minimal dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *Note: For the new Management Dashboard, you will also need to install Node.js and run `npm install` in the `src/management_dashboard` directory.*


### For Developers (Contributing & Experimentation)

This setup installs all packages needed for training, testing, and LLM experimentation.

1.  **Clone the repository and set up the environment:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install all development dependencies:**
    - **Python:** `pip install -r dev_requirements.txt`
    - **Frontend:** `cd src/management_dashboard && npm install` (or `yarn install`)


## 4. Developer Guide: Training and Validation

This guide is for developers who want to train the models from scratch.

### Scikit-Learn Model Workflow

**Step 1: Generate Synthetic Data**
```bash
python src/data_training/synthetic_data_generator.py
```

**Step 2: Preprocess Data**
This prepares the data for training and saves the necessary scaler and encoders.
```bash
python src/data_training/preprocess_data.py
```

**Step 3: Train the Model**
This trains the `RandomForestClassifier` and saves it to `models/wellness_model.pkl`.
```bash
python scripts/train_model.py
```

**Step 4: Validate the Model**
Evaluate the model's performance. It should achieve ~95.6% accuracy.
```bash
python scripts/validate_model.py
```

### Advanced LLM Fine-Tuning Workflow

This workflow is for advanced users and requires a **GPU-enabled environment** like Google Colab or Kaggle.

**Step 1: Fine-Tune the LLM**
Use the `run_finetuning.py` script in your GPU environment. This script contains the full setup for QLoRA-based fine-tuning. For a detailed walkthrough, see the guide in `docs/Fine_Tuning_on_Colab.md`.
```bash
# In your Google Colab environment
python scripts/run_finetuning.py
```

**Step 2: Export the Model to ONNX**
After fine-tuning, convert the model checkpoint to the lightweight ONNX format for efficient inference.
```bash
python scripts/export_to_onnx.py --tuned_model_path "path/to/your/checkpoint" --output_onnx_path "models/phi3_wellbeing.onnx"
```

## 5. Management Dashboard UI Overhaul

The management dashboard has been completely refactored with a modern frontend stack to provide a professional, responsive, and maintainable user interface.

#### Technology Stack
-   **React:** For building a component-based, interactive UI.
-   **TypeScript:** For type safety and improved developer experience.
-   **Vite:** A next-generation frontend build tool for a fast development server and optimized builds.
-   **Material-UI (MUI):** A comprehensive suite of UI tools to create a polished and consistent design.

#### Features & Screenshots

Once the development environment is running, you can view the following features.

***Note:** The following screenshots are placeholders. Due to a sandbox environment issue preventing the application from running, real screenshots could not be captured. To generate them, run the application and take a screenshot of each component listed below.*

**1. Organization-Wide Snapshot**
Displays key performance indicators (KPIs) for a quick overview of company wellness.
`[Placeholder for KPI Snapshot Screenshot]`

**2. Department Wellness Heatmap**
A bubble chart visualizing the wellness vs. burnout risk for each department.
`[Placeholder for Heatmap Screenshot]`

**3. Wellness Trends (30 Days)**
A line chart showing the evolution of the overall wellness score over the past month.
`[Placeholder for Trends Chart Screenshot]`

**4. Wellness by Department**
A detailed list view of the current wellness score for each department.
`[Placeholder for Department List Screenshot]`

## 6. Running the Application
The application consists of three main services that should be run separately.

**1. The Backend Server (FastAPI)**
This server provides the mock ML prediction service for the dashboards.
```bash
# From the project root
uvicorn src.server.main:app --reload --port 8000
```

**2. The Management Dashboard (React)**
This is the new, modern UI for the management wellness dashboard. It connects to the backend server.
```bash
# From the project root, navigate to the dashboard directory
cd src/management_dashboard

# Install dependencies (use yarn if npm fails)
npm install
# or
yarn install

# Run the development server
npm run dev
```
Access the dashboard at `http://localhost:3000`.

**3. The Personal Dashboard (Bottle)**
This is the original user-facing UI with the Kanban board and other tools.
```bash
# From the project root
python src/agent_ui/main.py
```
Access the dashboard at `http://localhost:8080`.

## 7. Testing
To ensure the integrity of the codebase, run the suite of unit tests:
```bash
python -m unittest discover tests
```

## 8. Contributing
We welcome contributions! If you're interested in improving the platform, here are some ideas:
-   **Enhance the UI:** Improve the styling and interactivity of the React and Bottle frontends.
-   **Add More Tools:** Implement other productivity tools like a Pomodoro timer or a daily mood journal.
-   **Improve the Models:** Experiment with different model architectures or fine-tuning techniques.
-   **Strengthen Security:** Add authentication and more robust data handling to the APIs.