const express = require("express");
const router = express.Router();

// ===============================
// CONTROLLER
// ===============================
const reservasController = require("../controllers/reservas.controller");

// ===============================
// HELPERS DE SEGURIDAD
// ===============================
const safe = (fn) => {
  if (typeof fn !== "function") {
    return (req, res) =>
      res.status(500).json({
        ok: false,
        msg: "Handler no disponible en el servidor"
      });
  }
  return fn;
};

// =======================================
// LOGIN ADMIN (PÚBLICO)
// POST /api/reservas/login
// =======================================
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      ok: false,
      msg: "Usuario y contraseña requeridos",
    });
  }

  if (usuario === "admin" && password === "spot1234") {
    return res.json({
      ok: true,
      token: "TEMP_TOKEN_DEV"
    });
  }

  return res.status(401).json({
    ok: false,
    msg: "Credenciales incorrectas",
  });
});

// =======================================
// CREAR RESERVA (PÚBLICO)
// POST /api/reservas
// =======================================
router.post("/", safe(reservasController.crearReserva));

// =======================================
// LISTAR RESERVAS
// GET /api/reservas
// =======================================
router.get("/", safe(reservasController.listarReservasPaginadas));

// =======================================
// MARCAR RESERVA COMO REVISADA
// PUT /api/reservas/:id/revisada
// =======================================
router.put(
  "/:id/revisada",
  safe(reservasController.marcarRevisada)
);

// =======================================
// ELIMINAR RESERVA
// DELETE /api/reservas/:id
// =======================================
router.delete(
  "/:id",
  safe(reservasController.eliminarReserva)
);

module.exports = router;
