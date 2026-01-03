const reservasService = require("../services/reservas.services");
const reservasModel = require("../models/reservas.model");
const logger = require("../utils/logger");

// =======================================
// CREAR RESERVA
// =======================================
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

    logger.info("Creando reserva", {
      correo: reserva.correo,
      fecha: reserva.fecha,
    });

    const id = await reservasService.crear(reserva);

    logger.info("Reserva creada", {
      id,
      correo: reserva.correo,
    });

    res.json({
      ok: true,
      msg: "Reserva creada con éxito",
      id,
    });

  } catch (error) {
    logger.error("Error creando reserva", {
      error: error.message,
    });
    next(error);
  }
};

// =======================================
// LISTAR RESERVAS
// =======================================
exports.listarReservasPaginadas = async (req, res, next) => {
  try {
    const data = await reservasService.listar(req.query);
    const total = await reservasService.contarTotal();

    logger.info("Listado de reservas", {
      total,
    });

    res.json({
      ok: true,
      total,
      data,
    });

  } catch (error) {
    logger.error("Error listando reservas", {
      error: error.message,
    });
    next(error);
  }
};

// =======================================
// ACTUALIZAR ESTADO
// =======================================
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

    logger.info("Estado de reserva actualizado", {
      id,
      estado,
    });

    res.json({
      ok: true,
      msg: `Estado actualizado a '${estado}'`,
    });

  } catch (error) {
    logger.error("Error actualizando estado de reserva", {
      error: error.message,
      id: req.params.id,
    });
    next(error);
  }
};

// =======================================
// ELIMINAR RESERVA
// =======================================
exports.eliminarReserva = async (req, res, next) => {
  try {
    const ok = await reservasService.eliminar(req.params.id);

    if (!ok) {
      const err = new Error("Reserva no encontrada");
      err.statusCode = 404;
      throw err;
    }

    logger.warn("Reserva eliminada", {
      id: req.params.id,
    });

    res.json({
      ok: true,
      msg: "Reserva eliminada",
    });

  } catch (error) {
    logger.error("Error eliminando reserva", {
      error: error.message,
      id: req.params.id,
    });
    next(error);
  }
};
