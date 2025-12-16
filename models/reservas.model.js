// Modelo de dominio para Reservas (validación + normalización)

module.exports = {

  // ===============================
  // VALIDAR DATOS OBLIGATORIOS
  // ===============================
  validar(data) {
    const errores = [];

    if (!data || typeof data !== "object") {
      errores.push("Datos inválidos.");
      return errores;
    }

    if (!data.nombre || data.nombre.trim() === "") {
      errores.push("El nombre es obligatorio.");
    }

    if (!data.correo || data.correo.trim() === "") {
      errores.push("El correo es obligatorio.");
    }

    if (!data.fecha || data.fecha.trim() === "") {
      errores.push("La fecha es obligatoria.");
    }

    return errores;
  },

  // ===============================
  // NORMALIZAR / LIMPIAR DATOS
  // ===============================
  normalizar(data) {
    return {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono ? String(data.telefono).trim() : null,
      motivo:
        data.motivo && data.motivo.trim() !== ""
          ? data.motivo.trim()
          : "general",
      mensaje:
        data.mensaje && data.mensaje.trim() !== ""
          ? data.mensaje.trim()
          : null,
      fecha: data.fecha.trim(), // 👈 ahora sí
    };
  },

  // ===============================
  // CREAR OBJETO FINAL PARA DB
  // ===============================
  crearObjetoReserva(data) {
    const now = new Date();

    return {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      motivo: data.motivo,
      mensaje: data.mensaje,
      fecha: data.fecha, // 👈 la fecha del usuario
      estado: "pendiente",
      creado_en: now,
      actualizado_en: now,
    };
  },
};
