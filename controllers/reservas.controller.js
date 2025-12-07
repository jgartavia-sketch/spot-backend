const db = require("../Database/db");
const transporter = require("../email/mailer");


// =======================================
// CREAR RESERVA (FUNCIONA COMO ANTES)
// =======================================
exports.crearReserva = (req, res) => {
  const { nombre, correo, telefono, motivo, mensaje, fecha } = req.body;

  if (!nombre || !correo || !motivo || !fecha) {
    return res.status(400).json({ ok: false, msg: "Datos incompletos" });
  }

  const estado = "pendiente";
  const fecha_creada = new Date().toISOString();
  const fecha_actualizada = fecha_creada;

  db.run(
    `INSERT INTO reservas (nombre, correo, telefono, motivo, mensaje, fecha, estado, fecha_creada, fecha_actualizada)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, correo, telefono, motivo, mensaje, fecha, estado, fecha_creada, fecha_actualizada],
    function (err) {
      if (err) {
        console.log("❌ Error guardando reserva:", err);
        return res.status(500).json({ ok: false, msg: "Error guardando reserva" });
      }

      res.json({
        ok: true,
        msg: "Reserva creada con éxito",
        id: this.lastID
      });

      // Correos (opcional)
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
    }
  );
};


// =======================================
// LISTAR RESERVAS CON PAGINACIÓN + FILTROS
// =======================================
exports.listarReservasPaginadas = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { estado, motivo, inicio, fin, fecha, busqueda } = req.query;

  const where = [];
  const params = [];

  if (estado) {
    where.push("estado = ?");
    params.push(estado);
  }

  if (motivo) {
    where.push("motivo LIKE ?");
    params.push(`%${motivo}%`);
  }

  if (inicio) {
    where.push("date(fecha) >= date(?)");
    params.push(inicio);
  }

  if (fin) {
    where.push("date(fecha) <= date(?)");
    params.push(fin);
  }

  if (fecha) {
    where.push("date(fecha) = date(?)");
    params.push(fecha);
  }

  if (busqueda) {
    where.push("(nombre LIKE ? OR correo LIKE ? OR motivo LIKE ?)");
    params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
  }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sqlData = `
    SELECT *
    FROM reservas
    ${whereSQL}
    ORDER BY fecha_creada DESC
    LIMIT ? OFFSET ?
  `;

  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM reservas
    ${whereSQL}
  `;

  db.all(sqlData, [...params, limit, offset], (err, rows) => {
    if (err) {
      console.log("❌ Error obteniendo reservas:", err);
      return res.status(500).json({ ok: false, msg: "Error obteniendo reservas" });
    }

    db.get(sqlCount, params, (err2, count) => {
      if (err2) {
        console.log("❌ Error contando reservas:", err2);
        return res.status(500).json({ ok: false, msg: "Error obteniendo total" });
      }

      res.json({
        ok: true,
        page,
        totalPages: Math.ceil(count.total / limit),
        data: rows
      });
    });
  });
};


// =======================================
// MARCAR RESERVA COMO REVISADA
// =======================================
exports.marcarRevisada = (req, res) => {
  const id = req.params.id;

  db.run(
    "UPDATE reservas SET estado = 'revisada', fecha_actualizada = DATETIME('now') WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        console.log("❌ Error actualizando reserva:", err);
        return res.status(500).json({ ok: false, msg: "Error actualizando reserva" });
      }

      res.json({ ok: true, msg: "Reserva revisada correctamente" });
    }
  );
};


// =======================================
// ELIMINAR RESERVA
// =======================================
exports.eliminarReserva = (req, res) => {
  const id = req.params.id;

  console.log("🗑️ Eliminando reserva con ID:", id);

  if (!id) {
    console.log("❌ ID no recibido");
    return res.status(400).json({ ok: false, msg: "ID inválido" });
  }

  db.run("DELETE FROM reservas WHERE id = ?", [id], function (err) {
    if (err) {
      console.log("❌ Error eliminando reserva:", err);
      return res.status(500).json({ ok: false, msg: "Error eliminando reserva" });
    }

    if (this.changes === 0) {
      console.log("⚠ No se encontró reserva con ID:", id);
      return res.status(404).json({ ok: false, msg: "Reserva no encontrada" });
    }

    console.log("✅ Reserva eliminada correctamente:", id);
    res.json({ ok: true, msg: "Reserva eliminada correctamente" });
  });
};
