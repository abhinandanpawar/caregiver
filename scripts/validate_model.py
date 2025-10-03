import argparse
import os
import pandas as pd
import pickle
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import seaborn as sns
import matplotlib.pyplot as plt

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Validate the trained RandomForest model.")
    parser.add_argument("--validation_data_path", type=str, default="data/val_data.csv", help="Path to the validation data CSV file.")
    parser.add_argument("--model_path", type=str, default="models/wellness_model.pkl", help="Path to the trained model pickle file.")
    parser.add_argument("--results_path", type=str, default="validation_results", help="Directory to save validation results.")
    return parser.parse_args()

def validate_model(val_data_path, model_path, results_path):
    """
    Loads the validation data and the trained model, then evaluates the model's performance.

    Args:
        val_data_path (str): The path to the validation data.
        model_path (str): The path to the trained model.
        results_path (str): The path to save result artifacts.
    """
    print("Starting model validation...")

    # Load the validation data
    try:
        val_df = pd.read_csv(val_data_path)
    except FileNotFoundError:
        print(f"Error: Validation data not found at {val_data_path}")
        print("Please ensure you have run the preprocessing script first.")
        return

    # Load the trained model
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
    except FileNotFoundError:
        print(f"Error: Model not found at {model_path}")
        print("Please ensure you have run the training script first.")
        return

    # Separate features and true labels
    X_val = val_df.drop('wellness_label', axis=1)
    true_labels = val_df['wellness_label']

    # Generate predictions
    predicted_labels = model.predict(X_val)

    # --- Calculate Metrics ---
    print("\nCalculating performance metrics...")

    # Accuracy
    accuracy = accuracy_score(true_labels, predicted_labels)
    print(f"\nAccuracy: {accuracy:.4f}")

    # Classification Report
    # Note: LabelEncoder maps labels alphabetically. We assume: 0=Burnout, 1=Healthy, 2=Stressed
    target_names = ['Burnout', 'Healthy', 'Stressed']
    report = classification_report(true_labels, predicted_labels, target_names=target_names, zero_division=0)
    print("\nClassification Report:")
    print(report)

    # Confusion Matrix
    print("Generating confusion matrix...")
    cm = confusion_matrix(true_labels, predicted_labels)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=target_names, yticklabels=target_names)
    plt.title('Confusion Matrix')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')

    # Save the plot
    os.makedirs(results_path, exist_ok=True)
    plot_path = os.path.join(results_path, "confusion_matrix.png")
    plt.savefig(plot_path)
    print(f"Confusion matrix saved to {plot_path}")

    print("\nValidation script finished.")

if __name__ == "__main__":
    args = parse_args()
    validate_model(args.validation_data_path, args.model_path, args.results_path)