# 13. API Guidelines

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 13-api-guidelines.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El presente documento define los estándares oficiales para el diseño, implementación y evolución de todas las interfaces HTTP expuestas por la plataforma Tachi.

Su propósito consiste en garantizar que todos los servicios compartan una arquitectura consistente, predecible y fácilmente mantenible, independientemente del lenguaje de programación o la tecnología utilizada para implementarlos.

Estas directrices serán de cumplimiento obligatorio para todos los componentes backend de la plataforma.

Incluyendo.

- Backend Principal
- Trip Engine
- Servicios internos
- Microservicios futuros
- APIs administrativas
- APIs móviles
- APIs públicas

---

# 2. Objetivos

Los principales objetivos de este documento son.

- unificar el diseño de la API
- reducir inconsistencias
- facilitar el mantenimiento
- mejorar la experiencia de los desarrolladores
- simplificar la documentación
- facilitar la evolución de la plataforma
- permitir la interoperabilidad entre servicios
- establecer estándares de calidad

---

# 3. Alcance

Estas reglas aplican a todos los endpoints HTTP desarrollados dentro del ecosistema Tachi.

Incluyendo.

- Authentication
- Users
- Drivers
- Vehicles
- Trips
- Payments
- Pricing
- Ratings
- Notifications
- Administration
- Audit

Ningún dominio podrá definir convenciones diferentes sin una justificación técnica previamente aprobada.

---

# 4. Principios de Diseño

Toda la API deberá construirse siguiendo los siguientes principios.

---

## Consistencia

Todos los endpoints deberán seguir exactamente las mismas convenciones.

Un desarrollador deberá poder predecir el funcionamiento de un endpoint únicamente observando su estructura.

---

## Simplicidad

La API deberá ser sencilla de consumir.

Se evitarán estructuras complejas cuando exista una alternativa más simple.

---

## Legibilidad

Los nombres deberán expresar claramente su propósito.

No se utilizarán abreviaciones ambiguas.

Incorrecto.

```
/drv
```

Correcto.

```
/drivers
```

---

## Desacoplamiento

La API nunca expondrá detalles internos de la implementación.

El consumidor únicamente conocerá contratos públicos.

---

## Escalabilidad

Las convenciones deberán permitir incorporar nuevos módulos sin romper la compatibilidad existente.

---

## Evolución

Toda modificación deberá considerar la compatibilidad con versiones anteriores cuando sea posible.

---

# 5. Arquitectura REST

La plataforma adoptará una arquitectura basada en principios REST.

Cada recurso será representado mediante una URL claramente identificable.

Ejemplos.

```
/drivers
```

```
/vehicles
```

```
/trips
```

```
/payments
```

```
/wallet
```

Cada recurso representará una entidad del dominio y no una acción.

---

## Correcto

```
GET /drivers
```

```
POST /drivers
```

```
GET /drivers/{id}
```

---

## Incorrecto

```
GET /getDrivers
```

```
POST /createDriver
```

```
DELETE /deleteDriver
```

Las acciones serán determinadas por el método HTTP y no por el nombre del endpoint.

---

# 6. Versionado

Toda la API será versionada desde el inicio.

La primera versión oficial utilizará.

```
/api/v1
```

Ejemplos.

```
GET /api/v1/drivers
```

```
POST /api/v1/trips
```

```
GET /api/v1/payments/wallet
```

```
GET /api/v1/admin/users
```

El versionado permitirá introducir mejoras futuras sin afectar las aplicaciones existentes.

---

# 7. Convenciones de Endpoints

Todos los endpoints deberán seguir una estructura uniforme.

Formato general.

```
/api/v1/{resource}
```

Cuando un recurso posea elementos relacionados se utilizarán rutas jerárquicas.

Ejemplos.

```
/api/v1/drivers
```

```
/api/v1/drivers/{driverId}
```

```
/api/v1/drivers/{driverId}/vehicles
```

```
/api/v1/drivers/{driverId}/wallet
```

```
/api/v1/trips/{tripId}
```

```
/api/v1/trips/{tripId}/events
```

```
/api/v1/payments/{paymentId}
```

Las rutas deberán representar relaciones entre recursos y no procesos internos.

---

# 8. Convenciones de Nombres

Todos los recursos utilizarán.

- minúsculas
- plural
- palabras completas
- guiones únicamente cuando sean necesarios

---

## Correcto

```
drivers
```

```
vehicles
```

```
trip-events
```

```
payment-methods
```

---

## Incorrecto

```
Driver
```

```
driverList
```

```
drv
```

```
DriverVehicle
```

---

# 9. Métodos HTTP

La API utilizará únicamente los métodos HTTP estándar.

---

## GET

Obtiene información.

Nunca modifica datos.

Ejemplos.

```
GET /drivers
```

```
GET /drivers/{id}
```

```
GET /wallet
```

---

## POST

Crea un nuevo recurso.

Ejemplos.

```
POST /drivers
```

```
POST /vehicles
```

```
POST /trips
```

---

## PUT

Reemplaza completamente un recurso.

Solo deberá utilizarse cuando todos los atributos sean enviados nuevamente.

Ejemplo.

```
PUT /drivers/{id}
```

---

## PATCH

Actualiza parcialmente un recurso.

Será el método recomendado para modificaciones.

Ejemplos.

```
PATCH /drivers/{id}
```

```
PATCH /vehicles/{id}
```

```
PATCH /users/{id}
```

---

## DELETE

Elimina un recurso cuando el dominio lo permita.

Ejemplo.

```
DELETE /vehicles/{id}
```

En los casos donde se utilice eliminación lógica, el endpoint continuará siendo DELETE.

La implementación interna será transparente para el consumidor.

---

# 10. Request Body

Todas las solicitudes utilizarán JSON.

```
Content-Type

application/json
```

---

Ejemplo.

```json
{
  "firstName": "Miguel",
  "lastName": "Maldonado",
  "email": "miguel@example.com"
}
```

No se permitirán formatos propietarios.

---

# 11. Convenciones para Identificadores

Todos los recursos utilizarán identificadores únicos.

Ejemplo.

```
/drivers/{driverId}
```

```
/vehicles/{vehicleId}
```

```
/trips/{tripId}
```

```
/payments/{paymentId}
```

Nunca se utilizarán nombres genéricos como.

```
{id}
```

Cuando el contexto no sea suficientemente claro.

Siempre se preferirá un identificador semántico.

Ejemplo.

```
driverId
```

en lugar de.

```
id
```

---

# 12. Relaciones entre Recursos

Las relaciones deberán expresarse mediante rutas jerárquicas.

Ejemplos.

```
GET /drivers/{driverId}/vehicles
```

```
GET /drivers/{driverId}/wallet
```

```
GET /users/{userId}/trips
```

```
GET /trips/{tripId}/events
```

Nunca deberán representarse mediante nombres compuestos.

Incorrecto.

```
driverVehicles
```

Correcto.

```
drivers/{driverId}/vehicles
```

---

# 13. Response Standards

Todas las respuestas de la API deberán utilizar una estructura uniforme.

Esto permitirá simplificar el consumo desde aplicaciones móviles, panel administrativo y futuros clientes.

---

## Respuesta Exitosa

Formato general.

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "timestamp": "2026-07-31T18:00:00Z"
}
```

---

## Ejemplo

```json
{
  "success": true,
  "data": {
    "driverId": "drv_01",
    "firstName": "Miguel",
    "status": "ACTIVE"
  },
  "meta": {},
  "timestamp": "2026-07-31T18:00:00Z"
}
```

---

## Respuesta con Colecciones

Cuando la respuesta contenga múltiples elementos.

```json
{
  "success": true,
  "data": [
    {
      "driverId": "drv_01"
    },
    {
      "driverId": "drv_02"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 154
  },
  "timestamp": "2026-07-31T18:00:00Z"
}
```

---

# 14. Error Handling

Todas las respuestas de error deberán utilizar exactamente la misma estructura.

Formato.

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Driver not found."
  },
  "timestamp": "2026-07-31T18:00:00Z"
}
```

---

## Ejemplo

```json
{
  "success": false,
  "error": {
    "code": "VEHICLE_ALREADY_EXISTS",
    "message": "Vehicle plate already registered."
  },
  "timestamp": "2026-07-31T18:00:00Z"
}
```

---

# 15. HTTP Status Codes

La API utilizará únicamente códigos HTTP estándar.

---

## 200 OK

Solicitud ejecutada correctamente.

---

## 201 Created

Recurso creado correctamente.

---

## 204 No Content

Operación exitosa sin contenido de respuesta.

---

## 400 Bad Request

Solicitud inválida.

---

## 401 Unauthorized

Usuario no autenticado.

---

## 403 Forbidden

Usuario autenticado sin permisos.

---

## 404 Not Found

Recurso inexistente.

---

## 409 Conflict

Conflicto de datos.

Ejemplo.

```
Correo duplicado.
```

---

## 422 Unprocessable Entity

Los datos cumplen el formato esperado pero violan reglas del negocio.

Ejemplos.

- conductor suspendido
- vehículo inactivo
- viaje ya finalizado

---

## 429 Too Many Requests

Límite de solicitudes excedido.

---

## 500 Internal Server Error

Error inesperado del servidor.

---

# 16. Convenciones para Mensajes de Error

Los mensajes deberán cumplir las siguientes reglas.

- claros
- breves
- consistentes
- sin información técnica
- sin stack traces
- sin nombres de tablas
- sin nombres internos de servicios

---

## Correcto

```
Driver not found.
```

---

```
Vehicle already registered.
```

---

## Incorrecto

```
SQL Error.
```

---

```
NullPointerException.
```

---

```
Table drivers not found.
```

---

# 17. Error Codes

Todos los errores deberán utilizar códigos constantes.

Ejemplos.

```
INVALID_CREDENTIALS
```

```
USER_NOT_FOUND
```

```
DRIVER_NOT_AVAILABLE
```

```
TRIP_ALREADY_FINISHED
```

```
PAYMENT_DECLINED
```

```
INSUFFICIENT_WALLET_BALANCE
```

```
NEGATIVE_LIMIT_EXCEEDED
```

Los códigos serán utilizados por las aplicaciones para implementar comportamientos específicos sin depender del texto del mensaje.

---

# 18. Paginación

Toda consulta que pueda retornar múltiples registros deberá implementar paginación.

La paginación será obligatoria para evitar respuestas excesivamente grandes.

Los parámetros estándar serán.

```
?page=1

&limit=20
```

Ejemplo.

```
GET /api/v1/drivers?page=1&limit=20
```

---

## Meta de Paginación

Toda respuesta paginada incluirá información adicional.

Ejemplo.

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 350,
    "totalPages": 18,
    "hasNext": true,
    "hasPrevious": false
  },
  "traceId": "...",
  "timestamp": "..."
}
```

---

# 19. Filtering

Los filtros deberán enviarse mediante Query Parameters.

Ejemplos.

```
GET /drivers?status=ACTIVE
```

```
GET /drivers?city=mosquera
```

```
GET /drivers?vehicleType=CAR
```

```
GET /trips?status=COMPLETED
```

Se podrán combinar múltiples filtros.

```
GET /drivers?city=mosquera&status=ACTIVE
```

---

# 20. Sorting

El ordenamiento utilizará parámetros estándar.

```
sortBy

sortOrder
```

Ejemplo.

```
GET /drivers?sortBy=createdAt&sortOrder=desc
```

Otro ejemplo.

```
GET /trips?sortBy=startTime&sortOrder=asc
```

---

# 21. Búsquedas

Las búsquedas generales utilizarán el parámetro.

```
search
```

Ejemplo.

```
GET /drivers?search=miguel
```

```
GET /users?search=juan
```

```
GET /vehicles?search=ABC123
```

La implementación interna podrá utilizar índices especializados sin afectar la interfaz pública.

---

# 22. Idempotencia

Las operaciones críticas deberán soportar idempotencia.

Especialmente.

- pagos
- retiros
- recargas
- creación de viajes
- creación de órdenes

Para ello se utilizará el encabezado.

```
Idempotency-Key
```

Ejemplo.

```
POST /payments

Idempotency-Key:

b44f67d2...
```

Si una solicitud idéntica es recibida nuevamente con la misma clave, el servidor devolverá el resultado previamente generado sin ejecutar nuevamente la operación.

---

# 23. Headers

Todos los clientes deberán enviar los encabezados oficiales.

Ejemplo.

```
Authorization

Bearer JWT
```

---

```
Content-Type

application/json
```

---

```
Accept

application/json
```

---

Cuando aplique.

```
Idempotency-Key
```

---

Opcionalmente.

```
Accept-Language
```

Para soportar internacionalización futura.

---

# 24. Rate Limiting

La plataforma implementará mecanismos de limitación de solicitudes para proteger los servicios contra abusos, ataques automatizados y consumo excesivo de recursos.

Los límites podrán variar según el tipo de cliente.

Ejemplos.

| Cliente | Límite |
|----------|---------|
| Usuario autenticado | Configurable |
| Conductor autenticado | Configurable |
| Administrador | Configurable |
| API pública | Configurable |

Los valores específicos serán definidos por el Administration Domain.

Cuando un cliente exceda el límite permitido, el servidor responderá con.

```
HTTP 429
Too Many Requests
```

---

# 25. Documentación de la API

Toda la API deberá mantenerse documentada.

La documentación será generada automáticamente a partir del código fuente siempre que sea posible.

La documentación incluirá.

- descripción del endpoint
- parámetros
- request body
- response body
- códigos HTTP
- ejemplos
- reglas de autenticación
- permisos requeridos

El objetivo es garantizar que la documentación permanezca sincronizada con la implementación.

---

# 26. Compatibilidad

La plataforma evitará cambios incompatibles dentro de una misma versión de la API.

Siempre que sea posible.

- se agregarán nuevos campos sin eliminar los existentes
- se mantendrá la compatibilidad con clientes anteriores
- los cambios incompatibles requerirán una nueva versión de la API

Ejemplo.

```
/api/v1
```

↓

```
/api/v2
```

Las versiones anteriores podrán mantenerse activas durante un período definido por las políticas de la plataforma.

---

# 27. Buenas Prácticas

Todo desarrollo deberá seguir las siguientes recomendaciones.

- utilizar nombres descriptivos
- reutilizar estructuras existentes
- evitar duplicidad de endpoints
- evitar lógica de negocio en controladores
- validar siempre la entrada de datos
- responder únicamente con información necesaria
- mantener consistencia entre todos los dominios
- documentar nuevos endpoints
- utilizar códigos HTTP correctamente
- registrar eventos relevantes para auditoría

---

# 28. Roadmap

La arquitectura de la API ha sido diseñada para soportar futuras capacidades.

Entre ellas.

- GraphQL
- Webhooks
- gRPC
- APIs públicas
- SDK oficial
- Versionado automático
- OpenAPI avanzado
- Integración con terceros
- Multi Tenant
- API Keys
- OAuth2
- OpenID Connect

La incorporación de estas capacidades no requerirá modificar las convenciones definidas en este documento.

---

# 29. Control del Documento

| Versión | Fecha | Autor | Descripción |
|----------|------------|--------------------------|----------------------------------------------|
| 1.0 | 2026-07-31 | Miguel Maldonado / OpenAI | Definición inicial de los estándares oficiales para el diseño e implementación de la API de Tachi. |

---

# Conclusión

La API constituye el principal contrato de comunicación entre los diferentes componentes de la plataforma Tachi.

La adopción de estándares unificados garantiza consistencia, mantenibilidad y escalabilidad a largo plazo.

Estas directrices deberán ser consideradas de cumplimiento obligatorio para todos los servicios desarrollados dentro del ecosistema Tachi, independientemente de la tecnología utilizada para implementarlos.

La estandarización de rutas, métodos HTTP, estructuras de respuesta, manejo de errores, autenticación, paginación y versionado permitirá construir una plataforma robusta, predecible y preparada para evolucionar sin comprometer la compatibilidad con los clientes existentes.