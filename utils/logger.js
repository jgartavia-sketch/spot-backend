// utils/logger.js
// Logger simple y profesional para producción (Render friendly)

const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();

  console.log(
    JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    })
  );
};

module.exports = {
  info: (message, meta = {}) => log("info", message, meta),
  warn: (message, meta = {}) => log("warn", message, meta),
  error: (message, meta = {}) => log("error", message, meta),
};
