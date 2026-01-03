require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// =====================================
// MIDDLEWARES
// =====================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =====================================
// CONEXIÓN A BASE DE DATOS
// =====================================
require("./Database/db");

// =====================================
// HEALTHCHECK + ROOT (para Render)
// =====================================
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "El Spot Orgánico Backend OK ✅" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

// =====================================
// RUTAS API
// =====================================
const reservasRoutes = require("./routes/reservas.routes");
const productosaRoutes = require("./routes/productosa.routes");

app.use("/api/reservas", reservasRoutes);
app.use("/api/productosa", productosaRoutes);

// =====================================
// 404
// =====================================
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: "Ruta no encontrada" });
});

// =====================================
// INICIAR SERVIDOR (RENDER)
// =====================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
