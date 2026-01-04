const ordenesService = require("../services/ordenes.services");

// POST /api/ordenes
exports.crearOrden = async (req, res) => {
  try {
    const result = await ordenesService.crearOrden(req.body);
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    console.error("❌ Error crearOrden:", err.message);
    return res.status(400).json({ ok: false, msg: err.message });
  }
};

// GET /api/ordenes
exports.listarOrdenes = async (req, res) => {
  try {
    const data = await ordenesService.listarOrdenes();
    return res.json({ ok: true, data });
  } catch (err) {
    console.error("❌ Error listarOrdenes:", err.message);
    return res.status(500).json({ ok: false, msg: "Error listando órdenes" });
  }
};

// PATCH /api/ordenes/:id
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const result = await ordenesService.actualizarEstado(id, estado);
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error("❌ Error actualizarEstado:", err.message);
    return res.status(400).json({ ok: false, msg: err.message });
  }
};
