const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const leadRoutes = require("./routes/leadRoutes");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/leads", authMiddleware, leadRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.get("/", (req, res) => {
      res.json({
        message: "CRM Backend API is running!"
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  }
}

startServer();