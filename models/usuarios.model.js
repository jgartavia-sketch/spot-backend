// models/usuarios.model.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {

  validarLogin(data) {
    const errores = [];

    if (!data || typeof data !== "object") {
      errores.push("Datos inválidos");
      return errores;
    }

    if (!data.email || !EMAIL_REGEX.test(data.email)) {
      errores.push("Email inválido");
    }

    if (!data.password || data.password.length < 6) {
      errores.push("Password inválido");
    }

    return errores;
  },

  crearUsuario({ email, passwordHash, rol = "user" }) {
    return {
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      rol,
      creado_en: new Date(), // lo maneja el backend
    };
  }
};
