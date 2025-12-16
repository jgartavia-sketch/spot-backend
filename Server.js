require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
// INICIAR SERVIDOR (RENDER)
// =====================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
