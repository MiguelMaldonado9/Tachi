# 01. Visión General del Sistema (System Overview)

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 01-system-overview.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

Tachi es una plataforma de movilidad inteligente diseñada para conectar pasajeros y conductores mediante una arquitectura moderna, escalable y segura.

El sistema está concebido para operar inicialmente en municipios de la Sabana de Bogotá, con capacidad de crecimiento hacia otras ciudades y regiones sin requerir cambios estructurales en su arquitectura.

Desde su diseño, Tachi adopta principios de Clean Architecture, Domain-Driven Design (DDD) y una arquitectura modular que permite evolucionar cada componente de forma independiente.

---

# 2. Objetivos del Sistema

La plataforma tiene como objetivos principales:

- Facilitar la solicitud de servicios de transporte en tiempo real.
- Administrar el ciclo de vida completo de pasajeros y conductores.
- Gestionar vehículos, documentos y validaciones operativas.
- Asignar servicios utilizando algoritmos de proximidad.
- Permitir administración centralizada mediante un panel administrativo.
- Garantizar altos niveles de seguridad, disponibilidad y escalabilidad.

---

# 3. Arquitectura General

Tachi está construido como un monorepositorio que agrupa todas las aplicaciones, servicios y componentes compartidos.

La plataforma está compuesta por cuatro aplicaciones principales:

- Aplicación para Pasajeros.
- Aplicación para Conductores.
- Panel Administrativo.
- Backend API.

Estas aplicaciones comparten contratos, tipos y configuraciones comunes mediante paquetes reutilizables dentro del monorepo.

---

# 4. Principios Arquitectónicos

La arquitectura de Tachi se fundamenta en los siguientes principios:

## Clean Architecture

Separación clara entre dominio, infraestructura y presentación.

## Domain-Driven Design (DDD)

El sistema se organiza alrededor de dominios de negocio independientes.

## Modularidad

Cada módulo encapsula su propia lógica, rutas, servicios, repositorios y contratos.

## API First

Toda funcionalidad del sistema se expone mediante APIs antes de ser consumida por cualquier aplicación cliente.

## Database First

La estructura de la base de datos se diseña antes de implementar la lógica de negocio correspondiente.

## Security by Design

La seguridad forma parte del diseño desde el inicio, utilizando autenticación JWT, Row Level Security (RLS), políticas de acceso y separación de privilegios.

---

# 5. Organización por Dominios

Nota: Además de los dominios de negocio, el proyecto contiene módulos de infraestructura (como Middleware, Shared, Config y Lib) que proporcionan funcionalidades transversales reutilizables. Estos módulos no representan procesos del negocio, sino servicios de soporte para toda la plataforma.

El backend se divide en dominios independientes.

Los principales dominios definidos actualmente son:

- Authentication    → Autenticación 
- Users             → Usuarios
- Drivers           → Conductores
- Vehicles          → Vehículos
- Trips             → Viajes
- Payments          → Pagos
- Promotions        → Promociones
- Ratings           → Calificaciones
- Notifications     → Notificaciones
- Maps              → Mapas
- Pricing           → Precios
- Audit             → Auditoria
- Administration    → Administracón
- Fares             → Tarifas 

Modulos Compartidos e Infraestructura

- Middleware        → Middleware
- Shared            →  Compartido

Cada dominio mantiene independencia funcional y puede evolucionar sin afectar el resto del sistema.

---

# 6. Tecnologías Principales

## Backend

- Node.js
- TypeScript
- Fastify

## Base de Datos

- PostgreSQL
- Supabase
- PostGIS

## Aplicaciones

- Flutter (Usuario)
- Flutter (Conductor)
- React (Panel Administrativo)

## Infraestructura

- Supabase Auth
- JWT
- JOSE
- Row Level Security (RLS)

---

# 7. Flujo General del Sistema

De forma simplificada, el funcionamiento general de la plataforma sigue el siguiente flujo:

1. Registro del usuario.
2. Autenticación.
3. Gestión del perfil.
4. Solicitud del servicio.
5. Asignación del conductor.
6. Ejecución del viaje.
7. Pago.
8. Calificación.
9. Auditoría.

---

# 8. Escalabilidad

La arquitectura ha sido diseñada para soportar crecimiento horizontal mediante:

- Separación por dominios.
- APIs desacopladas.
- Base de datos PostgreSQL.
- Índices optimizados.
- Procesamiento asíncrono.
- Eventos de dominio.
- Integraciones futuras mediante microservicios si el negocio lo requiere.

Actualmente la arquitectura se implementa como un monolito modular, permitiendo una evolución progresiva sin introducir complejidad innecesaria.

---

# 9. Roadmap Arquitectónico

El desarrollo de la plataforma seguirá el siguiente orden:

1. Identity Domain          → Dominio de Identidad
2. Authentication Domain    → Dominio de Autenticación
3. Driver Domain            → Dominio del Conductor
4. Vehicle Domain           → Dominio del Vehículo
5. Driver Documents         → Documentos del Conductor
6. Vehicle Documents        → Documentos del Vehículo
7. Maps & Geolocation       → Mapas y geolocalización
8. Trips                    → Viajes 
9. Pricing                  → Precios
10. Payments                → Pagos
11. Ratings                 → Calificaciones
12. Notifications           → Notificaciones
13. Administration          → Administración
14. Audit                   → Auditoría

---

# 10. Filosofía del Proyecto

La arquitectura de Tachi prioriza la claridad, mantenibilidad y escalabilidad sobre soluciones rápidas o acoplamientos innecesarios.

Cada nuevo dominio deberá ser diseñado y documentado antes de su implementación.

La documentación arquitectónica constituye la fuente oficial del diseño del sistema y debe mantenerse sincronizada con la evolución del proyecto.

---

# Control del Documento

| Campo | Valor |
|-------|--------|
| Estado | Aprobado |
| Versión | 1.0 |
| Responsable | Equipo de Arquitectura - Tachi |

> Este documento constituye la referencia oficial de la arquitectura general del proyecto Tachi. Toda nueva funcionalidad deberá respetar los principios aquí definidos.