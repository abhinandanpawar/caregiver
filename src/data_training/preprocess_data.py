import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle
import os

def preprocess_data(input_path, output_train_path, output_val_path, artifacts_path, test_size=0.2, random_state=42, stratify=True):
    """
    Loads, preprocesses, and splits the synthetic wellness data.
    Also saves the scaler and encoders used for transformation.
    """
    os.makedirs(artifacts_path, exist_ok=True)
    df = pd.read_csv(input_path)

    department_encoder = LabelEncoder()
    df['department'] = department_encoder.fit_transform(df['department'])
    with open(os.path.join(artifacts_path, 'department_encoder.pkl'), 'wb') as f:
        pickle.dump(department_encoder, f)

    label_encoder = LabelEncoder()
    df['wellness_label'] = label_encoder.fit_transform(df['wellness_label'])
    with open(os.path.join(artifacts_path, 'label_encoder.pkl'), 'wb') as f:
        pickle.dump(label_encoder, f)

    X = df.drop('wellness_label', axis=1)
    y = df['wellness_label']

    y_stratify = y if stratify else None

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y_stratify)

    numerical_cols = X.columns.drop('department')

    scaler = StandardScaler()
    X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_val[numerical_cols] = scaler.transform(X_val[numerical_cols])
    with open(os.path.join(artifacts_path, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)

    train_data = pd.concat([X_train, y_train.reset_index(drop=True)], axis=1)
    val_data = pd.concat([X_val, y_val.reset_index(drop=True)], axis=1)

    train_data.to_csv(output_train_path, index=False)
    val_data.to_csv(output_val_path, index=False)

    print(f"Data preprocessed and saved to {output_train_path} and {output_val_path}")
    print(f"Scaler and encoders saved to {artifacts_path}")
    print(f"Training set shape: {train_data.shape}")
    print(f"Validation set shape: {val_data.shape}")

if __name__ == "__main__":
    INPUT_CSV = "data/synthetic_wellness_data.csv"
    TRAIN_CSV = "data/train_data.csv"
    VAL_CSV = "data/val_data.csv"
    ARTIFACTS_DIR = "models"

    preprocess_data(INPUT_CSV, TRAIN_CSV, VAL_CSV, ARTIFACTS_DIR, stratify=True)