// scripts/seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../Database/db");

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Verificar si ya existe
    const [rows] = await db.query(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length) {
      console.log("⚠️ El admin ya existe. No se creó nada.");
      process.exit(0);
    }

    await db.query(
      `INSERT INTO usuarios (email, password_hash, rol, creado_en)
       VALUES (?, ?, 'admin', ?)`,
      [email, passwordHash, new Date()]
    );

    console.log("✅ Admin inicial creado con éxito");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error creando admin:", error.message);
    process.exit(1);
  }
})();
