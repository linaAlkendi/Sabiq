const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const TASKS_FILE = path.join(__dirname, "../data/tasks.json");

// Utility: read all tasks
function getAllTasks() {
    const data = fs.readFileSync(TASKS_FILE, "utf-8");
    return JSON.parse(data);
}

// Utility: save all tasks
function saveAllTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// GET /api/tasks → returns all tasks
router.get("/", (req, res) => {
    try {
        const tasks = getAllTasks();
        res.json(tasks);
    } catch (err) {
        console.error("Error reading tasks:", err);
        res.status(500).json({ message: "Failed to load tasks" });
    }
});

// POST /api/tasks → add a new task
router.post("/", (req, res) => {
    try {
        const { technician, facility, fault, severity, action } = req.body;

        // Basic validation
        if (!technician || !facility || !fault || !severity || !action) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const tasks = getAllTasks();

        const newTask = {
            technician,
            facility,
            fault,
            severity,
            action,
            status: "قيد التنفيذ",
            assignedDate: new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD
        };

        tasks.push(newTask);
        saveAllTasks(tasks);

        res.status(201).json({ message: "Task assigned successfully", task: newTask });
    } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).json({ message: "Failed to save task" });
    }
});

module.exports = router;
