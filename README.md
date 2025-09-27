# AI-Powered Employee Wellbeing Monitoring System

This repository contains the complete source code, scripts, and documentation for the AI-Powered Employee Wellbeing Monitoring System. The system is designed to provide real-time, privacy-preserving insights into employee wellbeing by analyzing behavioral patterns.

**Note:** This project is a comprehensive setup for fine-tuning a large language model (LLM) for a specific task. The actual model training is intended to be run on a dedicated GPU environment like Google Colab or Kaggle, and this repository provides all the necessary tools and guides to do so.

## 1. System Architecture

The system consists of two main components as outlined in the [Technical Implementation Report](./docs/Technical_Implementation_Report.md):

1.  **Individual AI Agent (Client-Side):** A lightweight, cross-platform agent that runs on an employee's machine. It collects work-related behavioral data, performs local inference using a quantized Phi-3-mini model, and displays a personal wellness dashboard. All data reported to the central hub is aggregated and anonymized.
2.  **Central Analytics Hub (Server-Side):** A cloud-based platform that securely ingests, processes, and analyzes the anonymized data from all agents. It provides department-level insights to managers through a secure web dashboard, strictly enforcing privacy rules like the "minimum 5 employees" threshold for any reported metric.

## 2. Repository Structure

The project is organized into the following directories:

```
.
├── data/                  # Holds raw and processed datasets.
├── docs/                  # Project documentation, including the technical report and Colab guide.
├── scripts/               # Standalone scripts for tasks like fine-tuning, ONNX export, and validation.
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
-   **AI Model:** Quantized `microsoft/Phi-3-mini-4k-instruct`
-   **Fine-Tuning:** PEFT (QLoRA) on Hugging Face Transformers
-   **Data Handling:** pandas, scikit-learn
-   **Model Export:** ONNX
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


## 5. Usage Guide

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

### Step 3: Fine-Tune the Model on Google Colab

The model fine-tuning is resource-intensive and should be performed on a GPU. We have prepared a detailed guide for this process in a Jupyter Notebook.

**Follow the guide here: [Fine_Tuning_on_Colab.md](./docs/Fine_Tuning_on_Colab.md)**

The guide will walk you through:
- Setting up a T4 GPU runtime on Colab.
- Mounting your Google Drive to access project files.
- Installing all required libraries.
- Running the `run_finetuning.py` script to train the model.

### Step 4: Export the Model to ONNX

After fine-tuning, you will have model checkpoints saved in the output directory (e.g., `phi-3-mini-wellbeing-finetuned`). To convert a checkpoint to the lightweight ONNX format for inference, use the export script.

```bash
python scripts/export_to_onnx.py --tuned_model_path "path/to/your/checkpoint" --output_onnx_path "models/wellbeing_model.onnx"
```
*(Replace `path/to/your/checkpoint` with the actual path to your saved model checkpoint, e.g., `phi-3-mini-wellbeing-finetuned/checkpoint-100`)*

### Step 5: Validate the Model

To evaluate the performance of your model, run the validation script. This script uses the validation dataset (`val_data.csv`) to calculate key metrics.

```bash
python scripts/validate_model.py
```
This will print a classification report and save a confusion matrix plot to the `validation_results/` directory. *(Note: The script currently uses placeholder predictions. To use your actual model, you would need to modify it to load the ONNX model and perform inference.)*

## 6. Running the UI and Server

This project includes a local personal dashboard, a central server, and a management dashboard.

### Personal Dashboard (Agent UI)

This is a lightweight Bottle server that displays the employee-facing dashboard.

1.  **Install bottle:**
    ```bash
    pip install bottle
    ```
2.  **Run the server:**
    ```bash
    python src/agent_ui/main.py
    ```
3.  Access the dashboard at `http://localhost:8080`.

### Central Analytics Hub (Server)

This is the main FastAPI server for collecting data.

1.  **Install dependencies:**
    ```bash
    pip install -r src/server/requirements.txt
    ```
2.  **Run the server:**
    ```bash
    uvicorn src.server.main:app --reload --port 8000
    ```
3.  The API will be available at `http://localhost:8000`.

### Management Dashboard

This is a simple React application. To view it, you just need to open the `index.html` file in your browser.

1.  Navigate to the `src/management_dashboard` directory.
2.  Open `index.html` in your web browser.

## 7. Testing

To ensure the integrity of the codebase, you can run the suite of unit tests.

```bash
python -m unittest discover tests
```

This will discover and run all tests in the `tests/` directory.