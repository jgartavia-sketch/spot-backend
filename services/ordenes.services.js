const pool = require("../Database/db");

const ESTADOS_VALIDOS = new Set([
  "PENDIENTE",
  "CONFIRMADO",
  "PAGADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
]);

const METODOS_VALIDOS = new Set(["sinpe", "tarjeta", "efectivo"]);

function normalizeMetodoPago(v) {
  const val = String(v || "").trim().toLowerCase();
  return METODOS_VALIDOS.has(val) ? val : "sinpe";
}

function normalizeEstado(v) {
  const val = String(v || "").trim().toUpperCase();
  return ESTADOS_VALIDOS.has(val) ? val : "PENDIENTE";
}

function makeCodigo() {
  return `ORD-${Date.now()}`;
}

function must(val, field) {
  if (!val || String(val).trim() === "") {
    throw new Error(`Falta el campo obligatorio: ${field}`);
  }
  return String(val).trim();
}

function asInt(n, field) {
  const num = Number(n);
  if (!Number.isFinite(num)) throw new Error(`Campo inválido: ${field}`);
  return Math.trunc(num);
}

exports.crearOrden = async (payload) => {
  // Estructura esperada desde el front:
  // {
  //   buyer: { name, phone, email, address },
  //   payMethod: "sinpe"|"tarjeta"|"efectivo",
  //   items: [{ id, nombre, cat, precio, qty }],
  //   total: 12345
  // }

  const buyer = payload?.buyer || {};
  const items = Array.isArray(payload?.items) ? payload.items : [];

  if (!items.length) throw new Error("El carrito está vacío.");

  const cliente_nombre = must(buyer.name, "buyer.name");
  const cliente_telefono = must(buyer.phone, "buyer.phone");
  const cliente_correo = must(buyer.email, "buyer.email");
  const cliente_direccion = buyer.address ? String(buyer.address).trim() : null;

  const metodo_pago = normalizeMetodoPago(payload?.payMethod);
  const estado = "PENDIENTE";
  const codigo = makeCodigo();

  // Total: si viene, se usa; si no, se calcula
  let total = 0;
  if (payload?.total !== undefined && payload?.total !== null && payload?.total !== "") {
    total = asInt(payload.total, "total");
  } else {
    total = items.reduce((acc, it) => {
      const precio = asInt(it.precio, "item.precio");
      const qty = asInt(it.qty, "item.qty");
      return acc + precio * qty;
    }, 0);
  }

  // Transacción: insert orden + insert items
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [ordenRes] = await conn.execute(
      `INSERT INTO ordenes
        (codigo, estado, metodo_pago, total, cliente_nombre, cliente_telefono, cliente_correo, cliente_direccion, creado_en, actualizado_en)
       VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        codigo,
        estado,
        metodo_pago,
        total,
        cliente_nombre,
        cliente_telefono,
        cliente_correo,
        cliente_direccion,
      ]
    );

    const orden_id = ordenRes.insertId;

    for (const it of items) {
      const producto_id = must(it.id, "item.id");
      const producto_nombre = must(it.nombre, "item.nombre");
      const producto_categoria = it.cat ? String(it.cat).trim() : null;

      const precio_unitario = asInt(it.precio, "item.precio");
      const cantidad = asInt(it.qty, "item.qty");
      if (cantidad <= 0) throw new Error("Cantidad inválida en items.");

      const subtotal = precio_unitario * cantidad;

      await conn.execute(
        `INSERT INTO orden_items
          (orden_id, producto_id, producto_nombre, producto_categoria, precio_unitario, cantidad, subtotal, creado_en)
         VALUES
          (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          orden_id,
          producto_id,
          producto_nombre,
          producto_categoria,
          precio_unitario,
          cantidad,
          subtotal,
        ]
      );
    }

    await conn.commit();

    return {
      msg: "Orden creada",
      orden: { id: orden_id, codigo, estado, metodo_pago, total },
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.listarOrdenes = async () => {
  // Lista órdenes (más nuevas primero) + sus items
  const [ordenes] = await pool.execute(
    `SELECT id, codigo, estado, metodo_pago, total,
            cliente_nombre, cliente_telefono, cliente_correo, cliente_direccion,
            creado_en, actualizado_en
     FROM ordenes
     ORDER BY id DESC
     LIMIT 200`
  );

  if (!ordenes.length) return [];

  const ids = ordenes.map((o) => o.id);

  const [items] = await pool.query(
    `SELECT id, orden_id, producto_id, producto_nombre, producto_categoria,
            precio_unitario, cantidad, subtotal, creado_en
     FROM orden_items
     WHERE orden_id IN (?)
     ORDER BY id ASC`,
    [ids]
  );

  const map = new Map();
  ordenes.forEach((o) => map.set(o.id, { ...o, items: [] }));
  items.forEach((it) => {
    const ord = map.get(it.orden_id);
    if (ord) ord.items.push(it);
  });

  return Array.from(map.values());
};

exports.actualizarEstado = async (id, estado) => {
  const ordenId = asInt(id, "id");
  const newEstado = normalizeEstado(estado);

  const [res] = await pool.execute(
    `UPDATE ordenes
     SET estado = ?, actualizado_en = NOW()
     WHERE id = ?`,
    [newEstado, ordenId]
  );

  if (res.affectedRows === 0) {
    throw new Error("Orden no encontrada.");
  }

  return { msg: "Estado actualizado", id: ordenId, estado: newEstado };
};
