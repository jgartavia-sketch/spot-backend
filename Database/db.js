// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

console.log("🌐 Inicializando pool de conexión MySQL (LOCAL)...");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test rápido de conexión (no bloqueante)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL LOCAL conectado correctamente a la base:", process.env.DB_NAME);
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL LOCAL:", error.message);
  }
})();

module.exports = pool;
