-- ==========================================================
-- TACHI
-- Driver Domain
-- Migration: 0004
-- ==========================================================
--
-- DESCRIPCIÓN:
--
-- Este módulo representa el dominio de conductores dentro
-- de la plataforma Tachi.
--
-- Un conductor NO es una entidad independiente.
-- Está vinculado directamente con un usuario existente
-- dentro del sistema de identidad.
--
-- Relación principal:
--
-- auth.users
--      |
--      |
-- public.users
--      |
--      |
-- app.drivers
--
-- Responsabilidades:
--
-- - Gestión del perfil operativo del conductor.
-- - Control de aprobación administrativa.
-- - Estado disponible/no disponible.
-- - Gestión documental.
-- - Historial de cambios de estado.
--
-- ==========================================================



-- ==========================================================
-- EXTENSIONES NECESARIAS
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;



-- ==========================================================
-- TIPOS DEL DOMINIO
-- ==========================================================

-- ----------------------------------------------------------
-- Estado operativo del conductor
--
-- Define el ciclo de vida dentro de Tachi.
--
-- PENDING:
-- Conductor registrado esperando aprobación.
--
-- ACTIVE:
-- Conductor aprobado y habilitado.
--
-- INACTIVE:
-- Conductor registrado pero no operativo.
--
-- SUSPENDED:
-- Suspendido temporalmente por administración.
--
-- BLOCKED:
-- Bloqueado permanentemente.
-- ----------------------------------------------------------

CREATE TYPE app.driver_status AS ENUM (

    'PENDING',
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'BLOCKED'

);



-- ==========================================================
-- TABLA PRINCIPAL
-- CONDUCTORES
-- ==========================================================

CREATE TABLE app.drivers (

    -- La identidad del conductor corresponde
    -- al usuario existente del sistema.
    --
    -- Relación:
    -- public.users.id
    id UUID PRIMARY KEY
        REFERENCES public.users(id)
        ON DELETE CASCADE,


    -- Estado actual del conductor.
    status app.driver_status
        NOT NULL DEFAULT 'PENDING',


    -- Número de licencia de conducción.
    license_number TEXT
        NOT NULL,


    -- Categoría de licencia.
    --
    -- Ejemplo:
    -- C1
    -- C2
    -- C3
    --
    license_category TEXT,


    -- Número telefónico operativo.
    phone TEXT,


    -- Indica si el conductor está actualmente
    -- disponible para recibir solicitudes.
    --
    -- Importante:
    -- Este campo será utilizado posteriormente
    -- por el Matching Engine.
    is_available BOOLEAN
        NOT NULL DEFAULT FALSE,


    -- Fecha de aprobación administrativa.
    approved_at TIMESTAMPTZ,


    -- Usuario administrador que aprobó.
    approved_by UUID
        REFERENCES public.users(id),


    -- Control de creación.
    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW(),


    -- Control de actualización.
    updated_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

);



-- ==========================================================
-- DOCUMENTOS DEL CONDUCTOR
-- ==========================================================
--
-- Guarda referencias a documentos almacenados
-- normalmente en servicios externos como:
--
-- Cloudinary
-- Storage privado
--
-- Ejemplos:
--
-- - Documento identidad
-- - Licencia
-- - SOAT
-- - Revisión técnico mecánica
--
-- ==========================================================


CREATE TABLE app.driver_documents (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),


    -- Conductor propietario del documento.
    driver_id UUID
        NOT NULL
        REFERENCES app.drivers(id)
        ON DELETE CASCADE,


    -- Tipo de documento.
    --
    -- Ejemplos:
    --
    -- IDENTITY
    -- LICENSE
    -- INSURANCE
    -- VEHICLE_DOCUMENT
    --
    document_type TEXT
        NOT NULL,


    -- Ubicación del archivo.
    document_url TEXT
        NOT NULL,


    -- Estado de validación administrativa.
    verified BOOLEAN
        NOT NULL DEFAULT FALSE,


    -- Fecha de validación.
    verified_at TIMESTAMPTZ,


    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

);



-- ==========================================================
-- HISTORIAL DE ESTADOS DEL CONDUCTOR
-- ==========================================================
--
-- Permite conocer:
--
-- - quién cambió el estado
-- - cuándo ocurrió
-- - motivo del cambio
--
-- Ejemplo:
--
-- PENDING
--    |
--    v
-- ACTIVE
--    |
--    v
-- SUSPENDED
--
-- ==========================================================


CREATE TABLE app.driver_status_history (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),


    driver_id UUID
        NOT NULL
        REFERENCES app.drivers(id)
        ON DELETE CASCADE,


    -- Estado anterior.
    old_status app.driver_status,


    -- Nuevo estado asignado.
    new_status app.driver_status
        NOT NULL,


    -- Usuario que realizó el cambio.
    --
    -- Normalmente:
    -- administrador o supervisor.
    changed_by UUID
        REFERENCES public.users(id),


    -- Motivo del cambio.
    reason TEXT,


    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

);



-- ==========================================================
-- ÍNDICES
-- ==========================================================

-- Búsqueda rápida por estado.
CREATE INDEX idx_drivers_status
ON app.drivers(status);



-- Búsqueda rápida de conductores disponibles.
--
-- Será utilizado por:
-- Matching Engine.
--
CREATE INDEX idx_drivers_available
ON app.drivers(is_available);



-- Buscar documentos por conductor.
CREATE INDEX idx_driver_documents_driver
ON app.driver_documents(driver_id);



-- Historial por conductor.
CREATE INDEX idx_driver_status_history_driver
ON app.driver_status_history(driver_id);



-- ==========================================================
-- TRIGGERS
-- ==========================================================

-- Actualización automática del campo updated_at.
--
-- Utiliza la función creada en:
--
-- 0001_identity_domain.sql
--
-- app.update_updated_at()
--

CREATE TRIGGER trg_drivers_updated_at

BEFORE UPDATE

ON app.drivers

FOR EACH ROW

EXECUTE FUNCTION app.update_updated_at();



-- ==========================================================
-- COMENTARIOS SQL
-- ==========================================================

COMMENT ON TABLE app.drivers IS

'Entidad operativa de conductores registrados en Tachi';


COMMENT ON TABLE app.driver_documents IS

'Documentos asociados al proceso de validación del conductor';


COMMENT ON TABLE app.driver_status_history IS

'Historial de cambios de estado administrativos del conductor';



-- ==========================================================
-- FIN MIGRATION
-- ==========================================================