// routes/auth.routes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// =======================================
// LOGIN
// Ruta final dependerá del app.use() en server.js
// Ej: app.use("/api/auth", router) => POST /api/auth/login
// =======================================
router.post("/login", authController.login);

module.exports = router;
