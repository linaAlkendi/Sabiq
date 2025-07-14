const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "incidents.json";

// GET all incidents
app.get("/incidents", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// POST new incident
app.post("/incidents", (req, res) => {
  const newIncident = req.body;

  const data = fs.readFileSync(DATA_FILE, "utf-8");
  const incidents = JSON.parse(data);

  // Generate a serial ID (max ID + 1, or 1 if empty)
  const maxId = incidents.reduce((max, item) => item.id > max ? item.id : max, 0);
  newIncident.id = maxId + 1;

  incidents.push(newIncident);

  fs.writeFileSync(DATA_FILE, JSON.stringify(incidents, null, 2), "utf-8");

  res.status(201).json({ message: "Incident saved", incident: newIncident });
});

// GET facilities
app.get("/facilities", (req, res) => {
  const data = fs.readFileSync("facilities.json", "utf-8");
  res.json(JSON.parse(data));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
