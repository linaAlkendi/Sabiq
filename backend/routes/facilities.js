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

module.exports = router;
