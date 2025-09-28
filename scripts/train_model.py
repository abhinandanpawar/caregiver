import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

# Load the training data
df = pd.read_csv('data/train_data.csv')

# Split the data into features and labels
X_train = df.drop('wellness_label', axis=1)
y_train = df['wellness_label']

# Create and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
with open('models/wellness_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model trained and saved to models/wellness_model.pkl")