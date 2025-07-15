const fs = require("fs");
const path = require("path");

const NOTIFICATIONS_FILE = path.join(__dirname, "../data/notifications.json");

function loadNotifications() {
  if (!fs.existsSync(NOTIFICATIONS_FILE)) return [];
  const data = fs.readFileSync(NOTIFICATIONS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveNotifications(notifications) {
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), "utf-8");
}

function createNotification({ title, description, color }) {
  const notifications = loadNotifications();
  const newId = notifications.reduce((max, n) => (n.id > max ? n.id : max), 0) + 1;

  const newNotification = {
    id: newId,
    title,
    description,
    color,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19)
  };

  notifications.push(newNotification);
  saveNotifications(notifications);
  return newNotification;
}

module.exports = {
  loadNotifications,
  createNotification
};
