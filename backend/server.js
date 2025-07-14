const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const incidentRoutes = require("./routes/incidents");
const facilityRoutes = require("./routes/facilities");

app.use(cors());
app.use(express.json());

// Route bindings
app.use("/incidents", incidentRoutes);
app.use("/facilities", facilityRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
