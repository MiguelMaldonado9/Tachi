# 03. Dispatcher

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 03-dispatcher.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Dispatcher constituye el componente responsable de gestionar la entrega de solicitudes de viaje hacia los conductores seleccionados por el Matching Engine.

Su función principal consiste en coordinar el proceso de oferta, espera, respuesta y reasignación de viajes.

Mientras el Matching Algorithm determina quién debería recibir un viaje, el Dispatcher controla cómo se ejecuta dicha asignación en tiempo real.

---

# 2. Objetivos

El Dispatcher deberá cumplir los siguientes objetivos.

- entregar ofertas de viaje a conductores
- administrar tiempos de respuesta
- controlar aceptación y rechazo
- gestionar expiraciones
- realizar reintentos
- evitar asignaciones duplicadas
- mantener consistencia del estado
- generar eventos internos
- garantizar baja latencia

---

# 3. Responsabilidad del Dispatcher

El Dispatcher es responsable exclusivamente de la coordinación de ofertas.

No deberá encargarse de decidir qué conductor es el mejor candidato.

Esa responsabilidad pertenece al Matching Engine.

La separación queda definida así.

```
Matching Engine

↓

¿Quién recibe la oportunidad?

↓

Dispatcher

↓

¿Cómo se administra la oferta?

```

---

# 4. Flujo General

El flujo básico de una asignación es el siguiente.

```
Nuevo Viaje

↓

Matching Engine

↓

Lista de candidatos

↓

Dispatcher

↓

Crear Oferta

↓

Enviar al Conductor

↓

Esperar Respuesta

↓

Aceptar / Rechazar / Expirar

↓

Actualizar Estado

```

---

# 5. Concepto de Oferta

Una oferta representa una oportunidad temporal de aceptar un viaje.

Cada oferta posee un ciclo de vida independiente.

Una oferta contiene información como.

- identificador del viaje
- identificador del conductor
- fecha de creación
- tiempo límite
- estado actual
- resultado

---

# 6. Ciclo de Vida de una Oferta

Cada oferta será administrada mediante una máquina de estados.

Conceptualmente.

```
CREATED

↓

SENT

↓

WAITING_RESPONSE

↓

ACCEPTED

     o

REJECTED

     o

EXPIRED

```

Una oferta solamente podrá avanzar mediante transiciones válidas.

---

# 7. Estados Principales

## CREATED

La oferta ha sido generada por el Dispatcher.

Todavía no ha sido enviada al conductor.

---

## SENT

La oferta fue enviada correctamente al conductor.

El sistema espera confirmación de entrega.

---

## WAITING_RESPONSE

El conductor recibió la oferta y dispone de un tiempo determinado para responder.

---

## ACCEPTED

El conductor acepta realizar el viaje.

El Dispatcher genera el evento correspondiente.

---

## REJECTED

El conductor rechaza la solicitud.

El Dispatcher continúa con el siguiente candidato disponible.

---

## EXPIRED

El tiempo máximo de respuesta fue alcanzado sin una decisión.

---

# 8. Estrategia de Despacho

El Dispatcher deberá soportar diferentes estrategias para entregar ofertas de viaje.

La estrategia seleccionada dependerá de la configuración operativa de Tachi.

---

# 9. Sequential Dispatch

En el modelo Sequential, las ofertas son enviadas una por una siguiendo el orden generado por el Matching Algorithm.

Ejemplo.

```
Candidato #1

↓

Oferta enviada

↓

Rechaza / Expira

↓

Candidato #2

↓

Oferta enviada

↓

Acepta
```

---

## Ventajas

- mayor control del flujo
- menor cantidad de conflictos
- menor cantidad de ofertas simultáneas
- fácil auditoría
- menor carga de comunicación

---

## Desventajas

- puede aumentar el tiempo de asignación
- depende del tiempo de respuesta del conductor

---

# 10. Parallel Dispatch

En el modelo Parallel, múltiples candidatos pueden recibir una oferta al mismo tiempo.

Ejemplo.

```
          Viaje

            │

 ┌──────────┼──────────┐

 │          │          │

Driver A Driver B Driver C

            │

 Primera aceptación válida

            │

          Asignado

```

---

## Ventajas

- menor tiempo promedio de asignación
- mayor probabilidad de conseguir conductor rápidamente
- útil en momentos de alta demanda

---

## Desventajas

- mayor consumo de recursos
- mayor complejidad
- requiere control estricto de concurrencia
- varios conductores pueden aceptar simultáneamente

---

# 11. Estrategia Inicial de Tachi

Para el MVP se recomienda utilizar:

```
Sequential Dispatch

+

Timeout configurable

+

Reintentos automáticos

```

Esta estrategia proporciona mayor control operativo durante la etapa inicial.

La arquitectura permitirá incorporar Parallel Dispatch posteriormente sin modificar los componentes principales.

---

# 12. Control de Tiempo

Toda oferta deberá tener un tiempo máximo de respuesta.

Ejemplo.

```
Oferta creada

↓

Enviar al conductor

↓

Esperar 20 segundos

↓

Sin respuesta

↓

Expirar

```

El tiempo deberá ser configurable desde la administración de la plataforma.

---

# 13. Expiración Automática

Las ofertas no podrán permanecer indefinidamente activas.

El Scheduler del Trip Engine será responsable de verificar ofertas pendientes y ejecutar expiraciones.

Flujo.

```
Scheduler

↓

Detecta oferta vencida

↓

Dispatcher

↓

Cambia estado

↓

Genera evento

```

---

# 14. Reintentos

Cuando una oferta falle, el Dispatcher podrá solicitar un nuevo candidato al Matching Engine.

Casos.

- rechazo del conductor
- expiración
- pérdida de conexión
- error de entrega

El proceso continuará hasta:

- encontrar conductor válido
- alcanzar límite de intentos
- superar tiempo máximo de búsqueda

---

# 15. Prevención de Doble Aceptación

El Dispatcher deberá garantizar que un viaje solamente pueda ser aceptado por un único conductor.

Ejemplo.

Situación:

```
Driver A acepta

        │

        ▼

Trip asignado


Driver B acepta al mismo tiempo

```

Resultado esperado:

```
Driver A

↓

Asignación válida


Driver B

↓

Respuesta rechazada
```

La validación deberá realizarse mediante mecanismos de concurrencia y control de estado.

---

# 16. Comunicación con WebSocket Hub

El Dispatcher no tendrá comunicación directa con los dispositivos móviles.

La entrega de ofertas será realizada mediante el WebSocket Hub del Trip Engine.

La separación permite mantener responsabilidades independientes.

Conceptualmente.

```
Dispatcher

↓

WebSocket Hub

↓

Aplicación Conductor

```

---

# 17. Flujo de Entrega

El proceso completo de una oferta será:

```
Dispatcher

↓

Crear Oferta

↓

Enviar Evento

↓

WebSocket Hub

↓

Enviar al Conductor

↓

Confirmación

↓

Actualizar Estado

```

---

# 18. Confirmación de Entrega (ACK)

Toda oferta enviada deberá contar con mecanismos de confirmación.

El sistema deberá diferenciar entre:

- oferta creada
- oferta enviada
- oferta entregada
- oferta visualizada
- oferta respondida

---

Estados internos:

```
CREATED

↓

SENT

↓

DELIVERED

↓

VIEWED

↓

RESPONDED

```

---

# 19. Pérdida de Conexión

El Dispatcher deberá contemplar escenarios donde el conductor pierda conectividad durante una oferta activa.

Ejemplos.

- pérdida de internet
- cierre de aplicación
- batería agotada
- suspensión del dispositivo

---

Cuando ocurra una desconexión:

```
Conductor Offline

↓

WebSocket detecta pérdida

↓

Evento generado

↓

Dispatcher evalúa oferta

↓

Reintento o expiración

```

---

# 20. Estado del Conductor

El Dispatcher dependerá del estado operativo mantenido por el Driver Manager.

Estados principales.

```
AVAILABLE

BUSY

OFFLINE

DISCONNECTED

SUSPENDED
```

Una oferta solamente podrá enviarse a conductores en estado válido.

---

# 21. Confirmación del Conductor

Una respuesta del conductor deberá contener información suficiente para validar la operación.

Ejemplo.

```
TripOfferResponse

{

offerId,

driverId,

action,

timestamp

}

```

Acciones permitidas:

```
ACCEPT

REJECT

```

---

# 22. Validación de Respuesta

Antes de aceptar una respuesta, el Dispatcher deberá verificar.

- que la oferta exista
- que pertenezca al conductor correcto
- que no haya expirado
- que el viaje continúe disponible
- que ningún otro conductor haya sido asignado

---

# 23. Flujo de Aceptación

Proceso esperado:

```
Conductor acepta

↓

Dispatcher recibe respuesta

↓

Actor del viaje procesa evento

↓

Verifica estado

↓

Reserva temporal

↓

Confirma asignación

↓

Actualiza estado

↓

Genera TripAssigned

```

---

# 24. Flujo de Rechazo

Proceso esperado:

```
Conductor rechaza

↓

Dispatcher recibe respuesta

↓

Actualiza oferta

↓

Genera evento

↓

Solicita siguiente candidato

```

---

# 25. Tolerancia a Fallos

El Dispatcher deberá diseñarse bajo principios de tolerancia a fallos.

Un error interno no deberá provocar pérdida de información ni inconsistencias en los viajes.

---

# 26. Idempotencia

Todas las operaciones críticas del Dispatcher deberán ser idempotentes.

Esto significa que ejecutar una misma operación varias veces deberá producir el mismo resultado que ejecutarla una sola vez.

Ejemplo.

Primer evento:

```
DriverAccepted

↓

Asignar viaje
```

Segundo evento duplicado:

```
DriverAccepted

↓

Ignorar operación repetida
```

---

# 27. Recuperación ante Reinicios

Cuando una instancia del Trip Engine sea reiniciada, el Dispatcher deberá recuperar las ofertas activas existentes.

El proceso deberá consultar la información necesaria para reconstruir el estado operativo.

Conceptualmente.

```
Reinicio

↓

Recuperar ofertas activas

↓

Validar estados

↓

Continuar procesamiento

```

---

# 28. Timeouts Distribuidos

Los tiempos de espera no deberán depender únicamente de memoria local.

Toda operación crítica deberá considerar mecanismos que permitan recuperar el control incluso después de una interrupción.

Ejemplos.

- expiración de ofertas
- aceptación pendiente
- confirmación de entrega

---

# 29. Auditoría de Decisiones

El Dispatcher deberá generar información suficiente para reconstruir cualquier asignación realizada.

Cada evento relevante deberá registrar.

- viaje asociado
- conductor involucrado
- oferta generada
- fecha y hora
- resultado
- motivo de finalización

---

Ejemplo.

```
OfferCreated

↓

OfferSent

↓

OfferDelivered

↓

OfferRejected

↓

NextCandidateSelected

```

---

# 30. Métricas del Dispatcher

El funcionamiento del Dispatcher deberá ser medido mediante métricas operativas.

---

## Tiempo de asignación

Tiempo desde creación de oferta hasta aceptación del conductor.

---

## Tasa de aceptación

Porcentaje de ofertas aceptadas.

---

## Tiempo promedio de respuesta

Tiempo utilizado por los conductores para responder.

---

## Ofertas expiradas

Cantidad de ofertas sin respuesta dentro del límite establecido.

---

## Reintentos

Cantidad promedio de candidatos utilizados antes de completar una asignación.

---

# 31. Optimización Futura

La arquitectura permitirá incorporar mejoras progresivas.

Ejemplos.

- despacho paralelo inteligente
- predicción de aceptación
- priorización dinámica
- aprendizaje automático
- análisis histórico
- estrategias por zona

---

# 32. Relación con Otros Componentes

El Dispatcher se integra con los principales componentes del Trip Engine.

```
                 Event Bus

                     │

        ┌────────────┼────────────┐

        │                         │

 Matching Engine              Scheduler

        │                         │

        └────────────┬────────────┘

                     │

               Dispatcher

                     │

              WebSocket Hub

                     │

             Aplicación Conductor

```

---

# 33. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|------------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Arquitectura del Dispatcher del Trip Engine. |

---

# Conclusión

El Dispatcher representa el componente encargado de convertir una decisión algorítmica en una asignación real de viaje.

Su arquitectura basada en eventos, máquinas de estados, comunicación WebSocket, control de concurrencia e idempotencia permite gestionar millones de interacciones de forma segura y consistente.

La separación entre Matching y Dispatcher garantiza que Tachi pueda evolucionar sus estrategias de asignación sin comprometer la estabilidad del sistema.

Este diseño proporciona una base sólida para soportar desde el MVP inicial hasta una plataforma de movilidad distribuida de gran escala.