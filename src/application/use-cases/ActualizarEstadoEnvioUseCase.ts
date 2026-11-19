import { DomainError, Envio, EstadoOrden } from '../../domain/entities/Envio';
import { IEnvioRepository } from '../../domain/repositories/IEnvioRepository';

export interface ActualizarEstadoInput {
  id_envio: string;
  estado_orden: EstadoOrden;
  usuario_id: string;
  motivo_cancelacion?: string;
}

export class ActualizarEstadoEnvioUseCase {
  constructor(private readonly envioRepository: IEnvioRepository) {}

  public async execute(input: ActualizarEstadoInput): Promise<Envio> {
    if (!input.usuario_id || (!input.motivo_cancelacion && input.estado_orden === 'CANCELLED')) {
      throw new DomainError(
        'usuario_id y motivo_cancelacion son obligatorios para cancelar',
        400,
        'BAD_REQUEST'
      );
    }

    const envio = await this.envioRepository.findById(input.id_envio);
    if (!envio) {
      throw new DomainError('Orden no encontrada', 404, 'NOT_FOUND');
    }

    envio.cambiarEstado(input.estado_orden, input.usuario_id, input.motivo_cancelacion);
    return await this.envioRepository.update(envio);
  }
}
