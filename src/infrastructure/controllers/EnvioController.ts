import { Request, Response } from 'express';
import { ActualizarEstadoEnvioUseCase } from '../../application/use-cases/ActualizarEstadoEnvioUseCase';
import { DomainError } from '../../domain/entities/Envio';

export class EnvioController {
  constructor(private readonly actualizarEstadoUseCase: ActualizarEstadoEnvioUseCase) {}

  public actualizarEstado = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { estado_orden, usuario_id, motivo_cancelacion } = req.body;

      const envioActualizado = await this.actualizarEstadoUseCase.execute({
        id_envio: id,
        estado_orden,
        usuario_id,
        motivo_cancelacion,
      });

      res.status(200).json({
        mensaje: 'Estado actualizado con éxito',
        orden_id: envioActualizado.id_envio,
        fecha_hora: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof DomainError) {
        res.status(error.statusCode).json({
          codigoError: error.codigoError,
          mensaje: error.message,
        });
        return;
      }

      res.status(500).json({
        codigoError: 'INTERNAL_SERVER_ERROR',
        mensaje: 'Error interno del servidor',
      });
    }
  };
}
