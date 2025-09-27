# Fine-Tuning Phi-3-mini for Employee Wellbeing Monitoring on Google Colab

This notebook provides a step-by-step guide to fine-tuning the `microsoft/Phi-3-mini-4k-instruct` model on our synthetic employee wellbeing dataset. We will use QLoRA for memory-efficient training, which is ideal for the free-tier Google Colab environment.

## Step 1: Setup and Environment Configuration

First, we need to configure the Colab runtime to use a GPU.
1. Go to **Runtime** -> **Change runtime type**.
2. Select **T4 GPU** from the dropdown menu and click **Save**.

Next, we'll mount your Google Drive to access our project files and save the fine-tuned model.

```python
from google.colab import drive
drive.mount('/content/drive')
```

## Step 2: Project Setup and Dependencies

Before running the script, you need to place your project folder in your Google Drive. Let's assume your project is located at `My Drive/Colab Notebooks/employee-wellbeing-ai`.

Now, let's navigate to the project directory and install the required Python libraries.

```python
%cd /content/drive/My Drive/Colab Notebooks/employee-wellbeing-ai

!pip install torch torchvision torchaudio
!pip install transformers datasets peft trl bitsandbytes accelerate
```

## Step 3: Verify Data

Ensure your synthetic data is preprocessed. If you haven't done so, run the `preprocess_data.py` script first.

```python
# This step is only necessary if you haven't preprocessed the data yet.
!python src/data_training/preprocess_data.py
```

## Step 4: Run the Fine-Tuning Script

Now we are ready to start the fine-tuning process. We will execute the `run_finetuning.py` script with our desired parameters. You can adjust the learning rate, batch size, and number of epochs as needed.

**Note:** The training process may take a significant amount of time, depending on the configuration.

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

## Step 5: Troubleshooting

Here are some common issues and their solutions:

*   **`CUDA out of memory`**: This is the most common error. It means the GPU does not have enough memory to handle the batch size.
    *   **Solution**: Decrease the `--batch_size`. You can also try reducing `max_seq_length` in the `run_finetuning.py` script if smaller batch sizes don't work.

*   **`Runtime disconnected`**: This can happen if the Colab session is idle for too long or if you exceed the usage limits.
    *   **Solution**: Re-run the notebook from the beginning. The training script is set up to save checkpoints, so you can often resume from where you left off by modifying the script to load from a checkpoint.

*   **Installation Errors**: If you encounter issues while installing packages.
    *   **Solution**: Try restarting the runtime (**Runtime -> Restart runtime**) and running the installation cells again. Ensure you are connected to the internet.
```