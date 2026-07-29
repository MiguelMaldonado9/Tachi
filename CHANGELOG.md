# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com)
y este proyecto se rige por el [Direccionamiento Semántico de Versiones](https://semver.org).

---

## - 2026-07-29

### Added
- **Arquitectura de Monorrepo**: Establecimiento del ecosistema multi-paquete utilizando las convenciones de ECMAScript Modules (ESM) y rutas estrictas de TypeScript.
- **Núcleo de la Aplicación y Ciclo de Vida**:
  - Implementación del patrón App Factory (`buildApp`) utilizando el framework Fastify.
  - Validación estricta y segura de variables de entorno globales mediante **Zod** (`src/config/env.ts`).
  - Configuración dinámica del sistema de registros (logs) a través de **Pino** y `pino-pretty`, adaptada para el rendimiento de Desarrollo vs Producción.
- **Infraestructura Orientada a Eventos (`@tachi/shared-events`)**:
  - Creación del contrato central `EventBus` soportando el patrón arquitectónico Pub/Sub (Publicador/Suscriptor).
  - Implementación de un bus asíncrono local en memoria RAM (`InMemoryEventBus`) con aislamiento de fallos para desacoplar la comunicación entre módulos.
  - Tipado estricto de eventos mediante `AbstractDomainEvent` utilizando criptografía nativa de Node (`node:crypto`) para la generación automática de IDs UUID v4 y marcas de tiempo de auditoría de alta precisión.
  - Creación del evento de negocio principal `TripRequestedEvent` con verificación estricta de datos (payload) para el flujo central de solicitud de viajes.
- **Módulo de Autenticación y Seguridad**:
  - Estructuración del verificador descentralizado `JwtVerifier` mediante la librería **Jose**, permitiendo la validación remota y segura de tokens JWT contra el conjunto de llaves públicas de Supabase (JWKS) con rotación automática.
  - Implementación del middleware `authenticate` (gancho preHandler de Fastify) para centralizar la extracción de tokens, la validación del esquema Bearer y la inyección de la identidad del usuario en el contexto (`request.user`).
  - Capas de validación estructural independientes para el cuerpo de las peticiones mediante `loginSchema` y `registerSchema` usando Zod en tiempo de ejecución.
  - Modelado de reglas de negocio a través de Enumeradores estrictos para `UserRole`, `UserStatus` y `DriverStatus` en `auth.types.ts`.
- **Capas de Base de Datos y Acceso a Datos**:
  - Centralización del cliente de base de datos con `SupabaseProvider`, aislando el canal administrativo de bypass (`.admin` con service role key) del canal público restringido por políticas de seguridad de filas (`.client`).
  - Creación del repositorio `UserRepository` incorporando consultas HTTP optimizadas de tipo `HEAD` (`{ count: "exact", head: true }`) para verificaciones de existencia de usuarios con consumo cero de ancho de banda.
  - Implementación de flujos de registro administrativo en `AuthRepository` para omitir flujos manuales de confirmación de correo electrónico mediante inicializaciones asíncronas de cuentas.
- **Estructura Robusta de Excepciones**:
  - Extensión del motor nativo de JavaScript para modelar la clase base `AppError` con captura automatizada del StackTrace (traza de la pila).
  - Estandarización de excepciones específicas para respuestas HTTP controladas: `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409) e `InternalServerError` (500).
  - Configuración del manejador global `registerErrorHandler` en Fastify para asegurar respuestas JSON con un diseño inmutable y uniforme hacia los clientes.
- **Suite de Pruebas Unitarias**:
  - Configuración inicial del entorno automatizado de pruebas mediante **Vitest**.
  - Desarrollo de pruebas unitarias robustas para evaluar la resolución de un único manejador de eventos, la distribución masiva hacia múltiples suscriptores independientes (flujos de fan-out) y la resiliencia del bus ante eventos sin oyentes.
