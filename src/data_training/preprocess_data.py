import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

def preprocess_data(input_path, output_train_path, output_val_path, test_size=0.2, random_state=42):
    """
    Loads, preprocesses, and splits the synthetic wellness data.

    Args:
        input_path (str): Path to the input CSV file.
        output_train_path (str): Path to save the training data CSV.
        output_val_path (str): Path to save the validation data CSV.
        test_size (float): The proportion of the dataset to allocate to the validation set.
        random_state (int): Seed for the random number generator.
    """
    # Load the dataset
    df = pd.read_csv(input_path)

    # Encode the 'department' categorical feature
    le = LabelEncoder()
    df['department'] = le.fit_transform(df['department'])

    # Encode the 'wellness_label' target feature
    le_label = LabelEncoder()
    df['wellness_label'] = le_label.fit_transform(df['wellness_label'])

    # Separate features and target
    X = df.drop('wellness_label', axis=1)
    y = df['wellness_label']

    # Split the data into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)

    # Scale numerical features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)

    # Convert scaled arrays back to DataFrames
    X_train = pd.DataFrame(X_train_scaled, columns=X.columns)
    X_val = pd.DataFrame(X_val_scaled, columns=X.columns)

    # Combine features and target for saving
    train_data = pd.concat([X_train, y_train.reset_index(drop=True)], axis=1)
    val_data = pd.concat([X_val, y_val.reset_index(drop=True)], axis=1)

    # Save the processed data
    train_data.to_csv(output_train_path, index=False)
    val_data.to_csv(output_val_path, index=False)

    print("Data preprocessed and saved to {} and {}".format(output_train_path, output_val_path))
    print("Training set shape: {}".format(train_data.shape))
    print("Validation set shape: {}".format(val_data.shape))

if __name__ == "__main__":
    INPUT_CSV = "data/synthetic_wellness_data.csv"
    TRAIN_CSV = "data/train_data.csv"
    VAL_CSV = "data/val_data.csv"
    preprocess_data(INPUT_CSV, TRAIN_CSV, VAL_CSV)