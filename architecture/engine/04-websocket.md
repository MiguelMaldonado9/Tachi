# 04. WebSocket Architecture

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 04-websocket.md |
| Componente | Trip Engine |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El WebSocket Hub constituye el componente encargado de administrar las comunicaciones en tiempo real entre el Trip Engine y las aplicaciones conectadas.

Su responsabilidad principal consiste en mantener conexiones persistentes, transportar eventos y garantizar una comunicación eficiente entre:

- conductores,
- pasajeros,
- panel administrativo.

---

# 2. Objetivos

El WebSocket Hub deberá cumplir los siguientes objetivos.

- mantener conexiones persistentes
- transmitir eventos en tiempo real
- administrar presencia online/offline
- detectar desconexiones
- soportar reconexiones
- manejar miles de conexiones simultáneas
- distribuir mensajes correctamente
- garantizar baja latencia

---

# 3. Responsabilidades

El WebSocket Hub será responsable únicamente de la comunicación.

No implementará reglas de negocio.

Sus responsabilidades incluyen.

- aceptar conexiones
- autenticar sesiones WebSocket
- mantener clientes conectados
- enviar eventos
- recibir mensajes
- detectar pérdida de conexión
- administrar heartbeat
- cerrar conexiones inválidas

---

# 4. Separación de Responsabilidades

El WebSocket Hub no decidirá acciones del negocio.

Ejemplo incorrecto.

```
WebSocket

↓

Detecta conductor

↓

Asigna viaje

```

El comportamiento correcto.

```
Trip Engine

↓

Genera evento

↓

WebSocket Hub

↓

Entrega mensaje

↓

Aplicación

```

---

# 5. Arquitectura General

Conceptualmente.

```

                 Event Bus

                     │

                     ▼


              WebSocket Hub


        ┌────────────┼────────────┐


        │            │            │


    Driver App   User App   Admin Panel


```

---

# 6. Modelo de Conexión

Cada cliente conectado mantiene una sesión WebSocket activa.

Ejemplo.

```
Driver

↓

WebSocket Connection

↓

Session Manager

↓

Event Router

↓

Trip Engine

```

Cada conexión deberá tener información asociada.

Ejemplo.

```
Connection {

 id

 userId

 role

 device

 status

 lastHeartbeat

}

```

---

# 7. Tipos de Clientes

El sistema contempla tres tipos principales de conexiones.

---

## Driver Client

Representa la aplicación del conductor.

Responsable de recibir.

- ofertas de viaje
- cambios de estado
- instrucciones operativas

También envía.

- ubicación
- disponibilidad
- respuestas

---

## Passenger Client

Representa la aplicación del usuario.

Recibe.

- estado del viaje
- ubicación del conductor
- cambios de asignación

---

## Admin Client

Representa el panel administrativo.

Puede recibir.

- eventos operativos
- monitoreo
- métricas

---

# 8. Ciclo de Vida de una Conexión

Toda conexión WebSocket deberá seguir un ciclo de vida controlado.

El ciclo completo será administrado por el Connection Manager.

Conceptualmente.

```
CONNECTING

↓

AUTHENTICATING

↓

CONNECTED

↓

ACTIVE

↓

DISCONNECTING

↓

DISCONNECTED

```

---

# 9. Estado CONNECTING

Representa el momento inicial donde el cliente intenta establecer comunicación.

En esta etapa todavía no existe una sesión válida.

El sistema deberá validar.

- protocolo soportado
- origen permitido
- parámetros iniciales

---

# 10. Estado AUTHENTICATING

Después de establecer conexión, el cliente deberá demostrar su identidad.

La autenticación utilizará los mecanismos definidos por el dominio de identidad.

Ejemplo.

```
Cliente

↓

WebSocket Handshake

↓

JWT Token

↓

Validación

↓

Sesión creada

```

---

# 11. Estado CONNECTED

Una vez autenticado correctamente, el WebSocket Hub registra una nueva sesión.

La sesión deberá asociarse con.

- usuario
- rol
- dispositivo
- conexión activa

Ejemplo.

```
Session {

 userId

 role

 connectionId

 connectedAt

 lastActivity

}

```

---

# 12. Estado ACTIVE

Una conexión activa representa un cliente disponible para recibir y enviar eventos.

Durante este estado el sistema administra.

- mensajes entrantes
- mensajes salientes
- heartbeat
- actualización de presencia

---

# 13. Estado DISCONNECTING

Este estado ocurre cuando la conexión está finalizando.

Ejemplos.

- cierre voluntario
- logout
- cambio de sesión
- cierre administrativo

El sistema deberá ejecutar acciones de limpieza.

---

# 14. Estado DISCONNECTED

Representa una conexión completamente cerrada.

El Session Manager deberá actualizar la presencia correspondiente.

Ejemplo.

```
Driver

ONLINE

↓

Connection Lost

↓

OFFLINE

```

---

# 15. Autenticación WebSocket

Las conexiones WebSocket deberán estar protegidas mediante autenticación.

El cliente deberá presentar un token válido durante el establecimiento de conexión.

Proceso.

```
Cliente

↓

JWT Token

↓

WebSocket Hub

↓

Auth Validation

↓

Connection Accepted

```

---

# 16. Asociación de Identidad

Una vez autenticado el cliente, la conexión deberá asociarse con la identidad correspondiente.

Ejemplo.

```
Connection ID:

ws_839201


Usuario:

driver_554


Rol:

DRIVER

```

---

# 17. Sesiones Duplicadas

El sistema deberá manejar múltiples conexiones del mismo usuario.

Ejemplo.

Un conductor abre sesión en:

- teléfono principal
- teléfono secundario
- tablet

El Session Manager deberá aplicar una política configurable.

Opciones posibles.

---

## Single Active Session

Solo una conexión puede estar activa.

Nueva conexión:

```
Nueva sesión

↓

Cerrar anterior

↓

Mantener nueva

```

---

## Multiple Active Sessions

Varias conexiones pueden existir simultáneamente.

El sistema deberá determinar cuál tiene prioridad.

---

# 18. Estrategia para Tachi

Para aplicaciones críticas como la del conductor se recomienda inicialmente:

```
Single Active Session

+

Reconexión automática

```

Esto evita inconsistencias de ubicación y disponibilidad.

---

# 19. Heartbeat Manager

El Heartbeat Manager será el componente responsable de verificar continuamente la salud de las conexiones activas.

Su objetivo principal consiste en detectar conexiones inválidas o abandonadas y mantener actualizado el estado real de los clientes conectados.

---

# 20. Funcionamiento del Heartbeat

El mecanismo funcionará mediante mensajes periódicos entre cliente y servidor.

Flujo.

```
WebSocket Hub

↓

Ping

↓

Cliente

↓

Pong

↓

Actualizar actividad

```

---

Cada conexión deberá mantener información temporal.

Ejemplo.

```
Connection {

 id

 lastHeartbeat

 lastMessage

 status

}

```

---

# 21. Intervalos de Heartbeat

Los intervalos deberán ser configurables.

Ejemplo inicial.

```
Heartbeat Interval:

30 segundos


Timeout:

90 segundos

```

Si una conexión supera el tiempo máximo sin respuesta, será considerada perdida.

---

# 22. Detección de Conexión Muerta

Cuando una conexión no responde:

```
Heartbeat Failed

↓

Connection Manager

↓

Cerrar Socket

↓

Session Manager

↓

Actualizar Estado

↓

Generar Evento

```

---

Ejemplo.

```
Driver #455

ONLINE


↓

No responde 90 segundos


↓

OFFLINE

```

---

# 23. Reconexión Automática

Los clientes deberán implementar mecanismos de reconexión automática.

Cuando una conexión se pierda:

```
Aplicación

↓

Detecta desconexión

↓

Espera intervalo

↓

Intenta reconectar

↓

Autentica sesión

↓

Recupera estado

```

---

# 24. Estrategia de Backoff

Las reconexiones deberán utilizar espera progresiva para evitar saturar el servidor.

Ejemplo.

```
Intento 1

↓

1 segundo


Intento 2

↓

5 segundos


Intento 3

↓

15 segundos


Intento 4

↓

30 segundos

```

---

# 25. Recuperación de Sesión

Una reconexión no deberá crear una nueva identidad.

El sistema deberá recuperar la sesión existente cuando sea posible.

Proceso.

```
Cliente reconecta

↓

Connection Token

↓

Validación

↓

Nueva conexión asociada

↓

Restaurar sesión

```

---

# 26. Estado Operativo después de Reconexión

La reconexión técnica del WebSocket no implica automáticamente disponibilidad operativa.

Ejemplo.

Antes de perder conexión:

```
Driver

AVAILABLE

```

Después de varios minutos:

```
Driver reconecta

↓

Validar estado

↓

Restaurar o bloquear disponibilidad

```

---

El sistema deberá verificar:

- última ubicación conocida
- tiempo desconectado
- estado del viaje actual
- reglas operativas

---

# 27. Actualización de Ubicación

La aplicación del conductor enviará información de ubicación mediante WebSocket.

Ejemplo.

```
LocationUpdate

{

driverId,

latitude,

longitude,

speed,

heading,

timestamp

}

```

---

El WebSocket Hub deberá transportar esta información hacia los componentes correspondientes.

No deberá implementar lógica de negocio sobre ubicación.

---

# 28. Frecuencia de Ubicación

La frecuencia de envío deberá adaptarse según el estado del conductor.

Ejemplo.

Conductor disponible:

```
cada 5-10 segundos
```

Conductor en viaje:

```
cada 1-3 segundos
```

Offline:

```
sin transmisión
```

---

# 29. Escalabilidad del WebSocket Hub

El WebSocket Hub deberá estar preparado para funcionar mediante múltiples instancias.

La arquitectura deberá permitir crecimiento horizontal sin afectar la comunicación en tiempo real.

---

# 30. Arquitectura Distribuida

Una única instancia del WebSocket Hub puede convertirse en una limitación cuando aumenta el número de conexiones.

Por esta razón, el sistema deberá permitir múltiples nodos.

Conceptualmente.

```

                Load Balancer

                     │


        ┌────────────┼────────────┐


        │            │            │


   WS Hub 1     WS Hub 2     WS Hub 3


        │            │            │


        └────────────┼────────────┘


              Event Backbone

```

---

# 31. Distribución de Conexiones

Cada instancia podrá administrar un conjunto independiente de conexiones.

Ejemplo.

```
WS Hub 1

↓

Driver 1-10000


WS Hub 2

↓

Driver 10001-20000


WS Hub 3

↓

Usuarios y administración

```

---

Sin embargo, cualquier instancia deberá poder enviar eventos a cualquier usuario conectado.

---

# 32. Problema de Enrutamiento

Ejemplo.

```
Trip Engine

↓

Enviar oferta a Driver #500

```

Pero:

```
Driver #500

↓

Conectado en WS Hub 3

```

El sistema debe saber dónde vive esa conexión.

---

Para resolverlo se requiere un registro distribuido de sesiones.

---

# 33. Session Registry

El Session Manager deberá mantener información sobre la ubicación de las conexiones.

Ejemplo.

```
Session Registry


driver_500

↓

ws-node-3


driver_501

↓

ws-node-1

```

---

Información almacenada.

- usuario
- conexión activa
- nodo responsable
- última actividad
- estado

---

# 34. Message Routing Distribuido

Cuando un evento es generado:

Ejemplo.

```
TripOfferCreated

Driver: 500

```

El flujo será:

```
Event

↓

Message Router

↓

Session Registry

↓

Identificar nodo

↓

Enviar mensaje

↓

WebSocket Cliente

```

---

# 35. Event Backbone

Para comunicación entre instancias se utilizará un sistema de mensajería interno.

Conceptualmente.

```

WS Hub 1

      │

      │

Event Bus

      │

      │

WS Hub 2

```

---

El sistema podrá evolucionar hacia diferentes tecnologías.

Ejemplos.

- Redis Pub/Sub
- NATS
- RabbitMQ
- Kafka

La elección dependerá de la escala requerida.

---

# 36. Sticky Sessions

El balanceador de carga podrá utilizar sesiones persistentes.

Esto permite que un cliente mantenga conexión con el mismo nodo mientras sea posible.

Ejemplo.

```
Driver

↓

Load Balancer

↓

WS Hub 2

```

---

Sin embargo, la arquitectura no deberá depender exclusivamente de Sticky Sessions.

El sistema deberá continuar funcionando mediante registro distribuido.

---

# 37. Separación de Escala

Los diferentes componentes deberán poder escalar independientemente.

Ejemplo.

```
WebSocket Connections

        ↑

Connection Manager


Messages

        ↑

Message Router


Health Checks

        ↑

Heartbeat Manager

```

---

Esto evita que un aumento de ubicación en tiempo real afecte la entrega de ofertas.

---

# 38. Seguridad del WebSocket Hub

El WebSocket Hub deberá implementar controles de seguridad para proteger las comunicaciones en tiempo real.

Las conexiones deberán validarse antes de permitir intercambio de información.

---

# 39. Autorización por Rol

Cada conexión deberá estar asociada a un rol específico.

Ejemplo.

```
DRIVER

↓

Puede recibir ofertas y enviar ubicación


PASSENGER

↓

Puede recibir estados de viaje


ADMIN

↓

Puede recibir información administrativa
```

---

El Message Router deberá validar que cada evento pueda ser enviado al destinatario correspondiente.

---

# 40. Seguridad de Eventos

No todos los clientes podrán emitir cualquier evento.

Ejemplo incorrecto.

```
Driver App

↓

Enviar:

TripCompleted

```

La aplicación no deberá tener autoridad para modificar directamente estados críticos.

---

Flujo correcto.

```
Driver App

↓

Enviar solicitud

↓

Backend / Trip Engine

↓

Validación

↓

Cambio de estado

```

---

# 41. Rate Limiting

El WebSocket Hub deberá controlar la cantidad de mensajes enviados por cliente.

Objetivos.

- evitar abuso
- evitar saturación
- proteger recursos
- mantener estabilidad

Ejemplos.

```
LocationUpdate

Máximo permitido:

X mensajes por segundo

```

---

# 42. Protección contra Conexiones Maliciosas

El sistema deberá protegerse contra.

- conexiones falsas
- intentos repetidos
- tokens inválidos
- clientes no autorizados
- mensajes corruptos

---

Medidas.

- validación JWT
- expiración de tokens
- límites de conexión
- bloqueo temporal
- monitoreo de comportamiento

---

# 43. Observabilidad

El WebSocket Hub deberá generar métricas operativas.

Ejemplos.

## Conexiones

```
Usuarios conectados

Conductores conectados

Conexiones activas

```

---

## Rendimiento

```
Latencia promedio

Mensajes por segundo

Tiempo de entrega

```

---

## Errores

```
Desconexiones

Fallos de entrega

Errores de autenticación

Timeouts

```

---

# 44. Auditoría

Los eventos importantes deberán registrarse para análisis posterior.

Ejemplos.

```
ConnectionCreated

ConnectionAuthenticated

ConnectionClosed

MessageSent

MessageFailed

SessionExpired

```

---

La información registrada deberá permitir responder preguntas como:

- ¿Cuándo se conectó un conductor?
- ¿Por qué perdió conexión?
- ¿Se entregó correctamente una oferta?
- ¿Qué nodo procesó el evento?

---

# 45. Integración con Audit Domain

Los eventos críticos del WebSocket Hub podrán integrarse con el dominio de auditoría.

Ejemplo.

```
WebSocket Hub

↓

Audit Event

↓

Audit Domain

↓

Registro histórico

```

---

# 46. Preparación para Alta Escala

La arquitectura permite evolucionar hacia escenarios futuros.

Ejemplos.

- millones de conexiones
- múltiples regiones geográficas
- infraestructura distribuida
- balanceo inteligente
- edge servers
- comunicación regional optimizada

---

# 47. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|------------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Arquitectura del WebSocket Hub del Trip Engine. |

---

# Conclusión

El WebSocket Hub representa la capa de comunicación en tiempo real de Tachi.

Su diseño basado en conexiones persistentes, gestión de sesiones, eventos distribuidos, escalabilidad horizontal y seguridad permite soportar la interacción constante entre conductores, pasajeros y servicios internos.

La separación entre comunicación y lógica de negocio garantiza que el sistema pueda evolucionar sin comprometer la estabilidad del Trip Engine.

La arquitectura permite iniciar con una implementación sencilla para el MVP y evolucionar progresivamente hacia una infraestructura distribuida capaz de soportar grandes volúmenes de usuarios y operaciones de movilidad en tiempo real.
