# AI-Powered Employee Wellbeing & Productivity Platform

This repository contains the complete source code for an AI-Powered Employee Wellbeing and Productivity Platform. The system is designed with a dual purpose: to provide a practical, ready-to-use wellbeing monitoring system and to serve as a template for advanced Large Language Model (LLM) experimentation.

## 1. System Architecture

The application is built on a client-server model and features a dual-model approach to AI, along with a suite of productivity tools.

#### Core Components
1.  **Personal Dashboard (Client-Side):** A lightweight, local dashboard built with **Bottle** that runs on an employee's machine. It serves as the user's private interface for all features, including the Kanban Board and Goal Setting tools.
2.  **Central Analytics Hub (Server-Side):** A robust **FastAPI** server that uses a trained machine learning model to provide real-time wellness predictions.

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
│   └── server/            # Central FastAPI prediction server.
├── tests/                 # Unit tests for the core modules.
└── validation_results/    # Output from the model validation script.
```

## 3. Technology Stack
-   **Core Language:** Python 3.10+
-   **Production ML:** `scikit-learn`, `pandas`
-   **Experimental LLM:** `Hugging Face Transformers`, `PEFT (QLoRA)`, `bitsandbytes`
-   **Model Export:** ONNX
-   **Backend Frameworks:** FastAPI, Bottle
-   **Testing:** `unittest`

## 4. Setup and Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    pip install -r src/server/requirements.txt
    pip install bottle
    ```

## 5. Usage Guide
This guide is split into two parts: running the production-ready system and experimenting with the advanced LLM.

### Part A: The Ready-to-Use System (RandomForest Model)
This workflow uses the fast and accurate `scikit-learn` model.

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

### Part B: Advanced Experimentation (LLM Fine-Tuning)
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

## 6. Running the Application
The application consists of two main services that should be run separately.

**1. The Prediction Server (FastAPI)**
This server provides the ML prediction service.
```bash
uvicorn src.server.main:app --reload --port 8000
```

**2. The Personal Dashboard (Bottle)**
This is the main, user-facing UI with the Kanban board and other tools.
```bash
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