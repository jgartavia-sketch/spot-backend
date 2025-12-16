// backend/models/productos.model.js
// Modelo de dominio para Productos (validación + normalización)

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
      errores.push("El nombre del producto es obligatorio.");
    }

    if (data.precio === undefined || data.precio === null || isNaN(data.precio)) {
      errores.push("El precio del producto es obligatorio y debe ser numérico.");
    }

    return errores;
  },

  // ===============================
  // NORMALIZAR / LIMPIAR DATOS
  // ===============================
  normalizar(data) {
    return {
      nombre: data.nombre.trim(),
      descripcion:
        data.descripcion && data.descripcion.trim() !== ""
          ? data.descripcion.trim()
          : null,
      precio: Number(data.precio),
      imagen:
        data.imagen && data.imagen.trim() !== ""
          ? data.imagen.trim()
          : null,
    };
  },

  // ===============================
  // CREAR OBJETO FINAL PARA DB
  // ===============================
  crearObjetoProducto(data) {
    return {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      imagen: data.imagen,
    };
  },
};
