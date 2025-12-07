console.log("🔥 Server REAL ejecutándose — Arquitectura PRO activa");

const express = require("express");
const cors = require("cors");
const db = require("./Database/db");

// IMPORTAR RUTAS
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

// Render asigna dinámicamente el puerto
const PORT = process.env.PORT || 3000;

// CORS — permitir llamadas desde tu frontend (Render no falla con esto)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"]
}));

app.use(express.json());

// Confirmación DB
db.pragma("foreign_keys = ON");
console.log("📦 Base de datos SQLite conectada (better-sqlite3).");

// ===============================
// 🌱 RUTA RAÍZ — VERIFICAR API
// ===============================
app.get("/", (req, res) => {
  res.send("🌱 API El Spot Orgánico funcionando correctamente.");
});

// ===============================
// 🔥 ENDPOINT HEALTH (Render lo usa para diagnóstico)
// ===============================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ===============================
// 🚀 RUTAS DEL BACKEND
// ===============================
app.use("/api", reservasRoutes);

// ===============================
// 🚀 INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor en marcha en puerto ${PORT}`);
});
