# 04. Database Conventions

---

# Documento de Arquitectura

| Campo | Valor |
|-------|--------|
| Proyecto | Tachi |
| Documento | 04-database-conventions.md |
| Versión | 1.0 |
| Estado | Aprobado |
| Última actualización | 2026-07-31 |

---

# 1. Introducción

Este documento establece los estándares oficiales para el diseño, construcción y mantenimiento de la base de datos del proyecto Tachi.

Su propósito es garantizar consistencia, legibilidad, escalabilidad y facilidad de mantenimiento durante toda la vida del sistema.

Todas las migraciones futuras deberán cumplir las reglas definidas en este documento.

---

# 2. Objetivos

Los objetivos de este estándar son:

- Mantener una estructura uniforme.
- Reducir errores de diseño.
- Facilitar revisiones de código.
- Simplificar futuras migraciones.
- Mantener compatibilidad entre dominios.
- Garantizar escalabilidad.

---

# 3. Principios Generales

La base de datos seguirá los siguientes principios.

## Simplicidad

Las tablas deberán contener únicamente la información perteneciente a su dominio.

---

## Normalización

Se buscará mantener un modelo normalizado.

Las desnormalizaciones deberán estar justificadas.

---

## Integridad

Toda relación deberá estar protegida mediante claves foráneas.

---

## Escalabilidad

El modelo deberá permitir crecimiento sin romper compatibilidad.

---

## Seguridad

Toda tabla pública utilizará Row Level Security cuando corresponda.

---

# 4. Convenciones de Nombres

## Tablas

Siempre en plural.
Correcto
users
drivers
vehicles
trips
payments
Incorrecto
User
Driver
tbl_users
DriversTable

---

## Columnas

Siempre en snake_case.
Ejemplos
full_name
created_at
updated_at
driver_status
license_number

---

## Claves Primarias

Siempre:
id
Tipo:
UUID
Ejemplo
id UUID PRIMARY KEY

---

## Claves Foráneas

Siempre:
<tabla>_id
Ejemplos
user_id
driver_id
vehicle_id
trip_id
role_id

---

## Índices

Formato
idx_<tabla>_<campo>
Ejemplo
idx_users_email
idx_drivers_status
idx_trips_driver

---

## Constraints

Formato
fk_<tabla>_<referencia>
Ejemplo
fk_driver_user
fk_trip_driver

---

## Triggers

Formato
set_<tabla>_updated_at
Ejemplo
set_users_updated_at
set_drivers_updated_at

---

## Funciones

Todas las funciones propias vivirán dentro del esquema:
app
Ejemplos
app.handle_new_user()
app.update_updated_at_column()
app.calculate_fare()

---

# 5. Convenciones de Tipos

UUID
Identificadores.
TEXT
Campos largos.
VARCHAR
Solo cuando exista longitud máxima conocida.
BOOLEAN
Valores binarios.
TIMESTAMPTZ
Todas las fechas.
NUMERIC
Valores monetarios.
INTEGER
Cantidades.
SMALLINT
Catálogos pequeños.
JSONB
Configuraciones flexibles.

---

# 6. Convenciones de Auditoría

Toda entidad deberá incluir:
created_at
updated_at
Formato
TIMESTAMPTZ
DEFAULT NOW()

# 7. Convenciones de Auditoría

Todas las entidades persistentes deberán incluir información de auditoría básica.

Como mínimo deberán existir las siguientes columnas.

| Columna | Tipo | Obligatoria |
|----------|------|-------------|
| created_at | TIMESTAMPTZ | Sí |
| updated_at | TIMESTAMPTZ | Sí |

Formato recomendado:

```sql
created_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW(),

updated_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW()
```

---

## Actualización automática

La columna `updated_at` nunca será modificada manualmente.

Toda actualización deberá realizarse mediante el trigger oficial:

```
app.update_updated_at_column()
```

Cada tabla deberá registrar su propio trigger.

Ejemplo:

```sql
CREATE TRIGGER set_users_updated_at

BEFORE UPDATE

ON users

FOR EACH ROW

EXECUTE FUNCTION app.update_updated_at_column();
```

---

# 8. Soft Delete

Tachi evita eliminar información de negocio.

En lugar de eliminar registros, las entidades utilizarán estados de negocio.

Ejemplo:

ACTIVE
SUSPENDED
BLOCKED
INACTIVE

---

La eliminación física únicamente estará permitida para:

- tablas temporales
- logs temporales
- cachés
- tablas auxiliares

Nunca para entidades principales.

---

# 9. Convenciones para ENUM

Los ENUM oficiales deberán almacenarse dentro del esquema:

```
app
```

Ejemplo:

```sql
CREATE TYPE app.driver_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'BLOCKED'
);
```

No deberán crearse ENUM duplicados.

Cada ENUM representará un único concepto del dominio.

---

# 10. Relaciones

Toda relación entre entidades deberá implementarse mediante claves foráneas.

Ejemplo:

```sql
driver_id UUID
    REFERENCES drivers(id)
```

---

## ON DELETE

Las reglas serán las siguientes.

### CASCADE

Se utilizará cuando el registro hijo no tenga sentido sin el padre.

Ejemplo:

user_roles
driver_documents
trip_waypoints

---

### RESTRICT

Se utilizará cuando la eliminación deba impedirse.

Ejemplo:

roles
vehicle_types

---

### SET NULL

Se utilizará únicamente cuando la relación sea opcional.

Ejemplo:

current_vehicle_id
assigned_supervisor_id

---

# 11. Índices

Toda columna utilizada frecuentemente en búsquedas deberá poseer un índice.

Ejemplos.

```sql
email
status
driver_id
trip_id
created_at
```

---

Formato:

```sql
idx_<tabla>_<campo>
```

Ejemplos:

```
idx_users_email
idx_drivers_status
idx_trips_status
idx_driver_documents_expiration
```

---

## Índices Compuestos

Cuando una consulta utilice varias columnas simultáneamente, se crearán índices compuestos.

Ejemplo.

```sql
(driver_id, status)
(status, created_at)
(vehicle_id, active)
```

---

# 12. Migraciones

Cada migración será incremental.

Nunca deberá modificarse una migración previamente aplicada.

Formato.

```
0001_identity_domain.sql
0002_auth_sync.sql
0003_rls.sql
0004_driver_domain.sql
0005_vehicle_domain.sql
```

Cada migración deberá ser autocontenida.

---

## Orden

Cada migración deberá seguir la siguiente estructura.

1. Comentarios.
2. Esquemas.
3. Tipos ENUM.
4. Funciones.
5. Tablas.
6. Constraints.
7. Triggers.
8. Índices.
9. Datos iniciales.
10. Comentarios.

No deberá alterarse este orden.

---

# 13. Datos Iniciales (Seed Data)

Los datos obligatorios para el funcionamiento del sistema deberán incluirse dentro de la migración correspondiente.

Ejemplos:

Roles
Estados
Tipos de vehículos
Categorías
Configuraciones iniciales

---

Los datos de prueba nunca deberán incluirse dentro de las migraciones.

Se almacenarán mediante procesos independientes de seeding.

---

# 14. Comentarios SQL

Toda tabla deberá documentarse mediante:

```sql
COMMENT ON TABLE
```

Ejemplo.

```sql
COMMENT ON TABLE drivers IS
'Información profesional de los conductores.';
```

---

Las columnas críticas también deberán documentarse.

Ejemplo.

```sql
COMMENT ON COLUMN drivers.status IS
'Estado operativo actual del conductor.';
```

---

# 15. Esquemas

La base de datos utilizará únicamente los siguientes esquemas.

| Esquema | Uso |
|----------|-----|
| public | Tablas principales |
| auth | Autenticación administrada por Supabase |
| storage | Archivos |
| realtime | Eventos en tiempo real |
| app | Funciones, ENUM y lógica auxiliar |

No deberán crearse nuevos esquemas sin una justificación arquitectónica.

---

# 16. Row Level Security (RLS)

La seguridad de acceso a los datos será implementada utilizando Row Level Security (RLS) en PostgreSQL.

Todas las tablas que almacenen información de negocio deberán evaluar si requieren políticas RLS.

---

## Principios

Las políticas deberán cumplir las siguientes reglas:

- Denegar acceso por defecto.
- Permitir únicamente el acceso mínimo necesario.
- Basarse en `auth.uid()` siempre que sea posible.
- Evitar lógica compleja dentro de las políticas.
- Mantener una política por responsabilidad.

---

## Ejemplo

```sql
CREATE POLICY users_select_own

ON public.users

FOR SELECT

USING (

    auth.uid() = id

);
```

---

## Convenciones de nombres

Formato:

```
<tabla>_<acción>_<alcance>
```

Ejemplos:

```
users_select_own

users_update_own

drivers_select_supervisor

roles_select_authenticated
```

---

# 17. Funciones

Toda función desarrollada para el proyecto deberá almacenarse dentro del esquema:

```
app
```

Formato:

```
app.<nombre>()
```

Ejemplos:

```
app.handle_new_user()

app.update_updated_at_column()

app.calculate_trip_price()

app.validate_driver_documents()
```

---

## Convenciones

Las funciones deberán:

- Tener una única responsabilidad.
- Ser reutilizables.
- Estar documentadas.
- Utilizar nombres descriptivos.
- Evitar lógica innecesariamente compleja.

---

# 18. Triggers

Los triggers únicamente deberán utilizarse cuando aporten una ventaja clara sobre la lógica implementada desde la aplicación.

Casos permitidos:

- Auditoría.
- Actualización automática de fechas.
- Sincronización.
- Validaciones críticas.
- Integridad automática.

---

## Convención

Formato:

```
set_<tabla>_updated_at

handle_<evento>

sync_<tabla>
```

Ejemplos:

```
set_users_updated_at

set_drivers_updated_at

handle_new_user

sync_driver_status
```

---

# 19. Views

Las vistas deberán utilizarse para simplificar consultas frecuentes.

No deberán contener lógica de negocio.

Ejemplos futuros:

```
active_drivers

available_drivers

trip_statistics

monthly_income
```

---

# 20. Materialized Views

Las Materialized Views estarán reservadas para procesos analíticos.

Ejemplos:

- Reportes administrativos.
- Estadísticas.
- Dashboards.
- KPIs.

Nunca deberán utilizarse para operaciones transaccionales.

---

# 21. Performance

Todas las migraciones deberán considerar el rendimiento desde el diseño inicial.

---

## Consultas

Evitar:

- SELECT *
- Subconsultas innecesarias.
- JOIN excesivos.
- Funciones costosas sobre columnas indexadas.

---

## Índices

Agregar índices únicamente cuando exista una necesidad real.

Evitar índices innecesarios que afecten operaciones INSERT y UPDATE.

---

## Tipos de datos

Utilizar el tipo de dato más apropiado.

Ejemplos:

UUID

SMALLINT

BOOLEAN

NUMERIC

TIMESTAMPTZ

---

# 22. Versionado

Toda modificación estructural deberá realizarse mediante una nueva migración.

Nunca se permitirá modificar una migración previamente ejecutada.

Ejemplo correcto:

```
0008_add_driver_rating.sql
```

Ejemplo incorrecto:

Modificar:

```
0004_driver_domain.sql
```

---

# 23. Checklist de Revisión

Antes de aprobar cualquier migración deberán verificarse los siguientes puntos.

## Estructura

☐ Sigue el orden oficial.

☐ Utiliza nombres consistentes.

☐ Está documentada.

---

## Integridad

☐ Posee claves primarias.

☐ Posee claves foráneas.

☐ Define restricciones adecuadas.

---

## Auditoría

☐ Incluye created_at.

☐ Incluye updated_at.

☐ Posee trigger de actualización.

---

## Seguridad

☐ Evalúa necesidad de RLS.

☐ Incluye políticas cuando corresponda.

---

## Performance

☐ Índices correctamente definidos.

☐ Sin duplicidad.

☐ Consultas futuras optimizadas.

---

## Documentación

☐ COMMENT ON TABLE.

☐ COMMENT ON COLUMN cuando aplique.

☐ Comentarios generales.

---

# 24. Plantilla Oficial de Migración

Todas las migraciones del proyecto deberán seguir la siguiente estructura.

```sql
-- ==========================================================
-- TACHI
-- Nombre del Dominio
-- Migration: XXXX
-- ==========================================================

-- ==========================================================
-- ENUM
-- ==========================================================

-- ==========================================================
-- FUNCTIONS
-- ==========================================================

-- ==========================================================
-- TABLES
-- ==========================================================

-- ==========================================================
-- CONSTRAINTS
-- ==========================================================

-- ==========================================================
-- TRIGGERS
-- ==========================================================

-- ==========================================================
-- INDEXES
-- ==========================================================

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- ==========================================================
-- COMMENTS
-- ==========================================================
```

Esta plantilla constituye el estándar oficial para todas las migraciones del proyecto.

---

# 25. Evolución de la Base de Datos

La base de datos de Tachi ha sido diseñada para soportar la incorporación progresiva de nuevos dominios sin afectar los existentes.

Los próximos dominios previstos son:

- Driver
- Vehicle
- Trips
- Pricing
- Payments
- Ratings
- Notifications
- Promotions
- Administration
- Audit

Cada dominio deberá implementar sus propias migraciones respetando íntegramente las convenciones definidas en este documento.

---

# 26. Control del Documento

| Campo | Valor |
|-------|--------|
| Documento | 04-database-conventions.md |
| Estado | Aprobado |
| Versión | 1.0 |
| Responsable | Equipo de Arquitectura - Tachi |

---

# Conclusiones

Este documento establece el estándar oficial para el diseño y evolución de la base de datos del proyecto Tachi.

Su cumplimiento garantiza consistencia, mantenibilidad, escalabilidad y seguridad, proporcionando una base sólida para el desarrollo de todos los dominios de la plataforma.

Toda nueva migración deberá cumplir las convenciones aquí descritas antes de ser incorporada al repositorio principal.

Cualquier excepción deberá justificarse mediante una decisión de arquitectura documentada y aprobada por el equipo técnico.