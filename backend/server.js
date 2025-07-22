const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const incidentRoutes = require("./routes/incidents");
const facilityRoutes = require("./routes/facilities");
const notificationsRoutes = require("./routes/notifications");

app.use(cors());
app.use(express.json());

// Route bindings
app.use("/incidents", incidentRoutes);
app.use("/facilities", facilityRoutes);
app.use("/notifications", notificationsRoutes);

const authRoutes = require("./routes/auth");

// بعد app.use(cors()) و app.use(express.json());
app.use("/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
