const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();
const FLASK_HOST_NAME = process.env.FLASK_HOST_NAME;

const DATA_FILE = path.join(__dirname, "../data/facilities.json");

// GET all facilities with AI model prediction
router.get("/", async (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    const facilities = JSON.parse(rawData);

    const enrichedFacilities = await Promise.all(
      facilities.map(async (facility) => {
        try {
          const inputData = {
            temperature: parseFloat(facility.temperature),
            vibration: parseFloat(facility.vibration),
            pressure: parseFloat(facility.pressure),
            humidity: parseFloat(facility.humidity),
            motor_load: parseFloat(facility.motor_load)
          };

          const response = await axios.get(`${FLASK_HOST_NAME}/predict`, {
            params: inputData
          });

          return {
            ...facility,
            model_prediction: response.data.prediction
          };
        } catch (err) {
          console.error(`Prediction failed for facility ID ${facility.id}:`, err.message);
          return {
            ...facility,
            model_prediction: "Unavailable"
          };
        }
      })
    );

    res.json(enrichedFacilities);
  } catch (error) {
    console.error("Error reading facilities data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET facility by ID
router.get("/:id", (req, res) => {
  const facilities = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const id = parseInt(req.params.id);
  const facility = facilities.find(f => f.id === id);

  if (!facility) {
    return res.status(404).json({ error: "Facility not found" });
  }

  res.json(facility);
});


// PATCH facility status by name
router.patch("/status", (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: "Missing 'name' or 'status' in body" });
  }

  const facilities = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const facility = facilities.find(f => f.name === name);

  if (!facility) {
    return res.status(404).json({ error: "Facility not found" });
  }

  facility.status = status;

  fs.writeFileSync(DATA_FILE, JSON.stringify(facilities, null, 2), "utf-8");

  res.json({ message: "Facility status updated", facility });
});

module.exports = router;
