// services/reservas.services.js
const db = require("../Database/db");

const TABLE = "reservas";

// LISTAR RESERVAS
async function listar({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT id, nombre, correo, telefono, motivo, mensaje, fecha, creado_en, estado, actualizado_en
     FROM ${TABLE}
     ORDER BY creado_en DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  return rows;
}

// CONTAR TOTAL
async function contarTotal() {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM ${TABLE}`
  );
  return rows[0].total;
}

// CREAR RESERVA
async function crear(data) {
  const now = new Date();

  const [result] = await db.query(
    `INSERT INTO ${TABLE}
     (nombre, correo, telefono, motivo, mensaje, fecha, estado, creado_en, actualizado_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.correo,
      data.telefono,
      data.motivo,
      data.mensaje,
      data.fecha,
      data.estado,
      now,
      now,
    ]
  );

  return result.insertId;
}

// ACTUALIZAR ESTADO
async function actualizarEstado(id, estado) {
  const [result] = await db.query(
    `UPDATE ${TABLE}
     SET estado = ?, actualizado_en = ?
     WHERE id = ?`,
    [estado, new Date(), id]
  );

  return result.affectedRows > 0;
}

// ELIMINAR
async function eliminar(id) {
  const [result] = await db.query(
    `DELETE FROM ${TABLE} WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listar,
  contarTotal,
  crear,
  actualizarEstado,
  eliminar,
};
