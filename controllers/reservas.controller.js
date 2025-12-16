// controllers/reservas.controller.js

const reservasService = require("../services/reservas.services");
const reservasModel = require("../models/reservas.model");

// =======================================
// CREAR RESERVA
// =======================================
exports.crearReserva = async (req, res) => {
  try {
    console.log("🔥 LLEGÓ AL CONTROLLER crearReserva");
    console.log("📦 BODY RECIBIDO:", req.body);

    // Validación
    const errores = reservasModel.validar(req.body);
    if (errores.length) {
      console.warn("⚠️ Errores de validación:", errores);
      return res.status(400).json({ ok: false, errores });
    }

    // Normalizar datos
    const limpio = reservasModel.normalizar(req.body);
    console.log("🧼 Datos normalizados:", limpio);

    // Crear objeto final según contrato DB
    const reserva = reservasModel.crearObjetoReserva(limpio);
    console.log("🧱 Objeto final para DB:", reserva);

    console.log("🧠 VOY A INSERTAR EN DB...");
    const id = await reservasService.crear(reserva);
    console.log("✅ INSERT EJECUTADO, ID:", id);

    return res.json({
      ok: true,
      msg: "Reserva creada con éxito",
      id
    });

  } catch (error) {
    console.error("❌ ERROR REAL AL INSERTAR RESERVA:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error guardando reserva"
    });
  }
};

// =======================================
// LISTAR RESERVAS PAGINADAS
// =======================================
exports.listarReservasPaginadas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await reservasService.listar({ page, limit });
    const total = await reservasService.contarTotal();

    return res.json({
      ok: true,
      page,
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    console.error("❌ Error obteniendo reservas:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error obteniendo reservas"
    });
  }
};

// =======================================
// MARCAR RESERVA COMO REVISADA
// =======================================
exports.marcarRevisada = async (req, res) => {
  try {
    const ok = await reservasService.marcarRevisada(req.params.id);

    if (!ok) {
      return res.status(404).json({
        ok: false,
        msg: "Reserva no encontrada"
      });
    }

    return res.json({
      ok: true,
      msg: "Reserva marcada como revisada"
    });

  } catch (error) {
    console.error("❌ Error actualizando reserva:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error actualizando reserva"
    });
  }
};

// =======================================
// ELIMINAR RESERVA
// =======================================
exports.eliminarReserva = async (req, res) => {
  try {
    const ok = await reservasService.eliminar(req.params.id);

    if (!ok) {
      return res.status(404).json({
        ok: false,
        msg: "Reserva no encontrada"
      });
    }

    return res.json({
      ok: true,
      msg: "Reserva eliminada correctamente"
    });

  } catch (error) {
    console.error("❌ Error eliminando reserva:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error eliminando reserva"
    });
  }
};
