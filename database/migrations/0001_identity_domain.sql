-- ==========================================================
-- TACHI
-- Identity Domain
-- Migration: 0001
-- ==========================================================

-- ==========================================================
-- ESQUEMA INTERNO
-- ==========================================================
CREATE SCHEMA IF NOT EXISTS app;

CREATE TYPE app.user_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED',
    'BLOCKED'
);

-- ==========================================================
-- Función para actualizar automáticamente updated_at
-- ==========================================================

CREATE OR REPLACE FUNCTION app.update_updated_at_column()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;

$$;


-- ==========================================================
-- TABLA DE ROLES
-- ==========================================================
CREATE TABLE roles (

    id SMALLSERIAL PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ 
        NOT NULL 
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ 
        NOT NULL 
        DEFAULT NOW()

);

-- ==========================================================
-- TRIGGER
-- ==========================================================
CREATE TRIGGER set_roles_updated_at

BEFORE UPDATE

ON roles

FOR EACH ROW

EXECUTE FUNCTION app.update_updated_at_column();

COMMENT ON TABLE roles IS
'Catálogo de roles disponibles en la plataforma.';

-- ==========================================================
-- TABLA DE USUARIOS
-- ==========================================================
CREATE TABLE users (

    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT 
        NOT NULL 
        UNIQUE,    

    full_name TEXT NOT NULL,

    phone VARCHAR(20) UNIQUE,

    photo_url TEXT,

    status app.user_status
        NOT NULL
        DEFAULT 'PENDING',

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()

);

COMMENT ON TABLE users IS
'Información de negocio del usuario autenticado mediante Supabase Auth.';


-- ==========================================================
-- TRIGGER
-- ==========================================================
CREATE TRIGGER set_users_updated_at

BEFORE UPDATE

ON users

FOR EACH ROW

EXECUTE FUNCTION app.update_updated_at_column();


-- ==========================================================
-- TABLA DE USUARIOS / ROLES
-- ==========================================================
CREATE TABLE user_roles (

    user_id UUID
        NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    role_id SMALLINT
        NOT NULL
        REFERENCES roles(id)
        ON DELETE RESTRICT,

    assigned_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

    PRIMARY KEY (
        user_id,
        role_id
    )

);

COMMENT ON TABLE user_roles IS
'Relación N:M entre usuarios y roles.';

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX idx_roles_name
ON roles(name);

CREATE INDEX idx_users_status
ON users(status);

CREATE INDEX idx_user_roles_role
ON user_roles(role_id);


-- ==========================================================
-- ROLES INICIALES
-- ==========================================================
INSERT INTO roles (
    name,
    description
)
VALUES

(
    'ADMIN',
    'Administrador del sistema'
),

(
    'SUPERVISOR',
    'Supervisor operativo'
),

(
    'DRIVER',
    'Conductor'
),

(
    'PASSENGER',
    'Pasajero'
);
