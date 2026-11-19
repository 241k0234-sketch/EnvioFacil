import { DomainError, Envio, EstadoEnvio } from '../../domain/entities/Envio';
import { IEnvioRepository } from '../../domain/repositories/IEnvioRepository';

export class ActualizarEstadoEnvioUseCase {
  constructor(private readonly envioRepository: IEnvioRepository) {}

  public async execute(id: number, nuevoEstado: EstadoEnvio): Promise<Envio> {
    if (isNaN(id) || id <= 0) {
      throw new DomainError('El parámetro ID debe ser un número entero positivo.', 400);
    }

    if (!nuevoEstado) {
      throw new DomainError('El campo "estado" es obligatorio en el cuerpo de la petición.', 400);
    }

    const envio = await this.envioRepository.findById(id);
    if (!envio) {
      throw new DomainError(`No existe un envío registrado con el ID ${id}.`, 404);
    }

    envio.cambiarEstado(nuevoEstado);
    return await this.envioRepository.update(envio);
  }
}
