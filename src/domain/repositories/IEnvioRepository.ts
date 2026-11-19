import { Envio } from '../entities/Envio';

export interface IEnvioRepository {
  save(envio: Envio): Promise<Envio>;
  findById(id: number): Promise<Envio | null>;
  findAll(): Promise<Envio[]>;
  update(envio: Envio): Promise<Envio>;
}
