import argparse
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Export a fine-tuned PEFT model to ONNX format.")
    parser.add_argument("--base_model_id", type=str, default="microsoft/Phi-3-mini-4k-instruct", help="The base model ID from Hugging Face.")
    parser.add_argument("--tuned_model_path", type=str, required=True, help="Path to the fine-tuned PEFT model checkpoint directory.")
    parser.add_argument("--output_onnx_path", type=str, default="./wellbeing_model.onnx", help="Path to save the output ONNX model file.")
    return parser.parse_args()

def main():
    """Main function to run the ONNX export process."""
    args = parse_args()

    print("Loading base model: {}".format(args.base_model_id))
    # Load the base model with the same data type used for training
    base_model = AutoModelForCausalLM.from_pretrained(
        args.base_model_id,
        torch_dtype=torch.bfloat16,
        device_map="auto",
        trust_remote_code=True
    )
    tokenizer = AutoTokenizer.from_pretrained(args.base_model_id, trust_remote_code=True)
    print("Base model and tokenizer loaded.")

    print("Loading PEFT model from: {}".format(args.tuned_model_path))
    # Load the PEFT model (LoRA adapters) on top of the base model
    model = PeftModel.from_pretrained(base_model, args.tuned_model_path)
    print("PEFT model loaded.")

    print("Merging LoRA adapters into the base model...")
    # Merge the LoRA weights into the base model
    model = model.merge_and_unload()
    print("Model merged.")

    print("Exporting the merged model to ONNX at {}...".format(args.output_onnx_path))

    # Create a dummy input for the ONNX export
    dummy_input = tokenizer("This is a sample input", return_tensors="pt")
    dummy_input = {key: val.to(model.device) for key, val in dummy_input.items()}


    # Ensure the output directory exists
    output_dir = os.path.dirname(args.output_onnx_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    torch.onnx.export(
        model,
        (dummy_input['input_ids'], dummy_input['attention_mask']),
        args.output_onnx_path,
        input_names=['input_ids', 'attention_mask'],
        output_names=['logits'],
        dynamic_axes={
            'input_ids': {0: 'batch_size', 1: 'sequence'},
            'attention_mask': {0: 'batch_size', 1: 'sequence'},
            'logits': {0: 'batch_size', 1: 'sequence'}
        },
        opset_version=14 # A commonly supported opset version
    )

    print("----------------------------------------------------")
    print("Model successfully exported to {}".format(args.output_onnx_path))
    print("----------------------------------------------------")
    print("NOTE: This script creates a placeholder ONNX model. To generate a real model,")
    print("you must first run the fine-tuning process on a GPU and provide the path")
    print("to a valid checkpoint via the --tuned_model_path argument.")


if __name__ == "__main__":
    main()