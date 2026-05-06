// controllers/ordenes.controller.js

// ===============================
// BASE TEMPORAL EN MEMORIA
// ===============================

let ordenes = [
  {
    id: 1,
    estado: "PENDIENTE",
    total: 12500,
    creado_en: "2026-05-05 10:30 AM",
  },
  {
    id: 2,
    estado: "PAGADO",
    total: 21900,
    creado_en: "2026-05-05 02:10 PM",
  },
];

// ===============================
// GET - LISTAR ÓRDENES
// ===============================

exports.obtenerOrdenes = async (req, res) => {
  return res.json({
    ok: true,
    total: ordenes.length,
    data: ordenes,
  });
};

// ===============================
// POST - CREAR ORDEN
// ===============================

exports.crearOrden = async (req, res) => {
  console.log("🔥 DEBUG /api/ordenes LLEGÓ AQUÍ");
  console.log("📦 BODY:", req.body);

  const nuevaOrden = {
    id: Date.now(),
    estado: "PENDIENTE",
    total: req.body?.total || 0,
    creado_en: new Date().toLocaleString(),
  };

  ordenes.push(nuevaOrden);

  return res.status(201).json({
    ok: true,
    msg: "Orden creada correctamente",
    orden: nuevaOrden,
  });
};

// ===============================
// PATCH - ACTUALIZAR ESTADO
// ===============================

exports.actualizarEstadoOrden = async (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  const orden = ordenes.find((o) => o.id === id);

  if (!orden) {
    return res.status(404).json({
      ok: false,
      msg: "Orden no encontrada",
    });
  }

  orden.estado = estado;

  return res.json({
    ok: true,
    msg: "Estado actualizado",
    orden,
  });
};