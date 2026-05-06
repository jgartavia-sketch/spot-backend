// services/ordenes.service.js
// Acceso a datos para la tabla `ordenes`

const db = require("../Database/db");
const TABLE = "ordenes";

// Crear nueva orden
async function crearOrden({ nombre, correo, telefono, direccion, metodo_pago, total, items }) {
  const itemsJson = JSON.stringify(items || []);

  const [result] = await db.query(
    `INSERT INTO ${TABLE}
     (nombre, correo, telefono, direccion, metodo_pago, total, items_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, correo, telefono, direccion, metodo_pago, total, itemsJson]
  );

  return result.insertId;
}

// (Opcional) obtener orden por id
async function obtenerPorId(id) {
  const [rows] = await db.query(
    `SELECT id, nombre, correo, telefono, direccion, metodo_pago, total, items_json, creado_en
     FROM ${TABLE}
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  crearOrden,
  obtenerPorId,
};
