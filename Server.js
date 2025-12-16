require("dotenv").config();
const express = require("express");
const cors = require("cors");

const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// =====================
// RUTAS
// =====================
app.use("/api/reservas", require("./routes/reservas.routes"));

// =====================
// HEALTH CHECKS PRO
// =====================

// Liveness: proceso vivo
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Readiness: app lista (sin bloquear)
let dbReady = false;

require("./Database/db")
  .getConnection()
  .then(() => {
    dbReady = true;
    logger.info("Conectado a MySQL (Railway)");
  })
  .catch((err) => {
    dbReady = false;
    logger.error("Error conectando a MySQL", { error: err.message });
  });

app.get("/ready", (req, res) => {
  if (!dbReady) {
    return res.status(503).json({
      status: "not_ready",
      reason: "DB no disponible",
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

// =====================
// SERVER LISTEN (NO BLOQUEANTE)
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Servidor iniciado", { port: PORT });
});

// =====================
// ERROR HANDLER GLOBAL (SIEMPRE AL FINAL)
// =====================
app.use(errorHandler);
