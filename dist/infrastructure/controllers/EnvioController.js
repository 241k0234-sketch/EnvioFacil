"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioController = void 0;
const Envio_1 = require("../../domain/entities/Envio");
class EnvioController {
    constructor(actualizarEstadoUseCase, envioRepository) {
        this.actualizarEstadoUseCase = actualizarEstadoUseCase;
        this.envioRepository = envioRepository;
        this.listar = async (_req, res) => {
            const lista = await this.envioRepository.findAll();
            res.status(200).json(lista.map((e) => e.toJSON()));
        };
        this.obtenerPorId = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id) || id <= 0) {
                    throw new Envio_1.DomainError('El parámetro ID debe ser un número entero positivo.', 400);
                }
                const envio = await this.envioRepository.findById(id);
                if (!envio) {
                    throw new Envio_1.DomainError(`Producto/envío con ID ${id} no encontrado.`, 404);
                }
                res.status(200).json(envio.toJSON());
            }
            catch (error) {
                this.manejarError(error, res);
            }
        };
        this.crear = async (req, res) => {
            try {
                const { id, sku, descripcion, pesoKg, estado } = req.body;
                const nuevoEnvio = new Envio_1.Envio(Number(id) || Date.now(), sku, descripcion, Number(pesoKg), estado || 'EN_ALMACEN');
                const guardado = await this.envioRepository.save(nuevoEnvio);
                res.status(201).json(guardado.toJSON());
            }
            catch (error) {
                this.manejarError(error, res);
            }
        };
        this.actualizarEstado = async (req, res) => {
            try {
                const id = Number(req.params.id);
                const { estado } = req.body;
                const actualizado = await this.actualizarEstadoUseCase.execute(id, estado);
                res.status(200).json(actualizado.toJSON());
            }
            catch (error) {
                this.manejarError(error, res);
            }
        };
    }
    manejarError(error, res) {
        if (error instanceof Envio_1.DomainError) {
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
exports.EnvioController = EnvioController;
