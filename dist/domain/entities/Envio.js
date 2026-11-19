"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envio = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message, statusCode, codigoError) {
        super(message);
        this.name = 'DomainError';
        this.statusCode = statusCode;
        this.codigoError = codigoError;
    }
}
exports.DomainError = DomainError;
class Envio {
    constructor(id_envio, estado_actual = 'RECEIVED') {
        if (!id_envio || id_envio.trim() === '') {
            throw new DomainError('El id_envio es obligatorio', 400, 'BAD_REQUEST');
        }
        this.id_envio = id_envio;
        this._estado_actual = estado_actual;
    }
    get estado_actual() {
        return this._estado_actual;
    }
    cambiarEstado(nuevoEstado, usuarioId, motivoCancelacion) {
        if (!usuarioId || usuarioId.trim() === '') {
            throw new DomainError('usuario_id es obligatorio para auditar el cambio', 400, 'BAD_REQUEST');
        }
        if (!nuevoEstado || !Envio.ESTADOS_VALIDOS.includes(nuevoEstado)) {
            throw new DomainError(`estado_orden inválido. Valores permitidos: ${Envio.ESTADOS_VALIDOS.join(', ')}`, 400, 'BAD_REQUEST');
        }
        // Regla de integridad: Si se cancela, motivo_cancelacion es obligatorio (400)
        if (nuevoEstado === 'CANCELLED' && (!motivoCancelacion || motivoCancelacion.trim() === '')) {
            throw new DomainError('usuario_id y motivo_cancelacion son obligatorios para cancelar', 400, 'BAD_REQUEST');
        }
        // Regla de negocio: No cancelar si ya está OUT_FOR_DELIVERY (409)
        if (nuevoEstado === 'CANCELLED' && this._estado_actual === 'OUT_FOR_DELIVERY') {
            throw new DomainError('No se puede cancelar: el envío ya está en ruta', 409, 'CONFLICT_SHIPPING_IN_ROUTE');
        }
        if (this._estado_actual === 'CANCELLED' || this._estado_actual === 'DELIVERED') {
            throw new DomainError(`El envío se encuentra en estado final (${this._estado_actual}) y no puede modificarse`, 409, 'CONFLICT_FINAL_STATE');
        }
        this._estado_actual = nuevoEstado;
        this.ultimo_usuario_id = usuarioId;
        if (motivoCancelacion) {
            this.motivo_cancelacion = motivoCancelacion;
        }
    }
}
exports.Envio = Envio;
Envio.ESTADOS_VALIDOS = [
    'RECEIVED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
];
