import { Envio } from '../entities/Envio';

export interface IEnvioRepository {
  findById(id_envio: string): Promise<Envio | null>;
  update(envio: Envio): Promise<Envio>;
}
