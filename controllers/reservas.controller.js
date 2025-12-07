const db = require("../Database/db");
const transporter = require("../email/mailer");

// =======================================
// CREAR RESERVA
// =======================================
exports.crearReserva = (req, res) => {
  const { nombre, correo, telefono, motivo, mensaje, fecha } = req.body;

  if (!nombre || !correo || !motivo || !fecha) {
    return res.status(400).json({ ok: false, msg: "Datos incompletos" });
  }

  const estado = "pendiente";
  const fecha_creada = new Date().toISOString();
  const fecha_actualizada = fecha_creada;

  try {
    const stmt = db.prepare(`
      INSERT INTO reservas (nombre, correo, telefono, motivo, mensaje, fecha, estado, fecha_creada, fecha_actualizada)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      nombre,
      correo,
      telefono,
      motivo,
      mensaje,
      fecha,
      estado,
      fecha_creada,
      fecha_actualizada
    );

    res.json({
      ok: true,
      msg: "Reserva creada con éxito",
      id: result.lastInsertRowid
    });

    // Enviar correo (opcional)
    try {
      transporter.sendMail({
        from: "Sistema Reservas <noreply@spot.com>",
        to: correo,
        subject: "Reserva recibida",
        html: `<p>Hemos recibido tu reserva, ${nombre}</p>`
      });
    } catch (e) {
      console.log("⚠ No se pudo enviar correo al cliente");
    }

  } catch (err) {
    console.log("❌ Error guardando reserva:", err);
    return res.status(500).json({ ok: false, msg: "Error guardando reserva" });
  }
};

// =======================================
// LISTAR RESERVAS (paginadas)
// =======================================
exports.listarReservasPaginadas = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const stmt = db.prepare(`
      SELECT * FROM reservas
      ORDER BY fecha_creada DESC
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(limit, offset);

    const total = db.prepare("SELECT COUNT(*) AS total FROM reservas").get().total;

    res.json({
      ok: true,
      page,
      totalPages: Math.ceil(total / limit),
      data: rows
    });

  } catch (err) {
    console.log("❌ Error obteniendo reservas:", err);
    return res.status(500).json({ ok: false, msg: "Error obteniendo reservas" });
  }
};

// =======================================
// MARCAR RESERVA COMO REVISADA
// =======================================
exports.marcarRevisada = (req, res) => {
  const id = req.params.id;

  try {
    db.prepare(`
      UPDATE reservas
      SET estado = 'revisada',
          fecha_actualizada = ?
      WHERE id = ?
    `).run(new Date().toISOString(), id);

    res.json({ ok: true, msg: "Reserva revisada correctamente" });

  } catch (err) {
    console.log("❌ Error actualizando reserva:", err);
    return res.status(500).json({ ok: false, msg: "Error actualizando reserva" });
  }
};

// =======================================
// ELIMINAR RESERVA
// =======================================
exports.eliminarReserva = (req, res) => {
  const id = req.params.id;

  try {
    const result = db.prepare("DELETE FROM reservas WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ ok: false, msg: "Reserva no encontrada" });
    }

    res.json({ ok: true, msg: "Reserva eliminada correctamente" });

  } catch (err) {
    console.log("❌ Error eliminando reserva:", err);
    return res.status(500).json({ ok: false, msg: "Error eliminando reserva" });
  }
};
