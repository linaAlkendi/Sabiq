const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");

router.get("/predict", (req, res) => {
  const scriptPath = path.join(__dirname, "../ai-model/analyze_incidents.py");

  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Error running prediction script." });
    }

    try {
      const output = JSON.parse(stdout); // نتوقع البايثون يرجّع JSON
      res.json(output);
    } catch (err) {
      console.error("Parsing error:", err.message);
      res.status(500).json({ error: "Invalid output from Python script." });
    }
  });
});

module.exports = router;
