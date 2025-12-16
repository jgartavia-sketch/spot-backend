const jwt = require("jsonwebtoken");

// ===============================
// CONFIGURACIÓN
// ===============================
const SECRET_KEY = process.env.JWT_SECRET;

// ===============================
// GENERAR TOKEN
// ===============================
exports.generarToken = (payload) => {
  return jwt.sign(
    payload,
    SECRET_KEY,
    { expiresIn: "2h" }
  );
};

// ===============================
// VERIFICAR TOKEN
// ===============================
exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      ok: false,
      msg: "Token faltante",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token inválido o expirado",
    });
  }
};
