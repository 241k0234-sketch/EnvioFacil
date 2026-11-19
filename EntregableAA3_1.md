# Actividad 3.1: Construcción del Software - Sistema Envío Fácil

## 1. Descripción General
Implementación del backend funcional para **Envío Fácil** utilizando **TypeScript, Node.js y Express** bajo el patrón de **Arquitectura Limpia (Clean Architecture)**, alineado 1:1 con el contrato **OpenAPI 3.0.3 (`openapi.yaml`)** definido en la Actividad 2.3[cite: 4].

## 2. Estructura de Capas
- **`openapi.yaml`**: Contrato formal OpenAPI 3.0.3 en la raíz del repositorio[cite: 4].
- **`src/domain/`**: Entidad pura `Envio.ts` (invariantes de auditoría `usuario_id`, `motivo_cancelacion` y reglas de transición de estado) e interfaz `IEnvioRepository.ts`[cite: 4, 7].
- **`src/application/`**: Caso de uso `ActualizarEstadoEnvioUseCase.ts` que orquesta el flujo sin depender de Express.
- **`src/infrastructure/`**: Persistencia en memoria (`InMemoryEnvioRepository.ts`) con órdenes semilla (`EF-3001`, `EF-3002`) y controlador HTTP (`EnvioController.ts`) mapeado al contrato YAML[cite: 5].
- **`src/main.ts`**: Inyección manual de dependencias por constructor y exposición de `PATCH /api/v1/envios/:id/estado`[cite: 5].

## 3. Reglas de Negocio Implementadas
- **400 Bad Request (`BAD_REQUEST`)**: Si falta `usuario_id` o si se solicita `CANCELLED` sin `motivo_cancelacion`[cite: 4, 6].
- **404 Not Found (`NOT_FOUND`)**: Si el `id` de la orden no existe[cite: 4, 6].
- **409 Conflict (`CONFLICT_SHIPPING_IN_ROUTE`)**: Si se intenta cancelar una orden que ya está en estado `OUT_FOR_DELIVERY`[cite: 4, 6].

## 4. Ejecución Local
```bash
npm install
npm run build
node dist/main.js
