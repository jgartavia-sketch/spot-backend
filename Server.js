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
// HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.send("Backend SPOT corriendo OK");
});

// =====================
// SERVER LISTEN (NO BLOQUEANTE)
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Servidor iniciado", { port: PORT });
});

// =====================
// DB (NO BLOQUEANTE)
// =====================
require("./Database/db")
  .getConnection()
  .then(() => {
    logger.info("Conectado a MySQL (Railway)");
  })
  .catch((err) => {
    logger.error("Error conectando a MySQL", { error: err.message });
  });

// =====================
// ERROR HANDLER GLOBAL (SIEMPRE AL FINAL)
// =====================
app.use(errorHandler);
