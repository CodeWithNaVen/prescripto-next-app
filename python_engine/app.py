from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import numpy as np
import os

app = Flask(__name__)
CORS(app) # This allows your Next.js app to talk to this API

# Load data using absolute paths to avoid "File Not Found" errors
base_path = os.path.dirname(os.path.abspath(__file__))
training_path = os.path.join(base_path, 'Training.csv')

training_data = pd.read_csv(training_path)
X = training_data.drop('prognosis', axis=1)
y = training_data['prognosis']

model = DecisionTreeClassifier()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_symptoms = data.get('symptoms', [])
    
    input_vector = np.zeros(len(X.columns))
    for symptom in user_symptoms:
        if symptom in X.columns:
            idx = X.columns.get_loc(symptom)
            input_vector[idx] = 1
            
    prediction = model.predict([input_vector])[0]
    return jsonify({"disease": prediction})

if __name__ == '__main__':
    app.run(port=5000, debug=True)