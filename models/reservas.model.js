// models/reservas.model.js
// Dominio de Reservas: validación + normalización

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {

  // ===============================
  // VALIDACIONES AVANZADAS
  // ===============================
  validar(data) {
    const errores = [];

    if (!data || typeof data !== "object") {
      errores.push("Datos inválidos.");
      return errores;
    }

    // Nombre
    if (!data.nombre || data.nombre.trim().length < 2) {
      errores.push("El nombre es obligatorio y debe tener al menos 2 caracteres.");
    }

    // Correo
    if (!data.correo || !EMAIL_REGEX.test(data.correo)) {
      errores.push("El correo no tiene un formato válido.");
    }

    // Teléfono
    if (!data.telefono || String(data.telefono).trim().length < 8) {
      errores.push("El teléfono es obligatorio y debe ser válido.");
    }

    // Fecha
    if (!data.fecha) {
      errores.push("La fecha es obligatoria.");
    } else {
      const fechaReserva = new Date(data.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (isNaN(fechaReserva.getTime())) {
        errores.push("La fecha no es válida.");
      } else if (fechaReserva < hoy) {
        errores.push("La fecha no puede ser pasada.");
      }
    }

    return errores;
  },

  // ===============================
  // NORMALIZAR DATOS
  // ===============================
  normalizar(data) {
    return {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: String(data.telefono).trim(),
      motivo:
        data.motivo && data.motivo.trim() !== ""
          ? data.motivo.trim()
          : "general",
      mensaje:
        data.mensaje && data.mensaje.trim() !== ""
          ? data.mensaje.trim()
          : null,
      fecha: data.fecha,
    };
  },

  // ===============================
  // OBJETO FINAL PARA DB
  // ===============================
  crearObjetoReserva(data) {
    const now = new Date();

    return {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      motivo: data.motivo,
      mensaje: data.mensaje,
      fecha: data.fecha,
      estado: "pendiente",
      creado_en: now,
      actualizado_en: now,
    };
  },
};
