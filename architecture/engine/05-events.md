# 05. Events Architecture

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 05-events.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

La arquitectura de eventos define el mecanismo de comunicación entre los diferentes componentes internos de la plataforma Tachi.

El sistema utiliza un enfoque basado en eventos para permitir comunicación desacoplada entre dominios.

Los eventos representan hechos ocurridos dentro del sistema.

Ejemplo:

```
TripCreated

TripAccepted

TripStarted

TripCompleted

PaymentCreated

```

Un evento no solicita una acción.

Un evento informa que una acción ocurrió.

---

# 2. Objetivos

La arquitectura de eventos deberá cumplir los siguientes objetivos.

- desacoplar dominios
- permitir comunicación asíncrona
- mejorar escalabilidad
- facilitar auditoría
- permitir integración futura
- reducir dependencias directas
- soportar procesamiento distribuido

---

# 3. Principios de Diseño

El sistema seguirá los siguientes principios.

---

## Event First

Los cambios importantes del sistema deberán generar eventos.

Ejemplo.

Cuando un viaje inicia:

```
Trip

↓

Estado cambiado

↓

TripStartedEvent

```

---

## Loose Coupling

Los dominios no deberán conocerse directamente.

Ejemplo incorrecto:

```
Trip Domain

↓

Payment Service

```

Ejemplo correcto:

```
Trip Domain

↓

TripCompletedEvent

↓

Event Bus

↓

Payment Domain

```

---

## Single Responsibility

Cada dominio es responsable de sus propios eventos.

Ejemplo.

Trip Domain:

```
TripCreated

TripStarted

TripCompleted

```

Payment Domain:

```
PaymentCreated

PaymentCompleted

```

---

# 4. Concepto de Evento

Un evento representa un hecho ocurrido dentro del sistema.

Características.

- ocurre en un momento específico
- no debe modificarse después de creado
- contiene información necesaria
- puede tener múltiples consumidores

---

Ejemplo conceptual.

```
Event {

 id

 type

 aggregateId

 timestamp

 payload

 version

}

```

---

# 5. Tipos de Eventos

Tachi utilizará diferentes categorías de eventos.

---

# Domain Events

Representan cambios dentro de un dominio.

Ejemplo.

```
TripAcceptedEvent

DriverApprovedEvent

PaymentCompletedEvent

```

---

# Integration Events

Representan comunicación entre dominios independientes.

Ejemplo.

```
TripCompletedEvent

↓

Payment Domain

↓

Rating Domain

```

---

# System Events

Representan eventos técnicos del sistema.

Ejemplo.

```
WebSocketDisconnected

ServiceStarted

CacheInvalidated

```

---

# 6. Event Flow General

El flujo estándar será:

```

Domain

↓

Generate Event

↓

Event Publisher

↓

Event Bus

↓

Consumers

↓

Handlers


```

---

Ejemplo.

```
Trip Completed

↓

TripCompletedEvent

↓

Event Bus

↓

Payment Handler

↓

Create Payment

```

---

id="p3events"
# 7. Event Bus Architecture

El Event Bus constituye el componente encargado de transportar eventos entre los diferentes dominios y servicios internos de Tachi.

Su responsabilidad principal consiste en recibir eventos publicados por los dominios y distribuirlos hacia los consumidores registrados.

---

# 8. Responsabilidades del Event Bus

El Event Bus será responsable de:

- recibir eventos publicados
- mantener orden de procesamiento cuando sea requerido
- entregar eventos a consumidores
- administrar reintentos
- registrar fallos
- garantizar entrega confiable

---

El Event Bus no deberá contener lógica de negocio.

Su única responsabilidad es transportar información.

---

# 9. Event Publisher

Cada dominio deberá utilizar un Publisher para emitir eventos.

Ejemplo:

```
Trip Domain

↓

TripCompletedEvent

↓

Event Publisher

↓

Event Bus

```

---

El Publisher deberá encargarse de:

- construir el Event Envelope
- agregar metadata
- asignar identificadores
- publicar el evento

---

# 10. Event Consumer

Los consumidores son componentes interesados en determinados eventos.

Ejemplo:

```
TripCompletedEvent


Consumidores:

Payment Domain

Rating Domain

Notification Domain

Audit Domain

```

---

Cada consumidor deberá implementar su propio procesamiento.

Ejemplo:

```
Payment Consumer

↓

Recibe TripCompletedEvent

↓

Calcula pago

↓

Genera PaymentCreatedEvent

```

---

# 11. Event Handler

Cada evento deberá tener un Handler responsable de procesarlo.

Ejemplo:

```
Event

TripCompletedEvent


↓

Handler

TripCompletedHandler


↓

Ejecutar lógica

```

---

El Handler deberá cumplir:

- procesamiento independiente
- validación del evento
- manejo de errores
- registro de resultado

---

# 12. Modelo de Procesamiento

Tachi utilizará procesamiento asíncrono.

Flujo:

```
Acción del usuario

↓

Cambio de dominio

↓

Generación de evento

↓

Event Bus

↓

Consumidores

↓

Procesamiento independiente

```

---

Ejemplo:

Usuario finaliza viaje.

```
TripCompleted

↓

Event Bus

↓

Payment crea cobro

↓

Rating solicita evaluación

↓

Notification envía mensaje

↓

Audit registra acción

```

---

# 13. Entrega de Eventos

El sistema deberá definir garantías de entrega.

---

## At Most Once

El evento puede perderse pero nunca duplicarse.

No recomendado para operaciones críticas.

---

## At Least Once

El evento puede llegar más de una vez.

Requiere consumidores idempotentes.

Recomendado para Tachi.

---

## Exactly Once

Garantiza procesamiento único.

Es más complejo en sistemas distribuidos.

---

# 14. Estrategia de Tachi

Para el MVP y evolución inicial se utilizará:

```
At Least Once Delivery

+

Idempotent Consumers

```

---

Esto permite:

- alta confiabilidad
- recuperación ante fallos
- procesamiento distribuido

---

# 15. Arquitectura del Event Bus

El Event Bus representa la capa de comunicación asíncrona encargada de transportar eventos entre los diferentes dominios y componentes internos de Tachi.

Su objetivo principal es permitir que los dominios puedan comunicarse sin establecer dependencias directas entre ellos.

---

# 16. Responsabilidades del Event Bus

El Event Bus será responsable de:

- recibir eventos publicados
- distribuir eventos hacia consumidores registrados
- mantener comunicación desacoplada
- administrar entrega de mensajes
- soportar procesamiento asíncrono
- registrar información de transporte
- permitir escalabilidad horizontal

---

El Event Bus NO será responsable de:

- lógica de negocio
- modificación de estados de dominio
- validaciones funcionales
- decisiones operativas

Estas responsabilidades pertenecen a cada dominio.

---

# 17. Arquitectura General

La comunicación basada en eventos seguirá el siguiente flujo:

```

Domain

  |

  |

Event Publisher

  |

  |

Event Bus

  |

  |

Event Consumer

  |

  |

Event Handler

  |

  |

Business Logic


```

---

# 18. Event Publisher

Cada dominio deberá contar con un componente encargado de publicar eventos.

Ejemplo:

```
Trip Domain

↓

TripCompletedEvent

↓

Event Publisher

↓

Event Bus

```

---

El Event Publisher será responsable de:

- crear el Event Envelope
- asignar identificadores
- agregar metadata
- validar estructura del evento
- enviar el mensaje al Event Bus

---

# 19. Event Consumer

Los consumidores representan componentes interesados en recibir determinados eventos.

Un mismo evento puede tener múltiples consumidores.

Ejemplo:

```
TripCompletedEvent


        │


 ┌──────┼────────┐

 │      │        │


Payment Rating Notification


```

---

Cada consumidor deberá procesar solamente los eventos necesarios para su responsabilidad.

---

# 20. Event Handler

Los Event Handlers contienen la lógica específica asociada al procesamiento de un evento.

Ejemplo:

```
TripCompletedEvent

        |

        ▼

TripCompletedHandler

        |

        ▼

Crear proceso de pago

```

---

Cada Handler deberá:

- validar información recibida
- ejecutar operación correspondiente
- manejar errores
- registrar resultado
- evitar procesamiento duplicado

---

# 21. Procesamiento Asíncrono

Los eventos deberán procesarse de manera asíncrona siempre que no requieran respuesta inmediata.

Ejemplo:

Finalización de viaje.

Proceso inmediato:

```
Actualizar estado del viaje

```

Procesos asíncronos:

```
Crear pago

Enviar notificación

Solicitar valoración

Generar auditoría

```

---

# 22. Comunicación entre Dominios

Los dominios no deberán llamarse directamente.

Ejemplo incorrecto:

```
Trip Domain

↓

Payment Domain

```

---

Ejemplo correcto:

```
Trip Domain

↓

TripCompletedEvent

↓

Event Bus

↓

Payment Domain

```

---

Esto permite modificar o reemplazar un dominio sin afectar otros componentes.

---

# 23. Catálogo de Eventos

Tachi deberá mantener un catálogo oficial de eventos.

Cada evento deberá definir:

- nombre
- versión
- dominio propietario
- descripción
- consumidores autorizados
- estructura del payload

---

Ejemplo:

```
Event:

TripCompletedEvent


Owner:

Trip Domain


Consumers:

Payment Domain

Rating Domain

Notification Domain

Audit Domain

```

---

# 24. Convención de Nombres

Los eventos deberán utilizar nombres en pasado.

Correcto:

```
TripCreated

TripAccepted

TripStarted

TripCompleted

PaymentProcessed

```

Incorrecto:

```
CreateTrip

AcceptTrip

StartTrip

```

---

La razón es que los eventos representan hechos que ya ocurrieron.

---

# 25. Event Ordering

En sistemas distribuidos los eventos pueden llegar en un orden diferente al momento real en que fueron generados.

Por esta razón Tachi deberá implementar mecanismos para controlar el orden lógico de procesamiento.

---

# 26. Sequence Number

Cada evento deberá incluir un número secuencial asociado al Aggregate correspondiente.

Ejemplo:

```
TripCreated

sequence: 1


TripAccepted

sequence: 2


TripStarted

sequence: 3


TripCompleted

sequence: 4

```

---

El consumidor deberá validar la secuencia antes de aplicar cambios.

---

Ejemplo:

Evento recibido:

```
TripCompleted

sequence: 4

```

Estado actual:

```
Último evento procesado:

sequence: 3

```

Resultado:

```
Procesar evento

```

---

Si llega:

```
TripStarted

sequence: 2

```

Resultado:

```
Evento antiguo

Ignorar

```

---

# 27. Aggregate Ordering

El orden de eventos será controlado por Aggregate.

Ejemplo:

```
trip_1001

sequence:

1
2
3
4


trip_1002

sequence:

1
2

```

Cada viaje mantiene su propia línea temporal.

---

Esto evita bloquear eventos independientes.

---

Ejemplo correcto:

```
Trip 1001

Evento 5 pendiente


Trip 1002

Evento 8 procesado

```

---

# 28. Idempotencia de Consumidores

Los consumidores deberán diseñarse para procesar eventos duplicados de manera segura.

Debido a que Tachi utilizará entrega:

```
At Least Once

```

un evento puede llegar más de una vez.

---

Ejemplo:

Primer procesamiento:

```
PaymentCreatedEvent

↓

Crear pago

```

Segundo procesamiento:

```
PaymentCreatedEvent

↓

Detectar duplicado

↓

Ignorar

```

---

# 29. Event Processing Registry

Cada consumidor deberá mantener registro de eventos procesados.

Ejemplo:

```
ProcessedEvents


eventId

consumer

processedAt

status

```

---

Antes de procesar:

```
¿Evento procesado?

        |

        ├── Sí → Ignorar

        |

        └── No → Procesar

```

---

# 30. Reintentos de Eventos

Cuando un consumidor falle procesando un evento, el sistema deberá ejecutar mecanismos de reintento.

Ejemplo:

```
Evento recibido

↓

Procesamiento falla

↓

Esperar

↓

Reintentar

```

---

# 31. Estrategia de Backoff

Los reintentos deberán utilizar espera progresiva.

Ejemplo:

```
Intento 1

↓

1 segundo


Intento 2

↓

5 segundos


Intento 3

↓

30 segundos


Intento 4

↓

5 minutos

```

---

Esto evita sobrecargar servicios con errores persistentes.

---

# 32. Dead Letter Queue (DLQ)

Los eventos que no puedan procesarse después de varios intentos deberán enviarse a una cola especial.

Esta cola se denomina:

```
Dead Letter Queue

(DLQ)

```

---

Flujo:

```
Evento

↓

Consumer

↓

Error

↓

Retry

↓

Retry Failed

↓

DLQ

```

---

# 33. Administración de Eventos Fallidos

Los eventos almacenados en DLQ deberán poder:

- ser inspeccionados
- ser analizados
- ser reprocesados
- generar alertas

---

Ejemplo:

```
TripCompletedEvent

Estado:

FAILED


Motivo:

Payment Service unavailable

```

---

# 34. Recuperación Manual

Los administradores técnicos podrán solicitar reprocesamiento cuando el problema haya sido solucionado.

Proceso:

```
DLQ

↓

Validación

↓

Replay Event

↓

Consumer

↓

Procesamiento exitoso

```

---

# 35. Observabilidad de Eventos

El sistema deberá generar métricas sobre procesamiento de eventos.

Indicadores:

- eventos publicados
- eventos consumidos
- errores
- reintentos
- eventos en DLQ
- tiempo de procesamiento

---

# 36. Transactional Outbox Pattern

Tachi deberá utilizar el patrón Transactional Outbox para garantizar que los cambios de dominio y la generación de eventos permanezcan consistentes.

El objetivo es evitar situaciones donde:

- el estado del negocio se actualiza correctamente,
- pero el evento no logra publicarse.

---

Ejemplo de problema:

```
Trip Domain

↓

Actualizar viaje

↓

Guardar cambios

↓

Publicar evento

```

Si ocurre un fallo:

```
Base de datos

✅ Actualizada


Event Bus

❌ Evento perdido

```

Resultado:

Los demás dominios desconocen el cambio ocurrido.

---

# 37. Funcionamiento del Outbox

La operación deberá ejecutarse dentro de una misma transacción.

Ejemplo:

```
Database Transaction


Actualizar Trip


+

Guardar Event


↓

Commit


↓

Outbox Processor


↓

Event Bus

```

---

# 38. Tabla Outbox

Cada dominio que publique eventos críticos deberá disponer de una estructura Outbox.

Ejemplo:

```
outbox_events

----------------------

id

event_id

event_type

aggregate_id

payload

created_at

published_at

status

```

---

Estados posibles:

```
PENDING

PROCESSING

PUBLISHED

FAILED

```

---

# 39. Outbox Processor

El Outbox Processor será responsable de leer eventos pendientes y publicarlos hacia el Event Bus.

Flujo:

```
Outbox Worker

↓

Buscar eventos pendientes

↓

Publicar evento

↓

Confirmar entrega

↓

Actualizar estado

```

---

# 40. Event Store

Tachi deberá mantener un historial de eventos importantes para permitir auditoría y reconstrucción.

El Event Store almacenará eventos inmutables.

---

Ejemplo:

```
TripCreated

TripAccepted

TripStarted

TripCompleted

```

---

Los eventos almacenados no deberán modificarse.

Solamente podrán agregarse nuevos eventos.

---

# 41. Event Replay

El sistema deberá permitir reproducir eventos históricos cuando sea necesario.

Casos de uso:

- recuperación ante errores
- migraciones
- análisis histórico
- reconstrucción de estados

---

Flujo:

```
Event Store

↓

Replay Engine

↓

Consumer

↓

Nuevo procesamiento

```

---

# 42. Event Schema Registry

Todos los eventos deberán contar con un esquema registrado.

El Schema Registry permitirá controlar:

- estructura
- versión
- compatibilidad
- cambios futuros

---

Ejemplo:

```
TripCompletedEvent

Version:

1


Payload:

{

tripId,

driverId,

completedAt

}

```

---

Si cambia la estructura:

```
TripCompletedEvent v2

```

deberá mantenerse compatibilidad con consumidores existentes.

---

# 43. Seguridad de Eventos

Los eventos internos deberán estar protegidos.

Se deberá controlar:

- quién publica eventos
- quién consume eventos
- qué información contiene cada evento

---

Reglas:

Un dominio solamente podrá publicar eventos propios.

Ejemplo:

Correcto:

```
Trip Domain

↓

TripCompletedEvent

```

Incorrecto:

```
Trip Domain

↓

PaymentCompletedEvent

```

---

# 44. Protección de Datos

Los eventos no deberán almacenar información sensible innecesaria.

Ejemplo:

Evitar:

```
password

tokens

datos privados completos

```

Preferir:

```
identificadores

referencias

metadata necesaria

```

---

# 45. Integración con Audit Domain

Los eventos representan una fuente importante para auditoría.

Los eventos críticos deberán generar registros de auditoría.

Ejemplo:

```
TripCompletedEvent

↓

Audit Consumer

↓

Audit Record

```

---

Eventos auditables:

- creación de viaje
- asignación de conductor
- inicio de viaje
- finalización
- pagos
- cambios administrativos

---

# 46. Métricas del Sistema de Eventos

El sistema deberá monitorear:

## Producción

- eventos generados
- eventos publicados
- tasa de publicación

---

## Consumo

- eventos procesados
- tiempo de procesamiento
- errores

---

## Fallos

- eventos rechazados
- cantidad de reintentos
- tamaño de DLQ

---

# 47. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------------------|-----------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Arquitectura del sistema de eventos del Trip Engine |

---

# Conclusión

El sistema de eventos de Tachi establece una arquitectura desacoplada, escalable y preparada para procesamiento distribuido.

La combinación de:

- Event Bus
- Event Envelope estándar
- Correlation ID
- Event Ordering
- Idempotencia
- Transactional Outbox
- Event Store
- Schema Registry

permite que los diferentes dominios evolucionen de forma independiente manteniendo consistencia y trazabilidad.

Esta arquitectura permitirá que Tachi pueda crecer desde un MVP regional hasta una plataforma de movilidad distribuida con múltiples servicios, integraciones y capacidades inteligentes.