# Comprehensive Guide to Fine-Tuning Phi-3-mini on Google Colab

This document provides a detailed, step-by-step guide to fine-tuning the `microsoft/Phi-3-mini-4k-instruct` model using our synthetic employee wellbeing dataset. The process is designed for the free-tier Google Colab environment, leveraging QLoRA for memory-efficient training.

---

## Step 1: Environment Configuration

Before we begin, we must configure the Colab runtime to use a GPU, as training a large language model on a CPU is not feasible.

1.  In your Colab notebook, navigate to the menu bar and click **Runtime** -> **Change runtime type**.
2.  From the "Hardware accelerator" dropdown menu, select **T4 GPU**.
3.  Click **Save**.

## Step 2: Project Setup in Google Drive

To access our project files and save the output, we need to mount your Google Drive and set up the project directory.

#### 1. Mount Google Drive
Run the following Python code in a Colab cell. This will prompt you to authorize access to your Google Drive.

```python
from google.colab import drive
drive.mount('/content/drive')
```

#### 2. Upload and Navigate to Project Directory
You need to upload the entire project folder to your Google Drive. For this guide, we will assume you have placed it in `My Drive/Colab Notebooks/employee-wellbeing-ai`.

Next, navigate to this directory in your Colab environment using the following magic command:

```python
%cd /content/drive/My Drive/Colab Notebooks/employee-wellbeing-ai
```

## Step 3: Install Dependencies

Now, we will install all the necessary Python libraries for fine-tuning.

```python
# Install core AI and data handling libraries
!pip install torch torchvision torchaudio
!pip install transformers datasets peft trl bitsandbytes accelerate
```

## Step 4: Prepare the Dataset

The model requires the training data to be in a specific format. If you haven't already done so, run the preprocessing script to generate the `train_data.csv` and `val_data.csv` files.

```python
# This step is only necessary if you haven't preprocessed the data yet
# from your local machine.
!python src/data_training/preprocess_data.py
```

## Step 5: Run the Fine-Tuning Script

With the environment set up and the data ready, we can now start the fine-tuning process. The command below executes the main training script.

```python
!python scripts/run_finetuning.py \
    --model_id "microsoft/Phi-3-mini-4k-instruct" \
    --dataset_path "./data" \
    --output_dir "./phi-3-mini-wellbeing-finetuned" \
    --learning_rate 2e-4 \
    --batch_size 4 \
    --num_train_epochs 3 \
    --gradient_accumulation_steps 1 \
    --logging_steps 10 \
    --save_steps 50
```

#### Understanding the Script Arguments:
*   `--model_id`: The base model we are fine-tuning from the Hugging Face Hub.
*   `--dataset_path`: The directory where `train_data.csv` and `val_data.csv` are located.
*   `--output_dir`: The directory where the fine-tuned model checkpoints will be saved.
*   `--learning_rate`: Controls how much the model's weights are adjusted during training.
*   `--batch_size`: The number of training examples used in one iteration. **Lower this if you get "CUDA out of memory" errors.**
*   `--num_train_epochs`: The total number of times the model will cycle through the entire training dataset.
*   `--logging_steps`: How often to print training progress (e.g., every 10 steps).
*   `--save_steps`: How often to save a model checkpoint (e.g., every 50 steps).

## Step 6: Next Steps - Using Your Fine-Tuned Model

Once the training is complete, you will find the model checkpoints in the `--output_dir` (e.g., `phi-3-mini-wellbeing-finetuned`).

#### 1. Download the Model
-   In the Colab file explorer on the left, navigate to your project directory.
-   Find the output folder (e.g., `phi-3-mini-wellbeing-finetuned`).
-   Right-click the folder and select **Download** to save it to your local machine.

#### 2. Convert to ONNX for Inference
-   The downloaded folder contains the fine-tuned model in PyTorch format. To use it in the agent application, you need to convert it to the lightweight ONNX format.
-   On your local machine, run the `export_to_onnx.py` script, pointing to the path of your downloaded checkpoint folder.

```bash
# Example command to run on your local machine
python scripts/export_to_onnx.py \
    --tuned_model_path "path/to/your/downloaded/checkpoint-100" \
    --output_onnx_path "models/wellbeing_model.onnx"
```

You now have a fine-tuned, efficient model ready for inference in the agent application.

## Step 7: Troubleshooting

*   **`CUDA out of memory`**: The most common error. This means the GPU ran out of memory.
    *   **Solution**: In the command above, decrease the `--batch_size` (e.g., to 2 or 1). If the error persists, you can try reducing `max_seq_length` inside the `run_finetuning.py` script.
*   **`Runtime disconnected`**: This can happen if the Colab session is idle for too long.
    *   **Solution**: Re-run the notebook from the beginning. Training will resume from the last saved checkpoint if you don't delete the output directory.
*   **Installation Errors**: If package installation fails.
    *   **Solution**: Try restarting the runtime (**Runtime -> Restart runtime**) and running the installation cells again.