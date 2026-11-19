import { Envio } from '../../domain/entities/Envio';
import { IEnvioRepository } from '../../domain/repositories/IEnvioRepository';

export class InMemoryEnvioRepository implements IEnvioRepository {
  private readonly envios: Map<number, Envio> = new Map();

  constructor() {
    const envio1 = new Envio(1, 'EF-ELEC-001', 'Laptop Dell Latitude 5420', 2.1, 'EN_ALMACEN');
    const envio2 = new Envio(2, 'EF-ELEC-002', 'Monitor LED 24 pulgadas', 3.45, 'EN_RUTA');
    this.envios.set(envio1.id, envio1);
    this.envios.set(envio2.id, envio2);
  }

  public async save(envio: Envio): Promise<Envio> {
    this.envios.set(envio.id, envio);
    return envio;
  }

  public async findById(id: number): Promise<Envio | null> {
    return this.envios.get(id) || null;
  }

  public async findAll(): Promise<Envio[]> {
    return Array.from(this.envios.values());
  }

  public async update(envio: Envio): Promise<Envio> {
    this.envios.set(envio.id, envio);
    return envio;
  }
}
