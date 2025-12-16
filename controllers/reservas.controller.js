const reservasService = require("../services/reservas.services");
const reservasModel = require("../models/reservas.model");

// CREAR RESERVA
exports.crearReserva = async (req, res, next) => {
  try {
    const errores = reservasModel.validar(req.body);
    if (errores.length) {
      const err = new Error(errores.join(" | "));
      err.statusCode = 400;
      throw err;
    }

    const limpio = reservasModel.normalizar(req.body);
    const reserva = reservasModel.crearObjetoReserva(limpio);

    const id = await reservasService.crear(reserva);

    res.json({
      ok: true,
      msg: "Reserva creada con éxito",
      id,
    });

  } catch (error) {
    next(error);
  }
};

// LISTAR
exports.listarReservasPaginadas = async (req, res, next) => {
  try {
    const data = await reservasService.listar(req.query);
    const total = await reservasService.contarTotal();

    res.json({
      ok: true,
      total,
      data,
    });

  } catch (error) {
    next(error);
  }
};

// ACTUALIZAR ESTADO
exports.actualizarEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    const errorEstado = reservasModel.validarEstado(estado);
    if (errorEstado) {
      const err = new Error(errorEstado);
      err.statusCode = 400;
      throw err;
    }

    const ok = await reservasService.actualizarEstado(id, estado);

    if (!ok) {
      const err = new Error("Reserva no encontrada");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      ok: true,
      msg: `Estado actualizado a '${estado}'`,
    });

  } catch (error) {
    next(error);
  }
};

// ELIMINAR
exports.eliminarReserva = async (req, res, next) => {
  try {
    const ok = await reservasService.eliminar(req.params.id);

    if (!ok) {
      const err = new Error("Reserva no encontrada");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      ok: true,
      msg: "Reserva eliminada",
    });

  } catch (error) {
    next(error);
  }
};
