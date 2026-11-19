"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarEstadoEnvioUseCase = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class ActualizarEstadoEnvioUseCase {
    constructor(envioRepository) {
        this.envioRepository = envioRepository;
    }
    async execute(input) {
        if (!input.usuario_id || (!input.motivo_cancelacion && input.estado_orden === 'CANCELLED')) {
            throw new Envio_1.DomainError('usuario_id y motivo_cancelacion son obligatorios para cancelar', 400, 'BAD_REQUEST');
        }
        const envio = await this.envioRepository.findById(input.id_envio);
        if (!envio) {
            throw new Envio_1.DomainError('Orden no encontrada', 404, 'NOT_FOUND');
        }
        envio.cambiarEstado(input.estado_orden, input.usuario_id, input.motivo_cancelacion);
        return await this.envioRepository.update(envio);
    }
}
exports.ActualizarEstadoEnvioUseCase = ActualizarEstadoEnvioUseCase;
