# 02. Dominio de Autenticación (Authentication Domain)

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 02-auth-domain.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

El Dominio de Autenticación es responsable de administrar la identidad de todos los usuarios que interactúan con la plataforma Tachi.

Este dominio implementa la autenticación mediante Supabase Auth y utiliza JWT firmados con claves asimétricas para garantizar sesiones seguras y verificables.

La lógica de negocio relacionada con perfiles, conductores o permisos no pertenece a este dominio, sino a los dominios correspondientes.

---

# 2. Objetivos

El dominio tiene como responsabilidades principales:

- Registrar usuarios.
- Autenticar usuarios.
- Emitir sesiones.
- Verificar JWT.
- Obtener el usuario autenticado.
- Cambiar contraseña.
- Mantener sincronizada la identidad con la base de datos.

---

# 3. Responsabilidades

Authentication es responsable únicamente de la identidad.

Incluye:

- Registro
- Login
- Logout (futuro)
- Refresh Token (futuro)
- Cambio de contraseña
- Validación JWT
- Recuperación de sesión

No administra:

- Roles
- Conductores
- Vehículos
- Viajes
- Pagos

Estos pertenecen a otros dominios.

---

# 4. Arquitectura

El dominio está compuesto por los siguientes componentes:

Authentication

├── Controllers

├── DTOs

├── Schemas

├── Services

├── Repositories

├── Types

└── Routes

Cada capa mantiene una única responsabilidad siguiendo los principios de Clean Architecture.

---

# 5. Flujo de Registro

El flujo de creación de un usuario es el siguiente:

1. El cliente envía la solicitud de registro.
2. Se validan los datos mediante Zod.
3. AuthService verifica que el correo no exista.
4. AuthRepository crea el usuario en Supabase Auth.
5. Supabase ejecuta automáticamente el trigger `handle_new_user`.
6. Se crea el registro correspondiente en la tabla `users`.
7. Se retorna el perfil creado.

---

# 6. Flujo de Inicio de Sesión

1. El cliente envía correo y contraseña.
2. Se validan los datos.
3. Supabase Auth verifica las credenciales.
4. Se genera una sesión.
5. Se obtiene el perfil desde la tabla `users`.
6. Se retorna:

- UserDTO
- Access Token
- Refresh Token
- Expiration

---

# 7. Flujo de Autenticación

Todas las rutas protegidas siguen el siguiente proceso:

1. El cliente envía el JWT mediante el encabezado Authorization.
2. El middleware authenticate intercepta la solicitud.
3. JwtVerifier descarga el JWKS de Supabase.
4. JOSE valida la firma.
5. Se extraen los claims.
6. Se construye CurrentUser.
7. request.user queda disponible para el controlador.

---

# 8. Componentes Principales

## AuthController

Responsable de recibir las solicitudes HTTP.

Funciones:

- register()
- login()

---

## AuthService

Coordina toda la lógica del dominio.

Funciones:

- register()
- login()
- getCurrentUser()

---

## AuthRepository

Comunica el sistema con Supabase Auth.

Funciones:

- createUser()
- login()

---

## JwtVerifier

Verifica la autenticidad de los JWT emitidos por Supabase.

Tecnología utilizada:

- JOSE
- JWKS
- ES256

---

## Middleware Authenticate

Protege las rutas privadas.

Responsabilidades:

- Leer Authorization Header
- Validar Bearer Token
- Invocar JwtVerifier
- Inyectar request.user

---

# 9. DTOs

Actualmente el dominio define los siguientes contratos:

- LoginResponseDTO
- LoginDTO
- RegisterDTO
- SessionDTO

---

# 10. Esquemas de Validación

Se utilizan esquemas Zod para validar todas las entradas del dominio.

Actualmente existen:

- AuthSchema
- LoginSchema
- RegisterSchema


---

# 11. Integración con Base de Datos

La autenticación utiliza Supabase Auth como proveedor de identidad.

La información de negocio se almacena en PostgreSQL.

La sincronización entre ambos sistemas se realiza mediante el trigger:

handle_new_user()

Esto garantiza que todo usuario autenticado tenga un perfil correspondiente en la tabla users.

---

# 12. Seguridad

El dominio implementa las siguientes medidas:

- JWT firmados con ES256.
- Verificación mediante JWKS.
- Middleware para rutas protegidas.
- Row Level Security (RLS).
- Validación mediante Zod.
- Manejo centralizado de errores.
- Uso de Service Role únicamente en operaciones administrativas.

---

# 13. Estado Actual

Funcionalidades implementadas:

- Registro
- Inicio de sesión
- Verificación JWT
- Middleware de autenticación
- Obtener usuario autenticado
- Cambio de contraseña

Pendiente:

- Logout
- Refresh Token
- Recuperación de contraseña
- Verificación de correo
- MFA (opcional)

---

# 14. Dependencias

Este dominio depende de:

- Supabase Auth
- PostgreSQL
- JOSE
- Fastify
- Zod

No depende de ningún dominio de negocio.

---

# 15. Evolución Futura

Las próximas funcionalidades previstas para este dominio son:

- Refresh automático de tokens.
- Logout global.
- Revocación de sesiones.
- Autenticación multifactor (MFA).
- Inicio de sesión con proveedores externos (Google, Apple).

---

# Control del Documento

| Campo | Valor |
|-------|--------|
| Estado | Aprobado |
| Versión | 1.0 |
| Responsable | Equipo de Arquitectura - Tachi |

> Este documento constituye la especificación oficial del Dominio de Autenticación de Tachi. Toda modificación a este dominio deberá reflejarse primero en este documento antes de implementarse en el código.