// controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const usuariosService = require("../services/usuarios.services");
const usuariosModel = require("../models/usuarios.model");
const logger = require("../utils/logger");
const { generarToken } = require("../auth/jwt");

// =======================================
// LOGIN
// =======================================
exports.login = async (req, res, next) => {
  try {
    const errores = usuariosModel.validarLogin(req.body);
    if (errores.length) {
      const err = new Error("Credenciales inválidas");
      err.statusCode = 400;
      throw err;
    }

    const { email, password } = req.body;

    const usuario = await usuariosService.buscarPorEmail(email);

    // No revelar si existe o no
    if (!usuario) {
      const err = new Error("Credenciales inválidas");
      err.statusCode = 401;
      throw err;
    }

    const passwordOk = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordOk) {
      const err = new Error("Credenciales inválidas");
      err.statusCode = 401;
      throw err;
    }

    // ==========================
    // GENERAR JWT
    // ==========================
    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    logger.info("Login exitoso", {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.json({
      ok: true,
      msg: "Login correcto",
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    logger.warn("Intento de login fallido", {
      email: req.body?.email,
    });
    next(error);
  }
};
