// middlewares/requireAdmin.js

module.exports = (req, res, next) => {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({
      ok: false,
      msg: "Acceso denegado: se requiere rol admin",
    });
  }

  next();
};
