# Actividad 3.1: Construcción del Software - Sistema Envío Fácil

## 1. Descripción General
Implementación del esqueleto funcional del backend para el sistema **Envío Fácil** utilizando **TypeScript, Node.js y Express**, aplicando estrictamente los principios de **Arquitectura Limpia (Clean Architecture)**.

## 2. Estructura de Capas
- **`src/domain/`**: Entidades puras (`Envio.ts`) con validaciones de integridad, máquina de estados y contratos de repositorio (`IEnvioRepository.ts`). Sin dependencias de frameworks externos.
- **`src/application/`**: Casos de uso (`ActualizarEstadoEnvioUseCase.ts`) que orquestan la lógica de aplicación comunicándose únicamente mediante interfaces del dominio.
- **`src/infrastructure/`**: Adaptadores externos. Incluye `InMemoryEnvioRepository.ts` (persistencia volátil en memoria) y `EnvioController.ts` (exposición RESTful con Express).
- **`src/main.ts`**: Punto de entrada donde se realiza la inyección manual de dependencias mediante constructores.

## 3. Reglas de Negocio y Máquina de Estados
- Estados permitidos: `EN_ALMACEN`, `EN_RUTA`, `ENTREGADO`, `CANCELADO`.
- Si se intenta cancelar (`CANCELADO`) un envío que ya se encuentra `EN_RUTA` o `ENTREGADO`, el dominio bloquea la transición lanzando un error semántico **HTTP 409 Conflict**.

## 4. Ejecución Local
```bash
npm install
npm start
