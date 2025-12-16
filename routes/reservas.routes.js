const express = require("express");
const router = express.Router();

// ===============================
// CONTROLLER
// ===============================
const reservasController = require("../controllers/reservas.controller");

// ===============================
// LOGIN ADMIN (PÚBLICO)
// POST /api/reservas/login
// ===============================
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      ok: false,
      msg: "Usuario y contraseña requeridos",
    });
  }

  // ⚠️ Auth simple temporal (fase seguridad luego)
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
router.post("/", reservasController.crearReserva);

// =======================================
// LISTAR RESERVAS (TEMP SIN AUTH)
// GET /api/reservas
// =======================================
router.get("/", reservasController.listarReservasPaginadas);

// =======================================
// MARCAR RESERVA COMO REVISADA (TEMP SIN AUTH)
// PUT /api/reservas/:id/revisada
// =======================================
router.put("/:id/revisada", reservasController.marcarRevisada);

// =======================================
// ELIMINAR RESERVA (TEMP SIN AUTH)
// DELETE /api/reservas/:id
// =======================================
router.delete("/:id", reservasController.eliminarReserva);

module.exports = router;
