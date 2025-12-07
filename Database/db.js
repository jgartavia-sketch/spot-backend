const Database = require("better-sqlite3");

// Crear / abrir la base
const db = new Database("data.db", {
  verbose: console.log, // para debugging (podés quitarlo si querés)
});

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    motivo TEXT NOT NULL,
    mensaje TEXT,
    fecha TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    fecha_creada TEXT NOT NULL,
    fecha_actualizada TEXT NOT NULL
  );
`);

console.log("📦 Base de datos (better-sqlite3) inicializada correctamente.");

module.exports = db;
