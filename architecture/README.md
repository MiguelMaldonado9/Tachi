# Tachi Architecture

## Introducción

Esta carpeta contiene la documentación oficial de arquitectura del proyecto **Tachi**, una plataforma de movilidad diseñada para ofrecer un servicio de transporte moderno, seguro y altamente escalable.

Toda la documentación aquí almacenada constituye la fuente oficial de diseño del sistema. Ningún componente deberá implementarse sin contar previamente con su correspondiente especificación arquitectónica.

La arquitectura de Tachi ha sido diseñada siguiendo principios de **Clean Architecture**, **Domain-Driven Design (DDD)** y una arquitectura modular orientada a dominios, permitiendo que la plataforma evolucione desde un MVP hasta un ecosistema distribuido de gran escala.

---

# Estructura de la Documentación

## Arquitectura General

| Documento | Descripción |
|------------|-------------|
| 01-system-overview.md | Visión general del sistema |
| 02-auth-domain.md | Dominio de autenticación e identidad |
| 03-driver-domain.md | Dominio de conductores |
| 04-database-conventions.md | Convenciones y estándares de Base de Datos |
| 05-trip-domain.md | Dominio de viajes |
| 06-vehicle-domain.md | Dominio de vehículos |
| 07-payment-domain.md | Dominio de pagos, wallet y liquidaciones |
| 08-pricing-domain.md | Dominio de tarifas y cálculo de precios |
| 09-rating-domain.md | Dominio de calificaciones |
| 10-notification-domain.md | Dominio de notificaciones |
| 11-admin-domain.md | Dominio administrativo |
| 12-audit-domain.md | Dominio de auditoría |
| 13-api-guidelines.md | Estándares oficiales de la API |
| 14-security.md | Arquitectura de seguridad |
| 15-deployment.md | Arquitectura de despliegue e infraestructura |

---

# Documentación del Trip Engine

La carpeta **engine/** contiene la documentación técnica del motor de asignación de viajes desarrollado en **Go**.

Este componente constituye uno de los servicios críticos de la plataforma y opera de forma independiente del Backend Principal.

| Documento | Descripción |
|------------|-------------|
| 01-trip-engine-architecture.md | Arquitectura general del Trip Engine |
| 02-matching-algorithm.md | Algoritmo de asignación de conductores |
| 03-dispatcher.md | Dispatcher de viajes |
| 04-websocket.md | Gestión de conexiones WebSocket |
| 05-events.md | Arquitectura basada en eventos |
| 06-concurrency.md | Modelo de concurrencia en Go |
| 07-scheduler.md | Scheduler interno del motor |
| 08-deployment.md | Despliegue del Trip Engine |

---

# Diagramas

La carpeta **diagrams/** almacena los diagramas oficiales del proyecto desarrollados en Draw.io.

Estos diagramas representan la referencia visual de la arquitectura y deberán mantenerse sincronizados con la documentación.

Actualmente incluye diagramas de:

- Arquitectura General
- Authentication Domain
- Driver Domain
- Trip Domain
- Vehicle Domain
- Payment Domain
- Pricing Domain

---

# Principios Arquitectónicos

Toda la plataforma Tachi sigue los siguientes principios:

- Clean Architecture
- Domain-Driven Design (DDD)
- Arquitectura Modular
- Separation of Concerns
- SOLID
- API First
- Security by Design
- Database First
- Event-Driven Ready
- Zero Trust
- Defense in Depth
- Stateless Services
- Cloud Agnostic
- Infrastructure as Code
- Observability First
- Fail Secure
- Graceful Shutdown

---

# Flujo de Desarrollo

Todo nuevo componente deberá seguir el siguiente proceso:

1. Diseño del dominio.
2. Documento de arquitectura.
3. Modelo de datos.
4. Migraciones SQL.
5. Implementación Backend.
6. Implementación Frontend.
7. Pruebas.
8. Auditoría.
9. Documentación.

Ninguna funcionalidad deberá desarrollarse sin respetar este flujo.

---

# Organización de la Arquitectura

La arquitectura de Tachi se encuentra organizada en cuatro grandes bloques.

```
Architecture

├── Dominios
├── Documentos Transversales
├── Diagramas
└── Trip Engine
```

Cada bloque posee responsabilidades claramente definidas y evoluciona de manera independiente.

---

# Objetivo

El objetivo de esta documentación es garantizar que todas las decisiones técnicas del proyecto se encuentren documentadas, justificadas y alineadas con una arquitectura consistente.

Esto permitirá mantener una plataforma escalable, mantenible y preparada para evolucionar durante los próximos años sin comprometer la calidad del software.

---

# Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|--------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Organización inicial de la documentación de arquitectura de Tachi. |