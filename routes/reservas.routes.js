// routes/reservas.routes.js

const express = require("express");
const router = express.Router();

const reservasController = require("../controllers/reservas.controller");
const auth = require("../middlewares/auth");

// =======================================
// CREAR RESERVA (PÚBLICO)
// POST /api/reservas
// =======================================
router.post("/", reservasController.crearReserva);

// =======================================
// LISTAR RESERVAS (PROTEGIDO)
// GET /api/reservas
// =======================================
router.get(
  "/",
  auth,
  reservasController.listarReservasPaginadas
);

// =======================================
// ACTUALIZAR ESTADO (PROTEGIDO)
// PUT /api/reservas/:id/estado
// =======================================
router.put(
  "/:id/estado",
  auth,
  reservasController.actualizarEstado
);

// =======================================
// ELIMINAR RESERVA (PROTEGIDO)
// DELETE /api/reservas/:id
// =======================================
router.delete(
  "/:id",
  auth,
  reservasController.eliminarReserva
);

module.exports = router;
