const express = require("express");
const router = express.Router();

const reservasController = require("../controllers/reservas.controller");

// CREAR RESERVA
router.post("/", reservasController.crearReserva);

// LISTAR RESERVAS
router.get("/", reservasController.listarReservasPaginadas);

// ACTUALIZAR ESTADO
router.put("/:id/estado", reservasController.actualizarEstado);

// ELIMINAR
router.delete("/:id", reservasController.eliminarReserva);

module.exports = router;
