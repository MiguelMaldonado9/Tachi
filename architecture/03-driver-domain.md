# 03. Driver Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 03-driver-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Driver Domain administra el ciclo de vida completo de los conductores registrados en la plataforma Tachi.

Este dominio representa uno de los componentes más importantes del sistema, ya que controla quién puede prestar servicios de transporte dentro de la plataforma y bajo qué condiciones.

Su responsabilidad principal consiste en administrar toda la información profesional del conductor, validar que cumpla los requisitos exigidos por la operación, controlar la vigencia de su documentación y garantizar que únicamente los conductores habilitados puedan recibir solicitudes de viaje.

El dominio mantiene independencia respecto a la autenticación del usuario, la administración de vehículos y la gestión de viajes, permitiendo una arquitectura desacoplada y altamente mantenible.

---

# 2. Objetivos

El Driver Domain tiene como objetivos principales:

- Registrar perfiles profesionales de conductores.
- Administrar la información operativa del conductor.
- Validar documentación obligatoria.
- Controlar fechas de vencimiento.
- Gestionar estados operativos.
- Autorizar la recepción de viajes.
- Mantener historial operativo.
- Facilitar procesos de auditoría.
- Permitir futuras integraciones con otros dominios.

---

# 3. Alcance

Este dominio administra exclusivamente la información profesional del conductor.

Incluye:

- Perfil profesional.
- Estado operativo.
- Disponibilidad.
- Información laboral.
- Documentación.
- Historial.
- Validaciones.
- Auditoría.

No administra:

- Autenticación.
- Usuarios.
- Vehículos.
- Viajes.
- Pagos.
- Promociones.
- Notificaciones.

Cada uno de estos procesos pertenece a su correspondiente dominio.

---

# 4. Lenguaje del Dominio (Ubiquitous Language)

Con el fin de mantener consistencia en todo el proyecto, los siguientes términos tendrán un significado único dentro del sistema.

| Término       | Definición |
|---------------|------------|
| Conductor    | Persona autorizada para prestar servicios de transporte dentro de la plataforma. |
| Perfil Profesional | Información operativa del conductor independiente de su autenticación. |
| Documento | Archivo oficial requerido para validar la operación del conductor. |
| Documento Vigente | Documento cuya fecha de vencimiento aún no ha expirado. |
| Documento Vencido | Documento cuya fecha de expiración ya fue alcanzada. |
| Documento Rechazado | Documento que no cumple las políticas de validación. |
| Documento Aprobado | Documento aceptado por un supervisor. |
| Disponibilidad | Estado temporal que indica si el conductor desea recibir viajes. |
| Estado Operativo | Estado general del conductor dentro del sistema. |
| Vehículo Asignado | Vehículo actualmente asociado al conductor. |
| Historial | Registro cronológico de eventos importantes ocurridos sobre el conductor. |
| Supervisor | Usuario con permisos para revisar documentación y aprobar conductores. |

---

# 5. Modelo Conceptual

El Driver Domain se organiza alrededor del conductor como entidad principal.

```

```
                           DRIVER

                              │

        ┌─────────────────────┼─────────────────────┐

        │                     │                     │

 Perfil Profesional     Estado Operativo     Disponibilidad

        │                     │                     │

        │                     │                     │

 Documentación          Revisiones          Vehículo Asignado

        │                     │                     │

        └─────────────────────┼─────────────────────┘

                              │

                         Historial

                              │

                     Solicitudes de Viaje
```


Este modelo representa únicamente relaciones conceptuales del negocio.

No corresponde a la estructura física de la base de datos.

---

# 6. Responsabilidades del Dominio

El Driver Domain es responsable de:

## Gestión Profesional

- Crear perfiles profesionales.
- Actualizar información del conductor.
- Administrar información pública.

---

## Gestión Documental

- Registrar documentos.
- Validar documentos.
- Controlar fechas de vencimiento.
- Detectar documentos expirados.
- Solicitar actualización documental.

---

## Gestión Operativa

- Cambiar estados del conductor.
- Controlar disponibilidad.
- Autorizar recepción de viajes.
- Suspender conductores.
- Reactivar conductores.

---

## Auditoría

Registrar eventos importantes relacionados con:

- Creación.
- Actualización.
- Suspensiones.
- Bloqueos.
- Aprobaciones.
- Rechazos.
- Reactivaciones.

---

# 7. Ciclo de Vida del Conductor

Todo conductor dentro de Tachi seguirá el siguiente ciclo de vida.

```

```
                    REGISTRO

                        │

                        ▼

              DOCUMENTOS_PENDIENTES

                        │

          Documentación cargada

                        │

                        ▼

                  EN_REVISION

                        │

        Supervisor aprueba documentos

                        │

                        ▼

                    APROBADO

                        │

                        ▼

                     ACTIVO

                        │

         Conductor habilita disponibilidad

                        │

                        ▼

                  DISPONIBLE

                        │

               Recibe un viaje

                        │

                        ▼

                  EN_SERVICIO

                        │

             Finaliza el viaje

                        │

                        ▼

                  DISPONIBLE

                        │

────────────────────────────────────────────

      Si algún documento vence

                        │

                        ▼

             DOCUMENTO_VENCIDO

                        │

      No puede recibir servicios

                        │

      Carga documento actualizado

                        │

                        ▼

                 EN_REVISION

                        │

      Supervisor aprueba nuevamente

                        │

                        ▼

                     ACTIVO

────────────────────────────────────────────

      Si existe una sanción administrativa

                        │

                        ▼

                  SUSPENDIDO

                        │

          Levantamiento sanción

                        │

                        ▼

                     ACTIVO

────────────────────────────────────────────

      Si existe una falta grave

                        │

                        ▼

                   BLOQUEADO

                        │

      Solo un administrador podrá desbloquear
```


Este flujo representa el comportamiento esperado del conductor durante toda su permanencia dentro de la plataforma.

Las transiciones entre estados deberán implementarse respetando estrictamente las reglas de negocio definidas por este documento.

---

# 8. Máquina de Estados del Conductor

El Driver Domain implementa una máquina de estados finita (Finite State Machine - FSM) para controlar el comportamiento operativo de cada conductor.

Un conductor únicamente podrá encontrarse en uno de los estados definidos por este documento.

No existen estados implícitos ni transiciones automáticas fuera de las aquí especificadas.

---

## Estados Oficiales

| Estado | Descripción |
|----------|------------|
| DOCUMENTS_PENDING | El conductor aún no ha cargado toda la documentación requerida. |
| IN_REVIEW | La documentación está siendo revisada por un supervisor. |
| APPROVED | Toda la documentación fue aprobada y el conductor puede ser activado. |
| ACTIVE | El conductor pertenece oficialmente a la plataforma. |
| AVAILABLE | Está disponible para recibir viajes. |
| ON_TRIP | Actualmente ejecuta un viaje. |
| OFFLINE | Se encuentra desconectado voluntariamente. |
| DOCUMENT_EXPIRED | Algún documento obligatorio ha expirado. |
| SUSPENDED | Suspendido temporalmente por razones administrativas. |
| BLOCKED | Bloqueado permanentemente hasta intervención administrativa. |

---

## Transiciones Permitidas

DOCUMENTS_PENDING

↓

IN_REVIEW

↓

APPROVED

↓

ACTIVE

↓

AVAILABLE

↓

ON_TRIP

↓

AVAILABLE

---

ACTIVE

↓

OFFLINE

↓

ACTIVE

---

ACTIVE

↓

DOCUMENT_EXPIRED

↓

IN_REVIEW

↓

ACTIVE

---

ACTIVE

↓

SUSPENDED

↓

ACTIVE

---

ACTIVE

↓

BLOCKED

---

No se permitirán transiciones que no estén expresamente definidas.

---

# 9. Reglas de Negocio

Las siguientes reglas constituyen la especificación oficial del Driver Domain.

Toda implementación deberá respetarlas.

---

## RN-001

Un usuario únicamente podrá tener un perfil de conductor.

---

## RN-002

Un conductor deberá existir previamente como usuario autenticado.

---

## RN-003

No podrá crearse un conductor sin un usuario asociado.

---

## RN-004

El correo electrónico del conductor será administrado exclusivamente por el Authentication Domain.

---

## RN-005

Toda modificación del nombre o fotografía deberá sincronizarse con el User Domain.

---

## RN-006

Un conductor no podrá recibir viajes mientras permanezca en alguno de los siguientes estados:

- DOCUMENTS_PENDING
- IN_REVIEW
- DOCUMENT_EXPIRED
- SUSPENDED
- BLOCKED
- OFFLINE

---

## RN-007

Solo los conductores en estado AVAILABLE podrán participar en el algoritmo de asignación de viajes.

---

## RN-008

Al aceptar un viaje el estado cambiará automáticamente a:

ON_TRIP

---

## RN-009

Al finalizar un viaje el estado volverá automáticamente a:

AVAILABLE

si el conductor mantiene activada su disponibilidad.

En caso contrario cambiará a:

OFFLINE

---

## RN-010

Un conductor bloqueado nunca podrá volver automáticamente a ACTIVE.

Su reactivación requerirá autorización administrativa.

---

## RN-011

Los documentos vencidos deshabilitan inmediatamente la operación del conductor.

No existe período de gracia.

---

## RN-012

La carga de un documento nuevo no reactiva automáticamente al conductor.

Siempre deberá pasar nuevamente por revisión.

---

## RN-013

El historial operativo nunca podrá eliminarse.

---

## RN-014

Todo cambio de estado deberá generar un evento de auditoría.

---

## RN-015

La eliminación física de un conductor no estará permitida.

Únicamente podrá utilizarse desactivación lógica.

---

# 10. Validaciones Automáticas

El sistema ejecutará validaciones automáticas sobre los documentos del conductor.

---

## Licencia de Conducción

Validaciones:

- Fecha de vencimiento.
- Número de licencia.
- Estado del documento.
- Integridad del archivo.

Si la licencia vence:

DOCUMENT_EXPIRED

---

## Documento de Identidad

Validaciones:

- Existencia.
- Integridad.
- Legibilidad.

---

## Antecedentes

Podrán integrarse en versiones futuras mediante servicios externos.

---

## Fotografía

La fotografía deberá cumplir requisitos mínimos de calidad.

---

## Validaciones Programadas

El sistema ejecutará tareas automáticas diariamente para:

- Detectar documentos vencidos.
- Detectar documentos próximos a vencer.
- Generar notificaciones.
- Actualizar estados.

---

# 11. Modelo de Datos Conceptual

El Driver Domain se organiza alrededor de la entidad Driver.

Driver

├── Información Profesional

├── Estado

├── Disponibilidad

├── Documentos

├── Historial

├── Vehículo Actual

└── Auditoría

La implementación física podrá dividir esta información en múltiples tablas sin alterar el modelo conceptual.

---

# 12. Relación con otros Dominios

## Authentication

Obtiene:

- identidad
- auth_id

No administra autenticación.

---

## Users

Comparte:

- nombre
- fotografía
- teléfono

---

## Vehicles

Un conductor podrá operar distintos vehículos durante su permanencia en la plataforma.

La asignación del vehículo será administrada exclusivamente por el Vehicle Domain.

El Driver Domain únicamente conocerá cuál es el vehículo activo en un momento determinado.

---

## Trips

El Driver Domain informa:

- disponibilidad
- estado
- ubicación operativa

El Trip Domain decide la asignación del servicio.

---

## Audit

Todo evento relevante será registrado automáticamente.

Ejemplos:

- creación
- aprobación
- suspensión
- bloqueo
- documentos vencidos
- reactivaciones

---

# 13. Casos de Uso

El Driver Domain soporta los siguientes casos de uso.

---

## CU-001 Registrar Conductor

Actor:

- Usuario

Descripción:

Permite crear el perfil profesional del conductor asociado a un usuario previamente autenticado.

Resultado:

Estado inicial:

DOCUMENTS_PENDING

---

## CU-002 Actualizar Información Profesional

Actor:

- Conductor

Permite actualizar información pública como:

- teléfono
- fotografía
- información de contacto

No permite modificar:

- correo
- identidad
- autenticación

---

## CU-003 Cargar Documentación

Actor:

- Conductor

Permite cargar documentos obligatorios.

Al finalizar la carga:

Estado:

IN_REVIEW

---

## CU-004 Aprobar Documentación

Actor:

- Supervisor

Resultado:

APPROVED

Posteriormente:

ACTIVE

---

## CU-005 Rechazar Documentación

Actor:

- Supervisor

Resultado:

DOCUMENTS_PENDING

El conductor deberá cargar nuevamente los documentos.

---

## CU-006 Activar Disponibilidad

Actor:

- Conductor

Precondiciones:

- Estado ACTIVE
- Documentación vigente
- Vehículo asignado (cuando el Vehicle Domain esté implementado)

Resultado:

AVAILABLE

---

## CU-007 Desactivar Disponibilidad

Actor:

- Conductor

Resultado:

OFFLINE

---

## CU-008 Inicio de Viaje

Actor:

- Sistema

Resultado:

ON_TRIP

---

## CU-009 Finalización de Viaje

Actor:

- Sistema

Resultado:

AVAILABLE

o

OFFLINE

dependiendo de la preferencia del conductor.

---

## CU-010 Suspender Conductor

Actor:

- Administrador

Resultado:

SUSPENDED

---

## CU-011 Bloquear Conductor

Actor:

- Administrador

Resultado:

BLOCKED

---

## CU-012 Reactivar Conductor

Actor:

- Supervisor
- Administrador

Precondiciones:

- Documentación aprobada
- Sin sanciones activas

Resultado:

ACTIVE

---

# 14. Eventos del Dominio

El Driver Domain publicará eventos para permitir integración con otros dominios.

Inicialmente se contemplan los siguientes eventos.

---

DriverCreated

Se genera al crear un nuevo perfil profesional.

Consumidores potenciales:

- Audit
- Notifications

---

DriverApproved

Se genera cuando un supervisor aprueba al conductor.

Consumidores:

- Notifications
- Trips

---

DriverRejected

Indica rechazo documental.

Consumidores:

- Notifications

---

DriverActivated

El conductor queda habilitado para operar.

Consumidores:

- Trips
- Notifications

---

DriverAvailable

El conductor entra en disponibilidad.

Consumidores:

- Trips

---

DriverUnavailable

El conductor deja de recibir viajes.

Consumidores:

- Trips

---

DriverSuspended

Consumidores:

- Audit
- Notifications

---

DriverBlocked

Consumidores:

- Audit

---

DriverDocumentExpired

Consumidores:

- Notifications
- Audit

---

DriverReactivated

Consumidores:

- Trips
- Notifications

---

# 15. Consideraciones para Futuras Integraciones

El Driver Domain ha sido diseñado para soportar nuevas capacidades sin romper la arquitectura existente.

Entre las funcionalidades previstas se encuentran:

---

## Integración con Vehicles

Un conductor podrá utilizar distintos vehículos durante su permanencia en la plataforma.

El historial de asignaciones será administrado por el Vehicle Domain.

El Driver Domain únicamente conocerá cuál es el vehículo actualmente activo.

---

## Integración con Maps

Obtención de ubicación en tiempo real.

Estados GPS.

Última conexión.

---

## Integración con Trips

Historial de viajes.

Cantidad de servicios.

Tiempo conectado.

Tiempo en línea.

Tiempo en servicio.

---

## Integración con Payments

Liquidaciones.

Comisiones.

Ganancias.

Bonificaciones.

---

## Integración con Ratings

Calificación promedio.

Número de evaluaciones.

Historial.

---

## Integración con Notifications

Recordatorios automáticos de:

- documentos próximos a vencer
- documentos vencidos
- suspensión
- aprobación

---

## Integraciones Externas

En futuras versiones podrán integrarse servicios gubernamentales para validar:

- Licencias.
- SOAT.
- Revisión técnico-mecánica.
- Antecedentes.
- Identidad.

---

# 16. Principios de Diseño

El Driver Domain fue diseñado siguiendo los siguientes principios arquitectónicos.

---

## Responsabilidad Única

Cada componente tendrá una única responsabilidad.

---

## Bajo Acoplamiento

El dominio no dependerá internamente de otros dominios.

Las integraciones se realizarán mediante interfaces o eventos.

---

## Alta Cohesión

Toda lógica relacionada con conductores permanecerá dentro del Driver Domain.

---

## Escalabilidad

La arquitectura permitirá incorporar nuevas funcionalidades sin modificar las existentes.

---

## Auditabilidad

Toda acción importante deberá quedar registrada.

---

## Seguridad

Ningún conductor podrá operar sin cumplir las reglas documentales definidas por este documento.

---

# 17. Roadmap

Las siguientes funcionalidades forman parte de la evolución prevista del Driver Domain.

## Versión 1

- Registro de conductores.
- Documentación.
- Estados.
- Disponibilidad.

---

## Versión 2

- Historial documental.
- Múltiples vehículos.
- Auditoría completa.

---

## Versión 3

- Validaciones automáticas externas.
- IA para revisión documental.
- Recordatorios inteligentes.
- Panel avanzado para supervisores.

---

## Versión 4

- Integración con entidades gubernamentales.
- Firma electrónica.
- Verificación biométrica.
- Renovación automática documental.

---

# 18. Control del Documento

| Campo | Valor |
|-------|--------|
| Documento | 03-driver-domain.md |
| Dominio | Driver |
| Estado | Aprobado |
| Versión | 1.0 |
| Responsable | Equipo de Arquitectura - Tachi |

---

# Conclusiones

El Driver Domain constituye el núcleo operativo de la plataforma Tachi.

Su diseño establece un modelo desacoplado, escalable y orientado al dominio, donde la autenticación, los vehículos, los viajes y los pagos permanecen independientes, comunicándose mediante contratos bien definidos.

Este documento representa la especificación oficial del dominio y deberá servir como referencia para cualquier modificación futura del modelo de negocio o de la implementación técnica.

Toda modificación funcional deberá actualizar primero este documento antes de reflejarse en el código fuente o en la base de datos.