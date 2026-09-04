const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        username: username,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login"
    });
  }
});

module.exports = router;