const productosaService = require("../services/productosa.service");

// ===============================
// LISTAR PRODUCTOS
// ===============================
exports.listarProductos = async (req, res) => {
  try {
    const productos = await productosaService.obtenerTodos();
    return res.json({ ok: true, productos });
  } catch (err) {
    console.error("❌ listarProductos:", err);
    return res.status(500).json({ ok: false, msg: "Error listando productos" });
  }
};

// ===============================
// CREAR PRODUCTO
// ===============================
exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ ok: false, msg: "Nombre y precio requeridos" });
  }

  try {
    const id = await productosaService.crearProducto({
      nombre,
      descripcion,
      precio,
      imagen,
    });

    return res.json({ ok: true, msg: "Producto creado correctamente", id });
  } catch (err) {
    console.error("❌ crearProducto:", err);
    return res.status(500).json({ ok: false, msg: "Error creando producto" });
  }
};

// ===============================
// ACTUALIZAR PRODUCTO
// ===============================
exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const actualizado = await productosaService.actualizarProducto(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    }

    return res.json({ ok: true, msg: "Producto actualizado correctamente" });
  } catch (err) {
    console.error("❌ actualizarProducto:", err);
    return res.status(500).json({ ok: false, msg: "Error actualizando producto" });
  }
};

// ===============================
// ELIMINAR PRODUCTO
// ===============================
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await productosaService.eliminarProducto(id);

    if (!eliminado) {
      return res.status(404).json({ ok: false, msg: "Producto no encontrado" });
    }

    return res.json({ ok: true, msg: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("❌ eliminarProducto:", err);
    return res.status(500).json({ ok: false, msg: "Error eliminando producto" });
  }
};
