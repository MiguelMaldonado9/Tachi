# 14. Security

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 14-security.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

La seguridad constituye uno de los pilares fundamentales de la arquitectura de Tachi.

Debido a que la plataforma administra información personal, documentos oficiales, ubicaciones en tiempo real y operaciones financieras, todos los componentes deberán diseñarse siguiendo principios de seguridad desde su concepción.

La seguridad no será considerada una funcionalidad independiente.

Será una capacidad transversal presente en toda la plataforma.

Este documento establece los lineamientos generales que deberán seguir todos los dominios y servicios del ecosistema Tachi.

---

# 2. Objetivos

Los principales objetivos de la arquitectura de seguridad son.

- proteger la información de los usuarios
- proteger la información de los conductores
- garantizar la confidencialidad de los datos
- garantizar la integridad de la información
- garantizar la disponibilidad de los servicios
- prevenir accesos no autorizados
- minimizar riesgos operativos
- facilitar procesos de auditoría
- cumplir buenas prácticas de seguridad
- permitir una evolución segura de la plataforma

---

# 3. Alcance

Las políticas definidas en este documento aplican a todos los componentes del ecosistema Tachi.

Incluyendo.

- Backend Principal
- Trip Engine
- Authentication Domain
- Payment Domain
- Pricing Domain
- Notification Domain
- Administration Domain
- Audit Domain
- Base de Datos
- APIs
- Aplicaciones móviles
- Panel administrativo

Ningún componente podrá implementar mecanismos de seguridad incompatibles con estas directrices.

---

# 4. Principios de Seguridad

Toda decisión arquitectónica deberá respetar los siguientes principios.

---

## Seguridad por Diseño

La seguridad deberá incorporarse desde la etapa de diseño.

Nunca deberá agregarse posteriormente como una funcionalidad adicional.

---

## Mínimo Privilegio

Todo usuario, servicio o componente dispondrá únicamente de los permisos estrictamente necesarios para realizar su función.

---

## Defensa en Profundidad

La protección de la plataforma estará compuesta por múltiples capas de seguridad.

La existencia de una vulnerabilidad en una capa no deberá comprometer completamente el sistema.

---

## Confianza Cero

Ningún usuario, dispositivo o servicio será considerado confiable por defecto.

Toda solicitud deberá ser autenticada, autorizada y validada.

---

## Auditoría Permanente

Todas las operaciones relevantes deberán quedar registradas para facilitar investigaciones, monitoreo y cumplimiento de políticas internas.

---

## Protección de Datos

La información sensible deberá protegerse durante su almacenamiento, transmisión y procesamiento.

---

# 5. Modelo General de Seguridad

La arquitectura de seguridad de Tachi estará basada en múltiples capas independientes.

Conceptualmente.

```
Cliente

↓

Autenticación

↓

Autorización

↓

API

↓

Backend

↓

Dominios

↓

Base de Datos

↓

Auditoría
```

Cada capa implementará mecanismos específicos de protección.

El compromiso de una capa no deberá implicar el compromiso total de la plataforma.

---

# 6. Autenticación

Toda identidad deberá ser validada antes de permitir el acceso a recursos protegidos.

La autenticación será administrada por el Authentication Domain.

El resto de los dominios nunca implementarán mecanismos propios de autenticación.

Conceptualmente.

```
Cliente

↓

Authentication Domain

↓

Token válido

↓

Acceso permitido
```

Toda solicitud autenticada deberá incluir un token válido emitido por el sistema de autenticación.

---

## Sesiones

La plataforma utilizará autenticación basada en tokens.

El servidor no mantendrá sesiones tradicionales.

Cada solicitud será completamente independiente.

---

## Expiración

Todos los tokens deberán poseer un tiempo de expiración.

Una vez expirados, será necesario obtener un nuevo token mediante el mecanismo definido por el Authentication Domain.

---

## Revocación

La plataforma deberá permitir revocar credenciales cuando sea necesario.

Ejemplos.

- cierre de sesión
- dispositivo perdido
- cambio de contraseña
- actividad sospechosa
- suspensión del usuario

---

# 7. Autorización

La autenticación responde a la pregunta.

```
¿Quién eres?
```

La autorización responde a la pregunta.

```
¿Qué puedes hacer?
```

Toda operación deberá validar los permisos del usuario antes de ejecutarse.

---

## Roles

Inicialmente la plataforma contemplará los siguientes roles.

- Passenger
- Driver
- Administrator
- Supervisor

Cada rol dispondrá de permisos específicos definidos por el Administration Domain.

---

## Permisos

Los permisos deberán administrarse de forma independiente a los roles.

Esto permitirá modificar privilegios sin alterar la estructura general de la plataforma.

Ejemplos.

```
drivers.read
```

```
drivers.create
```

```
drivers.update
```

```
drivers.delete
```

```
payments.read
```

```
payments.withdraw
```

```
users.block
```

---

## Principio de Negación por Defecto

Toda operación deberá considerarse prohibida hasta demostrar explícitamente que el usuario posee autorización para ejecutarla.

---

# 8. Protección de APIs

Toda API pública deberá implementar mecanismos de protección.

Entre ellos.

- autenticación
- autorización
- validación de entrada
- rate limiting
- control de versiones
- registros de auditoría

---

## HTTPS Obligatorio

Toda comunicación deberá realizarse mediante conexiones seguras.

No se permitirá tráfico HTTP sin cifrado.

---

## Validación de Entrada

Toda información recibida deberá validarse antes de ingresar al dominio correspondiente.

Se validarán.

- tipos
- formatos
- tamaños
- rangos
- reglas de negocio

Nunca se confiará en la información enviada por el cliente.

---

## Sanitización

Los datos recibidos deberán ser sanitizados cuando sea necesario para evitar ataques como.

- Cross Site Scripting
- SQL Injection
- Command Injection
- Header Injection

---

# 9. Protección contra Fuerza Bruta

La plataforma implementará mecanismos para reducir ataques automatizados.

Entre ellos.

- límite de intentos
- retrasos progresivos
- bloqueo temporal
- monitoreo de actividad sospechosa

Las políticas específicas serán configurables desde el Administration Domain.

---

# 10. Protección contra Enumeración

La API no deberá revelar información que permita determinar si un recurso existe cuando ello represente un riesgo de seguridad.

Ejemplo.

Durante el proceso de autenticación no se diferenciará entre.

```
Usuario inexistente.
```

y

```
Contraseña incorrecta.
```

Ambos casos responderán con un mensaje uniforme.

```
Credenciales inválidas.
```

Esto reduce la posibilidad de ataques de enumeración de usuarios.

---

# 11. Protección de Datos

Toda la información administrada por Tachi deberá protegerse durante su almacenamiento, transmisión y procesamiento.

La protección de datos constituye una responsabilidad transversal de toda la plataforma.

---

## Clasificación de la Información

La información será clasificada según su nivel de sensibilidad.

### Pública

Información que puede divulgarse sin afectar la seguridad de la plataforma.

Ejemplos.

- nombre comercial
- información institucional
- documentación pública

---

### Interna

Información utilizada únicamente por la plataforma.

Ejemplos.

- configuraciones
- métricas internas
- registros operativos

---

### Confidencial

Información cuyo acceso estará restringido.

Ejemplos.

- datos personales
- documentos de identidad
- licencias de conducción
- información de vehículos
- historial financiero

---

### Crítica

Información cuya exposición podría comprometer gravemente la seguridad de la plataforma.

Ejemplos.

- credenciales
- secretos
- claves privadas
- tokens
- configuraciones de infraestructura

---

# 12. Cifrado

Toda información sensible deberá protegerse mediante mecanismos criptográficos apropiados.

El cifrado deberá aplicarse cuando corresponda.

- durante la transmisión
- durante el almacenamiento
- durante procesos de respaldo

La selección del algoritmo específico dependerá de la implementación técnica y podrá evolucionar sin afectar esta arquitectura.

---

## Contraseñas

Las contraseñas nunca serán almacenadas en texto plano.

Siempre deberán almacenarse utilizando algoritmos de hashing resistentes a ataques de fuerza bruta.

---

## Secretos

Las claves utilizadas por la plataforma nunca deberán almacenarse dentro del código fuente.

Los secretos deberán administrarse mediante mecanismos especializados de gestión de credenciales.

---

# 13. Seguridad en Base de Datos

La base de datos constituye uno de los activos más importantes de la plataforma.

Su acceso deberá protegerse mediante múltiples mecanismos.

---

## Acceso Restringido

Únicamente los servicios autorizados podrán establecer conexiones directas con la base de datos.

Las aplicaciones cliente nunca accederán directamente a información crítica sin pasar por los mecanismos definidos por la arquitectura.

---

## Mínimo Privilegio

Cada servicio utilizará únicamente los permisos estrictamente necesarios.

No existirán cuentas con privilegios administrativos para operaciones cotidianas.

---

## Separación de Responsabilidades

Las operaciones administrativas deberán ejecutarse mediante credenciales diferentes a las utilizadas por los servicios de producción.

---

## Respaldo

La plataforma deberá disponer de políticas periódicas de respaldo.

Los procedimientos de recuperación deberán probarse regularmente para garantizar la continuidad del servicio.

---

# 14. Protección de Información Sensible

La información sensible nunca deberá exponerse innecesariamente.

Ejemplos.

No devolver.

- contraseñas
- hashes
- tokens
- secretos
- claves privadas

Cuando sea necesario mostrar parcialmente un dato, se utilizará enmascaramiento.

Ejemplos.

Documento.

```
********1234
```

Correo.

```
mig****@correo.com
```

Teléfono.

```
*** *** 4589
```

---

# 15. Seguridad en WebSockets

Las conexiones WebSocket deberán mantener el mismo nivel de seguridad que las APIs HTTP.

Toda conexión deberá autenticarse antes de permitir el intercambio de información.

---

## Autenticación

El cliente deberá presentar un token válido durante el establecimiento de la conexión.

Las conexiones no autenticadas serán rechazadas inmediatamente.

---

## Autorización

La autenticación de una conexión no implica autorización para todos los eventos.

Cada mensaje recibido deberá validar los permisos correspondientes.

Ejemplos.

- ubicación del conductor
- aceptación de viaje
- cancelación de viaje
- eventos administrativos

---

## Expiración

Cuando una credencial expire, la conexión deberá cerrarse o renovarse mediante el mecanismo definido por el Authentication Domain.

---

## Validación de Eventos

Todo mensaje recibido mediante WebSocket deberá validarse antes de ser procesado.

Nunca se confiará en la información enviada por el cliente.

---

# 16. Seguridad del Trip Engine

El Trip Engine constituye uno de los componentes críticos de la plataforma.

Su responsabilidad consiste en administrar el proceso de asignación de viajes y la coordinación entre pasajeros y conductores.

---

## Comunicación Interna

El Trip Engine únicamente aceptará solicitudes provenientes de componentes autorizados.

No expondrá interfaces públicas para operaciones internas.

---

## Validación de Eventos

Todo evento recibido será validado antes de iniciar cualquier proceso de despacho.

Ejemplos.

- viaje creado
- conductor disponible
- conductor desconectado
- ubicación actualizada
- cancelación
- finalización

---

## Integridad

El Trip Engine nunca confiará en datos calculados por el cliente.

Toda decisión será tomada utilizando información validada por los dominios correspondientes.

---

## Protección contra Repetición

Los eventos críticos deberán protegerse contra procesamiento duplicado.

El motor deberá detectar eventos repetidos e ignorarlos cuando corresponda.

---

## Observabilidad

Toda operación relevante generará registros que permitan reconstruir completamente el proceso de asignación de un viaje.

---

# 17. Auditoría

Toda operación crítica deberá quedar registrada.

Entre ellas.

- autenticaciones
- autorizaciones
- cambios de permisos
- modificaciones administrativas
- operaciones financieras
- asignaciones de viajes
- cancelaciones
- bloqueos
- suspensiones

---

## Inmutabilidad

Los registros de auditoría no podrán modificarse una vez creados.

Las correcciones deberán realizarse mediante nuevos eventos.

---

## Trazabilidad

Cada evento deberá permitir reconstruir completamente el flujo que originó una operación.

Toda auditoría deberá poder relacionarse con.

- usuario
- conductor
- administrador
- dispositivo
- dirección IP
- timestamp
- traceId

---

# 18. Gestión de Secretos

Las credenciales utilizadas por la plataforma deberán administrarse mediante mecanismos especializados.

Nunca deberán almacenarse.

- en el código fuente
- en repositorios
- en archivos públicos
- en aplicaciones cliente

---

## Rotación

Los secretos deberán poder reemplazarse periódicamente sin afectar la disponibilidad de la plataforma.

---

## Acceso

Únicamente los servicios autorizados podrán acceder a los secretos necesarios para su funcionamiento.

Se aplicará el principio de mínimo privilegio.

---

# 19. Monitoreo de Seguridad

La plataforma deberá mantener mecanismos permanentes de monitoreo para identificar comportamientos anómalos y responder oportunamente ante posibles incidentes de seguridad.

El monitoreo abarcará todos los componentes del ecosistema Tachi.

Incluyendo.

- Backend Principal
- Trip Engine
- Base de Datos
- APIs
- WebSockets
- Servicios Internos
- Infraestructura

---

## Eventos Monitoreados

Entre los eventos que deberán supervisarse se encuentran.

- múltiples intentos fallidos de autenticación
- accesos desde ubicaciones inusuales
- incremento anormal del tráfico
- errores repetitivos
- solicitudes bloqueadas
- cambios administrativos
- operaciones financieras críticas
- accesos fuera del horario habitual
- comportamiento anómalo de dispositivos

---

## Alertas

La plataforma deberá generar alertas cuando se detecten situaciones consideradas de riesgo.

Ejemplos.

- intentos de fuerza bruta
- utilización de credenciales comprometidas
- incremento inusual de errores
- intentos de acceso a recursos restringidos
- actividad sospechosa sobre cuentas administrativas

Las reglas específicas podrán configurarse desde el Administration Domain.

---

# 20. Gestión de Incidentes

Toda incidencia de seguridad deberá seguir un procedimiento controlado.

El objetivo consiste en minimizar el impacto sobre la plataforma y facilitar la recuperación del servicio.

---

## Ciclo de Gestión

Todo incidente seguirá el siguiente flujo.

```
Detección

↓

Análisis

↓

Contención

↓

Erradicación

↓

Recuperación

↓

Lecciones Aprendidas
```

Cada fase deberá quedar documentada para futuras revisiones.

---

## Registro

Todo incidente deberá registrarse con información suficiente para permitir su análisis posterior.

Como mínimo.

- fecha
- responsable
- descripción
- impacto
- componentes afectados
- acciones ejecutadas
- resultado
- referencia de auditoría

---

# 21. Continuidad del Servicio

La arquitectura deberá diseñarse para reducir el impacto de incidentes de seguridad y fallos operativos.

Entre las estrategias contempladas se incluyen.

- respaldos periódicos
- redundancia de servicios
- recuperación ante desastres
- restauración controlada
- monitoreo continuo
- pruebas periódicas de recuperación

---

# 22. Roadmap de Seguridad

La arquitectura ha sido diseñada para evolucionar progresivamente.

Entre las capacidades previstas para futuras versiones se encuentran.

- autenticación multifactor (MFA)
- detección automática de fraude
- análisis de comportamiento
- gestión avanzada de dispositivos
- cifrado de extremo a extremo
- Security Information and Event Management (SIEM)
- integración con OpenID Connect
- autenticación biométrica
- Zero Trust Architecture completa
- rotación automática de credenciales
- gestión centralizada de certificados
- motores de detección de anomalías mediante inteligencia artificial

Estas funcionalidades podrán incorporarse sin modificar los principios fundamentales definidos en este documento.

---

# 23. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|-----------------------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Definición de la arquitectura y lineamientos de seguridad de Tachi. |

---

# Conclusión

La seguridad en Tachi constituye una capacidad transversal presente en todos los componentes de la plataforma.

Desde la autenticación de usuarios hasta la comunicación entre servicios, la protección de datos y la auditoría de operaciones, cada decisión arquitectónica ha sido diseñada siguiendo principios de seguridad por diseño, mínimo privilegio, defensa en profundidad y confianza cero.

La aplicación de estos lineamientos permitirá construir una plataforma robusta, resiliente y preparada para evolucionar hacia entornos de mayor escala sin comprometer la confidencialidad, integridad y disponibilidad de la información.

Este documento establece la base sobre la cual deberán implementarse todos los mecanismos de seguridad del ecosistema Tachi.