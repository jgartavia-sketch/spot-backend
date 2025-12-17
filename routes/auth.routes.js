// routes/auth.routes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// =======================================
// LOGIN
// POST /api/auth/login
// =======================================
router.post("/login", authController.login);

module.exports = router;
