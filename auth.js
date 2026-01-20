const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Sign Up
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email already exists!" });

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign In
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        res.json({ message: "Login successful!", userEmail: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
