# Actividad 3.1: Construcción del Software - Sistema Envío Fácil

## 1. Objetivo del Proyecto
Materializar los diseños arquitectónicos y de interfaz de las Unidades 1 y 2 en un esqueleto funcional de backend para el sistema **Envío Fácil**, desarrollado con **TypeScript, Node.js y Express**, respetando estrictamente los principios de **Arquitectura Limpia (Clean Architecture)**, inyección manual de dependencias y persistencia en memoria.

---

## 2. Trazabilidad de Artefactos (Unidades 1 y 2 $\rightarrow$ Código)

| Artefacto Previo | Elemento Diseñado | Implementación en el Código (`src/`) |
| :--- | :--- | :--- |
| **AA1.2 Criterios Gherkin** | Escenarios de consulta de producto y validación de transiciones inválidas al cancelar un envío en ruta. | `Envio.ts` (reglas de validación y excepciones `DomainError`) y `ActualizarEstadoEnvioUseCase.ts`. |
| **AA2.1 Máquina de Estados y Modelo Relacional** | Atributos (`id`, `sku`, `descripcion`, `pesoKg`, `estado`) y transiciones permitidas (`EN_ALMACEN`, `EN_RUTA`, `ENTREGADO`, `CANCELADO`). | Entidad `Envio.ts` (método `cambiarEstado`) y almacenamiento estructurado en `InMemoryEnvioRepository.ts`. |
| **AA2.3 Contrato OpenAPI 3.0** | Rutas RESTful (`/api/v1/productos/:id`, `/api/v1/productos/:id/estado`), verbo `PATCH` y códigos HTTP (`200`, `201`, `400`, `404`, `409`). | `EnvioController.ts` y mapeo de rutas en `src/main.ts`. |

---

## 3. Arquitectura Limpia en 3 Capas

La estructura del proyecto garantiza la **Regla de Dependencia**, donde las capas externas dependen de las internas, pero el núcleo de negocio permanece completamente aislado de frameworks y bases de datos:

```text
EnvioFacil/
├── src/
│   ├── domain/                          # CAPA 1: Dominio (Núcleo puro sin librerías externas)
│   │   ├── entities/
│   │   │   └── Envio.ts                 # Entidad con invariantes y máquina de estados
│   │   └── repositories/
│   │       └── IEnvioRepository.ts      # Puerto / Interfaz de persistencia
│   ├── application/                     # CAPA 2: Aplicación (Orquestación)
│   │   └── use-cases/
│   │       └── ActualizarEstadoEnvioUseCase.ts
│   ├── infrastructure/                  # CAPA 3: Infraestructura (Adaptadores externos)
│   │   ├── persistence/
│   │   │   └── InMemoryEnvioRepository.ts  # Implementación en memoria (Map)
│   │   └── controllers/
│   │       └── EnvioController.ts       # Adaptador HTTP con Express
│   └── main.ts                          # Composición e inyección manual por constructor
├── dist/                                # Código JavaScript compilado (tsc)
├── package.json
├── tsconfig.json
└── EntregableAA3_1.md
