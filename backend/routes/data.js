const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

const INCIDENTS_PATH = path.join(__dirname, "../data/incidentData.json");
const OUTPUT_PATH = path.join(__dirname, "../data/output.json");
const PYTHON_SCRIPT = path.join(__dirname, "../analyze_incidents.py");

// Route: GET /data/incidents
router.get("/incidents", (req, res) => {
  try {
    const data = fs.readFileSync(INCIDENTS_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "فشل في قراءة ملف الأعطال" });
  }
});

// Route: GET /data/output 
router.get("/output", (req, res) => {
  try {
    const data = fs.readFileSync(INCIDENTS_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "فشل في قراءة ملف الأعطال" });
  }
});
module.exports = router;
