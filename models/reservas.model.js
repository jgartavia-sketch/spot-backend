// MODELO PROFESIONAL DE RESERVA

module.exports = {
  
  // ===============================
  // VALIDAR DATOS OBLIGATORIOS
  // ===============================
  validar: (data) => {
    const errores = [];

    if (!data.nombre || data.nombre.trim() === "") {
      errores.push("El nombre es obligatorio.");
    }

    if (!data.correo || data.correo.trim() === "") {
      errores.push("El correo es obligatorio.");
    }

    return errores;
  },


  // ===============================
  // NORMALIZAR / LIMPIAR DATOS
  // ===============================
  normalizar: (data) => {
    return {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono ? String(data.telefono).trim() : null,
      motivo: data.motivo && data.motivo.trim() !== "" ? data.motivo.trim() : "general",
      mensaje: data.mensaje && data.mensaje.trim() !== "" ? data.mensaje.trim() : null
    };
  },


  // ===============================
  // CREAR OBJETO FINAL PARA DB
  // ===============================
  crearObjetoReserva: (data) => {
    const ahora = new Date().toISOString();

    return {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      motivo: data.motivo,
      mensaje: data.mensaje,
      fecha: ahora,
      estado: "pendiente",
      fecha_creada: ahora,
      fecha_actualizada: ahora
    };
  }

};
