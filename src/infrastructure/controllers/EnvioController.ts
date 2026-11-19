import { Request, Response } from 'express';
import { ActualizarEstadoEnvioUseCase } from '../../application/use-cases/ActualizarEstadoEnvioUseCase';
import { IEnvioRepository } from '../../domain/repositories/IEnvioRepository';
import { DomainError, Envio } from '../../domain/entities/Envio';

export class EnvioController {
  constructor(
    private readonly actualizarEstadoUseCase: ActualizarEstadoEnvioUseCase,
    private readonly envioRepository: IEnvioRepository
  ) {}

  public listar = async (_req: Request, res: Response): Promise<void> => {
    const lista = await this.envioRepository.findAll();
    res.status(200).json(lista.map((e) => e.toJSON()));
  };

  public obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        throw new DomainError('El parámetro ID debe ser un número entero positivo.', 400);
      }

      const envio = await this.envioRepository.findById(id);
      if (!envio) {
        throw new DomainError(`Producto/envío con ID ${id} no encontrado.`, 404);
      }

      res.status(200).json(envio.toJSON());
    } catch (error) {
      this.manejarError(error, res);
    }
  };

  public crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, sku, descripcion, pesoKg, estado } = req.body;
      const nuevoEnvio = new Envio(
        Number(id) || Date.now(),
        sku,
        descripcion,
        Number(pesoKg),
        estado || 'EN_ALMACEN'
      );
      const guardado = await this.envioRepository.save(nuevoEnvio);
      res.status(201).json(guardado.toJSON());
    } catch (error) {
      this.manejarError(error, res);
    }
  };

  public actualizarEstado = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;
      const actualizado = await this.actualizarEstadoUseCase.execute(id, estado);
      res.status(200).json(actualizado.toJSON());
    } catch (error) {
      this.manejarError(error, res);
    }
  };

  private manejarError(error: unknown, res: Response): void {
    if (error instanceof DomainError) {
      res.status(error.statusCode).json({
        codigo: error.statusCode,
        mensaje: error.message,
      });
      return;
    }

    res.status(500).json({
      codigo: 500,
      mensaje: 'Error interno del servidor.',
    });
  }
}
