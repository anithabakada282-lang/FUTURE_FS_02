const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // ✅ LOAD ENV VARIABLES

const app = express();

// Middleware
app.use(cors({
  origin: "*", // later restrict to Netlify URL
}));
app.use(express.json());

// ✅ MongoDB connection (FROM .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ------------------- LOGIN ROUTE -------------------
app.post("/api/login", (req, res) => {
  console.log("LOGIN HIT ✔");
  console.log("BODY:", req.body);

  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET, // ✅ FROM ENV
      { expiresIn: "1d" }
    );

    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// ------------------- LEADS ROUTES -------------------
app.use("/api/leads", require("./routes/leadRoutes"));

// Root route
app.get("/", (req, res) => res.send("API Running..."));

// ✅ USE DYNAMIC PORT (RENDER NEEDS THIS)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));