const express = require("express");
const router = express.Router();

// ===============================
// CONTROLLER
// ===============================
const productosaController = require("../controllers/productosa.controller");

// ===============================
// AUTH (JWT)
// ===============================
const auth = require("../auth/auth");

// =============================================
// LISTAR PRODUCTOS (PÚBLICO)
// GET /api/productosa
// =============================================
router.get("/", productosaController.listarProductos);

// =============================================
// CREAR PRODUCTO (PROTEGIDO)
// POST /api/productosa
// =============================================
router.post(
  "/",
  auth.verificarToken,
  productosaController.crearProducto
);

// =============================================
// ACTUALIZAR PRODUCTO (PROTEGIDO)
// PUT /api/productosa/:id
// =============================================
router.put(
  "/:id",
  auth.verificarToken,
  productosaController.actualizarProducto
);

// =============================================
// ELIMINAR PRODUCTO (PROTEGIDO)
// DELETE /api/productosa/:id
// =============================================
router.delete(
  "/:id",
  auth.verificarToken,
  productosaController.eliminarProducto
);

module.exports = router;
