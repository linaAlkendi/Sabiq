from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

model_path = os.path.join(os.path.dirname(__file__), "rf_model.pkl")
model = joblib.load(model_path)

@app.route('/predict', methods=['GET'])
def predict():
    # Retrieve parameters from the query string
    try:
        input_data = {
            "temperature": float(request.args.get("temperature")),
            "vibration": float(request.args.get("vibration")),
            "pressure": float(request.args.get("pressure")),
            "humidity": float(request.args.get("humidity")),
            "motor_load": float(request.args.get("motor_load"))
        }
    except (TypeError, ValueError):
        return jsonify({"error": "Missing or invalid input parameters"}), 400

    df = pd.DataFrame([input_data])
    prediction = model.predict(df)[0]

    return jsonify({
        "input_data": input_data,
        "prediction": str(prediction)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render will inject its own value
    app.run(host="0.0.0.0", port=port)