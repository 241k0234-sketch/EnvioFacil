"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnvioRepository = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class InMemoryEnvioRepository {
    constructor() {
        this.envios = new Map();
        this.envios.set('EF-3001', new Envio_1.Envio('EF-3001', 'PREPARING'));
        this.envios.set('EF-3002', new Envio_1.Envio('EF-3002', 'OUT_FOR_DELIVERY'));
    }
    async findById(id_envio) {
        return this.envios.get(id_envio) || null;
    }
    async update(envio) {
        this.envios.set(envio.id_envio, envio);
        return envio;
    }
}
exports.InMemoryEnvioRepository = InMemoryEnvioRepository;
