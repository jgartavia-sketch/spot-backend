// routes/reservas.routes.js

const express = require("express");
const router = express.Router();

// Controlador
const reservasController = require("../controllers/reservas.controller");

// Autenticación (JWT)
const auth = require("../auth/auth");

// ===============================
// LOGIN SIMPLE (PÚBLICO)
// ===============================
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "spot1234") {
    const token = auth.generarToken(usuario);
    return res.json({ ok: true, token });
  }

  return res.status(401).json({ ok: false, msg: "Credenciales incorrectas" });
});

// ===============================
// CREAR RESERVA (PÚBLICO)
// ===============================
router.post("/reservar", reservasController.crearReserva);

// ===============================
// LISTAR RESERVAS (PROTEGIDA)
// ===============================
router.get(
  "/reservas",
  auth.verificarToken,
  reservasController.listarReservasPaginadas
);

// ===============================
// MARCAR RESERVA COMO REVISADA (PROTEGIDA)
// ===============================
router.put(
  "/reservas/:id/revisada",
  auth.verificarToken,
  reservasController.marcarRevisada
);

// ===============================
// ELIMINAR RESERVA (PROTEGIDA)
// ===============================
router.delete(
  "/reservas/:id",
  auth.verificarToken,
  reservasController.eliminarReserva
);

module.exports = router;
