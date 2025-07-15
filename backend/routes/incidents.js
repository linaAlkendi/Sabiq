const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_FILE = path.join(__dirname, "../data/incidents.json");
const notifier = require("../utils/notifier");

// GET all incidents
router.get("/", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// POST a new incident
router.post("/", (req, res) => {
  const incidents = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const newIncident = req.body;

  // Serial ID generation
  newIncident.id = incidents.length
    ? incidents[incidents.length - 1].id + 1
    : 1;

  incidents.push(newIncident);
  fs.writeFileSync(DATA_FILE, JSON.stringify(incidents, null, 2), "utf-8");

  // Generate a notification after successful incident creation
  notifier.createNotification({
    title: "بلاغ جديد",
    description: `تم تسجيل بلاغ في ${newIncident.facility} - نوع العطل: ${newIncident.issueType}`,
    severity: "M",
  });

  res.status(201).json({ message: "Incident saved", incident: newIncident });
});

module.exports = router;
