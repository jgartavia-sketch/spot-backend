// middlewares/auth.js
const { verificarToken } = require("../auth/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      msg: "Token requerido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verificarToken(token);
    req.user = decoded; // id, email, rol
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token inválido o expirado",
    });
  }
};
