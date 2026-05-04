import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Performance Optimization: Load model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "churn_model.pkl")
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Expected columns for Feature Consistency Guarantee
EXPECTED_COLUMNS = [
    "gender", "SeniorCitizen", "Partner", "Dependents", "tenure",
    "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
    "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV",
    "StreamingMovies", "Contract", "PaperlessBilling", "PaymentMethod",
    "MonthlyCharges", "TotalCharges", "avg_charge", "tenure_group", "high_value"
]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

@app.route("/predict", methods=["POST"])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400

        # Convert input into a DataFrame
        df = pd.DataFrame([data])

        # Data Type Enforcement & Default Values
        required_fields = {
            "gender": "Male", "SeniorCitizen": 0, "Partner": "No", "Dependents": "No",
            "tenure": 0, "PhoneService": "Yes", "MultipleLines": "No", 
            "InternetService": "No", "OnlineSecurity": "No", "OnlineBackup": "No",
            "DeviceProtection": "No", "TechSupport": "No", "StreamingTV": "No",
            "StreamingMovies": "No", "Contract": "Month-to-month", 
            "PaperlessBilling": "No", "PaymentMethod": "Electronic check",
            "MonthlyCharges": 0.0, "TotalCharges": 0.0
        }

        for col, default_val in required_fields.items():
            if col not in df.columns or pd.isnull(df[col].iloc[0]):
                df[col] = default_val

        # Force correct types
        df["tenure"] = df["tenure"].astype(int)
        df["MonthlyCharges"] = df["MonthlyCharges"].astype(float)
        df["TotalCharges"] = df["TotalCharges"].astype(float)

        # Feature Engineering
        # Division Safety
        df["avg_charge"] = df["TotalCharges"] / (df["tenure"] + 1)
        
        # Tenure group logic
        def get_tenure_group(t):
            if t < 12: return "0-1yr"
            if t < 24: return "1-2yr"
            if t < 48: return "2-4yr"
            if t < 60: return "4-5yr"
            return "5+yr"
        
        df["tenure_group"] = df["tenure"].apply(get_tenure_group)
        
        # High value logic
        df["high_value"] = (df["MonthlyCharges"] > 70).astype(int)

        # Enforce exact column ordering
        for col in EXPECTED_COLUMNS:
            if col not in df.columns:
                df[col] = 0

        df = df[EXPECTED_COLUMNS]

        # Prediction
        probabilities = model.predict_proba(df)[0]
        churn_prob = float(probabilities[1])  # Probability of churn

        # Risk Logic & Suggestions
        if churn_prob > 0.6:
            risk_level = "High"
            suggestions = ["Offer significant discounts", "Reach out via customer support", "Propose a long-term plan"]
        elif churn_prob >= 0.4:
            risk_level = "Medium"
            suggestions = ["Send engagement offers", "Highlight unused features"]
        else:
            risk_level = "Low"
            suggestions = ["Maintain regular communication", "Stable customer - no immediate action required"]

        # Explanation Rules
        reasons = []
        if df["Contract"].iloc[0] == "Month-to-month":
            reasons.append("Month-to-month contract indicates higher flight risk")
        if df["tenure"].iloc[0] < 12:
            reasons.append("Short-duration customer (< 12 months)")
        if df["MonthlyCharges"].iloc[0] > 70:
            reasons.append("High monthly cost may lead to price sensitivity")

        if not reasons:
            reasons.append("No critical risk factors identified")

        response = {
            "churn_probability": round(churn_prob, 4),
            "risk_level": risk_level,
            "reasons": reasons,
            "suggestions": suggestions,
            "model_version": "v1.0.0"
        }

        return jsonify(response)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
