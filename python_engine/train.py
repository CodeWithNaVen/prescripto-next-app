import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

base_path = os.path.dirname(os.path.abspath(__file__))
training_path = os.path.join(base_path, 'Training.csv')

# Load dataset
data = pd.read_csv(training_path)

X = data.drop("prognosis", axis=1)
y = data["prognosis"]

# Better than DecisionTree
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# Save model + columns
pickle.dump(model, open(os.path.join(base_path, "model.pkl"), "wb"))
pickle.dump(X.columns.tolist(), open(os.path.join(base_path, "columns.pkl"), "wb"))

print("✅ Model trained & saved successfully")