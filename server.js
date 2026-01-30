require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const paymentRoutes = require("./routes/payment");
const projectRoutes = require("./routes/projects");

const app = express(); // ✅ app FIRST

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/projects", projectRoutes); // ✅ now safe

app.get("/", (req, res) => {
  res.send("Backend running correctly 🚀");
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
