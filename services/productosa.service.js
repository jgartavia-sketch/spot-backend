// services/productosa.service.js
// Acceso a datos para la tabla `productosa`

const db = require("../Database/db");

const TABLE = "productosa";

// ============================================
// OBTENER TODOS LOS PRODUCTOS (PÚBLICO)
// ============================================
async function obtenerTodos() {
  const [rows] = await db.query(
    `SELECT 
       id, 
       nombre, 
       descripcion, 
       precio, 
       stock,
       imagen_url AS imagen,
       categoria
     FROM ${TABLE}
     ORDER BY id DESC`
  );
  return rows;
}

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================
async function obtenerPorId(id) {
  const [rows] = await db.query(
    `SELECT 
       id, 
       nombre, 
       descripcion, 
       precio, 
       stock,
       imagen_url AS imagen,
       categoria
     FROM ${TABLE}
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

// ============================================
// CREAR NUEVO PRODUCTO
// Nota: mapeamos "imagen" del cuerpo a "imagen_url" en la DB
// ============================================
async function crearProducto({ nombre, descripcion, precio, imagen, stock = 0, categoria = null }) {
  const [result] = await db.query(
    `INSERT INTO ${TABLE}
     (nombre, descripcion, precio, stock, imagen_url, categoria)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, precio, stock, imagen, categoria]
  );

  return result.insertId;
}

// ============================================
// ACTUALIZAR PRODUCTO
// ============================================
async function actualizarProducto(
  id,
  { nombre, descripcion, precio, imagen, stock, categoria }
) {
  const [result] = await db.query(
    `UPDATE ${TABLE}
     SET 
       nombre = ?, 
       descripcion = ?, 
       precio = ?, 
       stock = ?, 
       imagen_url = ?, 
       categoria = ?
     WHERE id = ?`,
    [nombre, descripcion, precio, stock, imagen, categoria, id]
  );

  return result.affectedRows > 0;
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================
async function eliminarProducto(id) {
  const [result] = await db.query(
    `DELETE FROM ${TABLE} WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
