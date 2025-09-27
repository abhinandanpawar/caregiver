import unittest
import os
import sys
from unittest.mock import patch, MagicMock

# Add the scripts directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# The script is in `scripts` dir, so we need to adjust the path to import it
from scripts import export_to_onnx

class TestExportToOnnx(unittest.TestCase):

    @patch('scripts.export_to_onnx.parse_args')
    @patch('transformers.AutoTokenizer.from_pretrained')
    @patch('transformers.AutoModelForCausalLM.from_pretrained')
    @patch('peft.PeftModel.from_pretrained')
    @patch('torch.onnx.export')
    def test_main_script_flow(self, mock_onnx_export, mock_peft_model, mock_automodel, mock_autotokenizer, mock_parse_args):
        """
        Test the main flow of the export_to_onnx.py script by mocking external libraries.
        This test ensures the script calls the right functions in the correct order
        without needing a real model or tokenizer.
        """
        # --- Mock Setup ---

        # Mock command line arguments
        mock_args = MagicMock()
        mock_args.base_model_id = "fake/base-model"
        mock_args.tuned_model_path = "fake/tuned-model"
        mock_args.output_onnx_path = "fake_model.onnx"
        mock_parse_args.return_value = mock_args

        # Mock the tokenizer and its output
        mock_tokenizer_instance = MagicMock()
        mock_tokenizer_instance.return_value = dict(
            input_ids=MagicMock(),
            attention_mask=MagicMock()
        )
        mock_autotokenizer.return_value = mock_tokenizer_instance

        # Mock the base model and the PEFT model
        mock_base_model_instance = MagicMock()
        mock_automodel.return_value = mock_base_model_instance

        mock_peft_model_instance = MagicMock()
        mock_peft_model_instance.merge_and_unload.return_value = mock_base_model_instance # Merged model is the base model instance
        mock_peft_model.return_value = mock_peft_model_instance

        # --- Run the main function ---
        export_to_onnx.main()

        # --- Assertions ---

        # 1. Check if arguments were parsed
        mock_parse_args.assert_called_once()

        # 2. Check if base model and tokenizer were loaded
        mock_automodel.assert_called_with(
            mock_args.base_model_id,
            torch_dtype=unittest.mock.ANY,
            device_map="auto",
            trust_remote_code=True
        )
        mock_autotokenizer.assert_called_with(mock_args.base_model_id, trust_remote_code=True)

        # 3. Check if PEFT model was loaded
        mock_peft_model.assert_called_with(mock_base_model_instance, mock_args.tuned_model_path)

        # 4. Check if the model was merged
        mock_peft_model_instance.merge_and_unload.assert_called_once()

        # 5. Check if ONNX export was called
        mock_onnx_export.assert_called_once()

        # Clean up the dummy file if it was created by mistake (os.makedirs is not mocked)
        if os.path.exists(mock_args.output_onnx_path):
            os.remove(mock_args.output_onnx_path)

if __name__ == '__main__':
    unittest.main()