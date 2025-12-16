const express = require("express");
const router = express.Router();

// ===============================
// CONTROLLER
// ===============================
const reservasController = require("../controllers/reservas.controller");

// ===============================
// AUTH (JWT)
// ===============================
const auth = require("../auth/auth");

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

  // ⚠️ Esto luego se mueve a BD (fase seguridad)
  if (usuario === "admin" && password === "spot1234") {
    const token = auth.generarToken({ usuario });
    return res.json({ ok: true, token });
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
// LISTAR RESERVAS (PROTEGIDO)
// GET /api/reservas
// =======================================
router.get(
  "/",
  auth.verificarToken,
  reservasController.listarReservasPaginadas
);

// =======================================
// MARCAR RESERVA COMO REVISADA (PROTEGIDO)
// PUT /api/reservas/:id/revisada
// =======================================
router.put(
  "/:id/revisada",
  auth.verificarToken,
  reservasController.marcarRevisada
);

// =======================================
// ELIMINAR RESERVA (PROTEGIDO)
// DELETE /api/reservas/:id
// =======================================
router.delete(
  "/:id",
  auth.verificarToken,
  reservasController.eliminarReserva
);

module.exports = router;
