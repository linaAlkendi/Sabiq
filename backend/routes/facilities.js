const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_FILE = path.join(__dirname, "../data/facilities.json");

// GET all facilities
router.get("/", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  res.json(JSON.parse(data));
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
