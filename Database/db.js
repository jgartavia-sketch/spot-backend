const mysql = require("mysql2/promise");

console.log("🌐 Inicializando pool de conexión MySQL...");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test rápido de conexión (no bloqueante)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL conectado correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
  }
})();

module.exports = pool;
