"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarEstadoEnvioUseCase = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class ActualizarEstadoEnvioUseCase {
    constructor(envioRepository) {
        this.envioRepository = envioRepository;
    }
    async execute(id, nuevoEstado) {
        if (isNaN(id) || id <= 0) {
            throw new Envio_1.DomainError('El parámetro ID debe ser un número entero positivo.', 400);
        }
        if (!nuevoEstado) {
            throw new Envio_1.DomainError('El campo "estado" es obligatorio en el cuerpo de la petición.', 400);
        }
        const envio = await this.envioRepository.findById(id);
        if (!envio) {
            throw new Envio_1.DomainError(`No existe un envío registrado con el ID ${id}.`, 404);
        }
        envio.cambiarEstado(nuevoEstado);
        return await this.envioRepository.update(envio);
    }
}
exports.ActualizarEstadoEnvioUseCase = ActualizarEstadoEnvioUseCase;
