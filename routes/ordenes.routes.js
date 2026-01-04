const express = require("express");
const router = express.Router();

const ordenesController = require("../controllers/ordenes.controller");

// POST /api/ordenes -> crear orden + items
router.post("/", ordenesController.crearOrden);

// GET /api/ordenes -> listar ordenes (con items)
router.get("/", ordenesController.listarOrdenes);

// PATCH /api/ordenes/:id -> actualizar estado
router.patch("/:id", ordenesController.actualizarEstado);

module.exports = router;
