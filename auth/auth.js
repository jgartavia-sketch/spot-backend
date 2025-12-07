const jwt = require("jsonwebtoken");

const SECRET_KEY = "ELSPOT_SUPER_SECRETO_2025"; // podés cambiarla si querés

exports.generarToken = (usuario) => {
  return jwt.sign(
    { usuario },
    SECRET_KEY,
    { expiresIn: "2h" } // dura 2 horas
  );
};

exports.verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ ok: false, msg: "Token faltante" });
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, msg: "Token inválido" });
    }

    req.usuario = decoded.usuario;
    next(); // continuar hacia la ruta protegida
  });
};
