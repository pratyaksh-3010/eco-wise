const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const searchRoutes = require("./routes/search");
const historyRoutes = require("./routes/history");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// Routes
app.use("/api/search", searchRoutes);
app.use("/api/history", historyRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Eco Product Finder API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});