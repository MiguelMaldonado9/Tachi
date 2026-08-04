# 12. Audit Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 12-audit-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Audit Domain es el dominio responsable de registrar todos los eventos relevantes ocurridos dentro de la plataforma Tachi.

Su objetivo es construir un historial completo, confiable e inalterable de las acciones realizadas por usuarios, conductores, administradores y procesos internos del sistema.

A diferencia de los registros técnicos (logs), la auditoría representa evidencia de negocio y permite reconstruir exactamente qué ocurrió, quién lo hizo, cuándo sucedió y sobre qué recurso se ejecutó la acción.

Este dominio constituye la "caja negra" de la plataforma.

---

# 2. Objetivos

Los principales objetivos del Audit Domain son:

- Registrar todos los eventos importantes del sistema.
- Mantener un historial completo de operaciones.
- Facilitar investigaciones internas.
- Proporcionar trazabilidad sobre los cambios realizados.
- Apoyar procesos de seguridad y cumplimiento.
- Permitir reconstruir eventos históricos.
- Generar evidencia para auditorías técnicas y legales.
- Servir como fuente de información para análisis futuros.

---

# 3. Responsabilidades

El Audit Domain será responsable exclusivamente de registrar eventos de auditoría.

Entre sus responsabilidades se encuentran:

- registrar acciones de usuarios
- registrar acciones de conductores
- registrar acciones administrativas
- registrar eventos del sistema
- almacenar cambios relevantes
- conservar información histórica
- registrar operaciones críticas
- suministrar información para consultas de auditoría

No será responsabilidad del Audit Domain administrar:

- autenticación
- usuarios
- conductores
- vehículos
- viajes
- pagos
- promociones
- notificaciones
- tarifas

Cada uno de estos dominios continuará siendo propietario de su propia lógica de negocio.

---

# 4. Principios del Dominio

El diseño del Audit Domain se basa en los siguientes principios.

---

## Trazabilidad

Toda acción relevante deberá poder reconstruirse completamente.

Siempre deberá conocerse:

- quién realizó la acción
- cuándo ocurrió
- qué recurso fue afectado
- cuál fue el resultado

---

## Inmutabilidad

Los registros de auditoría nunca deberán modificarse una vez almacenados.

La información representa evidencia histórica del sistema.

Si ocurre un cambio posterior, deberá registrarse un nuevo evento en lugar de modificar el existente.

---

## Independencia

El Audit Domain permanecerá desacoplado del resto de los dominios.

Cada módulo únicamente notificará la ocurrencia de un evento.

La forma de almacenarlo será responsabilidad exclusiva del Audit Domain.

---

## Bajo Acoplamiento

Los demás dominios no conocerán cómo funciona internamente la auditoría.

Únicamente emitirán eventos.

---

## Escalabilidad

La arquitectura permitirá registrar millones de eventos sin afectar el funcionamiento de la plataforma.

Esto facilitará futuras integraciones con sistemas especializados de análisis y observabilidad.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Audit Domain se definen los siguientes conceptos.

---

## Evento

Representa una acción importante ocurrida dentro de la plataforma.

Ejemplos:

- inicio de sesión
- registro de usuario
- viaje iniciado
- viaje finalizado
- pago aprobado

---

## Actor

Entidad responsable de ejecutar una acción.

Un actor podrá ser:

- usuario
- conductor
- administrador
- proceso automático
- servicio interno

---

## Recurso

Elemento afectado por una acción.

Ejemplos:

- usuario
- vehículo
- viaje
- promoción
- tarifa
- documento
- pago

---

## Acción

Describe exactamente qué ocurrió sobre el recurso.

Ejemplos:

- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- APPROVE
- REJECT
- ASSIGN
- CANCEL
- COMPLETE

---

## Evidencia

Información adicional asociada al evento.

Puede incluir:

- valores anteriores
- valores nuevos
- dirección IP
- dispositivo
- navegador
- ubicación
- metadatos técnicos

---

# 6. Actores

Dentro del Audit Domain participan los siguientes actores.

---

## Usuario

Genera eventos relacionados con:

- autenticación
- actualización del perfil
- solicitudes de viaje
- pagos
- calificaciones

---

## Conductor

Genera eventos relacionados con:

- aceptación de servicios
- actualización de documentos
- cambios de disponibilidad
- inicio y finalización de viajes

---

## Administrador

Genera eventos administrativos como:

- cambios de tarifas
- aprobación de documentos
- bloqueo de cuentas
- asignación de roles
- modificaciones de configuración

---

## Sistema

Procesos automáticos también podrán generar eventos.

Ejemplos:

- expiración de documentos
- cancelaciones automáticas
- vencimiento de promociones
- tareas programadas
- procesos internos

---

# 7. Modelo Conceptual

Todo evento registrado por el Audit Domain seguirá una estructura uniforme.

Conceptualmente el flujo será el siguiente.

```
Dominio

↓

Evento

↓

Audit Domain

↓

Registro Permanente
```

El dominio que genera la acción no almacenará directamente la auditoría.

Únicamente notificará que ocurrió un evento.

Será responsabilidad exclusiva del Audit Domain registrar dicha información.

---

# 8. Estructura Conceptual del Evento

Todo evento de auditoría estará compuesto por un conjunto de atributos comunes.

Conceptualmente un evento podrá representarse de la siguiente manera.

```
Evento

├── Event ID
├── Timestamp
├── Actor
├── Resource
├── Action
├── Result
├── Metadata
└── Context
```

Esta estructura permanecerá constante independientemente del dominio que origine el evento.

---

## Event ID

Identificador único del evento.

Permitirá localizar exactamente un registro específico dentro del historial de auditoría.

---

## Timestamp

Fecha y hora exacta en la que ocurrió el evento.

Todos los registros utilizarán UTC.

---

## Actor

Identifica quién originó la acción.

Ejemplos.

```
USER

DRIVER

ADMIN

SYSTEM

SERVICE
```

---

## Resource

Indica cuál fue el recurso afectado.

Ejemplos.

```
AUTH

USER

DRIVER

VEHICLE

TRIP

PAYMENT

PRICING

PROMOTION

NOTIFICATION
```

---

## Action

Describe la operación ejecutada.

Ejemplos.

```
CREATE

UPDATE

DELETE

LOGIN

LOGOUT

APPROVE

REJECT

ASSIGN

START

FINISH

CANCEL
```

---

## Result

Resultado obtenido después de ejecutar la acción.

Ejemplos.

```
SUCCESS

FAILED

DENIED

ERROR
```

---

## Metadata

Información adicional relacionada con el evento.

Puede contener datos como:

- dirección IP
- navegador
- dispositivo
- sistema operativo
- versión de la aplicación
- ciudad
- identificadores internos

Cada dominio podrá agregar información específica sin alterar la estructura principal.

---

## Context

Representa información complementaria necesaria para reconstruir el evento.

Ejemplos.

- valores anteriores
- valores nuevos
- motivo del cambio
- observaciones
- comentarios administrativos

---

# 9. Categorías de Eventos

Los eventos serán clasificados según el dominio que los origine.

---

## Eventos de Autenticación

Ejemplos.

```
LOGIN

LOGOUT

REGISTER

PASSWORD_CHANGED

TOKEN_REFRESH

LOGIN_FAILED
```

---

## Eventos de Usuarios

Ejemplos.

```
PROFILE_UPDATED

PHONE_CHANGED

PHOTO_UPDATED

ACCOUNT_BLOCKED

ACCOUNT_UNBLOCKED
```

---

## Eventos de Conductores

Ejemplos.

```
DRIVER_REGISTERED

DOCUMENT_UPLOADED

DOCUMENT_APPROVED

DOCUMENT_REJECTED

ONLINE

OFFLINE
```

---

## Eventos de Vehículos

Ejemplos.

```
VEHICLE_REGISTERED

SOAT_UPDATED

TECHNICAL_INSPECTION_UPDATED

VEHICLE_DISABLED

VEHICLE_ENABLED
```

---

## Eventos de Viajes

Ejemplos.

```
TRIP_REQUESTED

TRIP_ASSIGNED

TRIP_ACCEPTED

TRIP_STARTED

TRIP_COMPLETED

TRIP_CANCELLED
```

---

## Eventos de Pagos

Ejemplos.

```
PAYMENT_CREATED

PAYMENT_APPROVED

PAYMENT_REJECTED

REFUND_CREATED

PAYOUT_COMPLETED
```

---

## Eventos Administrativos

Ejemplos.

```
ROLE_ASSIGNED

ROLE_REMOVED

USER_BLOCKED

DRIVER_APPROVED

PRICING_UPDATED

PROMOTION_CREATED
```

---

# 10. Ciclo de Vida del Evento

Todo evento seguirá el mismo ciclo de procesamiento.

```
Acción

↓

Generación del Evento

↓

Validación

↓

Persistencia

↓

Consulta Histórica
```

Una vez persistido, el evento no podrá modificarse.

Cualquier cambio futuro será registrado mediante un nuevo evento.

---

# 11. Reglas de Negocio

El Audit Domain aplicará un conjunto de reglas que garantizarán la consistencia de toda la información histórica registrada por la plataforma.

---

## Regla 1

Toda acción crítica del sistema deberá generar un evento de auditoría.

No existirán operaciones sensibles que no dejen evidencia.

---

## Regla 2

Los registros de auditoría nunca podrán modificarse.

Si una acción cambia nuevamente un recurso, deberá generarse un nuevo evento.

Nunca se actualizará un evento existente.

---

## Regla 3

Todos los eventos deberán registrarse utilizando UTC.

Esto garantizará consistencia entre regiones y facilitará la correlación de eventos.

---

## Regla 4

Cada evento deberá poseer un identificador único.

Esto permitirá localizar cualquier operación de manera precisa.

---

## Regla 5

El Audit Domain nunca modificará información perteneciente a otros dominios.

Su única responsabilidad será registrar evidencia.

---

## Regla 6

Los eventos deberán conservar el contexto suficiente para reconstruir una operación.

Siempre que sea posible deberán almacenarse:

- valor anterior
- valor nuevo
- actor
- recurso
- acción realizada
- fecha
- resultado

---

## Regla 7

Los eventos deberán almacenarse en orden cronológico.

Esto permitirá reconstruir fácilmente la historia completa de cualquier entidad.

---

## Regla 8

El registro de auditoría no deberá impedir la ejecución de una operación crítica.

Si el almacenamiento de auditoría falla, el sistema deberá registrar el incidente para su recuperación posterior sin comprometer la disponibilidad de la plataforma.

---

# 12. Retención de Información

La auditoría representa información histórica de alto valor para la plataforma.

Por esta razón, los registros seguirán políticas de conservación definidas por la organización.

---

## Conservación

Los eventos no serán eliminados automáticamente.

Las políticas de retención podrán variar dependiendo de:

- requisitos legales
- políticas internas
- capacidad de almacenamiento
- regulaciones futuras

---

## Archivado

Cuando el volumen de información crezca significativamente, los eventos antiguos podrán trasladarse a almacenamiento histórico.

Este proceso no modificará la información original.

---

## Consulta

Los eventos archivados continuarán siendo consultables para procesos de auditoría, soporte técnico o investigaciones.

---

# 13. Integración con otros Dominios

El Audit Domain interactúa con todos los dominios de la plataforma.

Sin embargo, su comunicación siempre será unidireccional.

```
Dominio

↓

Evento

↓

Audit Domain
```

El Audit Domain nunca ejecutará lógica de negocio sobre otros módulos.

---

## Auth Domain

Generará eventos como:

- registro
- inicio de sesión
- cierre de sesión
- cambio de contraseña
- actualización de correo

---

## Driver Domain

Generará eventos relacionados con:

- documentos
- estado del conductor
- aprobaciones
- bloqueos
- disponibilidad

---

## Vehicle Domain

Registrará:

- creación de vehículos
- actualizaciones
- vencimientos
- cambios de vehículo activo

---

## Trip Domain

Generará algunos de los eventos más importantes de toda la plataforma.

Ejemplos.

- viaje solicitado
- viaje asignado
- viaje aceptado
- viaje iniciado
- viaje finalizado
- viaje cancelado

---

## Pricing Domain

Registrará modificaciones como:

- cambio de tarifas
- nuevos multiplicadores
- promociones
- descuentos
- reglas comerciales

---

## Payment Domain

Registrará:

- creación de pagos
- aprobación
- rechazo
- reembolsos
- liquidaciones

---

## Notification Domain

Permitirá conocer:

- notificaciones enviadas
- entregadas
- fallidas
- reintentadas

---

## Administration Domain

Será uno de los mayores productores de eventos de auditoría.

Toda acción administrativa deberá quedar registrada.

---

# 14. Preparación para Arquitectura Orientada a Eventos

El Audit Domain ha sido diseñado para integrarse naturalmente con una arquitectura basada en eventos.

En futuras versiones, los dominios podrán publicar eventos en un Event Bus interno.

El Audit Domain actuará como uno de los consumidores de dichos eventos.

```
Trip Domain

↓

Event Bus

↓

Audit Domain
```

Este diseño permitirá desacoplar completamente la generación de eventos de su almacenamiento.

Además, facilitará futuras integraciones con sistemas de monitoreo, analítica e inteligencia artificial.

---

# 15. Roadmap del Dominio

El Audit Domain ha sido diseñado para evolucionar junto con el crecimiento de la plataforma Tachi.

Entre las funcionalidades previstas para futuras versiones se encuentran las siguientes.

---

## Integración con Event Bus

El dominio podrá consumir eventos publicados por toda la plataforma mediante un Event Bus interno.

Esto permitirá desacoplar completamente la generación de eventos de su almacenamiento.

---

## Exportación de Auditorías

Se incorporará la posibilidad de exportar registros de auditoría en diferentes formatos.

Ejemplos.

- PDF
- CSV
- Excel
- JSON

Esta funcionalidad facilitará procesos de auditoría interna y cumplimiento normativo.

---

## Dashboards de Auditoría

El Administration Domain podrá incorporar paneles especializados para visualizar métricas como:

- eventos por día
- eventos por usuario
- eventos por conductor
- cambios administrativos
- operaciones críticas
- incidentes de seguridad

---

## Alertas de Seguridad

El Audit Domain podrá generar alertas automáticas cuando detecte patrones anómalos.

Ejemplos.

- múltiples intentos fallidos de inicio de sesión
- cambios masivos de configuración
- accesos desde ubicaciones inusuales
- modificaciones repetitivas sobre recursos críticos

---

## Integración con Observabilidad

En futuras versiones el dominio podrá integrarse con plataformas especializadas de monitoreo y observabilidad.

Ejemplos.

- OpenTelemetry
- Grafana
- Loki
- Prometheus
- Elastic Stack

Esto permitirá correlacionar eventos de negocio con métricas técnicas de la plataforma.

---

# 16. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Audit Domain |

---

# Conclusión

El Audit Domain constituye el mecanismo oficial de trazabilidad de la plataforma Tachi.

Su responsabilidad consiste en registrar de forma consistente, cronológica e inmutable todas las acciones relevantes realizadas por usuarios, conductores, administradores y procesos internos del sistema.

Gracias a su arquitectura desacoplada, el dominio puede integrarse con cualquier módulo sin afectar su lógica de negocio, proporcionando evidencia histórica, soporte para investigaciones, cumplimiento normativo y una base sólida para futuras capacidades de analítica, monitoreo e inteligencia artificial.

El diseño propuesto garantiza que la auditoría evolucione junto con la plataforma, manteniendo siempre la integridad y confiabilidad de la información registrada.

---