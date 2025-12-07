console.log("🔥 Server REAL ejecutándose — Arquitectura PRO activa");

const express = require("express");
const cors = require("cors");
const db = require("./Database/db");

// IMPORTAR RUTAS
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

// *** PUERTO CORREGIDO PARA RENDER ***
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Confirmación DB
db.serialize(() => {
  console.log("📦 Base de datos SQLite conectada.");
});

// RUTAS DEL BACKEND – SOLO UNA VEZ
app.use("/api", reservasRoutes);

// Ruta raíz (para probar funcionamiento)
app.get("/", (req, res) => {
  res.send("🌱 Servidor de El Spot Orgánico ONLINE");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en marcha en el puerto ${PORT}`);
});
