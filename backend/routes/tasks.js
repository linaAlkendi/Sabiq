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

// GET /api/user/:username → returns all tasks for the specified user
router.get('/user/:username', (req, res) => {
    const username = req.params.username;

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to load tasks.' });

        const tasks = JSON.parse(data);
        const userTasks = tasks.filter(task => task.technician === username);
        res.json(userTasks);
    });
});

// PATCH /api/tasks/complete/:id → Mark a task as complete
router.put('/complete/:id', (req, res) => {
    const tasks = getAllTasks();
    const taskId = req.params.id;

    const taskIndex = tasks.findIndex((t) => t.id?.toString() === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

    tasks[taskIndex].status = "تم الإنجاز";
    saveAllTasks(tasks);
    res.json({ success: true, task: tasks[taskIndex] });
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

        const maxId = tasks.reduce((max, t) => t.id > max ? t.id : max, 0);

        const newTask = {
            id: maxId + 1,
            technician,
            facility,
            fault,
            severity,
            action,
            status: "بانتظار التنفيذ",
            assignedDate: new Date().toISOString().split("T")[0]
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
