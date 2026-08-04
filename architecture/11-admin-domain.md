# 11. Administration Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 11-admin-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Administration Domain constituye el centro de control operativo de la plataforma Tachi.

Su responsabilidad consiste en proporcionar todas las herramientas necesarias para administrar, supervisar y mantener el funcionamiento de la plataforma sin intervenir directamente sobre la lógica interna de los demás dominios.

A través del panel administrativo será posible gestionar usuarios, conductores, vehículos, viajes, pagos, tarifas, promociones, auditorías, notificaciones y configuraciones generales del sistema.

El Administration Domain nunca implementará reglas propias de negocio.

Su función consiste en orquestar y consumir las capacidades expuestas por los diferentes dominios de la plataforma.

---

# 2. Objetivos

Los principales objetivos del Administration Domain son:

- Centralizar la administración de la plataforma.
- Facilitar la supervisión operativa.
- Permitir la configuración del sistema.
- Administrar usuarios y conductores.
- Gestionar vehículos.
- Supervisar viajes.
- Administrar pagos.
- Configurar tarifas.
- Consultar auditorías.
- Gestionar campañas y promociones.
- Visualizar indicadores operativos.
- Reducir la necesidad de intervención técnica sobre la base de datos.

---

# 3. Responsabilidades

El Administration Domain será responsable de:

- administrar usuarios
- administrar conductores
- administrar vehículos
- administrar viajes
- administrar pagos
- administrar promociones
- administrar tarifas
- consultar auditorías
- administrar notificaciones
- visualizar estadísticas
- configurar parámetros generales
- administrar permisos administrativos

No será responsable de:

- autenticación
- cálculo de tarifas
- asignación de viajes
- procesamiento de pagos
- envío de notificaciones
- almacenamiento de auditorías
- cálculo de reputaciones

Cada dominio continuará siendo propietario exclusivo de su lógica de negocio.

---

# 4. Principios del Dominio

El Administration Domain ha sido diseñado siguiendo los siguientes principios.

---

## Centralización

Toda la administración operativa de la plataforma deberá realizarse desde un único panel.

---

## Seguridad

Todas las operaciones administrativas requerirán autenticación y autorización.

Ningún usuario sin permisos podrá acceder a funciones administrativas.

---

## Trazabilidad

Toda acción ejecutada desde el panel deberá quedar registrada por el Audit Domain.

No existirán operaciones administrativas sin evidencia histórica.

---

## Desacoplamiento

El panel administrativo nunca accederá directamente a la base de datos.

Toda interacción deberá realizarse mediante los servicios expuestos por los diferentes dominios.

---

## Configurabilidad

Los parámetros operativos deberán poder modificarse sin necesidad de desplegar nuevamente la plataforma.

---

## Escalabilidad

La arquitectura permitirá incorporar nuevos módulos administrativos sin afectar los ya existentes.

---

# 5. Conceptos del Dominio

Para comprender el funcionamiento del Administration Domain se definen los siguientes conceptos.

---

## Panel Administrativo

Interfaz principal utilizada por administradores y supervisores para gestionar la plataforma.

Representa el punto único de administración del sistema.

---

## Módulo Administrativo

Cada área funcional del panel será implementada como un módulo independiente.

Ejemplos.

- Usuarios
- Conductores
- Vehículos
- Viajes
- Pagos
- Tarifas
- Promociones
- Auditoría

---

## Configuración

Conjunto de parámetros operativos que podrán modificarse desde el panel.

Ejemplos.

- tarifa base
- multiplicadores
- radios de búsqueda
- tiempos máximos
- ventanas de evaluación

---

## Indicador

Métrica utilizada para supervisar el estado de la plataforma.

Ejemplos.

- viajes diarios
- conductores activos
- pagos realizados
- cancelaciones
- tiempo promedio de respuesta

---

## Operación Administrativa

Toda acción ejecutada por un administrador.

Ejemplos.

- aprobar conductor
- bloquear usuario
- modificar tarifa
- crear promoción
- consultar auditoría

---

# 6. Actores

Dentro del Administration Domain participan los siguientes actores.

---

## Administrador

Dispone de acceso completo a la plataforma.

Podrá administrar todos los módulos disponibles.

---

## Supervisor

Dispondrá de permisos limitados según las políticas de la organización.

Podrá supervisar la operación sin acceder necesariamente a todas las configuraciones.

---

## Operador

Podrá realizar tareas operativas específicas.

Ejemplos.

- aprobar documentos
- responder incidentes
- consultar viajes
- gestionar soporte

---

## Sistema

El sistema podrá ejecutar tareas administrativas automáticas.

Ejemplos.

- generación de reportes
- cierre diario
- mantenimiento
- limpieza de datos temporales
- actualización de estadísticas

---

# 7. Modelo Conceptual

El Administration Domain actúa como el centro de control de la plataforma.

Todos los módulos administrativos operan sobre los diferentes dominios mediante servicios especializados.

Conceptualmente.

```
Administrador

↓

Panel Administrativo

↓

Administration Domain

↓

Servicios

↓

Dominios

↓

Base de Datos
```

El panel nunca accederá directamente a la base de datos.

Toda interacción deberá realizarse mediante los servicios de cada dominio.

---

# 8. Organización del Panel Administrativo

El panel estará dividido en módulos funcionales.

Cada módulo administrará un dominio específico.

```
Dashboard

Usuarios

Conductores

Vehículos

Viajes

Pagos

Tarifas

Promociones

Calificaciones

Notificaciones

Auditoría

Configuración

Reglas Comerciales
```

Cada módulo podrá evolucionar de manera independiente.

---

# 9. Dashboard Ejecutivo

El Dashboard será la pantalla principal del sistema.

Permitirá visualizar el estado general de la plataforma en tiempo real.

Ejemplos de indicadores.

- usuarios registrados
- conductores activos
- viajes del día
- ingresos del día
- ingresos del mes
- viajes en curso
- pagos pendientes
- promociones activas
- incidencias abiertas

También podrá mostrar gráficas históricas.

---

# 10. Gestión de Usuarios

Permitirá administrar completamente los pasajeros registrados.

Funciones principales.

- consultar usuarios
- buscar usuarios
- visualizar perfil
- bloquear usuario
- reactivar usuario
- consultar historial
- consultar viajes
- consultar reputación

El módulo nunca modificará directamente la lógica del Users Domain.

---

# 11. Gestión de Conductores

Permitirá administrar toda la operación relacionada con conductores.

Funciones.

- aprobar registro
- rechazar registro
- suspender conductor
- bloquear conductor
- reactivar conductor
- consultar documentos
- consultar reputación
- consultar vehículos asociados
- consultar historial de viajes

---

# 12. Gestión de Vehículos

Permitirá administrar todos los vehículos registrados.

Funciones.

- aprobar vehículo
- rechazar vehículo
- consultar documentos
- consultar vencimientos
- inhabilitar vehículo
- reactivar vehículo
- consultar historial

También permitirá visualizar alertas por documentos próximos a vencer.

---

# 13. Gestión de Viajes

Permitirá supervisar la operación diaria.

Funciones.

- consultar viajes
- buscar viajes
- visualizar ruta
- consultar conductor
- consultar pasajero
- consultar pagos
- consultar incidencias

El panel no modificará el estado de un viaje salvo en situaciones excepcionales definidas por las políticas operativas.

---

# 14. Gestión Comercial

Este módulo administrará todas las reglas económicas de la plataforma.

Permitirá configurar:

- porcentaje de comisión
- comisiones por ciudad
- comisiones por tipo de conductor
- promociones comerciales
- campañas
- descuentos
- planes de suscripción
- políticas comerciales
- vigencias de las políticas

Todas estas configuraciones estarán desacopladas del código fuente y podrán modificarse desde el panel administrativo sin necesidad de desplegar una nueva versión de la aplicación.

---

# 15. Gestión de Pagos

El módulo de pagos permitirá supervisar todas las transacciones económicas realizadas dentro de la plataforma.

Funciones principales.

- consultar pagos
- buscar pagos
- visualizar comprobantes
- consultar liquidaciones
- consultar comisiones
- consultar reembolsos
- consultar estado del pago
- generar reportes financieros

El módulo consumirá exclusivamente los servicios expuestos por el Payment Domain.

---

# 16. Gestión de Tarifas

Permitirá administrar todas las configuraciones relacionadas con el cálculo del precio de los viajes.

Entre ellas.

- tarifa base
- costo por kilómetro
- costo por minuto
- tarifa mínima
- tarifa máxima
- multiplicadores dinámicos
- tarifas por ciudad
- tarifas especiales

Toda modificación quedará registrada por el Audit Domain.

---

# 17. Gestión de Promociones

Este módulo administrará todas las campañas comerciales de la plataforma.

Permitirá crear promociones como:

- cupones
- descuentos
- campañas temporales
- bonos de bienvenida
- promociones por ciudad
- promociones por horario
- promociones para conductores
- promociones para pasajeros

Cada campaña tendrá:

- fecha de inicio
- fecha de finalización
- estado
- reglas de aplicación
- presupuesto (opcional)

---

# 18. Gestión de Calificaciones

Permitirá consultar la reputación de usuarios y conductores.

Funciones.

- consultar evaluaciones
- consultar comentarios
- visualizar estadísticas
- detectar comportamientos anómalos
- consultar historial
- generar reportes

El módulo será únicamente de consulta.

Las evaluaciones nunca podrán modificarse desde el panel.

---

# 19. Gestión de Notificaciones

Permitirá administrar las comunicaciones enviadas por la plataforma.

Funciones.

- consultar historial
- reenviar notificaciones
- crear campañas
- programar envíos
- visualizar estados
- consultar errores
- administrar plantillas

También permitirá visualizar métricas como:

- enviadas
- entregadas
- leídas
- fallidas

---

# 20. Configuración General

El Administration Domain concentrará la configuración global de la plataforma.

Ejemplos.

- radios máximos de búsqueda
- tiempo máximo de espera
- tiempo máximo para aceptar viajes
- tiempo para cancelar servicios
- ventanas de evaluación
- políticas de documentos
- parámetros de seguridad
- configuración de notificaciones

Toda configuración deberá ser modificable sin necesidad de realizar un despliegue de software.

---

# 21. Gestión de Reglas Comerciales

Uno de los módulos más importantes del sistema será la administración de las políticas comerciales.

Este módulo permitirá configurar completamente el modelo económico de Tachi.

Entre las configuraciones disponibles se encuentran.

- porcentaje de comisión
- comisión fija
- comisión variable
- comisión por ciudad
- comisión por tipo de servicio
- comisión por tipo de conductor
- planes de suscripción
- promociones comerciales
- descuentos especiales
- campañas temporales

Cada política comercial será completamente versionada.

Ejemplo.

```
Política Comercial

↓

Versión

↓

Fecha Inicio

↓

Fecha Fin

↓

Ciudad

↓

Tipo de Servicio

↓

Estado

↓

Prioridad
```

Esto permitirá reconstruir históricamente qué política se encontraba vigente para cualquier viaje realizado.

---

# 22. Reportes y Estadísticas

El panel permitirá generar reportes operativos y financieros.

Ejemplos.

## Operación

- viajes diarios
- viajes mensuales
- cancelaciones
- tiempo promedio de respuesta
- tiempo promedio de espera

---

## Conductores

- conductores activos
- nuevos registros
- documentos próximos a vencer
- reputación promedio

---

## Usuarios

- nuevos usuarios
- usuarios activos
- frecuencia de uso
- crecimiento mensual

---

## Finanzas

- ingresos diarios
- ingresos mensuales
- comisiones generadas
- liquidaciones
- pagos pendientes
- reembolsos

Todos los reportes podrán exportarse en futuras versiones.

---

# 23. Seguridad Administrativa

El Administration Domain implementará un sistema de control de acceso basado en roles (RBAC).

Cada usuario administrativo dispondrá únicamente de los permisos necesarios para desempeñar sus funciones.

El principio de menor privilegio será aplicado en toda la plataforma.

Ningún administrador tendrá permisos implícitos.

Todos los permisos deberán asignarse explícitamente.

---

# 24. Roles Administrativos

Inicialmente la plataforma contemplará los siguientes perfiles administrativos.

---

## Super Administrador

Es el máximo nivel de acceso del sistema.

Podrá administrar completamente la plataforma.

Funciones.

- administrar administradores
- configurar la plataforma
- modificar políticas comerciales
- consultar auditorías
- administrar permisos
- administrar todos los módulos

---

## Administrador

Responsable de la operación general.

Podrá administrar.

- usuarios
- conductores
- vehículos
- viajes
- promociones
- notificaciones

No podrá modificar configuraciones críticas del sistema.

---

## Supervisor

Responsable del seguimiento operativo.

Podrá.

- consultar información
- aprobar documentos
- gestionar incidencias
- monitorear viajes
- consultar reportes

No podrá modificar configuraciones financieras.

---

## Operador

Perfil orientado al soporte operativo.

Ejemplos.

- revisar documentos
- responder solicitudes
- consultar historial
- gestionar soporte

Dispondrá de permisos limitados.

---

## Analista Financiero

Especializado en la operación económica.

Podrá administrar.

- pagos
- liquidaciones
- comisiones
- reportes financieros
- políticas comerciales (solo consulta)

No tendrá acceso a módulos operativos.

---

# 25. Modelo de Permisos

Cada módulo podrá definir permisos independientes.

Ejemplo.

```
Usuarios

↓

Ver

Crear

Editar

Eliminar

Bloquear

Reactivar
```

Lo mismo aplicará para todos los módulos.

Ejemplo.

```
Vehículos

↓

Ver

Aprobar

Rechazar

Suspender

Reactivar
```

De esta forma un mismo rol podrá tener permisos distintos para cada módulo.

---

# 26. Permisos Granulares

Los permisos estarán organizados por acción.

Ejemplos.

```
VIEW

CREATE

UPDATE

DELETE

APPROVE

REJECT

EXPORT

CONFIGURE
```

Este diseño permitirá crear perfiles completamente personalizados.

---

# 27. Acciones Críticas

Algunas operaciones requerirán mecanismos adicionales de seguridad.

Ejemplos.

- eliminar registros
- modificar comisiones
- cambiar tarifas
- bloquear conductores
- suspender usuarios
- modificar políticas comerciales
- administrar permisos

Estas acciones podrán requerir:

- confirmación adicional
- reautenticación
- doble validación
- registro obligatorio en auditoría

---

# 28. Registro Obligatorio de Auditoría

Toda operación administrativa generará automáticamente un evento para el Audit Domain.

Ejemplo.

```
Administrador

↓

Aprueba Conductor

↓

Administration Domain

↓

Audit Domain
```

La auditoría almacenará información como.

- usuario administrador
- fecha
- hora
- dirección IP
- módulo
- acción
- recurso afectado
- resultado

Esto garantizará trazabilidad completa.

---

# 29. Gestión de Sesiones Administrativas

Las sesiones administrativas tendrán controles más estrictos que las sesiones normales.

Entre ellos.

- expiración automática
- cierre por inactividad
- invalidación remota
- control de múltiples sesiones
- registro de dispositivos

En futuras versiones podrán incorporarse mecanismos de autenticación multifactor (MFA).

---

# 30. Protección contra Errores Humanos

El panel implementará mecanismos para reducir operaciones accidentales.

Ejemplos.

Antes de ejecutar una acción crítica.

```
Eliminar Usuario

↓

¿Está seguro?

↓

Confirmar
```

Para operaciones de alto impacto podrá solicitarse una segunda confirmación o la introducción de la contraseña del administrador.

---

# 31. Integración con otros Dominios

El Administration Domain constituye el punto central de administración de la plataforma.

Su responsabilidad consiste en consumir los servicios expuestos por los demás dominios sin reemplazar su lógica de negocio.

---

## Integración con Auth Domain

Permitirá administrar el acceso de los usuarios administrativos.

Entre sus funciones.

- administración de administradores
- asignación de roles
- bloqueo de cuentas
- reactivación
- gestión de sesiones

---

## Integración con Users Domain

Permitirá consultar y administrar pasajeros.

Ejemplos.

- búsqueda
- consulta de perfiles
- bloqueo
- reactivación
- historial

---

## Integración con Driver Domain

Permitirá administrar conductores.

Ejemplos.

- aprobación
- rechazo
- suspensión
- consulta documental
- consulta de reputación

---

## Integración con Vehicle Domain

Permitirá supervisar todos los vehículos registrados.

Funciones.

- aprobación
- rechazo
- consulta documental
- vencimientos
- historial

---

## Integración con Trip Domain

Permitirá supervisar toda la operación de viajes.

Funciones.

- consulta
- seguimiento
- incidencias
- estadísticas
- soporte operativo

---

## Integración con Payment Domain

Permitirá administrar la información financiera.

Ejemplos.

- pagos
- liquidaciones
- comisiones
- reembolsos
- estados financieros

---

## Integración con Pricing Domain

Permitirá administrar las políticas de tarifas.

Ejemplos.

- tarifa base
- multiplicadores
- reglas dinámicas
- precios por ciudad

---

## Integración con Rating Domain

Permitirá consultar información relacionada con la reputación.

Ejemplos.

- historial
- comentarios
- estadísticas
- indicadores

---

## Integración con Notification Domain

Permitirá administrar la comunicación institucional.

Ejemplos.

- campañas
- plantillas
- programación
- seguimiento

---

## Integración con Audit Domain

Toda acción administrativa será registrada automáticamente.

No existirá ninguna operación administrativa sin auditoría.

---

# 32. Roadmap del Dominio

El Administration Domain ha sido diseñado para evolucionar junto con el crecimiento de la plataforma.

Entre las funcionalidades previstas para futuras versiones se encuentran las siguientes.

---

## Dashboard Inteligente

El panel podrá mostrar indicadores personalizados según el rol del administrador.

Ejemplos.

- financiero
- operaciones
- soporte
- dirección

---

## Constructor de Reportes

Permitirá crear reportes personalizados mediante filtros dinámicos.

Ejemplos.

- por ciudad
- por conductor
- por fecha
- por estado
- por vehículo

---

## Centro de Incidentes

Se incorporará un módulo especializado para administrar incidentes operativos.

Ejemplos.

- reclamaciones
- accidentes
- fraudes
- conflictos
- investigaciones

---

## Gestión Documental

Permitirá administrar documentos internos.

Ejemplos.

- manuales
- procedimientos
- políticas
- contratos
- formatos

---

## Automatización

El panel podrá ejecutar tareas automáticas.

Ejemplos.

- cierre diario
- generación de reportes
- envío de correos
- actualización de indicadores
- limpieza de información temporal

---

## Inteligencia Artificial

En futuras versiones podrán incorporarse asistentes inteligentes para apoyar la administración.

Ejemplos.

- generación automática de reportes
- detección de anomalías
- recomendaciones comerciales
- predicción de demanda
- análisis financiero

---

# 33. Visión del Backoffice

El objetivo del Administration Domain no consiste únicamente en ofrecer un panel administrativo.

Su propósito es convertirse en el centro de operaciones de Tachi.

Desde este dominio será posible administrar completamente la plataforma sin necesidad de acceder directamente a la infraestructura técnica.

Todas las decisiones operativas, comerciales y administrativas deberán poder ejecutarse desde este entorno de forma segura, auditable y escalable.

---

# 34. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Administration Domain |

---

# Conclusión

El Administration Domain constituye el núcleo administrativo de la plataforma Tachi.

Su arquitectura ha sido diseñada para proporcionar un entorno unificado desde el cual sea posible supervisar, administrar y configurar todos los componentes de la plataforma sin comprometer la independencia de los demás dominios.

Gracias a su integración con los diferentes dominios funcionales, al modelo de permisos granulares, al registro obligatorio de auditoría y a la configuración dinámica de las reglas comerciales, el panel administrativo permitirá operar la plataforma de manera segura, flexible y escalable.

Este diseño establece las bases para que Tachi evolucione desde un MVP hasta una plataforma empresarial capaz de soportar múltiples ciudades, equipos operativos, modelos comerciales y procesos administrativos complejos.

---