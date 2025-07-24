# 🛫 Sabiq – Aviation Safety Prototype

This project is a prototype for reporting and visualizing technical safety incidents in an aviation environment. It consists of a frontend interface (HTML, CSS, JavaScript) and a backend API built with Express.js to manage incident data via a local JSON file.

---

## 📁 Project Structure

```
sabiq/
├── backend/
│   ├── ai-model/                  # JSON data files
│   │   ├── analyze_incidents.py
│   │
│   ├── data/                      # JSON data files
│   │   ├── incidents.json
│   │   ├── facilities.json
│   │   └── notifications.json
│   │   └── incidentsData.json
│   │
│   ├── facility-fault-model/      # AI model integration
│   │   ├── rf_model.pkl           # Pretrained model (Random Forest)
│   │   └── model_api.py           # Flask API for inference
│   │
│   ├── helpers/                   # Utility/helper functions
│   │   └── notifier.js
│   │
│   ├── routes/                    # Route logic (modularized)
│   │   ├── incidents.js
│   │   ├── facilities.js
│   │   ├── notifications.js
│   │   └── auth.js
│   │
│   ├── server.js                  # Express server entry point
│   └── package.json               # Node dependencies
│
├── pages/                        # Frontend HTML pages
├── js/                           # Frontend JavaScript files
├── css/                          # Stylesheets
├── main.py
├── .gitignore
└── README.md
```

---

## 👥 Team

- **Mona** – Operational analysis, connecting system idea to airport operations and international regulations
- **Lina** – Designed and developed the UI, tracked workflow and task coordination
- **Shroog** – Designed and developed the UI
- **Rami** – Integrated database and backend systems with frontend
---

## 🚀 Getting Started (Backend)

### Requirements
- Check if Node.js is installed:
```bash
node -v
```
If not installed, download it here: [Download Node.js](https://nodejs.org/)

### Setup Instructions (Run Once)
```bash
cd backend       # navigate to backend folder
npm install      # install dependencies (only once)
```

### Run the Server (Every Time You Start Working)
```bash
cd backend       # make sure you're inside the backend folder
node server.js   # start the server
```

The server will be available at:
```
http://localhost:3000
```

---

## 🌐 Frontend

Simply open any HTML file inside the `pages/` folder in your browser (e.g. `reports.html`, `new-report.html`, `dashboard.html`). The pages will communicate with the backend via API calls to `http://localhost:3000`.


---

## 🧠 AI Fault Prediction Integration

This project integrates a trained machine learning model to predict potential facility malfunctions based on telemetry data (temperature, pressure, etc.).

### 🧪 Python Environment Setup

To run the prediction API, Python **3.10.x** must be installed. Other versions (like 3.11/3.12/3.13) are not compatible due to serialization limitations.

1. **Install Python 3.10.x:**
   - Download from: [https://www.python.org/downloads/release/python-3100/](https://www.python.org/downloads/release/python-3100/)
   - During installation, make sure to **check "Add Python to PATH"**

2. **Install required Python packages (with specific versions):**
   ```bash
   pip install flask==2.3.3
   pip install joblib==1.2.0
   pip install pandas==1.5.3
   pip install scikit-learn==1.2.2
   pip install numpy==1.23.5
   ```

### ▶️ Running the Flask Model API

To serve predictions locally:

```bash
cd backend/facility-fault-model
python model_api.py
```

Test the API by visiting in your browser:
```
http://localhost:5000/predict?temperature=35.5&vibration=0.8&pressure=92.0&humidity=46.0&motor_load=60.0
```

- The model returns a `"prediction"` value of `"0"` (normal) or `"1"` (malfunction).
- Your backend system can integrate this endpoint to check for real-time status.

