// middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error("❌ ERROR GLOBAL:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const status = err.statusCode || 500;

  res.status(status).json({
    ok: false,
    msg: status === 500
      ? "Error interno del servidor"
      : err.message,
  });
};
