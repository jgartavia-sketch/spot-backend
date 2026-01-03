// auth/jwt.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!SECRET) {
  throw new Error("JWT_SECRET no definido en .env");
}

const generarToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

const verificarToken = (token) =>
  jwt.verify(token, SECRET);

module.exports = {
  generarToken,
  verificarToken,
};
