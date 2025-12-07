// database/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta donde se guardará el archivo de base de datos
const dbPath = path.join(__dirname, "reservas.db");

// Abre o crea la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err);
  } else {
    console.log("Base de datos SQLite funcionando ✨ —", dbPath);
  }
});

// Crear tabla si NO existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL,
      telefono TEXT,
      motivo TEXT NOT NULL,
      mensaje TEXT,
      fecha TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Error creando la tabla reservas:", err);
    } else {
      console.log("Tabla 'reservas' verificada/creada.");
    }
  });
});

module.exports = db;
