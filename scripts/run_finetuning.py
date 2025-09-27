import argparse
import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Fine-tune a Phi-3-mini model on the employee wellness dataset.")
    parser.add_argument("--model_id", type=str, default="microsoft/Phi-3-mini-4k-instruct", help="The model ID from Hugging Face.")
    parser.add_argument("--dataset_path", type=str, default="./data", help="Path to the training and validation data files.")
    parser.add_argument("--output_dir", type=str, default="./phi-3-mini-wellbeing-finetuned", help="Directory to save the fine-tuned model.")
    parser.add_argument("--learning_rate", type=float, default=2e-4, help="Learning rate for training.")
    parser.add_argument("--batch_size", type=int, default=4, help="Batch size for training and evaluation.")
    parser.add_argument("--num_train_epochs", type=int, default=3, help="Number of training epochs.")
    parser.add_argument("--gradient_accumulation_steps", type=int, default=1, help="Gradient accumulation steps.")
    parser.add_argument("--logging_steps", type=int, default=10, help="Log every X updates steps.")
    parser.add_argument("--save_steps", type=int, default=50, help="Save checkpoint every X updates steps.")
    return parser.parse_args()

def main():
    """Main function to run the fine-tuning process."""
    args = parse_args()

    # --- 1. Load Dataset ---
    print("Loading dataset...")
    data_files = {
        "train": os.path.join(args.dataset_path, "train_data.csv"),
        "test": os.path.join(args.dataset_path, "val_data.csv")
    }
    dataset = load_dataset('csv', data_files=data_files)

    # This is a placeholder for formatting the data into a prompt template.
    # For a real-world scenario, you would create a prompt that guides the model.
    # Example: "Analyze the following employee data and classify the wellness level: [DATA] -> [LABEL]"
    def format_prompt(example):
        # The model expects a 'text' field.
        # We will create a simple text representation of our data.
        features = [key + ": " + str(value) for key, value in example.items() if key != 'wellness_label']
        text = "Classify the wellness of an employee with the following metrics: {}. Wellness Level: {}".format(', '.join(features), example['wellness_label'])
        return {"text": text}

    dataset = dataset.map(format_prompt)
    print("Dataset loaded and formatted.")

    # --- 2. Configure Quantization (QLoRA) ---
    print("Configuring quantization...")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )
    print("Quantization configured.")

    # --- 3. Load Model and Tokenizer ---
    print("Loading base model: {}...".format(args.model_id))
    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(args.model_id, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token # Set pad token
    print("Model and tokenizer loaded.")

    # --- 4. Configure LoRA ---
    print("Configuring LoRA...")
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, lora_config)
    print("LoRA configured.")

    # --- 5. Configure Training Arguments ---
    print("Setting up training arguments...")
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.learning_rate,
        num_train_epochs=args.num_train_epochs,
        logging_dir=os.path.join(args.output_dir, "logs"),
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        evaluation_strategy="steps",
        eval_steps=args.save_steps,
        do_eval=True,
        report_to="tensorboard",
        fp16=True, # Use fp16 for mixed-precision training
    )
    print("Training arguments set.")

    # --- 6. Initialize Trainer ---
    print("Initializing SFTTrainer...")
    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
        dataset_text_field="text", # Use the formatted text field
        max_seq_length=512,
        tokenizer=tokenizer,
    )
    print("Trainer initialized.")

    # --- 7. Start Training ---
    print("Starting model fine-tuning...")
    print("NOTE: This script is a setup template. Actual training should be run on a GPU-enabled environment like Google Colab.")
    print("To start training, you would call `trainer.train()`")
    # In a real scenario, you would uncomment the following line:
    # trainer.train()
    print("Fine-tuning script setup is complete.")


if __name__ == "__main__":
    main()