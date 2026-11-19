"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnvioRepository = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class InMemoryEnvioRepository {
    constructor() {
        this.envios = new Map();
        const envio1 = new Envio_1.Envio(1, 'EF-ELEC-001', 'Laptop Dell Latitude 5420', 2.1, 'EN_ALMACEN');
        const envio2 = new Envio_1.Envio(2, 'EF-ELEC-002', 'Monitor LED 24 pulgadas', 3.45, 'EN_RUTA');
        this.envios.set(envio1.id, envio1);
        this.envios.set(envio2.id, envio2);
    }
    async save(envio) {
        this.envios.set(envio.id, envio);
        return envio;
    }
    async findById(id) {
        return this.envios.get(id) || null;
    }
    async findAll() {
        return Array.from(this.envios.values());
    }
    async update(envio) {
        this.envios.set(envio.id, envio);
        return envio;
    }
}
exports.InMemoryEnvioRepository = InMemoryEnvioRepository;
