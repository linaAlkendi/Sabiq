require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const incidentRoutes = require("./routes/incidents");
const facilityRoutes = require("./routes/facilities");
const notificationsRoutes = require("./routes/notifications");
const predictRoute = require("./routes/predict");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/detailed-log"); 
const tasksRouter = require("./routes/tasks");

app.use(cors());
app.use(express.json());

// Route bindings
app.use("/incidents", incidentRoutes);
app.use("/facilities", facilityRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/auth", authRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/detailed-log", dataRoutes); 
app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
