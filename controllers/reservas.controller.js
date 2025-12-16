const reservasService = require("../services/reservas.services");

// =======================================
// CREAR RESERVA
// =======================================
exports.crearReserva = async (req, res) => {
  try {
    console.log("📦 BODY RECIBIDO:", req.body);

    const {
      nombre,
      correo,
      telefono,
      motivo,
      mensaje,
      fecha
    } = req.body;

    // Validación mínima real
    if (!nombre || !correo || !telefono || !motivo || !fecha) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan campos obligatorios"
      });
    }

    const ahora = new Date();

    // Objeto alineado 1:1 con Railway
    const reserva = {
      nombre,
      correo,
      telefono,
      motivo,
      mensaje: mensaje || null,
      fecha,
      estado: "pendiente",
      creado_en: ahora,
      actualizado_en: ahora
    };

    console.log("🧱 INSERTANDO:", reserva);

    const id = await reservasService.crear(reserva);

    return res.json({
      ok: true,
      msg: "Reserva creada con éxito",
      id
    });

  } catch (error) {
    console.error("❌ ERROR INSERT RESERVA:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error guardando reserva"
    });
  }
};
