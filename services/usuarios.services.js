// services/usuarios.services.js

const db = require("../Database/db");

const TABLE = "usuarios";

// Buscar usuario por email
async function buscarPorEmail(email) {
  const [rows] = await db.query(
    `SELECT * FROM ${TABLE} WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
}

// Crear usuario
async function crear(usuario) {
  const { email, password_hash, rol, creado_en } = usuario;

  const [result] = await db.query(
    `INSERT INTO ${TABLE} (email, password_hash, rol, creado_en)
     VALUES (?, ?, ?, ?)`,
    [email, password_hash, rol, creado_en]
  );

  return result.insertId;
}

module.exports = {
  buscarPorEmail,
  crear,
};
