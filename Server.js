require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================================
// CORS CONFIGURACIÓN PRO (RENDER READY)
// =====================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "https://spot-front.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // permitir requests sin origin (Postman, Render healthcheck)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(
        new Error("Not allowed by CORS")
      );
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔑 MUY IMPORTANTE: manejar preflight
app.options("*", cors());

// =====================================
// MIDDLEWARES
// =====================================
app.use(express.json());

// =====================================
// CONEXIÓN A BASE DE DATOS
// =====================================
require("./Database/db");

// =====================================
// RUTAS API
// =====================================
const reservasRoutes = require("./routes/reservas.routes");
const productosaRoutes = require("./routes/productosa.routes");

app.use("/api/reservas", reservasRoutes);
app.use("/api/productosa", productosaRoutes);

// =====================================
// SERVIR FRONTEND (SOLO LOCAL)
// =====================================
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "../ESO")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../ESO/index.html"));
  });
}

// =====================================
// HEALTHCHECK (RENDER LO NECESITA)
// =====================================
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend El Spot Orgánico activo" });
});

// =====================================
// INICIAR SERVIDOR
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
