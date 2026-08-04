# 01. Trip Engine Architecture

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 01-trip-engine-architecture.md |
| Motor | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Trip Engine constituye el núcleo operativo de Tachi.

Es el componente responsable de coordinar en tiempo real la interacción entre pasajeros, conductores y viajes, garantizando que las asignaciones se realicen de forma eficiente, segura y escalable.

A diferencia del Backend Principal, el Trip Engine no está orientado a solicitudes HTTP tradicionales.

Su funcionamiento está basado en eventos, procesamiento concurrente y comunicación permanente con los clientes conectados.

---

# 2. Objetivos

El Trip Engine ha sido diseñado para cumplir los siguientes objetivos.

- localizar conductores disponibles
- ejecutar el algoritmo de matching
- despachar solicitudes de viaje
- administrar eventos en tiempo real
- mantener conexiones WebSocket
- actualizar estados de viajes
- sincronizar la disponibilidad de conductores
- minimizar los tiempos de asignación
- soportar miles de conexiones simultáneas
- escalar horizontalmente

---

# 3. Responsabilidades

El Trip Engine será responsable exclusivamente del procesamiento en tiempo real.

Entre sus responsabilidades se encuentran.

- Matching de conductores
- Dispatcher
- Gestión de WebSockets
- Procesamiento de eventos
- Scheduler interno
- Sincronización de estados
- Control de disponibilidad
- Coordinación de viajes activos

El motor no implementará reglas pertenecientes a otros dominios.

Ejemplos.

No administrará.

- autenticación
- pagos
- usuarios
- vehículos
- tarifas
- administración

Estas responsabilidades permanecerán dentro del Backend Principal.

---

# 4. Filosofía de Diseño

El Trip Engine ha sido diseñado siguiendo una filosofía de procesamiento continuo.

Mientras el Backend responde solicitudes puntuales, el motor permanece ejecutándose permanentemente.

Conceptualmente.

```
Backend

↓

Solicitud

↓

Respuesta

↓

Finaliza
```

Trip Engine.

```
Inicia

↓

Permanece activo

↓

Recibe eventos

↓

Procesa eventos

↓

Genera eventos

↓

Continúa ejecutándose
```

El motor nunca deja de operar mientras la plataforma permanezca disponible.

---

# 5. ¿Por qué Go?

El lenguaje Go fue seleccionado para el desarrollo del Trip Engine debido a sus características orientadas a sistemas concurrentes de alto rendimiento.

Entre las principales razones se encuentran.

- concurrencia ligera mediante goroutines
- canales de comunicación seguros
- excelente rendimiento
- bajo consumo de memoria
- tiempos de compilación reducidos
- simplicidad del lenguaje
- facilidad para desarrollar servicios distribuidos
- escalabilidad horizontal
- alta estabilidad en producción

Estas características permiten construir un motor capaz de administrar miles de eventos y conexiones simultáneamente con un consumo eficiente de recursos.

---

# 6. Arquitectura Interna

El Trip Engine se encuentra organizado mediante módulos especializados.

Cada módulo posee una única responsabilidad y colabora con los demás mediante eventos internos.

Conceptualmente.

```
                Event Bus

                     │

 ┌─────────────┬─────────────┬─────────────┐

 │             │             │             │

Matching   Dispatcher   Scheduler   WebSocket Hub

 │             │             │             │

 └─────────────┴─────────────┴─────────────┘

              State Manager
```

La comunicación entre módulos se realiza mediante eventos, evitando dependencias innecesarias.

---

# 7. Componentes

## Event Bus

Constituye el núcleo de comunicación del motor.

Todos los eventos internos circulan a través del Event Bus.

Ejemplos.

- TripCreated
- DriverAvailable
- DriverAccepted
- DriverRejected
- TripCancelled
- TripCompleted

El Event Bus desacopla completamente los componentes del motor.

---

## Matching Engine

Responsable de seleccionar el mejor conductor disponible para un viaje.

El algoritmo de asignación se encuentra documentado en.

```
02-matching-algorithm.md
```

---

## Dispatcher

Responsable de enviar ofertas de viaje a los conductores seleccionados por el Matching Engine.

Administra.

- tiempos de espera
- reintentos
- expiraciones
- aceptación
- rechazo

Su funcionamiento se describe en.

```
03-dispatcher.md
```

---

## Scheduler

Responsable de ejecutar procesos internos del motor.

Ejemplos.

- limpieza
- expiración de ofertas
- verificación de disponibilidad
- heartbeats
- mantenimiento interno

Su arquitectura se describe en.

```
07-scheduler.md
```

---

## WebSocket Hub

Administra todas las conexiones persistentes con los clientes.

Mantiene comunicación en tiempo real con.

- conductores
- pasajeros
- panel administrativo

Toda su arquitectura se documenta en.

```
04-websocket.md
```

---

## State Manager

Responsable de mantener el estado operativo del motor.

Entre otros.

- conductores disponibles
- viajes activos
- viajes pendientes
- conexiones
- sesiones internas

El State Manager representa el estado operativo del motor durante su ejecución.

---

# 8. Flujo General

Conceptualmente el procesamiento sigue el siguiente recorrido.

```
Evento

↓

Event Bus

↓

Matching

↓

Dispatcher

↓

Driver

↓

Respuesta

↓

Nuevo Evento

↓

Event Bus
```

El procesamiento continúa hasta que el viaje cambia de estado o finaliza.

---

# 9. Independencia de Componentes

Los módulos del Trip Engine deberán permanecer desacoplados.

Cada componente conocerá únicamente las interfaces necesarias para realizar su trabajo.

La modificación de un módulo no deberá afectar el funcionamiento de los demás siempre que se respeten los contratos definidos.

---

# 10. Modelo de Procesamiento

El Trip Engine opera mediante un modelo de procesamiento continuo basado en eventos.

Cada evento representa un cambio dentro del sistema y desencadena una o varias acciones internas.

El motor permanece ejecutándose permanentemente mientras la plataforma se encuentre disponible.

---

## Ciclo Operativo

Conceptualmente el funcionamiento del motor puede representarse de la siguiente manera.

```
Esperar Evento

↓

Procesar Evento

↓

Actualizar Estado

↓

Generar Nuevos Eventos

↓

Esperar siguiente Evento
```

Este ciclo constituye el núcleo operativo del Trip Engine.

---

# 11. Flujo de Eventos

Todos los cambios importantes del sistema son representados mediante eventos.

Ejemplos.

```
TripCreated
```

↓

```
MatchingStarted
```

↓

```
DriverSelected
```

↓

```
TripOfferSent
```

↓

```
DriverAccepted
```

↓

```
TripStarted
```

↓

```
TripCompleted
```

Cada evento modifica el estado del motor y puede generar nuevos eventos para otros componentes.

---

# 12. Estado del Motor

El Trip Engine mantiene un estado operativo durante toda su ejecución.

Este estado representa la información necesaria para responder rápidamente a los eventos recibidos.

Entre otros.

- conductores conectados
- disponibilidad
- ubicación actual
- viajes pendientes
- viajes activos
- ofertas en proceso
- conexiones WebSocket
- temporizadores

El estado operativo permite reducir consultas innecesarias y minimizar la latencia.

---

## Fuente Oficial de Datos

Aunque el motor mantiene información en memoria para operar en tiempo real, la fuente oficial de los datos continúa siendo la Base de Datos administrada por el Backend Principal.

El estado interno del motor constituye una representación temporal optimizada para procesamiento de alta velocidad.

---

# 13. Consistencia

El motor deberá mantener consistencia entre el estado interno y la información persistida.

Toda modificación relevante deberá reflejarse mediante los mecanismos definidos por la arquitectura de eventos.

La sincronización deberá minimizar inconsistencias temporales sin afectar el rendimiento del sistema.

---

# 14. Recuperación del Estado

Cuando una instancia del motor inicie o se recupere tras un fallo, deberá reconstruir su estado operativo utilizando las fuentes oficiales de información.

El proceso de recuperación deberá permitir que el motor vuelva a operar sin comprometer la integridad de los viajes activos.

---

# 15. Tolerancia a Fallos

El diseño del Trip Engine deberá minimizar el impacto producido por errores internos.

Los fallos de un componente no deberán propagarse innecesariamente al resto del motor.

Siempre que sea posible.

- los errores deberán aislarse,
- registrarse,
- recuperarse automáticamente,
- o escalarse mediante eventos de error controlados.

---

# 16. Modelo de Concurrencia

El Trip Engine ha sido diseñado para aprovechar el modelo de concurrencia del lenguaje Go.

Su arquitectura permitirá ejecutar múltiples procesos simultáneamente sin comprometer la consistencia del sistema.

La concurrencia constituye uno de los pilares fundamentales del motor.

---

## Goroutines

Cada tarea independiente podrá ejecutarse mediante goroutines.

Ejemplos.

- procesamiento de eventos
- matching
- dispatcher
- scheduler
- heartbeats
- monitoreo de conexiones
- sincronización de estados

Las goroutines deberán ser ligeras y especializadas.

---

## Comunicación

La comunicación entre componentes concurrentes deberá realizarse preferiblemente mediante canales de comunicación internos.

El intercambio directo de memoria compartida deberá minimizarse.

Este enfoque reduce el acoplamiento y disminuye la probabilidad de condiciones de carrera.

---

# 17. Aislamiento

Cada módulo deberá operar sobre su propio contexto de ejecución.

Siempre que sea posible, los componentes evitarán modificar directamente el estado administrado por otros módulos.

La coordinación se realizará mediante eventos e interfaces claramente definidas.

---

# 18. Sincronización

Cuando múltiples procesos requieran acceder al mismo recurso, el acceso deberá sincronizarse mediante mecanismos apropiados.

La sincronización deberá proteger especialmente.

- viajes activos
- conductores disponibles
- ofertas pendientes
- conexiones activas

El objetivo consiste en garantizar que cada recurso mantenga un estado consistente durante toda su vida útil.

---

# 19. Procesamiento Secuencial por Entidad

Aunque el motor ejecuta múltiples tareas en paralelo, una misma entidad lógica deberá procesarse de manera secuencial.

Ejemplos.

Un mismo viaje no podrá ejecutar simultáneamente dos procesos de asignación.

Un mismo conductor no podrá aceptar dos ofertas diferentes al mismo tiempo.

Este principio evita inconsistencias y simplifica el razonamiento del sistema.

---

# 20. Contexto de Ejecución

Toda operación deberá ejecutarse dentro de un contexto claramente definido.

El contexto permitirá.

- cancelar procesos
- establecer tiempos máximos
- propagar información entre componentes
- liberar recursos cuando una operación finalice

---

# 21. Manejo de Errores

Los errores producidos durante el procesamiento concurrente deberán administrarse de forma controlada.

Todo error deberá.

- registrarse
- clasificarse
- propagarse cuando corresponda
- generar eventos cuando afecte al funcionamiento del motor

Los errores nunca deberán provocar la detención completa del Trip Engine.

---

# 22. Escalabilidad del Motor

El Trip Engine ha sido diseñado para crecer progresivamente conforme aumente la demanda de la plataforma.

Su arquitectura permitirá incorporar nuevas instancias sin modificar la lógica de negocio.

---

## Escalabilidad Horizontal

El crecimiento principal del motor se realizará mediante múltiples instancias.

Conceptualmente.

```
             Load Balancer

                   │

      ┌────────────┼────────────┐

      │            │            │

 Engine 1     Engine 2     Engine 3
```

Cada instancia podrá procesar eventos de manera independiente.

---

## Distribución de la Carga

La carga del sistema podrá distribuirse utilizando diferentes estrategias.

Ejemplos.

- por ciudad
- por zona
- por región
- por volumen de conductores
- por volumen de viajes

La estrategia utilizada dependerá de las necesidades operativas de la plataforma.

---

# 23. Principios Fundamentales

Toda implementación del Trip Engine deberá respetar los siguientes principios.

- procesamiento basado en eventos
- alta concurrencia
- componentes desacoplados
- comunicación mediante eventos
- estado consistente
- escalabilidad horizontal
- procesamiento determinístico
- recuperación ante fallos
- observabilidad
- simplicidad operacional

Estos principios constituyen la base de todas las decisiones de diseño del motor.

---

# 24. Evolución

La arquitectura del Trip Engine ha sido diseñada para permitir futuras mejoras sin modificar sus principios fundamentales.

Entre las capacidades previstas para versiones posteriores se encuentran.

- procesamiento distribuido
- múltiples regiones
- particionamiento geográfico
- balanceo inteligente
- colas distribuidas
- procesamiento paralelo avanzado
- replicación de estado
- consenso distribuido
- auto escalamiento
- análisis predictivo mediante inteligencia artificial

Estas capacidades podrán incorporarse progresivamente conforme evolucione la plataforma.

---

# 25. Relación con Otros Componentes

El Trip Engine forma parte del ecosistema Tachi y trabaja en coordinación con los demás dominios de la plataforma.

Su interacción se realiza mediante interfaces bien definidas.

Conceptualmente.

```
                Backend Principal

                        │

                        ▼

                 Trip Engine

      ┌───────────┼───────────┐

      │           │           │

 Dispatcher   Scheduler   WebSocket Hub

      │           │           │

      └───────────┼───────────┘

                  │

             Aplicaciones
```

El motor no reemplaza al Backend Principal.

Ambos componentes colaboran para ofrecer una experiencia de transporte en tiempo real.

---

# 26. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|--------------------------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Definición de la arquitectura del Trip Engine de Tachi. |

---

# Conclusión

El Trip Engine constituye el núcleo de procesamiento en tiempo real de Tachi.

Su arquitectura modular, basada en eventos, altamente concurrente y desacoplada, permite administrar de forma eficiente la asignación de viajes, la comunicación con conductores y pasajeros, y la coordinación de los procesos críticos de movilidad.

La combinación de componentes especializados, procesamiento determinístico, máquinas de estados, actores por entidad y escalabilidad horizontal proporciona una base sólida para soportar el crecimiento de la plataforma sin comprometer el rendimiento, la consistencia ni la mantenibilidad del sistema.

Este documento establece los principios fundamentales sobre los cuales deberán desarrollarse todos los componentes internos del Trip Engine.