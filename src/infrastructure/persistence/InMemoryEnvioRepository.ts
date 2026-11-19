import { Envio } from '../../domain/entities/Envio';
import { IEnvioRepository } from '../../domain/repositories/IEnvioRepository';

export class InMemoryEnvioRepository implements IEnvioRepository {
  private readonly envios: Map<string, Envio> = new Map();

  constructor() {
    this.envios.set('EF-3001', new Envio('EF-3001', 'PREPARING'));
    this.envios.set('EF-3002', new Envio('EF-3002', 'OUT_FOR_DELIVERY'));
  }

  public async findById(id_envio: string): Promise<Envio | null> {
    return this.envios.get(id_envio) || null;
  }

  public async update(envio: Envio): Promise<Envio> {
    this.envios.set(envio.id_envio, envio);
    return envio;
  }
}
