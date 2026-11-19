"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InMemoryEnvioRepository_1 = require("./infrastructure/persistence/InMemoryEnvioRepository");
const ActualizarEstadoEnvioUseCase_1 = require("./application/use-cases/ActualizarEstadoEnvioUseCase");
const EnvioController_1 = require("./infrastructure/controllers/EnvioController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Inyección manual de dependencias por constructor
const envioRepository = new InMemoryEnvioRepository_1.InMemoryEnvioRepository();
const actualizarEstadoUseCase = new ActualizarEstadoEnvioUseCase_1.ActualizarEstadoEnvioUseCase(envioRepository);
const envioController = new EnvioController_1.EnvioController(actualizarEstadoUseCase, envioRepository);
// Rutas RESTful
app.get('/api/v1/productos', envioController.listar);
app.get('/api/v1/productos/:id', envioController.obtenerPorId);
app.post('/api/v1/productos', envioController.crear);
app.patch('/api/v1/productos/:id/estado', envioController.actualizarEstado);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Envío Fácil corriendo en http://localhost:${PORT}`);
});
