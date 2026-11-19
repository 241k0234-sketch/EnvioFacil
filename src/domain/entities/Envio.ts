export type EstadoOrden =
  | 'RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export class DomainError extends Error {
  public readonly statusCode: number;
  public readonly codigoError: string;

  constructor(message: string, statusCode: number, codigoError: string) {
    super(message);
    this.name = 'DomainError';
    this.statusCode = statusCode;
    this.codigoError = codigoError;
  }
}

export class Envio {
  public readonly id_envio: string;
  private _estado_actual: EstadoOrden;
  public ultimo_usuario_id?: string;
  public motivo_cancelacion?: string;

  public static readonly ESTADOS_VALIDOS: EstadoOrden[] = [
    'RECEIVED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  constructor(id_envio: string, estado_actual: EstadoOrden = 'RECEIVED') {
    if (!id_envio || id_envio.trim() === '') {
      throw new DomainError('El id_envio es obligatorio', 400, 'BAD_REQUEST');
    }
    this.id_envio = id_envio;
    this._estado_actual = estado_actual;
  }

  public get estado_actual(): EstadoOrden {
    return this._estado_actual;
  }

  public cambiarEstado(
    nuevoEstado: EstadoOrden,
    usuarioId: string,
    motivoCancelacion?: string
  ): void {
    if (!usuarioId || usuarioId.trim() === '') {
      throw new DomainError(
        'usuario_id es obligatorio para auditar el cambio',
        400,
        'BAD_REQUEST'
      );
    }

    if (!nuevoEstado || !Envio.ESTADOS_VALIDOS.includes(nuevoEstado)) {
      throw new DomainError(
        `estado_orden inválido. Valores permitidos: ${Envio.ESTADOS_VALIDOS.join(', ')}`,
        400,
        'BAD_REQUEST'
      );
    }

    // Regla de integridad: Si se cancela, motivo_cancelacion es obligatorio (400)
    if (nuevoEstado === 'CANCELLED' && (!motivoCancelacion || motivoCancelacion.trim() === '')) {
      throw new DomainError(
        'usuario_id y motivo_cancelacion son obligatorios para cancelar',
        400,
        'BAD_REQUEST'
      );
    }

    // Regla de negocio: No cancelar si ya está OUT_FOR_DELIVERY (409)
    if (nuevoEstado === 'CANCELLED' && this._estado_actual === 'OUT_FOR_DELIVERY') {
      throw new DomainError(
        'No se puede cancelar: el envío ya está en ruta',
        409,
        'CONFLICT_SHIPPING_IN_ROUTE'
      );
    }

    if (this._estado_actual === 'CANCELLED' || this._estado_actual === 'DELIVERED') {
      throw new DomainError(
        `El envío se encuentra en estado final (${this._estado_actual}) y no puede modificarse`,
        409,
        'CONFLICT_FINAL_STATE'
      );
    }

    this._estado_actual = nuevoEstado;
    this.ultimo_usuario_id = usuarioId;
    if (motivoCancelacion) {
      this.motivo_cancelacion = motivoCancelacion;
    }
  }
}
