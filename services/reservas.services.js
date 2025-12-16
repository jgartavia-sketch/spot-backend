// services/reservas.services.js
// Lógica de acceso a datos para la tabla `reservas`

const db = require("../Database/db");

const TABLE = "reservas";

// ============================================
// LISTAR RESERVAS (PAGINADAS)
// ============================================
async function listar({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT id, nombre, correo, telefono, motivo, mensaje, fecha, estado, fecha_creada, fecha_actualizada
     FROM ${TABLE}
     ORDER BY fecha_creada DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  return rows;
}

// ============================================
// CONTAR TOTAL DE RESERVAS
// ============================================
async function contarTotal() {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM ${TABLE}`
  );

  return rows[0].total;
}

// ============================================
// CREAR RESERVA
// ============================================
async function crear(data) {
  const {
    nombre,
    correo,
    telefono,
    motivo,
    mensaje,
    fecha,
    estado = "pendiente",
  } = data;

  const now = new Date();

  const [result] = await db.query(
    `INSERT INTO ${TABLE}
     (nombre, correo, telefono, motivo, mensaje, fecha, estado, creado_en, actualizada_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      correo,
      telefono,
      motivo,
      mensaje,
      fecha,
      estado,
      now,
      now,
    ]
  );

  return result.insertId;
}

// ============================================
// MARCAR RESERVA COMO REVISADA
// ============================================
async function marcarRevisada(id) {
  const [result] = await db.query(
    `UPDATE ${TABLE}
     SET estado = 'revisada', actualizado_en = ?
     WHERE id = ?`,
    [new Date(), id]
  );

  return result.affectedRows > 0;
}

// ============================================
// ELIMINAR RESERVA
// ============================================
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
  marcarRevisada,
  eliminar,
};
