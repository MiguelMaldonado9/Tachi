# 06. Vehicle Domain

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 06-vehicle-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Vehicle Domain es el dominio responsable de administrar toda la información relacionada con los vehículos que participan en la plataforma Tachi.

Su objetivo principal consiste en garantizar que únicamente los vehículos que cumplen las condiciones operativas, técnicas y legales puedan participar en la prestación del servicio de transporte.

Este dominio centraliza las reglas relacionadas con la documentación del vehículo, su estado operativo, disponibilidad, características técnicas y asociación con los conductores.

De esta manera, el resto de la plataforma podrá consultar el estado de un vehículo sin conocer la lógica utilizada para determinar si dicho vehículo puede o no prestar servicio.

El Vehicle Domain constituye una pieza fundamental para la seguridad de la plataforma, ya que evita que vehículos con documentación vencida, bloqueados o fuera de servicio puedan ser asignados a un viaje.

---

# 2. Objetivos

El Vehicle Domain tiene como objetivos principales:

- Administrar la información de los vehículos.
- Gestionar la documentación obligatoria.
- Validar la vigencia de los documentos.
- Controlar el estado operativo del vehículo.
- Mantener la relación entre conductores y vehículos.
- Garantizar que únicamente vehículos habilitados participen en el sistema.
- Proveer información confiable al Trip Engine.
- Facilitar futuras ampliaciones relacionadas con inspecciones, mantenimientos y seguros adicionales.

---

# 3. Responsabilidades

El Vehicle Domain será responsable exclusivamente de las operaciones relacionadas con los vehículos.

Entre sus responsabilidades se encuentran:

- Registrar vehículos.
- Actualizar información del vehículo.
- Gestionar documentos obligatorios.
- Validar fechas de vencimiento.
- Administrar estados del vehículo.
- Controlar disponibilidad.
- Asociar vehículos a conductores.
- Determinar el vehículo activo de cada conductor.
- Informar si un vehículo está habilitado para prestar servicio.

No será responsabilidad del Vehicle Domain administrar:

- autenticación
- perfiles de usuario
- documentos personales del conductor
- asignación de viajes
- pagos
- promociones
- calificaciones

Estas responsabilidades pertenecen a sus respectivos dominios.

---

# 4. Principios del Dominio

El diseño del Vehicle Domain se fundamenta en los siguientes principios.

---

## Independencia

La información del vehículo deberá mantenerse completamente separada de la información del conductor.

Un conductor podrá cambiar de vehículo sin modificar su perfil.

---

## Seguridad

Ningún vehículo podrá prestar servicio si incumple cualquiera de los requisitos legales definidos por la plataforma.

---

## Integridad

Toda modificación realizada sobre un vehículo deberá conservar la consistencia de la información registrada.

---

## Escalabilidad

El modelo deberá permitir incorporar nuevos documentos, inspecciones o certificaciones sin modificar la estructura principal del dominio.

---

## Trazabilidad

Todas las modificaciones importantes deberán registrarse para procesos de auditoría.

---

## Desacoplamiento

Los demás dominios únicamente consultarán el estado final del vehículo.

Nunca conocerán la lógica interna utilizada para determinar su disponibilidad.

---

# 5. Conceptos del Dominio

Para comprender correctamente este dominio se definen los siguientes conceptos.

---

## Vehículo

Representa el medio de transporte autorizado para prestar servicios dentro de la plataforma.

Cada vehículo posee identidad propia y puede ser asociado a uno o varios conductores a lo largo de su ciclo de vida.

---

## Vehículo Activo

Es el vehículo que un conductor utilizará durante la prestación del servicio.

Aunque un conductor pueda tener varios vehículos registrados, únicamente uno podrá encontrarse activo al mismo tiempo.

---

## Disponibilidad

Condición que determina si un vehículo puede participar en la operación.

La disponibilidad dependerá del cumplimiento de todas las reglas definidas por este dominio.

---

## Documentación

Conjunto de documentos obligatorios exigidos para que un vehículo pueda prestar servicio.

---

## Estado Operativo

Representa la condición actual del vehículo dentro de la plataforma.

El estado operativo determinará si el vehículo puede ser considerado por el Trip Engine durante el proceso de asignación.

---

## Asociación

Relación existente entre un conductor y un vehículo.

Esta asociación será independiente de la disponibilidad del vehículo.

---

# 6. Actores

En este dominio participan los siguientes actores.

---

## Conductor

Responsable de registrar y administrar los vehículos asociados a su cuenta.

Podrá:

- registrar vehículos
- actualizar información
- cargar documentos
- seleccionar el vehículo activo

---

## Administrador

Responsable de supervisar y validar la información registrada.

Podrá:

- bloquear vehículos
- aprobar documentación
- consultar historial
- realizar auditorías

---

## Sistema

Responsable de ejecutar validaciones automáticas.

Entre ellas:

- verificar vencimientos
- actualizar estados
- controlar disponibilidad
- emitir eventos

---

## Trip Engine

Consumidor principal de este dominio.

Su única responsabilidad será consultar si un vehículo está habilitado para prestar servicio.

El Trip Engine nunca validará directamente documentos, seguros o fechas de vencimiento.

Toda esa lógica permanecerá encapsulada dentro del Vehicle Domain.

---

# 7. Modelo Conceptual

El Vehicle Domain administra la información de cada vehículo registrado dentro de la plataforma.

Conceptualmente un vehículo estará compuesto por los siguientes elementos.

```
Vehículo

│

├── Identificación

│      ├── Marca
│      ├── Modelo
│      ├── Año
│      ├── Color
│      ├── Placa

│

├── Información Técnica

│      ├── Tipo
│      ├── Capacidad
│      ├── Combustible
│      ├── Transmisión

│

├── Documentación

│      ├── SOAT
│      ├── Tecnomecánica
│      ├── Tarjeta de Propiedad

│

├── Estado

│      ├── Operativo
│      ├── Disponible
│      ├── Vehículo Activo

│

└── Asociación

       └── Conductor
```

Cada uno de estos componentes representa una responsabilidad claramente definida dentro del dominio.

---

# 8. Ciclo de Vida del Vehículo

Todo vehículo registrado dentro de la plataforma recorrerá un ciclo de vida desde su creación hasta su retiro definitivo.

```
Registrado

↓

Pendiente de Validación

↓

Activo

↓

En Operación

↓

Mantenimiento

↓

Activo

↓

Suspendido

↓

Bloqueado

↓

Retirado
```

Cada transición representa un cambio importante dentro del estado operativo del vehículo.

---

## Registro

El conductor registra un nuevo vehículo proporcionando toda la información básica.

Durante esta etapa aún no podrá prestar servicios.

---

## Validación

El sistema verifica que toda la documentación requerida se encuentre disponible y vigente.

Hasta finalizar esta validación el vehículo permanecerá fuera del proceso de asignación.

---

## Activación

Cuando todas las validaciones son satisfactorias el vehículo cambia al estado:

```
ACTIVE
```

Desde este momento podrá ser seleccionado por el Trip Engine.

---

## Operación

Mientras permanezca activo el vehículo podrá participar normalmente en la prestación del servicio.

---

## Mantenimiento

Si el vehículo entra en mantenimiento preventivo o correctivo dejará temporalmente de recibir viajes.

---

## Suspensión

El vehículo podrá ser suspendido por diferentes motivos administrativos.

Durante este estado permanecerá completamente fuera de operación.

---

## Bloqueo

Representa una restricción grave.

Ejemplos:

- documentos vencidos
- fraude
- inconsistencias
- incumplimiento normativo

---

## Retiro

Estado permanente.

El vehículo deja de pertenecer a la plataforma.

No podrá volver a utilizarse salvo un nuevo proceso de registro.

---

# 9. Estados del Vehículo

Los estados representan la condición operacional del vehículo.

```text
PENDING

ACTIVE

IN_MAINTENANCE

SUSPENDED

BLOCKED

RETIRED
```

---

## PENDING

Estado inicial.

Características.

- recién registrado
- documentación pendiente
- no recibe viajes

---

## ACTIVE

Estado normal de operación.

Características.

- documentación vigente
- habilitado
- disponible para matching

Este será el único estado aceptado por el Trip Engine.

---

## IN_MAINTENANCE

El vehículo se encuentra fuera de servicio debido a procesos de mantenimiento.

Características.

- no participa en matching
- puede volver a ACTIVE

---

## SUSPENDED

Estado temporal impuesto por procesos administrativos.

Ejemplos.

- investigaciones
- documentación pendiente
- inconsistencias menores

No podrá prestar servicio.

---

## BLOCKED

Estado crítico.

Ejemplos.

- documentos vencidos
- fraude
- problemas legales
- decisiones administrativas

Un vehículo bloqueado nunca podrá participar en el algoritmo de asignación.

---

## RETIRED

Estado permanente.

Representa un vehículo que deja definitivamente la plataforma.

No podrá volver a utilizarse.

---

# 10. Máquina de Estados

La siguiente máquina define las transiciones permitidas.

```
                +-------------+
                |  PENDING    |
                +-------------+
                       |
                       |
                       v
                +-------------+
                |   ACTIVE    |
                +-------------+
                  |    |     |
                  |    |     |
                  |    |     +----------------+
                  |    |                      |
                  |    v                      |
                  |  IN_MAINTENANCE           |
                  |    |                      |
                  +----+----------------------+
                  |
                  v
             SUSPENDED
                  |
                  v
              BLOCKED
                  |
                  v
              RETIRED
```

No todas las transiciones estarán permitidas.

El dominio será responsable de validar cada cambio de estado.

---

# 11. Documentación Obligatoria

Para que un vehículo pueda prestar servicio deberá mantener vigente toda la documentación exigida por la legislación colombiana y por las políticas internas de la plataforma.

Inicialmente el sistema administrará los siguientes documentos.

---

## SOAT

Seguro Obligatorio de Accidentes de Tránsito.

Información registrada:

- Número
- Fecha de expedición
- Fecha de vencimiento
- Entidad aseguradora
- Estado

---

## Certificado de Revisión Técnico-Mecánica

Documento que certifica las condiciones mecánicas y ambientales del vehículo.

Información registrada:

- Número
- Fecha de expedición
- Fecha de vencimiento
- Centro de Diagnóstico Automotor
- Estado

---

## Tarjeta de Propiedad

Documento que acredita la propiedad del vehículo.

Información registrada:

- Número
- Titular
- Estado

---

## Documentación futura

La arquitectura permitirá incorporar posteriormente nuevos documentos sin modificar el modelo principal.

Ejemplos:

- Seguro Todo Riesgo
- Seguro Contractual
- Seguro Extracontractual
- Inspección Vehicular
- Certificados Municipales
- Permisos Especiales

---

# 12. Reglas de Negocio

El Vehicle Domain será el único responsable de determinar si un vehículo puede participar en la operación.

Todas las decisiones deberán basarse en reglas claramente definidas.

---

## Regla 1

Un vehículo únicamente podrá participar en la plataforma si su estado es:

```
ACTIVE
```

---

## Regla 2

El SOAT deberá encontrarse vigente.

Si la fecha actual supera la fecha de vencimiento:

- el vehículo dejará de operar
- no recibirá viajes
- se emitirá un evento de vencimiento

---

## Regla 3

La revisión técnico-mecánica deberá encontrarse vigente.

En caso contrario:

- el vehículo será bloqueado automáticamente
- dejará de participar en el algoritmo de matching

---

## Regla 4

Todo vehículo deberá encontrarse asociado al menos a un conductor.

---

## Regla 5

Un vehículo retirado nunca podrá volver al estado ACTIVE.

Su reutilización requerirá un nuevo proceso de registro.

---

## Regla 6

Toda modificación relevante deberá quedar registrada para procesos de auditoría.

---

## Regla 7

Un vehículo suspendido no podrá participar en ningún viaje.

---

## Regla 8

Un vehículo bloqueado permanecerá fuera de operación hasta que un administrador autorice nuevamente su activación.

---

# 13. Vehículo Activo

Un conductor podrá registrar varios vehículos dentro de la plataforma.

Ejemplo:

```
Juan Pérez

↓

Mazda 2

↓

Toyota Corolla

↓

Renault Logan
```

Sin embargo únicamente uno podrá encontrarse marcado como:

```
ACTIVE VEHICLE
```

Este será el vehículo utilizado durante la prestación del servicio.

El cambio de vehículo activo podrá realizarse desde la aplicación del conductor siempre que el nuevo vehículo cumpla todas las reglas definidas por este dominio.

---

## Beneficios

Este modelo permitirá:

- cambiar fácilmente de vehículo
- trabajar con vehículos alquilados
- administrar flotas
- compartir vehículos entre diferentes conductores
- futuras integraciones empresariales

---

# 14. Asociación Driver - Vehicle

El conductor y el vehículo representan entidades completamente independientes.

Su relación será administrada mediante una asociación.

Conceptualmente:

```
Driver

↓

DriverVehicle

↓

Vehicle
```

Este diseño ofrece múltiples ventajas.

Un conductor podrá utilizar distintos vehículos durante su permanencia en la plataforma.

Un vehículo podrá cambiar de conductor cuando sea necesario.

La información histórica permanecerá intacta.

El Trip Engine únicamente consultará cuál es el vehículo activo asociado al conductor.

Nunca administrará directamente estas relaciones.

---

## Asociación activa

Solamente una asociación podrá encontrarse activa al mismo tiempo para cada conductor.

Esto garantiza que el sistema conozca exactamente cuál vehículo será utilizado durante un viaje.

---

# 15. Validaciones Automáticas

El sistema ejecutará procesos automáticos para mantener actualizada la información del dominio.

Entre las validaciones se incluyen:

- vencimiento de SOAT
- vencimiento de revisión técnico-mecánica
- consistencia documental
- estado operativo
- disponibilidad
- asociación activa
- cambios administrativos

Estas validaciones podrán ejecutarse mediante tareas programadas sin intervención del usuario.

---

# 16. Integración con otros Dominios

El Vehicle Domain no opera de forma aislada.

Su funcionamiento depende de la interacción con otros dominios de la plataforma.

Cada dominio conserva sus propias responsabilidades, evitando el acoplamiento entre componentes.

---

## Integración con Driver Domain

El Driver Domain administra toda la información relacionada con el conductor.

El Vehicle Domain administra exclusivamente los vehículos.

La relación entre ambos dominios se establece mediante la asociación Driver-Vehicle.

El Driver Domain nunca almacenará información técnica del vehículo.

El Vehicle Domain nunca administrará información personal del conductor.

---

## Integración con Trip Domain

El Trip Domain consulta al Vehicle Domain para determinar si el vehículo asociado al conductor puede participar en la operación.

La consulta conceptual será equivalente a:

```

¿Vehículo habilitado?

↓

SI

↓

Puede participar en Matching

```

o

```

¿Vehículo habilitado?

↓

NO

↓

Excluir del algoritmo

```

El Trip Engine nunca validará:

- SOAT
- Tecnomecánica
- Documentación
- Estado administrativo

Toda esa lógica permanecerá encapsulada dentro del Vehicle Domain.

---

## Integración con Pricing Domain

El Pricing Domain podrá utilizar información del vehículo para aplicar reglas tarifarias futuras.

Ejemplos:

- tipo de vehículo
- capacidad
- categoría
- combustible
- vehículo premium

Actualmente esta integración queda preparada para futuras versiones.

---

## Integración con Payment Domain

El dominio de pagos utilizará únicamente la información del viaje.

No requerirá conocer documentación del vehículo.

La interacción será indirecta.

---

## Integración con Notification Domain

Cuando ocurra un cambio importante el Vehicle Domain emitirá eventos para que Notification Domain informe al conductor.

Ejemplos:

- SOAT próximo a vencer.
- Tecnomecánica vencida.
- Vehículo suspendido.
- Vehículo bloqueado.
- Vehículo reactivado.

---

## Integración con Audit Domain

Toda modificación importante deberá registrarse para auditoría.

Ejemplos:

- creación del vehículo
- actualización
- cambio de estado
- cambio de conductor
- bloqueo
- desbloqueo
- cambio de vehículo activo

Esto permitirá reconstruir completamente el historial operativo del vehículo.

---

## Integración con Administration Domain

Los administradores podrán ejecutar acciones administrativas sobre cualquier vehículo.

Entre ellas:

- aprobar vehículos
- bloquear
- suspender
- retirar
- consultar historial
- revisar documentación

---

# 17. Roadmap del Dominio

El diseño del Vehicle Domain contempla futuras ampliaciones sin modificar su arquitectura principal.

Entre las funcionalidades previstas se encuentran:

---

## Gestión avanzada de documentos

- múltiples versiones
- historial documental
- carga automática
- validaciones inteligentes

---

## Mantenimiento

Registro completo de mantenimientos.

Ejemplos:

- preventivos
- correctivos
- cambios de aceite
- frenos
- llantas
- revisiones generales

---

## Inspecciones

Control de inspecciones realizadas por la plataforma.

Incluye:

- fotografías
- observaciones
- aprobación
- rechazo

---

## Vehículos compartidos

Permitir que múltiples conductores autorizados puedan operar un mismo vehículo bajo reglas definidas.

---

## Flotas empresariales

Administración de vehículos pertenecientes a empresas.

Incluye:

- propietario empresarial
- administrador de flota
- asignación dinámica
- estadísticas

---

## Vehículos eléctricos

Incorporación de información específica como:

- autonomía
- nivel de batería
- estaciones de carga
- tiempos de recarga

---

## Integración con IA

En futuras versiones el sistema podrá utilizar Inteligencia Artificial para:

- detectar documentos próximos a vencer
- identificar inconsistencias documentales
- recomendar mantenimientos preventivos
- detectar comportamientos anómalos

---

# 18. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|----------------|--------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Creación inicial del Vehicle Domain |

---

# Conclusión

El Vehicle Domain constituye el componente responsable de garantizar que únicamente vehículos que cumplen todos los requisitos operativos, administrativos y legales puedan participar en la prestación del servicio.

La separación entre Driver Domain y Vehicle Domain permite mantener un modelo altamente desacoplado, escalable y fácil de mantener.

Toda la lógica relacionada con documentación, disponibilidad y estado operativo permanece encapsulada dentro de este dominio, permitiendo que componentes como el Trip Engine interactúen mediante interfaces simples sin depender de reglas internas.

Esta arquitectura facilita la incorporación de nuevas funcionalidades en el futuro sin afectar el funcionamiento del resto de la plataforma y constituye uno de los pilares fundamentales para garantizar la seguridad, confiabilidad y escalabilidad del ecosistema Tachi.

---