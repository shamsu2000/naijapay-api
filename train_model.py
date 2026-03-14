import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# 1. Create Mock Transaction Data
# Features: transaction_amount (Naira), hour_of_day (0-23), velocity (transactions in last hour)
data = {
    'amount': [2000, 5000, 1500, 3000, 500000, 1000, 4500, 2500, 800000, 3500],
    'hour': [14, 15, 9, 11, 2, 10, 16, 13, 3, 12], # Notice the large amounts at 2 AM and 3 AM
    'velocity': [1, 2, 1, 1, 15, 1, 2, 1, 20, 1]     # Notice the high velocity
}

df = pd.DataFrame(data)

# 2. Initialize and Train the Model
# Contamination is the expected percentage of fraud in the dataset (we set it to 20% for this dummy data)
model = IsolationForest(n_estimators=100, contamination=0.2, random_state=42)

# Train the model on our features
print("Training the fraud detection model...")
model.fit(df[['amount', 'hour', 'velocity']])

# 3. Save the Model for the Backend to Use
joblib.dump(model, 'fraud_model.joblib')
print("Model trained and saved successfully as 'fraud_model.joblib'!")