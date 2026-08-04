# 10. Notification Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 10-notification-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Notification Domain es el dominio responsable de administrar todas las comunicaciones enviadas por la plataforma Tachi hacia sus usuarios, conductores y administradores.

Su función consiste en recibir eventos generados por otros dominios y transformarlos en mensajes entregados a través de diferentes canales de comunicación.

El Notification Domain nunca toma decisiones de negocio.

Únicamente comunica información generada por otros módulos del sistema.

Gracias a esta separación de responsabilidades, cualquier dominio podrá solicitar el envío de una notificación sin conocer el mecanismo utilizado para entregarla.

---

# 2. Objetivos

Los principales objetivos del Notification Domain son:

- Centralizar todas las comunicaciones de la plataforma.
- Desacoplar el envío de mensajes de la lógica de negocio.
- Permitir múltiples canales de comunicación.
- Garantizar consistencia en los mensajes enviados.
- Facilitar futuras integraciones con nuevos proveedores.
- Registrar el estado de entrega de cada notificación.
- Mejorar la experiencia de usuarios y conductores.

---

# 3. Responsabilidades

El Notification Domain será responsable de:

- enviar notificaciones push
- enviar correos electrónicos
- enviar mensajes internos de la aplicación
- administrar plantillas de mensajes
- registrar estados de entrega
- administrar reintentos de envío
- programar notificaciones diferidas
- seleccionar el canal de comunicación adecuado

No será responsable de:

- autenticación
- viajes
- pagos
- promociones
- conductores
- usuarios
- tarifas
- auditoría

Cada dominio continuará siendo propietario de su propia lógica de negocio.

---

# 4. Principios del Dominio

El Notification Domain ha sido diseñado siguiendo los siguientes principios.

---

## Desacoplamiento

Los dominios únicamente solicitarán el envío de una notificación.

No conocerán cómo será entregada.

---

## Multicanal

La misma notificación podrá enviarse mediante diferentes canales.

Ejemplo.

```
Pago aprobado

↓

Push

↓

Correo

↓

Centro de Notificaciones
```

---

## Escalabilidad

La arquitectura permitirá incorporar nuevos canales de comunicación sin modificar los dominios existentes.

---

## Confiabilidad

Cada intento de envío deberá registrar su resultado.

Esto permitirá realizar reintentos automáticos cuando sea necesario.

---

## Configurabilidad

Los tipos de notificación podrán habilitarse o deshabilitarse según las preferencias del usuario y las políticas de la plataforma.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Notification Domain se definen los siguientes conceptos.

---

## Notificación

Representa un mensaje generado por la plataforma para comunicar un evento.

Ejemplos.

- viaje aceptado
- pago aprobado
- documento rechazado
- contraseña actualizada

---

## Canal

Es el medio utilizado para entregar la notificación.

Ejemplos.

- Push
- Email
- SMS
- Centro de Notificaciones

---

## Plantilla

Representa el formato base utilizado para construir un mensaje.

Las plantillas permitirán mantener consistencia visual y facilitar traducciones futuras.

---

## Destinatario

Entidad que recibirá la notificación.

Podrá ser:

- usuario
- conductor
- administrador

---

## Estado

Representa el resultado del proceso de entrega.

Ejemplos.

```
PENDING

SENT

DELIVERED

FAILED

READ
```

---

# 6. Actores

Dentro del Notification Domain participan los siguientes actores.

---

## Usuario

Recibe notificaciones relacionadas con:

- viajes
- pagos
- promociones
- seguridad
- cuenta

---

## Conductor

Recibe notificaciones relacionadas con:

- nuevos servicios
- documentos
- pagos
- estado de la cuenta
- promociones

---

## Administrador

Recibe notificaciones relacionadas con:

- incidencias
- auditorías
- reportes
- eventos críticos
- alertas operativas

---

## Sistema

Los procesos automáticos también podrán generar notificaciones.

Ejemplos.

- recordatorios
- vencimiento de documentos
- campañas programadas
- tareas automáticas
- mantenimiento programado

---

# 7. Modelo Conceptual

El Notification Domain transforma eventos generados por la plataforma en mensajes entregados a los diferentes actores del sistema.

Conceptualmente el proceso puede representarse de la siguiente manera.

```
Dominio

↓

Evento

↓

Notification Domain

↓

Construcción del Mensaje

↓

Selección del Canal

↓

Entrega

↓

Registro del Estado
```

El dominio que origina el evento nunca enviará directamente la notificación.

Únicamente notificará que ocurrió una acción.

---

# 8. Flujo General de Envío

Toda notificación seguirá exactamente el mismo flujo.

```
Evento

↓

Validación

↓

Construcción del Mensaje

↓

Selección del Canal

↓

Envío

↓

Confirmación

↓

Actualización del Estado
```

Este flujo será común para todos los tipos de comunicación.

---

# 9. Canales de Comunicación

El Notification Domain permitirá utilizar múltiples canales de entrega.

Cada canal será completamente independiente.

---

## Push Notification

Será el principal mecanismo de comunicación en tiempo real.

Ejemplos.

- conductor asignado
- conductor llegó
- viaje iniciado
- viaje finalizado
- pago aprobado

Proveedor previsto.

```
Firebase Cloud Messaging

(Android)

↓

Apple Push Notification Service

(iOS)
```

---

## Correo Electrónico

Utilizado para comunicaciones formales.

Ejemplos.

- recuperación de contraseña
- bienvenida
- comprobantes
- cambios importantes
- notificaciones administrativas

---

## Centro de Notificaciones

La aplicación contará con un historial interno de mensajes.

Permitirá consultar notificaciones antiguas aunque el usuario haya cerrado la aplicación.

Ejemplos.

- promociones
- pagos
- viajes
- documentos
- mensajes administrativos

---

## SMS

Inicialmente no será utilizado.

Sin embargo, la arquitectura permitirá incorporarlo en futuras versiones.

Podrá emplearse para:

- códigos OTP
- recuperación de cuenta
- notificaciones críticas

---

# 10. Tipos de Notificación

Las notificaciones serán clasificadas según el tipo de evento que las origine.

---

## Seguridad

Ejemplos.

```
Inicio de sesión

↓

Cambio de contraseña

↓

Cambio de correo

↓

Acceso desde nuevo dispositivo
```

---

## Viajes

Ejemplos.

```
Viaje solicitado

↓

Conductor asignado

↓

Conductor llegó

↓

Viaje iniciado

↓

Viaje finalizado

↓

Viaje cancelado
```

---

## Pagos

Ejemplos.

```
Pago aprobado

↓

Pago rechazado

↓

Reembolso

↓

Liquidación disponible
```

---

## Conductores

Ejemplos.

```
Documento aprobado

↓

Documento rechazado

↓

Vehículo aprobado

↓

Cuenta suspendida
```

---

## Promociones

Ejemplos.

```
Nuevo cupón

↓

Promoción disponible

↓

Campaña especial

↓

Beneficio por fidelidad
```

---

## Sistema

Ejemplos.

```
Mantenimiento

↓

Actualización

↓

Cambios importantes

↓

Incidentes operativos
```

---

# 11. Prioridad de las Notificaciones

No todas las notificaciones tendrán la misma importancia.

El sistema clasificará cada mensaje según su prioridad.

---

## Prioridad Crítica

Requiere atención inmediata.

Ejemplos.

- viaje asignado
- conductor llegó
- pago rechazado
- bloqueo de cuenta

---

## Prioridad Alta

Debe entregarse lo antes posible.

Ejemplos.

- viaje iniciado
- viaje finalizado
- documento rechazado
- liquidación disponible

---

## Prioridad Media

Información importante, pero no urgente.

Ejemplos.

- promociones activas
- cambios de perfil
- nuevos beneficios

---

## Prioridad Baja

Mensajes informativos.

Ejemplos.

- campañas comerciales
- novedades
- consejos
- noticias de la plataforma

La prioridad permitirá optimizar el procesamiento cuando el volumen de mensajes aumente significativamente.

---

# 12. Estados de Entrega

Cada notificación recorrerá diferentes estados durante su ciclo de vida.

```
PENDING

↓

PROCESSING

↓

SENT

↓

DELIVERED

↓

READ
```

En caso de error.

```
PENDING

↓

PROCESSING

↓

FAILED

↓

RETRY
```

El historial permitirá conocer exactamente qué ocurrió con cada mensaje enviado.

---

# 13. Plantillas de Notificación

El Notification Domain utilizará plantillas para generar todos los mensajes enviados por la plataforma.

Las plantillas permitirán mantener una comunicación uniforme entre todos los canales.

Ejemplos de plantillas.

```
WELCOME_EMAIL

PASSWORD_RESET

TRIP_ASSIGNED

TRIP_STARTED

TRIP_COMPLETED

PAYMENT_APPROVED

PAYMENT_REJECTED

PROMOTION_AVAILABLE

DOCUMENT_APPROVED

DOCUMENT_REJECTED
```

Cada plantilla podrá contener variables dinámicas.

Ejemplo.

```
Hola {{userName}}

Tu conductor {{driverName}}

ha llegado al punto de recogida.
```

El Notification Domain reemplazará automáticamente las variables antes del envío.

---

# 14. Personalización de Mensajes

Cada tipo de notificación podrá presentar contenido diferente dependiendo del canal utilizado.

Ejemplo.

```
Evento

↓

Viaje Finalizado

↓

Push

"Tu viaje terminó."

↓

Correo

Incluye:

- origen
- destino
- conductor
- valor
- recibo

↓

Centro de Notificaciones

Resumen completo del viaje
```

Esto permitirá adaptar la experiencia al medio de comunicación.

---

# 15. Preferencias del Usuario

Cada usuario podrá configurar qué tipo de notificaciones desea recibir.

Ejemplos.

```
Viajes

✔

Pagos

✔

Promociones

✘

Noticias

✘

Recordatorios

✔
```

Las preferencias serán consultadas antes de realizar cualquier envío.

Las notificaciones críticas ignorarán estas preferencias cuando la seguridad o la operación de la plataforma lo requieran.

---

# 16. Reintentos Automáticos

Cuando un canal falle temporalmente, el Notification Domain podrá realizar reintentos automáticos.

Conceptualmente el flujo será:

```
Enviar

↓

Error

↓

Esperar

↓

Reintento

↓

Éxito

↓

Fin
```

Cada tipo de canal podrá definir su propia política de reintentos.

Ejemplos.

- número máximo de intentos
- tiempo entre intentos
- tiempo máximo de espera

---

# 17. Notificaciones Programadas

El dominio permitirá programar mensajes para una fecha y hora futuras.

Ejemplos.

- recordatorio de documentos próximos a vencer
- campañas comerciales
- mantenimiento programado
- felicitaciones de cumpleaños
- promociones temporales

Conceptualmente.

```
Crear Notificación

↓

Programar Fecha

↓

Esperar

↓

Enviar
```

---

# 18. Envíos Masivos

El Notification Domain permitirá distribuir mensajes a múltiples destinatarios.

Ejemplos.

- todos los usuarios
- todos los conductores
- una ciudad específica
- una zona geográfica
- usuarios corporativos
- conductores activos

Este mecanismo será utilizado principalmente para campañas y comunicaciones institucionales.

---

# 19. Preparación para Internacionalización

La arquitectura permitirá soportar múltiples idiomas.

Las plantillas podrán existir en diferentes versiones.

Ejemplo.

```
WELCOME_EMAIL

↓

Español

↓

Inglés

↓

Portugués
```

El idioma será seleccionado automáticamente según la configuración del usuario.

---

# 20. Preparación para Colas de Mensajes

A medida que la plataforma crezca, el Notification Domain podrá utilizar colas para procesar grandes volúmenes de mensajes.

Conceptualmente.

```
Evento

↓

Notification Queue

↓

Worker

↓

Proveedor

↓

Usuario
```

Este diseño permitirá:

- procesar miles de mensajes simultáneamente
- desacoplar el envío de la lógica de negocio
- evitar bloqueos en operaciones críticas
- escalar horizontalmente los procesos de comunicación

En futuras versiones, este mecanismo podrá implementarse mediante tecnologías como Redis Streams, RabbitMQ o Kafka, según las necesidades operativas de la plataforma.

---

# 21. Integración con otros Dominios

El Notification Domain interactúa con prácticamente todos los dominios de la plataforma.

Sin embargo, su comunicación siempre será unidireccional.

Los demás dominios generan eventos.

El Notification Domain únicamente comunica dichos eventos.

```
Dominio

↓

Evento

↓

Notification Domain

↓

Usuario
```

---

## Integración con Auth Domain

El Auth Domain generará notificaciones relacionadas con la autenticación.

Ejemplos.

- bienvenida
- recuperación de contraseña
- cambio de contraseña
- cambio de correo
- acceso desde un nuevo dispositivo

---

## Integración con Driver Domain

El Driver Domain generará notificaciones como:

- documento aprobado
- documento rechazado
- vehículo aprobado
- cuenta suspendida
- cuenta reactivada

---

## Integración con Vehicle Domain

El Vehicle Domain notificará eventos relacionados con los vehículos registrados.

Ejemplos.

- SOAT próximo a vencer
- tecnomecánica próxima a vencer
- vehículo aprobado
- vehículo rechazado
- vehículo inhabilitado

---

## Integración con Trip Domain

El Trip Domain será uno de los principales productores de notificaciones.

Ejemplos.

- viaje solicitado
- conductor asignado
- conductor en camino
- conductor llegó
- viaje iniciado
- viaje finalizado
- viaje cancelado

Estas notificaciones serán entregadas tanto al pasajero como al conductor según corresponda.

---

## Integración con Pricing Domain

El Pricing Domain podrá generar mensajes informativos relacionados con cambios comerciales.

Ejemplos.

- nuevas tarifas
- promociones activas
- descuentos especiales

---

## Integración con Payment Domain

El Payment Domain notificará eventos financieros.

Ejemplos.

- pago aprobado
- pago rechazado
- reembolso realizado
- liquidación disponible
- comprobante generado

---

## Integración con Rating Domain

El Rating Domain solicitará notificaciones para recordar la calificación de un viaje.

Ejemplos.

- califica tu conductor
- califica tu pasajero

---

## Integración con Administration Domain

El Administration Domain podrá generar comunicaciones institucionales.

Ejemplos.

- mantenimiento programado
- cambios en los términos del servicio
- campañas informativas
- anuncios generales

---

## Integración con Audit Domain

Cada intento de envío de una notificación podrá generar eventos de auditoría.

Ejemplos.

- notificación enviada
- entrega confirmada
- fallo en el envío
- reintento realizado
- mensaje leído

Esto permitirá mantener trazabilidad completa del proceso de comunicación.

---

# 22. Roadmap del Dominio

El Notification Domain ha sido diseñado para evolucionar junto con el crecimiento de la plataforma.

Entre las funcionalidades previstas para futuras versiones se encuentran las siguientes.

---

## Centro de Preferencias

Cada usuario podrá administrar completamente sus preferencias de comunicación.

Podrá definir:

- canales permitidos
- horarios
- categorías
- frecuencia de envío

---

## Motor de Campañas

Se incorporará un sistema especializado para campañas masivas.

Permitirá segmentar usuarios por:

- ciudad
- comportamiento
- frecuencia de uso
- historial de viajes
- promociones

---

## Inteligencia Artificial

En futuras versiones podrán utilizarse modelos de IA para optimizar las comunicaciones.

Ejemplos.

- mejor horario de envío
- canal más efectivo
- contenido personalizado
- recomendaciones automáticas

---

## Analítica de Comunicaciones

Se incorporarán métricas como:

- tasa de entrega
- tasa de apertura
- tasa de lectura
- tasa de interacción
- conversiones

Estas métricas ayudarán a mejorar continuamente la estrategia de comunicación de la plataforma.

---

## Arquitectura Basada en Eventos

El Notification Domain podrá consumir eventos directamente desde el Event Bus interno.

```
Trip Domain

↓

Event Bus

↓

Notification Domain

↓

Usuario
```

Esto permitirá desacoplar completamente la generación de eventos del proceso de comunicación.

---

# 23. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Notification Domain |

---

# Conclusión

El Notification Domain constituye el centro de comunicaciones de la plataforma Tachi.

Su responsabilidad consiste en transformar los eventos generados por los diferentes dominios en mensajes entregados a través de múltiples canales, garantizando una experiencia consistente para usuarios, conductores y administradores.

Gracias a su arquitectura desacoplada, el dominio podrá evolucionar desde un sistema básico de notificaciones push hasta una plataforma completa de comunicaciones multicanal, preparada para trabajar con colas de mensajes, procesamiento distribuido, campañas masivas e inteligencia artificial.

Este diseño asegura que la plataforma mantenga una comunicación eficiente, escalable y confiable sin comprometer la independencia de los demás dominios del sistema.

---