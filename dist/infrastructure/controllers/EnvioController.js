"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioController = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class EnvioController {
    constructor(actualizarEstadoUseCase) {
        this.actualizarEstadoUseCase = actualizarEstadoUseCase;
        this.actualizarEstado = async (req, res) => {
            try {
                const id = String(req.params.id);
                const { estado_orden, usuario_id, motivo_cancelacion } = req.body;
                const envioActualizado = await this.actualizarEstadoUseCase.execute({
                    id_envio: id,
                    estado_orden,
                    usuario_id,
                    motivo_cancelacion,
                });
                res.status(200).json({
                    mensaje: 'Estado actualizado con éxito',
                    orden_id: envioActualizado.id_envio,
                    fecha_hora: new Date().toISOString(),
                });
            }
            catch (error) {
                if (error instanceof Envio_1.DomainError) {
                    res.status(error.statusCode).json({
                        codigoError: error.codigoError,
                        mensaje: error.message,
                    });
                    return;
                }
                res.status(500).json({
                    codigoError: 'INTERNAL_SERVER_ERROR',
                    mensaje: 'Error interno del servidor',
                });
            }
        };
    }
}
exports.EnvioController = EnvioController;
