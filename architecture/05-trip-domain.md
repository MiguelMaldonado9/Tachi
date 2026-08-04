# 05. Trip Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 05-trip-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Trip Domain representa el núcleo funcional de la plataforma Tachi.

Mientras otros dominios administran información como usuarios, conductores, vehículos o pagos, este dominio es responsable de coordinar el ciclo de vida completo de un servicio de transporte, desde el momento en que un pasajero solicita un viaje hasta su finalización.

Este dominio concentra las reglas de negocio más críticas del sistema y constituye el principal consumidor de información proveniente de los demás dominios.

Su responsabilidad no consiste únicamente en crear registros de viajes, sino en tomar decisiones operativas en tiempo real para garantizar que cada solicitud sea asignada al conductor más adecuado bajo criterios de disponibilidad, proximidad, seguridad y eficiencia.

Debido a la naturaleza altamente concurrente de estas operaciones, el motor operacional del Trip Domain será implementado mediante un servicio especializado desarrollado en Go, mientras que el resto de la plataforma continuará utilizando Fastify y TypeScript para la gestión de las API y los procesos administrativos.

Este documento define las reglas funcionales y operativas que deberá cumplir dicho motor.

---

# 2. Objetivos

El Trip Domain tiene como objetivos principales:

- Gestionar el ciclo completo de cada viaje.
- Coordinar la comunicación entre pasajeros y conductores.
- Seleccionar el conductor más adecuado para cada solicitud.
- Optimizar los tiempos de asignación.
- Minimizar tiempos de espera.
- Mantener consistencia durante todo el proceso del viaje.
- Garantizar la integridad del estado del servicio.
- Facilitar la escalabilidad del sistema mediante procesamiento concurrente.

---

# 3. Responsabilidades

Este dominio será responsable exclusivamente de las operaciones relacionadas con los viajes.

Entre sus responsabilidades se encuentran:

- Crear solicitudes de viaje.
- Buscar conductores disponibles.
- Ejecutar el algoritmo de asignación.
- Administrar el proceso de aceptación.
- Gestionar cancelaciones.
- Controlar el ciclo de vida del viaje.
- Actualizar estados del viaje.
- Gestionar reasignaciones.
- Emitir eventos hacia otros dominios.
- Mantener consistencia durante la operación.

No será responsabilidad del Trip Domain administrar:

- autenticación
- perfiles de usuario
- documentos del conductor
- vehículos
- pagos
- promociones
- calificaciones

Estos procesos serán delegados a sus respectivos dominios.

---

# 4. Principios de Diseño

El diseño del Trip Domain sigue los siguientes principios.

---

## Tiempo Real

Todas las decisiones deberán tomarse con la menor latencia posible.

La plataforma debe responder en segundos ante cualquier solicitud.

---

## Escalabilidad

El procesamiento deberá soportar miles de solicitudes simultáneas sin degradar el rendimiento.

---

## Alta Disponibilidad

La caída de un componente no deberá comprometer el funcionamiento general del sistema.

---

## Bajo Acoplamiento

El Trip Domain dependerá únicamente de contratos públicos expuestos por otros dominios.

Nunca accederá directamente a lógica interna de otro módulo.

---

## Procesamiento Concurrente

Las operaciones susceptibles de ejecutarse en paralelo deberán aprovechar procesamiento concurrente.

Este principio será implementado mediante Go.

---

## Consistencia

Cada viaje tendrá un único estado válido en cualquier instante.

No podrán existir estados ambiguos o contradictorios.

---

## Observabilidad

Todas las decisiones relevantes deberán generar eventos para auditoría y monitoreo.

---

# 5. Conceptos del Dominio

Para comprender correctamente este dominio es necesario definir los siguientes conceptos.

---

## Viaje (Trip)

Representa el servicio de transporte solicitado por un pasajero.

Su ciclo de vida inicia con una solicitud y finaliza cuando el servicio ha concluido o ha sido cancelado.

---

## Solicitud de Viaje (Trip Request)

Es la intención inicial del pasajero de obtener un servicio de transporte.

Todavía no existe un conductor asignado.

---

## Matching

Proceso mediante el cual el sistema identifica los conductores candidatos para atender una solicitud.

Este proceso constituye el núcleo del motor operacional.

---

## Asignación

Proceso mediante el cual un conductor acepta oficialmente una solicitud de viaje.

---

## ETA (Estimated Time of Arrival)

Tiempo estimado que tardará el conductor en llegar al punto de recogida.

El ETA será recalculado continuamente durante la aproximación.

---

## Radio de Búsqueda

Distancia máxima utilizada para localizar conductores cercanos.

Este radio será dinámico y podrá incrementarse progresivamente cuando no existan conductores disponibles.

---

## Disponibilidad

Estado operativo que determina si un conductor puede recibir nuevas solicitudes.

---

## Cancelación

Proceso mediante el cual el pasajero o el conductor finalizan una solicitud antes de completar el servicio.

---

## Reasignación

Proceso mediante el cual una solicitud vuelve a entrar al motor de búsqueda debido a la pérdida del conductor inicialmente asignado.

---

# 6. Actores

En el Trip Domain participan los siguientes actores.

---

## Pasajero

Responsable de solicitar el servicio de transporte.

Puede:

- crear solicitudes
- cancelar solicitudes
- visualizar el estado del viaje
- seguir la ubicación del conductor

---

## Conductor

Responsable de aceptar o rechazar solicitudes.

Puede:

- aceptar viajes
- rechazar viajes
- iniciar el recorrido
- finalizar el servicio
- cancelar bajo condiciones permitidas

---

## Sistema

Representa el motor operacional.

Es responsable de:

- ejecutar el algoritmo de matching
- calcular prioridades
- controlar tiempos
- actualizar estados
- emitir eventos
- realizar reasignaciones
- controlar expiraciones

---

## Administrador

Puede intervenir únicamente en situaciones excepcionales.

Ejemplos:

- cancelar viajes
- investigar incidentes
- consultar historial
- realizar auditorías

---

# 7. Ciclo de Vida del Viaje

El ciclo de vida de un viaje representa la secuencia ordenada de estados por los cuales transita una solicitud de transporte desde su creación hasta su finalización.

Cada viaje deberá encontrarse siempre en un único estado válido.

No podrán existir dos estados simultáneos para un mismo viaje.

Toda transición deberá cumplir las reglas definidas por este documento.

---

## Flujo General

El flujo operativo de un viaje es el siguiente.

```

REQUESTED

↓

SEARCHING_DRIVER

↓

DRIVER_ASSIGNED

↓

DRIVER_ACCEPTED

↓

DRIVER_ARRIVING

↓

DRIVER_WAITING

↓

IN_PROGRESS

↓

COMPLETED

```

Este representa el escenario ideal.

Sin embargo, durante el proceso podrán producirse cancelaciones, rechazos, reasignaciones o fallos operativos.

---

# 8. Máquina de Estados

La siguiente máquina de estados define todos los estados válidos del dominio.

---

## REQUESTED

Descripción

El pasajero ha solicitado un viaje.

Todavía no existe un conductor asignado.

Acciones permitidas

- cancelar solicitud
- iniciar búsqueda

Transiciones válidas

```

REQUESTED

↓

SEARCHING_DRIVER

```

o

```

REQUESTED

↓

CANCELLED

```

---

## SEARCHING_DRIVER

Descripción

El sistema ejecuta el algoritmo de búsqueda de conductores.

Durante este estado el motor podrá:

- consultar ubicación
- calcular distancia
- calcular prioridad
- enviar solicitudes

Acciones permitidas

- asignar conductor
- ampliar radio
- cancelar búsqueda

Transiciones válidas

```

SEARCHING_DRIVER

↓

DRIVER_ASSIGNED

```

```

SEARCHING_DRIVER

↓

NO_DRIVER_FOUND

```

```

SEARCHING_DRIVER

↓

CANCELLED

```

---

## DRIVER_ASSIGNED

Descripción

El sistema encontró un conductor candidato.

La solicitud fue enviada al conductor.

Se inicia el temporizador de respuesta.

Acciones permitidas

- aceptar
- rechazar
- expirar

Transiciones válidas

```

DRIVER_ASSIGNED

↓

DRIVER_ACCEPTED

```

```

DRIVER_ASSIGNED

↓

SEARCHING_DRIVER

```

(rechazo o timeout)

---

## DRIVER_ACCEPTED

Descripción

El conductor aceptó oficialmente la solicitud.

A partir de este momento queda reservado para ese viaje.

Acciones permitidas

- iniciar desplazamiento
- cancelar bajo políticas

Transiciones

```

DRIVER_ACCEPTED

↓

DRIVER_ARRIVING

```

---

## DRIVER_ARRIVING

Descripción

El conductor se encuentra desplazándose hacia el punto de recogida.

Durante este estado el sistema actualizará continuamente:

- ubicación
- ETA
- distancia restante

Acciones permitidas

- cancelar
- llegar

Transiciones

```

DRIVER_ARRIVING

↓

DRIVER_WAITING

```

---

## DRIVER_WAITING

Descripción

El conductor llegó al punto de recogida.

Se inicia el tiempo oficial de espera.

Acciones permitidas

- iniciar viaje
- cancelar por ausencia

Transiciones

```

DRIVER_WAITING

↓

IN_PROGRESS

```

```

DRIVER_WAITING

↓

CANCELLED

```

---

## IN_PROGRESS

Descripción

El pasajero abordó el vehículo.

El viaje ha comenzado oficialmente.

Durante este estado el sistema monitorea continuamente:

- GPS
- velocidad
- ruta
- ETA
- incidentes

Acciones permitidas

- finalizar viaje
- emergencia

Transiciones

```

IN_PROGRESS

↓

COMPLETED

```

```

IN_PROGRESS

↓

EMERGENCY

```

---

## COMPLETED

Descripción

El servicio finalizó correctamente.

Se habilitan procesos posteriores como:

- pago
- calificación
- auditoría
- estadísticas

Estado final.

---

## CANCELLED

Descripción

La solicitud fue cancelada.

Puede producirse por:

- pasajero
- conductor
- sistema
- administrador

Estado final.

---

## NO_DRIVER_FOUND

Descripción

El sistema agotó el radio máximo permitido sin encontrar un conductor disponible.

Estado final.

---

## EMERGENCY

Descripción

Representa una situación excepcional durante el viaje.

Ejemplos.

- accidente
- botón de pánico
- incidente de seguridad
- solicitud policial

Este estado activa protocolos especiales definidos por el dominio de Seguridad.

---

# 9. Reglas Generales de Transición

Las siguientes reglas deberán cumplirse en todos los viajes.

---

## Un único estado

Cada viaje tendrá exactamente un estado vigente.

Nunca podrán coexistir múltiples estados activos.

---

## Transiciones válidas

No podrán realizarse saltos arbitrarios.

Ejemplo.

Incorrecto

```

REQUESTED

↓

IN_PROGRESS

```

Correcto

```

REQUESTED

↓

SEARCHING_DRIVER

↓

DRIVER_ASSIGNED

↓

DRIVER_ACCEPTED

↓

DRIVER_ARRIVING

↓

DRIVER_WAITING

↓

IN_PROGRESS

```

---

## Estados Finales

Los siguientes estados terminan definitivamente el ciclo de vida.

- COMPLETED
- CANCELLED
- NO_DRIVER_FOUND

Después de estos estados no podrán existir nuevas transiciones.

---

## Estados Operativos

Los siguientes estados implican actividad del motor.

- SEARCHING_DRIVER
- DRIVER_ASSIGNED
- DRIVER_ACCEPTED
- DRIVER_ARRIVING
- DRIVER_WAITING
- IN_PROGRESS

Durante ellos el Matching Engine podrá continuar ejecutando lógica de negocio.

---

# 10. Flujo General del Sistema

El siguiente flujo describe el comportamiento completo del sistema desde el momento en que un pasajero solicita un viaje hasta que un conductor es asignado exitosamente.

Este proceso será ejecutado por el Trip Engine.

---

## Flujo Principal

```

Pasajero solicita viaje

↓

Backend valida solicitud

↓

Crear Trip Request

↓

Enviar solicitud al Trip Engine

↓

Iniciar proceso de Matching

↓

Buscar conductores

↓

Ordenar candidatos

↓

Enviar solicitud al mejor conductor

↓

Esperar respuesta

↓

Aceptó

↓

Crear asignación

↓

Actualizar estado del viaje

↓

Responder al Backend

↓

Notificar a las aplicaciones

```

---

## Responsabilidad del Backend

El Backend (Fastify) únicamente será responsable de:

- validar autenticación
- validar DTO
- validar permisos
- registrar la solicitud
- comunicarse con el Trip Engine
- responder al cliente

El Backend nunca ejecutará el algoritmo de asignación.

---

## Responsabilidad del Trip Engine

El Trip Engine será responsable de:

- buscar conductores
- calcular distancias
- calcular prioridades
- administrar temporizadores
- controlar el radio de búsqueda
- realizar reasignaciones
- emitir eventos

Todo el proceso de decisión será centralizado en este servicio.

---

# 11. Motor de Matching

El Matching Engine constituye el núcleo operativo de Tachi.

Su responsabilidad consiste en determinar cuál es el conductor más adecuado para atender cada solicitud de viaje.

El algoritmo deberá tomar decisiones en tiempo real utilizando múltiples criterios simultáneamente.

---

## Objetivos

El motor deberá:

- minimizar tiempos de espera
- reducir distancia de llegada
- maximizar disponibilidad
- evitar asignaciones incorrectas
- distribuir la carga entre conductores

---

## Información utilizada

Para cada conductor el sistema evaluará:

- ubicación actual
- disponibilidad
- estado operativo
- documentos vigentes
- conexión activa
- precisión GPS
- vehículo activo
- viajes actuales
- historial de bloqueos

---

## Información utilizada del viaje

El viaje aportará:

- origen
- destino
- categoría solicitada
- fecha
- hora
- prioridad
- tipo de servicio

---

# 12. Algoritmo de Asignación

El algoritmo oficial de asignación seguirá la siguiente secuencia.

---

## Paso 1

Recibir solicitud.

```

Trip Request

↓

Matching Engine

```

---

## Paso 2

Obtener ubicación del pasajero.

---

## Paso 3

Definir radio inicial.

Por defecto.

```

1 Kilómetro

```

---

## Paso 4

Buscar conductores disponibles.

Filtros mínimos.

- ACTIVE
- AVAILABLE
- GPS activo
- conexión activa
- documentos vigentes
- vehículo operativo

Todo conductor que no cumpla alguno de estos criterios será descartado.

---

## Paso 5

Calcular distancia.

El cálculo utilizará PostGIS.

No se utilizarán aproximaciones por coordenadas simples.

---

## Paso 6

Ordenar candidatos.

El orden inicial será:

1.

Menor distancia.

2.

Menor ETA.

3.

Mayor estabilidad de conexión.

4.

Menor carga de trabajo.

---

## Paso 7

Seleccionar el primer candidato.

```

Lista

↓

Conductor 1

```

---

## Paso 8

Enviar solicitud.

El conductor recibirá una oferta de viaje.

---

## Paso 9

Esperar respuesta.

El sistema iniciará un temporizador.

```

15 segundos

```

---

## Paso 10

Evaluar respuesta.

Si acepta.

```

Aceptar

↓

Asignar viaje

↓

Finalizar búsqueda

```

---

Si rechaza.

```

Rechazar

↓

Buscar siguiente candidato

```

---

Si no responde.

```

Timeout

↓

Marcar como rechazado

↓

Continuar búsqueda

```

---

# 13. Criterios de Elegibilidad

Un conductor será considerado elegible únicamente cuando cumpla todos los siguientes criterios.

---

## Estado

ACTIVE

---

## Disponibilidad

AVAILABLE

---

## GPS

Debe reportar posición válida.

---

## Conectividad

Debe mantener conexión activa con el servidor.

---

## Documentación

Licencia vigente.

SOAT vigente.

Revisión técnico mecánica vigente.

Documentos obligatorios completos.

---

## Vehículo

Debe existir un vehículo activo asociado al conductor.

---

## Viaje

No deberá encontrarse atendiendo otro servicio.

---

## Cuenta

No deberá estar suspendido.

---

# 14. Temporizadores

El motor utilizará múltiples temporizadores.

---

## Tiempo de respuesta

```

15 segundos

```

Tiempo máximo para aceptar un viaje.

---

## Tiempo de búsqueda

```

10 minutos

```

Tiempo máximo permitido para intentar conseguir conductor.

---

## Tiempo de llegada

Será dinámico.

Dependerá del ETA calculado por el proveedor de mapas.

---

## Tiempo de espera

Comenzará cuando el conductor llegue al punto de recogida.

Su duración será configurable desde el panel administrativo.

---

# 15. Reglas Operativas

Durante el proceso de matching deberán cumplirse las siguientes reglas.

---

Un conductor no podrá recibir dos solicitudes simultáneamente.

---

Una solicitud únicamente podrá estar asignada a un conductor.

---

Un conductor rechazado no volverá a recibir la misma solicitud.

---

Toda asignación deberá registrarse para auditoría.

---

Toda decisión importante deberá generar un evento del dominio.

---

# 16. Expansión Dinámica del Radio de Búsqueda

No siempre existirá un conductor disponible dentro del radio inicial.

Por esta razón, el Trip Engine implementará un mecanismo de expansión progresiva del área de búsqueda.

El objetivo es maximizar la probabilidad de asignación sin saturar innecesariamente a todos los conductores de la ciudad.

---

## Radio Inicial

Toda solicitud iniciará con un radio de búsqueda de:

```
1 Kilómetro
```

---

## Expansión

Si ningún conductor acepta dentro del tiempo establecido, el motor ampliará automáticamente el radio.

La expansión seguirá la siguiente secuencia.

```
1 km

↓

2 km

↓

3 km

↓

4 km

↓

5 km

↓

6 km
```

El valor máximo inicial del sistema será:

```
6 kilómetros
```

Este parámetro podrá modificarse desde el panel administrativo.

---

## Tiempo entre expansiones

Después de cada ciclo de búsqueda el sistema esperará un tiempo configurable antes de ampliar nuevamente el radio.

Valor inicial recomendado.

```
15 segundos
```

---

## Finalización

Si el radio máximo es alcanzado y ningún conductor acepta la solicitud, el viaje cambiará al estado:

```
NO_DRIVER_FOUND
```

y el pasajero será notificado inmediatamente.

---

# 17. Reasignación

Una reasignación ocurre cuando un conductor previamente asignado deja de ser válido para el viaje.

En este caso el viaje volverá automáticamente al proceso de búsqueda.

---

## Causas de Reasignación

El sistema iniciará una nueva búsqueda cuando ocurra cualquiera de los siguientes eventos.

- El conductor cancela.
- El conductor pierde conexión durante un tiempo prolongado.
- El GPS deja de actualizarse.
- El conductor cambia manualmente su disponibilidad.
- El vehículo asociado deja de cumplir las condiciones requeridas.
- El sistema detecta inconsistencias operativas.

---

## Flujo

```
DRIVER_ASSIGNED

↓

Conductor cancela

↓

SEARCHING_DRIVER

↓

Nuevo Matching

↓

Nuevo conductor
```

La reasignación deberá conservar el mismo identificador del viaje.

Nunca deberá crearse un nuevo viaje por una simple reasignación.

---

# 18. Reglas de Cancelación

El sistema reconoce diferentes tipos de cancelación.

Cada uno posee reglas independientes.

---

## Cancelación por el Pasajero

El pasajero podrá cancelar antes del inicio del viaje.

Dependiendo del momento de la cancelación podrán aplicarse políticas definidas por el negocio.

Ejemplo.

```
Conductor aún no acepta

↓

Cancelación gratuita
```

```
Conductor ya llegó

↓

Aplicar política de cancelación
```

---

## Cancelación por el Conductor

El conductor podrá cancelar únicamente bajo condiciones autorizadas.

Ejemplos.

- Incidente mecánico.
- Emergencia.
- Imposibilidad de acceder al punto de recogida.
- Riesgo para la seguridad.

Cada cancelación será registrada para procesos de auditoría y reputación.

---

## Cancelación Automática

El sistema podrá cancelar automáticamente cuando:

- expire el tiempo máximo de búsqueda.
- el pasajero no responda.
- el conductor desaparezca del sistema.
- ocurra un fallo crítico.

---

# 19. Monitoreo del Conductor

Una vez asignado un viaje, el Trip Engine continuará supervisando permanentemente al conductor.

---

## GPS

El sistema verificará que el conductor continúe enviando ubicación.

Si el GPS deja de actualizarse durante un periodo prolongado, el viaje será marcado para revisión.

---

## Conectividad

El sistema comprobará continuamente la conexión del conductor.

Si la pérdida de conexión supera el tiempo permitido podrán iniciarse protocolos de reasignación.

---

## Movimiento

El sistema verificará que el conductor continúe desplazándose hacia el pasajero.

Si el conductor comienza a alejarse injustificadamente podrán generarse alertas.

---

# 20. Reglas del ETA

El ETA (Estimated Time of Arrival) representa el tiempo estimado de llegada del conductor.

Este valor deberá actualizarse continuamente.

---

## Actualización

El ETA será recalculado cuando cambie cualquiera de los siguientes factores.

- posición del conductor
- tráfico
- ruta
- incidentes viales
- desvíos

---

## Incremento excesivo

Si el ETA aumenta significativamente durante la aproximación, el sistema podrá advertir al pasajero.

En futuras versiones podrán implementarse mecanismos automáticos de reasignación basados en este comportamiento.

---

# 21. Reglas de Seguridad

El Trip Engine deberá proteger la integridad de cada asignación.

---

## Un conductor por viaje

Nunca podrán existir dos conductores asignados simultáneamente al mismo viaje.

---

## Un viaje por conductor

Un conductor únicamente podrá atender un viaje activo al mismo tiempo.

---

## Confirmación de estado

Antes de confirmar una asignación el sistema verificará nuevamente:

- disponibilidad
- conexión
- ubicación
- estado operativo

Esto evita condiciones de carrera entre solicitudes concurrentes.

---

## Prevención de duplicados

El motor garantizará que una misma solicitud no sea enviada dos veces al mismo conductor durante el mismo ciclo de búsqueda.

---

## Tolerancia a Fallos

Si ocurre un error durante el proceso de asignación, el sistema deberá recuperar la operación sin perder el estado del viaje.

La prioridad siempre será preservar la consistencia del dominio antes que la velocidad de respuesta.

---

# 22. Eventos del Dominio

El Trip Domain emitirá eventos de dominio para informar a los demás módulos sobre cambios importantes durante el ciclo de vida del viaje.

Los eventos permitirán desacoplar el motor de viajes del resto de la plataforma.

---

## Objetivos

Los eventos permitirán:

- Notificar cambios de estado.
- Activar procesos automáticos.
- Actualizar paneles administrativos.
- Registrar auditoría.
- Enviar notificaciones.
- Calcular estadísticas.

---

## Eventos Principales

### TripRequested

Se genera cuando un pasajero solicita un nuevo viaje.

Consumidores:

- Matching Engine
- Audit
- Notifications

---

### DriverAssigned

Se genera cuando un conductor es asignado correctamente.

Consumidores:

- Notifications
- Users
- Drivers

---

### DriverArriving

Indica que el conductor se encuentra en camino hacia el pasajero.

Consumidores:

- Notifications
- Passenger App

---

### DriverWaiting

Indica que el conductor llegó al punto de recogida.

Consumidores:

- Passenger App
- Notifications

---

### TripStarted

Se genera cuando el pasajero inicia oficialmente el viaje.

Consumidores:

- Pricing
- Audit
- Notifications

---

### TripCompleted

Se genera al finalizar correctamente el servicio.

Consumidores:

- Payments
- Ratings
- Audit
- Statistics

---

### TripCancelled

Se genera cuando el viaje es cancelado.

Consumidores:

- Notifications
- Audit
- Statistics

---

### EmergencyTriggered

Se genera cuando ocurre un incidente de seguridad.

Consumidores:

- Security
- Audit
- Administration

---

# 23. Integración con otros Dominios

El Trip Domain interactúa con múltiples dominios del sistema.

Sin embargo, todas las integraciones deberán realizarse mediante contratos públicos.

Nunca mediante acceso directo a la lógica interna.

---

## Authentication

Responsabilidad.

Validar la identidad del usuario.

El Trip Domain nunca autentica usuarios.

---

## Users

Responsabilidad.

Obtener información del pasajero.

Ejemplos.

- nombre
- estado
- información básica

---

## Drivers

Responsabilidad.

Consultar conductores disponibles.

Obtener:

- estado
- disponibilidad
- ubicación
- documentos
- permisos

---

## Vehicles

Responsabilidad.

Consultar el vehículo activo asociado al conductor.

El Trip Domain nunca administrará vehículos.

---

## Pricing

Responsabilidad.

Calcular el valor del viaje.

El Trip Domain únicamente enviará la información necesaria.

---

## Payments

Responsabilidad.

Gestionar el cobro.

El Trip Domain únicamente notificará la finalización del servicio.

---

## Ratings

Responsabilidad.

Gestionar las calificaciones entre conductor y pasajero.

---

## Notifications

Responsabilidad.

Enviar mensajes.

Ejemplos.

- conductor encontrado
- conductor llegando
- viaje iniciado
- viaje finalizado
- cancelaciones

---

## Audit

Responsabilidad.

Registrar todas las acciones importantes realizadas durante el ciclo de vida del viaje.

---

# 24. Casos de Uso

Los siguientes representan los principales casos de uso del dominio.

---

## Solicitar Viaje

Actor.

Pasajero.

Resultado.

Se crea una nueva solicitud y comienza el proceso de matching.

---

## Aceptar Viaje

Actor.

Conductor.

Resultado.

El conductor queda asignado oficialmente.

---

## Rechazar Viaje

Actor.

Conductor.

Resultado.

La solicitud vuelve al algoritmo de búsqueda.

---

## Cancelar Viaje

Actor.

Pasajero

Conductor

Sistema

Administrador

Resultado.

Finaliza el proceso de viaje.

---

## Iniciar Viaje

Actor.

Conductor.

Resultado.

El estado cambia a:

```
IN_PROGRESS
```

---

## Finalizar Viaje

Actor.

Conductor.

Resultado.

El viaje cambia a:

```
COMPLETED
```

y se habilitan:

- pagos
- calificaciones
- auditoría

---

# 25. Roadmap del Dominio

La evolución prevista para este dominio contempla las siguientes fases.

---

## Versión 1

- Solicitud de viaje.
- Matching básico.
- Expansión del radio.
- Estados.
- Cancelaciones.
- Reasignaciones.

---

## Versión 2

- ETA inteligente.
- Reasignación automática avanzada.
- Balanceo dinámico de conductores.
- Priorización por calidad del servicio.

---

## Versión 3

- Predicción de demanda.
- Optimización mediante Machine Learning.
- Matching basado en comportamiento histórico.
- Recomendaciones inteligentes.

---

## Versión 4

- Integración con múltiples operadores.
- Matching multi-ciudad.
- Optimización regional.
- Escalabilidad distribuida.

---

# 26. Futuro Trip Engine

Toda la lógica operacional definida en este documento será implementada mediante un microservicio independiente desarrollado en Go.

Este servicio será responsable del procesamiento concurrente de solicitudes de viaje y de la ejecución del algoritmo oficial de asignación.

La API principal de la plataforma delegará en este motor todas las decisiones relacionadas con el ciclo de vida de los viajes.

La arquitectura específica del Trip Engine será documentada en un documento independiente.

---

# 27. Control del Documento

| Campo | Valor |
|-------|--------|
| Documento | 05-trip-domain.md |
| Estado | Aprobado |
| Versión | 1.0 |
| Responsable | Equipo de Arquitectura - Tachi |

---

# Conclusiones

El Trip Domain constituye el núcleo funcional de la plataforma Tachi.

Su diseño define el comportamiento operativo de todo el sistema de transporte, estableciendo las reglas que gobiernan la creación, asignación, ejecución y finalización de cada viaje.

Las decisiones descritas en este documento son independientes de la tecnología utilizada para su implementación y representan el contrato funcional que deberá cumplir el futuro Trip Engine desarrollado en Go.

Toda modificación sobre el comportamiento operativo del sistema deberá reflejarse primero en este documento antes de ser implementada en el código fuente.
