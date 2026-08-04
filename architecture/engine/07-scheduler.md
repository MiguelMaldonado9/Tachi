# 07. Scheduler Architecture

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 07-scheduler.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

La arquitectura del Scheduler define el sistema encargado de ejecutar tareas automáticas dentro de la plataforma Tachi.

El Scheduler permite ejecutar procesos que no dependen directamente de una acción inmediata del usuario.

---

Dentro de una plataforma de movilidad existen múltiples procesos que deben ejecutarse automáticamente.

Ejemplos:

- expiración de solicitudes de viaje
- reintentos de asignación
- actualización de estados
- procesamiento de eventos pendientes
- tareas financieras
- mantenimiento del sistema

---

# 2. Objetivos

El Scheduler deberá cumplir los siguientes objetivos:

- ejecutar tareas programadas
- manejar trabajos diferidos
- soportar reintentos automáticos
- distribuir carga de trabajo
- garantizar ejecución confiable
- evitar duplicación de procesos
- integrarse con Events y Concurrency Engine

---

# 3. Problema que Resuelve

Sin Scheduler, muchos procesos dependerían de acciones manuales.

Ejemplo:

```
Usuario solicita viaje

↓

Nadie acepta

↓

¿Qué pasa después?

```

---

El Scheduler permite:

```
Usuario solicita viaje

↓

Esperar tiempo configurado

↓

Scheduler detecta expiración

↓

Ejecutar acción

```

---

# 4. Principios de Diseño

El Scheduler seguirá los siguientes principios:

---

# 4.1 Asynchronous Execution

Las tareas que no necesitan respuesta inmediata deberán ejecutarse fuera del flujo principal.

Ejemplo:

```
Completar viaje

↓

Respuesta inmediata al usuario


Proceso secundario:

Generar estadísticas

```

---

# 4.2 Fault Tolerance

Las tareas deberán poder recuperarse ante fallos.

Ejemplo:

```
Worker falla

↓

Job queda pendiente

↓

Otro Worker procesa

```

---

# 4.3 Idempotency

Los Jobs deberán poder ejecutarse más de una vez sin generar efectos incorrectos.

Ejemplo:

```
ProcessPaymentJob

```

Si se ejecuta dos veces:

```
Primer intento:

Pago creado


Segundo intento:

Detectar existente

```

---

# 5. Tipos de Scheduler Jobs

Tachi manejará diferentes tipos de trabajos.

---

# 5.1 Cron Jobs

Tareas ejecutadas en intervalos definidos.

Ejemplo:

```
Cada minuto:

Verificar viajes expirados


Cada día:

Generar reportes

```

---

# 5.2 Delayed Jobs

Trabajos programados para ejecutarse después de un tiempo.

Ejemplo:

```
TripRequested

↓

Esperar 10 minutos

↓

Cancelar solicitud

```

---

# 5.3 Event Triggered Jobs

Trabajos creados como consecuencia de eventos.

Ejemplo:

```
TripCompletedEvent

↓

CreatePaymentJob

```

---

# 5.4 Retry Jobs

Trabajos generados cuando una operación falla.

Ejemplo:

```
Notification Failed

↓

RetryNotificationJob

```

---

# 6. Arquitectura General

El Scheduler seguirá el siguiente flujo:

```

Job Created

      |

      ▼

Scheduler Queue

      |

      ▼

Worker

      |

      ▼

Job Handler

      |

      ▼

Result


```

---

# 7. Componentes Principales

El Scheduler estará compuesto por:

---

## Scheduler Core

Responsable de:

- registrar jobs
- calcular ejecución
- administrar estados

---

## Job Queue

Responsable de:

- almacenar trabajos pendientes
- ordenar ejecución
- controlar disponibilidad

---

## Worker Pool

Responsable de:

- ejecutar jobs
- reportar resultados
- manejar errores

---

## Job Handler

Responsable de:

- ejecutar lógica específica
- validar resultados
- generar eventos

---

# 8. Job Lifecycle

Cada trabajo ejecutado por el Scheduler deberá tener un ciclo de vida controlado.

Un Job no deberá pasar directamente de creación a ejecución.

---

Flujo general:

```

CREATED

   ↓

QUEUED

   ↓

RUNNING

   ↓

COMPLETED


```

---

En caso de fallo:

```

RUNNING

   ↓

FAILED

   ↓

RETRYING

   ↓

RUNNING


```

---

Después de superar los límites:

```

FAILED

   ↓

DEAD


```

---

# 9. Estados de un Job

Cada Job deberá mantener un estado interno.

---

## CREATED

El trabajo fue generado pero todavía no fue agregado a la cola.

Ejemplo:

```
CreatePaymentRetryJob

status:

CREATED

```

---

## QUEUED

El Job está esperando disponibilidad de un Worker.

Ejemplo:

```
Queue:

[
PaymentRetryJob,
NotificationJob
]

```

---

## RUNNING

Un Worker tomó responsabilidad del Job.

Ejemplo:

```
Worker-02

↓

Processing:

CancelExpiredTripJob

```

---

## COMPLETED

La ejecución finalizó correctamente.

---

Ejemplo:

```
Job:

GenerateReportJob


Result:

SUCCESS

```

---

## FAILED

El Job terminó con error.

Ejemplo:

```
NotificationJob

Error:

Provider unavailable

```

---

## RETRYING

El sistema programó un nuevo intento.

Ejemplo:

```
Attempt:

2/5

Next execution:

30 seconds

```

---

## DEAD

El Job no pudo completarse después de todos los intentos.

Será enviado a un sistema de revisión.

---

# 10. Scheduler Queue

La Scheduler Queue será el componente encargado de almacenar Jobs pendientes.

---

Arquitectura:

```

Job Producer


      |

      ▼


Scheduler Queue


      |

      ▼


Worker Pool


```

---

La cola deberá soportar:

- prioridad
- retrasos
- reintentos
- ordenamiento
- bloqueo temporal

---

# 11. Prioridad de Jobs

Los Jobs deberán clasificarse según importancia.

---

# Alta Prioridad

Operaciones críticas.

Ejemplo:

```
DriverAssignmentRetry

TripExpiration

PaymentRetry

SecurityAction

```

---

# Prioridad Normal

Operaciones importantes pero no críticas.

Ejemplo:

```
NotificationRetry

StatisticsUpdate

DataSynchronization

```

---

# Baja Prioridad

Procesos secundarios.

Ejemplo:

```
AnalyticsProcessing

LogCleanup

HistoricalAggregation

```

---

# 12. Worker Pool

Los Workers serán responsables de ejecutar los Jobs asignados.

---

Arquitectura:

```

              Scheduler Queue


                     │


                     ▼


              Worker Pool


       ┌────────┬────────┬────────┐


       ▼        ▼        ▼


   Worker1  Worker2  Worker3


```

---

Cada Worker deberá:

- tomar un Job disponible
- bloquear la ejecución
- procesar
- reportar resultado
- liberar responsabilidad

---

# 13. Job Ownership

En una arquitectura distribuida, un Job debe tener un único propietario durante su ejecución.

---

Ejemplo:

```
Job:

CancelTrip_1001


Owner:

engine-node-2

```

---

Otro nodo:

```
engine-node-3

```

No podrá ejecutar el mismo Job.

---

# 14. Distributed Job Lock

Para evitar ejecución duplicada se utilizarán locks distribuidos.

---

Ejemplo:

```
Job Lock


Key:

job:cancel_trip_1001


Owner:

worker_02


TTL:

60 seconds

```

---

Si otro Worker intenta tomarlo:

```
LOCK EXISTS


Reject Execution

```

---

# 15. Heartbeat del Worker

Los Workers deberán reportar actividad periódicamente.

Ejemplo:

```
Worker-02


Heartbeat:

10:30:15

10:30:30

10:30:45

```

---

Si un Worker deja de responder:

```
Heartbeat Timeout

↓

Job Released

↓

Nuevo Worker toma ejecución

```

---

# 16. Scheduler Distribuido

El Scheduler deberá funcionar correctamente con múltiples instancias.

---

Ejemplo:

```

          Scheduler Cluster


        ┌────────┬────────┐


        ▼        ▼        ▼


     Node 1   Node 2   Node 3


```

---

Cada nodo podrá:

- recibir Jobs
- ejecutar Workers
- participar en coordinación

---

Pero solamente uno deberá ejecutar un Job específico.

---

# 17. Delayed Jobs Architecture

Los Delayed Jobs permiten ejecutar tareas después de un tiempo determinado.

Estos trabajos serán utilizados para operaciones que dependen de ventanas temporales.

---

Ejemplos:

- expiración de solicitudes
- reintentos automáticos
- recordatorios
- liberación de recursos
- procesos financieros

---

# 18. Ejemplo: Expiración de Viaje

Flujo:

```
TripRequestedEvent

        |

        ▼

Create Expiration Job


        |

        ▼

Wait 10 minutos


        |

        ▼

CancelTripJob


        |

        ▼

TripCancelledEvent

```

---

El tiempo de espera deberá ser configurable.

Ejemplo:

```
trip_expiration_time:

10 minutes

```

---

# 19. Retry Strategy

Los Jobs que fallen deberán utilizar una estrategia de reintentos controlada.

No se deberán ejecutar reintentos inmediatamente sin control.

---

Ejemplo incorrecto:

```
Error

↓

Retry

↓

Error

↓

Retry

↓

Error

```

Esto puede generar saturación.

---

Ejemplo correcto:

```
Error

↓

Esperar

↓

Retry

↓

Esperar más tiempo

↓

Retry

```

---

# 20. Exponential Backoff

Tachi utilizará una estrategia de espera progresiva.

Ejemplo:

```
Intento 1

↓

5 segundos


Intento 2

↓

30 segundos


Intento 3

↓

5 minutos


Intento 4

↓

30 minutos

```

---

Ventajas:

- reduce presión sobre servicios
- permite recuperación automática
- evita tormentas de errores

---

# 21. Retry Policy

Cada Job deberá definir su propia política.

Ejemplo:

```
Job:

NotificationRetryJob


Max Attempts:

5


Backoff:

Exponential


Timeout:

30 seconds

```

---

Ejemplo financiero:

```
PaymentRetryJob


Max Attempts:

10


Backoff:

Long

```

---

Ejemplo no crítico:

```
AnalyticsJob


Max Attempts:

3

```

---

# 22. Job Dependencies

Algunos Jobs requieren que otros procesos terminen primero.

---

Ejemplo:

Completar viaje:

```
TripCompleted


        |

        ▼


GeneratePaymentJob


        |

        ▼


GenerateReceiptJob


        |

        ▼


SendNotificationJob

```

---

El Scheduler deberá conocer dependencias.

---

Modelo:

```
Job A

     ↓

Job B

     ↓

Job C

```

---

# 23. Event Based Scheduling

Los Jobs podrán generarse automáticamente mediante eventos del sistema.

---

Ejemplo:

Evento:

```
DriverOfflineDetectedEvent

```

Genera:

```
ReleaseDriverResourcesJob

```

---

Otro ejemplo:

```
PaymentFailedEvent

```

Genera:

```
PaymentRetryJob

```

---

# 24. Dynamic Priority Scheduling

La prioridad de un Job podrá cambiar según el contexto.

---

Ejemplo:

Normalmente:

```
TripExpirationJob

Priority:

NORMAL

```

---

Pero si:

```
Usuario esperando:

9 minutos

```

la prioridad aumenta:

```
Priority:

HIGH

```

---

# 25. Scheduling basado en Contexto

El Scheduler podrá considerar información adicional:

- ubicación
- demanda
- estado del sistema
- cantidad de usuarios esperando
- disponibilidad de conductores

---

Ejemplo:

Zona:

```
Mosquera Centro

```

Alta demanda:

```
100 solicitudes pendientes

20 conductores disponibles

```

---

El Scheduler puede priorizar:

```
MatchingRetryJobs

```

sobre:

```
AnalyticsJobs

```

---

# 26. Job Deduplication

El sistema deberá evitar crear Jobs duplicados.

---

Ejemplo:

Dos eventos:

```
TripTimeoutDetectedEvent

```

llegan al mismo tiempo.

---

Sin control:

```
CancelTripJob

CancelTripJob

CancelTripJob

```

---

Con deduplicación:

```
Existe Job Activo

↓

No crear nuevo

```

---

# 27. Job Correlation

Cada Job deberá mantener relación con el proceso que lo originó.

Ejemplo:

```
Job:

CancelTripJob


Correlation ID:

trip_request_5001


Origin:

TripRequestedEvent

```

---

Esto permitirá:

- trazabilidad
- debugging
- auditoría

---

# 28. Scheduler Observability

El Scheduler deberá contar con mecanismos de observabilidad que permitan conocer el estado interno de los procesos automáticos.

La observabilidad permitirá detectar:

- fallos de ejecución
- retrasos
- saturación
- acumulación de trabajos
- problemas de rendimiento

---

# 29. Scheduler Metrics

El sistema deberá generar métricas operativas.

---

## Métricas de Jobs

```
Jobs Created

Jobs Completed

Jobs Failed

Jobs Retried

Jobs Dead

```

---

## Métricas de Ejecución

```
Average Execution Time

Maximum Execution Time

Queue Waiting Time

Worker Processing Time

```

---

## Métricas de Cola

```
Pending Jobs

Queue Size

Priority Distribution

Delayed Jobs

```

---

# 30. Job Execution Tracking

Cada ejecución deberá registrar información de seguimiento.

Ejemplo:

```
JobExecution


jobId

workerId

startedAt

finishedAt

duration

status

error

```

---

Esto permitirá reconstruir qué ocurrió durante una ejecución.

---

# 31. Scheduler Health Monitoring

El Scheduler deberá exponer información de salud.

Ejemplo:

```
Scheduler Status:


Workers:

25 active


Queue:

120 pending jobs


Failures:

2


Status:

Healthy

```

---

Estados posibles:

```
HEALTHY

DEGRADED

FAILED

```

---

# 32. Job Recovery

El sistema deberá recuperar Jobs cuando ocurra una falla.

---

Ejemplo:

```
Worker-01


Ejecutando:

PaymentRetryJob


↓

Servidor falla


↓

Job queda RUNNING


```

---

El sistema deberá detectar:

```
Worker Timeout

```

y recuperar el Job.

---

Flujo:

```
Detect Failure

↓

Release Ownership

↓

Return Job Queue

↓

Assign New Worker

```

---

# 33. Orphan Jobs

Un Job huérfano ocurre cuando:

- tiene propietario,
- pero el propietario dejó de existir.

Ejemplo:

```
Job:

TripExpirationJob


Owner:

engine-node-3


Node:

Offline

```

---

El Scheduler deberá marcar:

```
OWNER LOST

```

y permitir recuperación.

---

# 34. Distributed Scheduling Strategy

Tachi deberá soportar múltiples instancias del Scheduler.

Ejemplo:

```
Scheduler Node 1

Scheduler Node 2

Scheduler Node 3

```

---

Todos pueden participar, pero deben coordinarse.

---

Objetivos:

- evitar ejecución duplicada
- distribuir carga
- permitir escalabilidad horizontal

---

# 35. Leader Election

Para ciertas tareas globales se deberá elegir un líder temporal.

Ejemplo:

```
DailyReportGenerationJob

DatabaseCleanupJob

SystemMaintenanceJob

```

---

Flujo:

```
Scheduler Nodes


↓

Leader Election


↓

Leader executes global jobs

```

---

Si el líder falla:

```
Leader Failure

↓

New Election

↓

New Leader

```

---

# 36. Job Sharding

Para grandes volúmenes de Jobs se utilizará distribución por fragmentos.

---

Ejemplo:

```
Shard 1

Trips 1-10000


Shard 2

Trips 10001-20000


Shard 3

Trips 20001-30000

```

---

Cada Worker procesa solamente su fragmento.

---

Beneficios:

- escalabilidad
- menor competencia
- procesamiento paralelo

---

# 37. Load Balancing de Workers

El Scheduler deberá distribuir Jobs según capacidad disponible.

---

Ejemplo:

Worker 1:

```
CPU 90%

Jobs 500

```

Worker 2:

```
CPU 30%

Jobs 50

```

---

Nuevo trabajo:

```
Asignar a Worker 2

```

---

# 38. Backpressure Handling

Cuando la cantidad de Jobs supera la capacidad del sistema, el Scheduler deberá aplicar control de presión.

---

Ejemplo:

```
100.000 Jobs pendientes

↓

Worker Capacity:

10.000

```

---

Estrategias:

- reducir frecuencia
- pausar trabajos secundarios
- priorizar críticos
- aumentar Workers

---

# 39. Rate Limiting

El Scheduler deberá controlar la frecuencia de ejecución de ciertos Jobs.

---

Ejemplo:

No permitir:

```
1000 NotificationRetryJob

por segundo

```

---

Regla:

```
Maximum:

100 Jobs / segundo

```

---

# 40. Throttling

El sistema deberá reducir temporalmente la ejecución cuando detecte saturación.

---

Ejemplo:

Normal:

```
100 Workers activos

```

Alta carga:

```
Reducir Analytics Jobs

Mantener Payment Jobs

Mantener Trip Jobs

```

---

# 41. Scheduler Security

El Scheduler deberá implementar mecanismos de seguridad para evitar ejecuciones no autorizadas, manipulación de Jobs o procesamiento incorrecto.

---

Los principales controles serán:

- autenticación interna de Workers
- autorización de ejecución
- validación de Job ownership
- control de permisos
- auditoría de acciones

---

# 42. Worker Authentication

Cada Worker deberá identificarse antes de ejecutar un Job.

Ejemplo:

```
Worker


id:

worker-node-02


token:

internal-service-token

```

---

El Scheduler deberá validar:

- identidad del Worker
- estado activo
- permisos asignados

---

# 43. Job Authorization

No todos los Workers podrán ejecutar todos los Jobs.

Ejemplo:

```
Payment Worker

↓

Payment Jobs

```

---

Incorrecto:

```
Analytics Worker

↓

PaymentProcessingJob

```

---

Cada Job deberá definir:

```
allowedWorkers

requiredPermissions

```

---

# 44. Scheduler Audit Trail

Las operaciones importantes deberán generar registros de auditoría.

Ejemplos:

```
JobCreated

JobStarted

JobCompleted

JobFailed

JobRecovered

JobCancelled

```

---

Estos registros serán consumidos por:

```
Audit Domain

```

---

# 45. Integración con Event System

El Scheduler deberá integrarse con la arquitectura basada en eventos.

---

Los eventos podrán:

- crear Jobs
- cancelar Jobs
- modificar prioridades
- generar reintentos

---

Ejemplo:

```
PaymentFailedEvent


        ↓


PaymentRetryJob


        ↓


PaymentRecoveredEvent

```

---

# 46. Integración con Concurrency Engine

Los Jobs que modifiquen recursos críticos deberán respetar los mecanismos de concurrencia.

---

Ejemplo:

```
CancelExpiredTripJob


        ↓


Trip Aggregate


        ↓


Version Validation


        ↓


State Change

```

---

El Scheduler nunca deberá modificar directamente entidades críticas ignorando:

- versionamiento
- locks
- actores
- reglas de dominio

---

# 47. Jobs Críticos de Tachi

El Scheduler deberá soportar los siguientes procesos principales.

---

# Trip Jobs

```
ExpireTripRequestJob

RetryMatchingJob

CancelAbandonedTripJob

ReleaseDriverJob

```

---

# Driver Jobs

```
VerifyDriverAvailabilityJob

UpdateDriverStatusJob

ReleaseInactiveDriverJob

```

---

# Payment Jobs

```
ProcessPendingPaymentJob

RetryPaymentJob

GenerateDriverSettlementJob

```

---

# Notification Jobs

```
RetryNotificationJob

SendReminderJob

PushDeliveryValidationJob

```

---

# Maintenance Jobs

```
CleanupExpiredSessionsJob

ArchiveLogsJob

DatabaseMaintenanceJob

```

---

# 48. Scheduler Configuration

Los parámetros del Scheduler deberán ser configurables.

Ejemplos:

```
maxRetries

retryDelay

workerCount

jobTimeout

queueLimit

priorityRules

```

---

Estos valores deberán administrarse sin modificar código.

---

# 49. Estrategia MVP

Para la primera versión de Tachi se implementará:

```
Database Queue

+

Worker Process

+

Redis Locks

+

Retry Policy

+

Basic Monitoring

```

---

Objetivo:

Tener un Scheduler confiable sin agregar complejidad innecesaria.

---

# 50. Evolución Futura

Versiones posteriores podrán incorporar:

- Scheduler distribuido avanzado
- Event Driven Scheduling completo
- Machine Learning para priorización
- Auto Scaling de Workers
- Multi-region Scheduling
- Predictive Jobs

---

# 51. Arquitectura Final del Scheduler

```

                 Scheduler Engine


                       │


        ┌──────────────┼──────────────┐


        ▼              ▼              ▼


    Job Queue      Worker Pool    Policies


        │              │              │


        ▼              ▼              ▼


    Retry        Execution      Priority


        │


        ▼


 Event System + Concurrency Engine


        │


        ▼


        Tachi Domains


```

---

# 52. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------------------|----------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Arquitectura del Scheduler del Trip Engine |

---

# Conclusión

El Scheduler Architecture define el sistema encargado de ejecutar procesos automáticos dentro de Tachi de forma segura, escalable y confiable.

La combinación de:

- Job Queue
- Worker Pool
- Retry Strategy
- Distributed Scheduling
- Priority Engine
- Event Integration
- Concurrency Control

permite que Tachi pueda manejar operaciones temporales, procesos automáticos y tareas críticas sin depender de intervención manual.

Esta arquitectura permite iniciar con un MVP sólido y evolucionar hacia un sistema distribuido capaz de soportar grandes volúmenes de usuarios, conductores y operaciones simultáneas.
