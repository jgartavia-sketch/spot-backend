require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =====================================
// MIDDLEWARES
// =====================================
app.use(cors());
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
// SERVIR FRONTEND (ESO)
// =====================================
app.use(express.static(path.join(__dirname, "../ESO")));

// ⚠️ CATCH-ALL CORRECTO (SIN "*")
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../ESO/index.html"));
});

// =====================================
// INICIAR SERVIDOR
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
