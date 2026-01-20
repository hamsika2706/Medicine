require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nandu", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB (nandu)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const reminderRoutes = require("./routes/reminder");

app.use("/auth", authRoutes);
app.use("/reminders", reminderRoutes);

// Optional: Root endpoint for health check
app.get("/", (req, res) => {
    res.send("🚀 Medicine Reminder API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
