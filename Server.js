console.log("🔥 Server REAL ejecutándose — Arquitectura PRO activa");

const express = require("express");
const cors = require("cors");
const db = require("./Database/db");

const reservasRoutes = require("./routes/reservas.routes");

const app = express();

// Render asigna el puerto vía variable de entorno
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Confirmación DB
db.serialize(() => {
  console.log("📦 Base de datos SQLite conectada.");
});

// RUTAS
app.use("/api", reservasRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🌱 Servidor de El Spot Orgánico ONLINE");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en marcha en puerto ${PORT}`);
});
