// routes/reservas.routes.js

const express = require("express");
const router = express.Router();

const reservasController = require("../controllers/reservas.controller");
const auth = require("../middlewares/auth");
const requireAdmin = require("../middlewares/requireAdmin");

// =======================================
// CREAR RESERVA (PÚBLICO)
// =======================================
router.post("/", reservasController.crearReserva);

// =======================================
// LISTAR RESERVAS (TOKEN)
// =======================================
router.get(
  "/",
  auth,
  reservasController.listarReservasPaginadas
);

// =======================================
// ACTUALIZAR ESTADO (ADMIN)
// =======================================
router.put(
  "/:id/estado",
  auth,
  requireAdmin,
  reservasController.actualizarEstado
);

// =======================================
// ELIMINAR RESERVA (ADMIN)
// =======================================
router.delete(
  "/:id",
  auth,
  requireAdmin,
  reservasController.eliminarReserva
);

module.exports = router;
