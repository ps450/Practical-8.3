const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const verifyToken = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Sample users with roles
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "mod", password: "mod123", role: "Moderator" },
  { username: "user", password: "user123", role: "User" }
];

// Public route
app.get("/", (req, res) => {
  res.send("Welcome to Role-Based Access Control API");
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const foundUser = users.find(u => u.username === username && u.password === password);

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: foundUser.username, role: foundUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    role: foundUser.role,
    token
  });
});

// Protected routes
app.get("/user/profile", verifyToken, authorizeRoles("User", "Admin", "Moderator"), (req, res) => {
  res.json({ message: `Welcome to your profile, ${req.user.username}` });
});

app.get("/moderator/manage", verifyToken, authorizeRoles("Moderator", "Admin"), (req, res) => {
  res.json({ message: `Moderator access granted to ${req.user.username}` });
});

app.get("/admin/dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username} to your dashboard` });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
