import express from 'express';
import { InMemoryEnvioRepository } from './infrastructure/persistence/InMemoryEnvioRepository';
import { ActualizarEstadoEnvioUseCase } from './application/use-cases/ActualizarEstadoEnvioUseCase';
import { EnvioController } from './infrastructure/controllers/EnvioController';

const app = express();
app.use(express.json());

// Inyección manual de dependencias por constructor
const envioRepository = new InMemoryEnvioRepository();
const actualizarEstadoUseCase = new ActualizarEstadoEnvioUseCase(envioRepository);
const envioController = new EnvioController(actualizarEstadoUseCase);

// Endpoint exacto del contrato OpenAPI 3.0.3
app.patch('/api/v1/envios/:id/estado', envioController.actualizarEstado);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Envío Fácil corriendo en http://localhost:${PORT}`);
});
