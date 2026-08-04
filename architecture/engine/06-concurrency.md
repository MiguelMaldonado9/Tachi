# 06. Concurrency Architecture

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 06-concurrency.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

La arquitectura de concurrencia define los mecanismos utilizados por Tachi para controlar operaciones simultáneas dentro del Trip Engine.

Debido a la naturaleza de una plataforma de movilidad, múltiples actores pueden interactuar con los mismos recursos al mismo tiempo.

Ejemplos:

- usuarios solicitando viajes
- conductores aceptando servicios
- actualizaciones de ubicación
- cambios de estado del viaje
- procesamiento de pagos

---

# 2. Objetivos

El sistema de concurrencia deberá garantizar:

- consistencia de datos
- evitar doble asignación de conductores
- prevenir conflictos de actualización
- mantener integridad del estado del viaje
- permitir escalabilidad horizontal
- soportar múltiples instancias del backend

---

# 3. Problemas de Concurrencia en Tachi

Los principales escenarios son:

---

# 3.1 Asignación simultánea de conductor

Escenario:

```
Usuario A

Solicita viaje


Usuario B

Solicita viaje


        ↓


Mismo conductor disponible

```

Sin control:

```
Driver 101

↓

Acepta Trip A


↓

Acepta Trip B

```

Resultado:

Estado inválido.

---

# 3.2 Actualizaciones simultáneas

Ejemplo:

```
Driver App

↓

AVAILABLE


Backend

↓

BUSY


Otro proceso

↓

OFFLINE

```

Tres operaciones modificando el mismo recurso.

---

# 3.3 Procesamiento distribuido

Tachi podrá ejecutar múltiples instancias.

Ejemplo:

```
Backend Node 1


Backend Node 2


Backend Node 3

```

Todos pueden intentar procesar operaciones al mismo tiempo.

---

# 4. Principios de Concurrencia

La arquitectura seguirá los siguientes principios.

---

# 4.1 Single Source of Truth

Cada entidad deberá tener una única fuente oficial de estado.

Ejemplo:

```
Trip

Fuente:

Trip Domain

```

No:

```
WebSocket

Estado del viaje


Cache

Estado del viaje


Database

Estado del viaje

```

---

# 4.2 Atomic Operations

Las operaciones críticas deberán ejecutarse como unidades indivisibles.

Ejemplo:

Asignar conductor:

```
Verificar disponibilidad

+

Reservar conductor

+

Cambiar estado

```

Todo debe ocurrir como una sola operación.

---

# 4.3 Idempotencia

Las operaciones deberán poder repetirse sin generar efectos duplicados.

Ejemplo:

```
AcceptTripCommand

```

Si llega dos veces:

```
Primera ejecución:

Aceptado


Segunda ejecución:

Ignorar

```

---

# 5. Modelo de Concurrencia

Tachi utilizará una combinación de estrategias.

```

Optimistic Concurrency

+

Distributed Locking

+

Event Ordering

+

Idempotency


```

---

# 6. Optimistic Concurrency Control (OCC)

Tachi utilizará Optimistic Concurrency Control como mecanismo principal para controlar modificaciones simultáneas sobre entidades críticas.

Este modelo permite alta escalabilidad evitando bloqueos innecesarios.

---

# 7. Principio de Funcionamiento

Cada entidad crítica deberá mantener un número de versión.

Ejemplo:

```
Trip

id:

trip_1001


version:

5

```

Cuando una operación modifica la entidad, deberá indicar la versión esperada.

---

Ejemplo:

Solicitud de actualización:

```
Update Trip


Expected Version:

5

```

El sistema valida:

```
Versión actual:

5


Versión esperada:

5

```

Resultado:

```
Actualizar

Incrementar versión

```

---

# 8. Incremento de Versión

Después de una modificación exitosa:

Antes:

```
Trip

version:

5

```

Después:

```
Trip

version:

6

```

---

La nueva versión representa una nueva realidad del agregado.

---

# 9. Conflicto de Versiones

Un conflicto ocurre cuando dos procesos intentan modificar la misma entidad utilizando una versión antigua.

Ejemplo:

Estado inicial:

```
Trip

version:

5

```

---

Proceso A:

```
Lee Trip

version 5


Actualiza


Nueva versión:

6

```

---

Proceso B:

```
Lee Trip

version 5


Intenta actualizar

```

Resultado:

```
Conflict detected

Expected:

5


Current:

6

```

---

El sistema deberá rechazar la operación.

---

# 10. Manejo de Conflictos

Cuando ocurre un conflicto, el sistema deberá:

1. rechazar actualización inválida
2. registrar el conflicto
3. recuperar estado actual
4. decidir si reintenta

---

Ejemplo:

```
Update Failed

↓

Reload Entity

↓

Validate New State

↓

Retry or Reject

```

---

# 11. Entidades que Requieren Versionamiento

Las entidades críticas deberán implementar control de versión.

Ejemplos:

---

## Trip Aggregate

Controla:

- estado del viaje
- conductor asignado
- pasajero
- tarifa

---

## Driver Aggregate

Controla:

- disponibilidad
- estado operativo
- asignaciones activas

---

## Payment Aggregate

Controla:

- cobros
- liquidaciones
- wallet

---

# 12. Distributed Locking

Aunque OCC será la estrategia principal, algunas operaciones requieren exclusión temporal.

Para estos casos se utilizarán locks distribuidos.

---

Ejemplo:

Asignación de conductor.

```
Buscar conductor

↓

Reservar conductor

↓

Confirmar viaje

```

Durante este proceso otro proceso no debe modificar la misma reserva.

---

# 13. Distributed Lock Manager

El sistema deberá contar con un componente encargado de administrar locks distribuidos.

Conceptualmente:

```
Trip Engine

      |

      ▼

Distributed Lock Manager

      |

      ▼

Shared Lock Storage

```

---

# 14. Uso de Locks

Los locks deberán utilizarse solamente en operaciones críticas.

Ejemplos:

Necesitan lock:

```
Asignación de conductor

Aceptación de viaje

Procesamiento de pago

Cambio crítico de estado

```

---

No necesitan lock:

```
Actualización GPS

Métricas

Logs

Eventos informativos

```

---

# 15. Redis Distributed Lock

Para la primera implementación se recomienda utilizar un mecanismo basado en Redis.

Ejemplo conceptual:

```
lock:

driver:501

value:

trip_1001


TTL:

10 segundos

```

---

Si otro proceso intenta adquirir el mismo lock:

```
driver:501

LOCKED

```

Debe esperar o rechazar.

---

# 16. Reglas del Lock

Todo lock deberá tener:

- propietario
- tiempo de expiración
- identificación de operación
- liberación segura

---

Ejemplo:

```
Lock {

resourceId,

ownerId,

createdAt,

expiresAt

}

```

---
# 17. Actor Model Architecture

Tachi utilizará el patrón Actor Model como mecanismo complementario para controlar operaciones concurrentes sobre agregados críticos.

El objetivo es garantizar que las operaciones sobre una misma entidad sean procesadas de manera ordenada.

---

# 18. Concepto de Actor

Un Actor representa una entidad independiente capaz de:

- recibir mensajes
- procesar comandos
- mantener estado temporal
- ejecutar acciones secuenciales

---

En Tachi, los principales candidatos a Actor serán:

- Trip Aggregate
- Driver Aggregate
- Payment Aggregate

---

# 19. Trip Actor

Cada viaje activo podrá representarse como un Actor independiente.

Ejemplo:

```
Trip Actor


trip_1001


Estado actual:

WAITING_DRIVER


Mensajes pendientes:

AcceptDriver

CancelTrip

StartTrip

```

---

El Actor procesa un mensaje a la vez.

Ejemplo:

```
Mensaje 1

AcceptDriver


↓

Procesar


↓

Actualizar estado


↓

Mensaje 2

StartTrip

```

---

# 20. Cola de Mensajes por Actor

Cada Actor mantiene una cola interna de comandos.

Ejemplo:

```
Trip Actor


Queue:


1. AcceptDriver

2. CancelTrip

3. LocationUpdate


```

---

El sistema procesa los mensajes siguiendo reglas de prioridad y orden.

---

# 21. Ventaja del Procesamiento Secuencial

Sin Actor Model:

```
Request A

        \
         \
          Trip

         /

Request B

```

Dos procesos modifican al mismo tiempo.

---

Con Actor Model:

```
Request A

        |

        ▼


Trip Actor


        |

        ▼


Request B

```

Existe un único flujo de modificación.

---

# 22. Integración con State Machine

Cada Actor deberá respetar la máquina de estados definida para la entidad.

Ejemplo:

```
REQUESTED

↓

MATCHING

↓

ASSIGNED

↓

ARRIVING

↓

IN_PROGRESS

↓

COMPLETED

```

---

Un comando solamente será aceptado si la transición es válida.

---

Ejemplo:

Estado actual:

```
COMPLETED

```

Comando recibido:

```
StartTrip

```

Resultado:

```
Rejected

Invalid transition

```

---

# 23. Protección contra Doble Asignación

El Actor Model permite evitar escenarios como:

```
Driver A

Acepta viaje


Driver B

Acepta viaje


al mismo tiempo

```

---

Flujo:

```
AcceptDriverCommand


↓

Trip Actor


↓

Validar estado


↓

Asignar primer conductor válido


↓

Actualizar versión


↓

Emitir evento

```

---

Segundo intento:

```
AcceptDriverCommand


↓

Trip Actor


↓

Estado ya modificado


↓

Rechazar

```

---

# 24. Actor y Concurrencia Distribuida

En una arquitectura con múltiples instancias, solamente una instancia deberá ser responsable de procesar un Actor específico en un momento determinado.

---

Ejemplo:

```
Trip_1001


Asignado a:


Engine Node 1


```

Mientras:

```
Engine Node 2

No procesa ese Actor

```

---

Esto requiere mecanismos de:

- Actor Ownership
- Leader Election
- Distributed Coordination

---

# 25. Actor Ownership

El sistema deberá conocer qué nodo posee actualmente cada Actor.

Ejemplo:

```
Trip Registry


trip_1001

↓

engine-node-1


trip_1002

↓

engine-node-3

```

---

Cuando cambia el propietario:

```
Node Failure

↓

Rebalance

↓

Nuevo Owner

```

---

# 26. Comandos vs Eventos

Los Actors deberán diferenciar entre comandos y eventos.

---

## Command

Representa una intención.

Ejemplo:

```
AcceptTripCommand

```

Significa:

"Quiero aceptar este viaje."

---

## Event

Representa un hecho ocurrido.

Ejemplo:

```
TripAcceptedEvent

```

Significa:

"El viaje fue aceptado."

---

Flujo:

```
Command

↓

Actor

↓

Validation

↓

State Change

↓

Event

```

---

# 27. Actor Scheduler

El Actor Scheduler será el componente encargado de administrar la ejecución de los Actors dentro del Trip Engine.

Su responsabilidad será distribuir trabajo de manera eficiente entre los recursos disponibles.

---

# 28. Responsabilidades del Scheduler

El Actor Scheduler deberá:

- asignar ejecución a Actors
- administrar colas
- controlar prioridades
- evitar saturación
- distribuir carga
- detectar Actors inactivos
- recuperar procesamiento

---

# 29. Arquitectura del Scheduler

Conceptualmente:

```

             Actor Scheduler


                    │


        ┌───────────┼───────────┐


        ▼           ▼           ▼


    Worker 1    Worker 2    Worker 3


        │           │           │


     Actors      Actors      Actors


```

---

# 30. Cola de Comandos

Cada Actor tendrá una cola de comandos pendientes.

Ejemplo:

```
Trip Actor


Queue:


1. CancelTrip

2. AcceptDriver

3. UpdateLocation


```

---

El Scheduler será responsable de decidir cuándo ejecutar cada comando.

---

# 31. Priorización de Comandos

No todos los comandos tienen la misma importancia.

Tachi deberá implementar prioridades.

---

## Alta Prioridad

Ejemplos:

```
CancelTrip

EmergencyAction

PaymentConfirmation

```

---

## Prioridad Normal

Ejemplos:

```
AcceptDriver

StartTrip

CompleteTrip

```

---

## Baja Prioridad

Ejemplos:

```
AnalyticsUpdate

MetricsEvent

HistoricalSync

```

---

# 32. Command Ordering

Cuando múltiples comandos llegan al mismo Actor, deberán procesarse respetando reglas de orden.

Ejemplo:

```
AcceptDriverCommand


antes que


StartTripCommand

```

---

El sistema no deberá ejecutar:

```
StartTrip

↓

Sin conductor asignado

```

---

# 33. Backpressure

El sistema deberá controlar la acumulación excesiva de mensajes.

Ejemplo:

```
100.000 LocationUpdate

↓

Actor Queue

↓

Saturación

```

---

El Scheduler deberá aplicar estrategias:

- reducción de frecuencia
- eliminación de eventos no críticos
- agrupamiento de mensajes

---

# 34. Ejemplo: Actualizaciones GPS

La ubicación del conductor no requiere procesar cada mensaje.

Ejemplo:

Llegan:

```
Location 1

Location 2

Location 3

Location 4

```

Si todavía no fueron procesadas:

Puede conservarse solamente:

```
Última ubicación válida

```

---

Esto evita saturación.

---

# 35. Distributed Queue

En escenarios de alta escala, las colas deberán poder distribuirse.

Arquitectura:

```

Actor


 |

 |

Distributed Queue


 |

 |

Worker Pool


```

---

Beneficios:

- escalabilidad horizontal
- recuperación ante fallos
- distribución de carga

---

# 36. Actor Recovery

Los Actors deberán poder recuperarse después de fallos.

Ejemplo:

```
Engine Node 1

↓

Falla


Trip Actor

↓

Sin propietario


↓

Recovery Process


↓

Nuevo Node Owner

```

---

# 37. Actor Persistence

Los Actors no deberán depender únicamente de memoria.

El estado crítico deberá persistirse.

Ejemplo:

```
Actor State


↓

Database

+

Event Store

```

---

Esto permite reconstrucción.

---

# 38. Rebalanceo de Actors

Cuando aumenta o disminuye la capacidad del sistema:

```
Agregar Node


↓

Redistribuir Actors


↓

Balancear carga

```

---

El sistema deberá evitar interrupciones durante el movimiento.

---

# 39. Seguridad de Concurrencia

El sistema deberá implementar mecanismos de protección para evitar modificaciones inválidas causadas por operaciones simultáneas.

---

Los principales controles serán:

- validación de versión
- control de estados
- locks distribuidos
- idempotencia
- procesamiento ordenado
- auditoría de conflictos

---

# 40. Prevención de Race Conditions

Una condición de carrera ocurre cuando múltiples procesos intentan modificar un recurso compartido al mismo tiempo.

Ejemplo:

```
Driver 501


Proceso A

Asignar viaje


Proceso B

Cambiar disponibilidad

```

---

Sin protección:

```
Estado inconsistente

```

---

Con control de concurrencia:

```
Proceso A

↓

Lock / Version Check

↓

Actualizar


Proceso B

↓

Rechazado o reintentado

```

---

# 41. Validación de Estado

Antes de ejecutar cualquier comando crítico, el sistema deberá validar el estado actual del agregado.

Ejemplo:

Comando:

```
StartTripCommand

```

Estado requerido:

```
ASSIGNED

```

---

Si el estado actual es:

```
COMPLETED

```

Resultado:

```
Command Rejected

Invalid State Transition

```

---

# 42. Concurrency Metrics

El sistema deberá generar métricas relacionadas con concurrencia.

---

## Conflictos

```
Version conflicts

Rejected commands

Lock conflicts

```

---

## Rendimiento

```
Command processing time

Actor queue size

Event processing latency

```

---

## Recursos

```
Active Actors

Workers disponibles

CPU usage

Memory usage

```

---

# 43. Observabilidad del Concurrency Engine

El sistema deberá permitir monitorear el comportamiento interno del motor.

---

Información requerida:

```
Actor activo

Nodo propietario

Comandos pendientes

Estado actual

Último procesamiento

```

---

Ejemplo:

```
Trip Actor


ID:

trip_1001


Owner:

engine-node-2


State:

IN_PROGRESS


Queue:

3 commands

```

---

# 44. Auditoría de Concurrencia

Los eventos importantes relacionados con concurrencia deberán registrarse.

Ejemplos:

```
ConcurrencyConflictDetected

LockAcquired

LockReleased

CommandRejected

ActorReassigned

ActorRecovered

```

---

Estos registros permitirán analizar:

- problemas de rendimiento
- errores de asignación
- fallos distribuidos
- comportamiento inesperado

---

# 45. Pruebas de Concurrencia

El sistema deberá incluir pruebas específicas para escenarios simultáneos.

---

# 45.1 Double Assignment Test

Objetivo:

Verificar que un conductor no pueda aceptar dos viajes simultáneamente.

Ejemplo:

```
Trip A

+

Trip B


↓

Same Driver

```

Resultado esperado:

```
Solo una asignación válida

```

---

# 45.2 Concurrent Update Test

Objetivo:

Validar conflictos de actualización.

Ejemplo:

```
Proceso A

version 5


Proceso B

version 5

```

Resultado:

```
Uno procesa

Uno falla por conflicto

```

---

# 45.3 Failure Recovery Test

Objetivo:

Validar recuperación ante caída de nodos.

Ejemplo:

```
Actor Owner

↓

Node Failure


↓

Reassignment

```

---

# 46. Estrategia MVP

Para la primera versión de Tachi se implementará:

```
Optimistic Concurrency Control

+

Database Transactions

+

Idempotency

+

Redis Locks en operaciones críticas

```

---

El objetivo es mantener una arquitectura robusta sin introducir complejidad innecesaria.

---

# 47. Evolución Futura

En versiones posteriores podrán incorporarse:

- Actor Runtime dedicado
- Event Sourcing completo
- Distributed Scheduler avanzado
- Multi-region Actor Placement
- Smart Load Balancing

---

# 48. Arquitectura Final de Concurrencia

La arquitectura completa queda:

```

                Trip Engine


                     │


          ┌──────────┼──────────┐


          ▼          ▼          ▼


     Actor Model    OCC    Distributed Locks


          │          │          │


          └──────────┼──────────┘


                     ▼


              Event Architecture


                     ▼


              Consistent State


```

---

# 49. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------------------|----------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Arquitectura de concurrencia del Trip Engine |

---

# Conclusión

La arquitectura de concurrencia de Tachi permite controlar operaciones simultáneas manteniendo consistencia, disponibilidad y escalabilidad.

La combinación de:

- Optimistic Concurrency Control
- Versionamiento por agregado
- Distributed Locks
- Actor Model
- Scheduler
- Event Driven Architecture

permite que el Trip Engine pueda manejar operaciones críticas de movilidad sin generar estados inconsistentes.

Este diseño permite iniciar con una implementación preparada para el MVP y evolucionar hacia una arquitectura distribuida capaz de soportar grandes volúmenes de viajes, conductores y usuarios.
