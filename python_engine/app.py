# nexcare/python_engine/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

base_path = os.path.dirname(os.path.abspath(__file__))

# Load trained model
model = pickle.load(open(os.path.join(base_path, "model.pkl"), "rb"))
columns = pickle.load(open(os.path.join(base_path, "columns.pkl"), "rb"))

@app.route("/")
def home():
    return {"message": "NexCare ML API Running"}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        user_symptoms = data.get("symptoms", [])

        if not isinstance(user_symptoms, list):
            return jsonify({"error": "Symptoms must be a list"}), 400

        input_vector = np.zeros(len(columns))
        unknown_symptoms = []

        for symptom in user_symptoms:
            if symptom in columns:
                idx = columns.index(symptom)
                input_vector[idx] = 1
            else:
                unknown_symptoms.append(symptom)

        # Predict probabilities
        probs = model.predict_proba([input_vector])[0]
        top_indices = np.argsort(probs)[-3:][::-1]

        top_predictions = [
            {
                "disease": model.classes_[i],
                "confidence": float(probs[i])
            }
            for i in top_indices
        ]

        return jsonify({
            "top_predictions": top_predictions,
            "ignored_symptoms": unknown_symptoms
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)