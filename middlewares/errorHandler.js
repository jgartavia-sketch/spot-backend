// middlewares/errorHandler.js

const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  logger.error("Error global capturado", {
    status,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    ok: false,
    msg: status === 500
      ? "Error interno del servidor"
      : err.message,
  });
};
