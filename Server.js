const errorHandler = require("./middlewares/errorHandler");

require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
// HEALTH CHECK (CLAVE)
// =====================
app.get("/", (req, res) => {
  res.send("Backend SPOT corriendo OK");
});

// =====================
// SERVER LISTEN (ANTES DB)
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// =====================
// DB (NO BLOQUEANTE)
// =====================
require("./Database/db")
  .getConnection()
  .then(() => {
    console.log("✅ Conectado a MySQL (Railway)");
  })
  .catch((err) => {
    console.error("⚠️ Error conectando a MySQL:", err.message);
  });
app.use(errorHandler);
