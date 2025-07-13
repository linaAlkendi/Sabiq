# 🛫 Sabiq – Aviation Safety Prototype

This project is a prototype for reporting and visualizing technical safety incidents in an aviation environment. It consists of a frontend interface (HTML, CSS, JavaScript) and a backend API built with Express.js to manage incident data via a local JSON file.

---

## 📁 Project Structure

```
sabiq/
├── backend/
│   ├── server.js           # Express server
│   ├── incidents.json      # JSON file storing incident reports
│   └── package.json        # Node dependencies
│
├── pages/                  # Frontend HTML pages
├── js/                     # Frontend JavaScript files
├── css/                    # Stylesheets
├── .gitignore
└── README.md
```

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

Simply open any HTML file inside the `pages/` folder in your browser (e.g. `reports.html`, `new-report.html`). The pages will communicate with the backend via API calls to `http://localhost:3000`.

---

## 👥 Team

- **Mona** – Operational analysis, connecting system idea to airport operations and international regulations
- **Fatimah** – Developed AI-powered fault prediction and data analytics model
- **Lina** – Designed and developed the UI, tracked workflow and task coordination
- **Shurooq** – Designed and developed the UI
- **Rami** – Integrated database and backend systems with frontend
