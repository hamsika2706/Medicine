const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");

// Get reminders by user email
router.get("/:email", async (req, res) => {
    try {
        const reminders = await Reminder.find({ userEmail: req.params.email });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reminders" });
    }
});

// Add a new reminder
router.post("/", async (req, res) => {
    console.log("POST /reminders hit:", req.body); // 👈 Add this line
    try {
        const reminder = new Reminder(req.body);
        await reminder.save();
        res.status(201).json({ message: "Reminder added successfully", reminder });
    } catch (err) {
        console.error("Save Error:", err.message);
        res.status(400).json({ error: "Failed to add reminder", details: err.message });
    }
});


// Delete a reminder by ID
router.delete("/:id", async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.json({ message: "Reminder deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete reminder" });
    }
});

module.exports = router;
