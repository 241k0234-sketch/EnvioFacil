"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envio = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'DomainError';
        this.statusCode = statusCode;
    }
}
exports.DomainError = DomainError;
class Envio {
    constructor(id, sku, descripcion, pesoKg, estado = 'EN_ALMACEN') {
        if (!sku || sku.trim() === '') {
            throw new DomainError('El SKU del producto es obligatorio.', 400);
        }
        if (!descripcion || descripcion.trim() === '') {
            throw new DomainError('La descripción es obligatoria.', 400);
        }
        if (pesoKg <= 0) {
            throw new DomainError('El peso debe ser mayor a 0 kg.', 400);
        }
        if (!Envio.ESTADOS_VALIDOS.includes(estado)) {
            throw new DomainError(`Estado inicial inválido: ${estado}`, 400);
        }
        this.id = id;
        this.sku = sku;
        this.descripcion = descripcion;
        this.pesoKg = pesoKg;
        this._estado = estado;
    }
    get estado() {
        return this._estado;
    }
    cambiarEstado(nuevoEstado) {
        if (!Envio.ESTADOS_VALIDOS.includes(nuevoEstado)) {
            throw new DomainError(`Estado inválido. Permitidos: ${Envio.ESTADOS_VALIDOS.join(', ')}`, 400);
        }
        if (nuevoEstado === 'CANCELADO' &&
            (this._estado === 'EN_RUTA' || this._estado === 'ENTREGADO')) {
            throw new DomainError(`Operación denegada: No se puede cancelar un envío que ya está ${this._estado}.`, 409);
        }
        if (this._estado === 'CANCELADO' || this._estado === 'ENTREGADO') {
            throw new DomainError(`El envío se encuentra en un estado final (${this._estado}) y no admite cambios.`, 409);
        }
        this._estado = nuevoEstado;
    }
    toJSON() {
        return {
            id: this.id,
            sku: this.sku,
            descripcion: this.descripcion,
            pesoKg: this.pesoKg,
            estado: this._estado,
        };
    }
}
exports.Envio = Envio;
Envio.ESTADOS_VALIDOS = [
    'EN_ALMACEN',
    'EN_RUTA',
    'ENTREGADO',
    'CANCELADO',
];
