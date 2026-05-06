// routes/ordenes.routes.js

const express = require("express");
const router = express.Router();

const ordenesController = require("../controllers/ordenes.controller");

// ======================================
// GET - LISTAR ÓRDENES
// ======================================
// GET http://localhost:3000/api/ordenes
router.get("/", ordenesController.obtenerOrdenes);

// ======================================
// POST - CREAR ORDEN
// ======================================
// POST http://localhost:3000/api/ordenes
router.post("/", ordenesController.crearOrden);

// ======================================
// PATCH - ACTUALIZAR ESTADO
// ======================================
// PATCH http://localhost:3000/api/ordenes/:id
router.patch("/:id", ordenesController.actualizarEstadoOrden);

module.exports = router;