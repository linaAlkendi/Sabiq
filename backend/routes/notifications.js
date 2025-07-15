const express = require("express");
const router = express.Router();
const { loadNotifications, createNotification } = require("../utils/notifier");

// GET all notifications
router.get("/", (req, res) => {
  const notifications = loadNotifications();
  res.json(notifications);
});

// POST a new notification
router.post("/", (req, res) => {
  const { title, description, color } = req.body;
  if (!title || !description || !color) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newNotification = createNotification({ title, description, color });
  res.status(201).json({ message: "Notification created", notification: newNotification });
});

module.exports = router;
