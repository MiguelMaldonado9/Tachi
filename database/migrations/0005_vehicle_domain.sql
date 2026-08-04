-- ==========================================================
-- TACHI
-- Vehicle Domain
-- Migration: 0005
--
-- Responsabilidad:
-- Gestiona los vehículos asociados
-- a los conductores.
--
-- Incluye:
-- - Información del vehículo
-- - Características
-- - Documentación
-- - Estado operativo
--
-- Depende de:
-- - 0004_driver_domain.sql
--
-- ==========================================================



-- ==========================================================
-- ENUMS DEL DOMINIO VEHICLE
-- ==========================================================


CREATE TYPE app.vehicle_status AS ENUM (

    'ACTIVE',
    'INACTIVE',
    'BLOCKED'

);



CREATE TYPE app.vehicle_type AS ENUM (

    'CAR',
    'MOTORCYCLE',
    'SUV',
    'VAN'

);



-- ==========================================================
-- TABLA VEHÍCULOS
-- ==========================================================


CREATE TABLE IF NOT EXISTS app.vehicles (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),



    -- Conductor propietario

    driver_id UUID
        NOT NULL
        REFERENCES app.drivers(id)
        ON DELETE CASCADE,



    -- Estado administrativo

    status app.vehicle_status

        NOT NULL

        DEFAULT 'ACTIVE',



    -- Tipo vehículo

    type app.vehicle_type

        NOT NULL,



    -- ======================================================
    -- IDENTIFICACIÓN DEL VEHÍCULO
    -- ======================================================


    brand VARCHAR(50)
        NOT NULL,


    model VARCHAR(50)
        NOT NULL,


    year INTEGER
        NOT NULL,


    color VARCHAR(50),


    plate VARCHAR(20)
        UNIQUE
        NOT NULL,



    -- ======================================================
    -- INFORMACIÓN OPERATIVA
    -- ======================================================


    seats INTEGER

        DEFAULT 4,



    -- ======================================================
    -- DOCUMENTACIÓN
    -- ======================================================


    soat_expiration DATE,


    technical_review_expiration DATE,



    -- ======================================================
    -- AUDITORÍA
    -- ======================================================


    created_at TIMESTAMP WITH TIME ZONE

        DEFAULT NOW()

        NOT NULL,


    updated_at TIMESTAMP WITH TIME ZONE

        DEFAULT NOW()

        NOT NULL


);



-- ==========================================================
-- ÍNDICES
-- ==========================================================



CREATE INDEX idx_vehicle_driver

ON app.vehicles(driver_id);



CREATE INDEX idx_vehicle_plate

ON app.vehicles(plate);



CREATE INDEX idx_vehicle_status

ON app.vehicles(status);



-- ==========================================================
-- TRIGGER UPDATED_AT
-- ==========================================================



CREATE OR REPLACE FUNCTION app.update_vehicle_timestamp()

RETURNS TRIGGER

LANGUAGE plpgsql

AS $$

BEGIN


    NEW.updated_at = NOW();


    RETURN NEW;


END;


$$;



CREATE TRIGGER trigger_update_vehicle_timestamp


BEFORE UPDATE

ON app.vehicles


FOR EACH ROW


EXECUTE FUNCTION app.update_vehicle_timestamp();




-- ==========================================================
-- COMENTARIOS
-- ==========================================================


COMMENT ON TABLE app.vehicles IS

'Vehículos registrados dentro de la plataforma Tachi';



COMMENT ON COLUMN app.vehicles.plate IS

'Placa única del vehículo';



COMMENT ON COLUMN app.vehicles.driver_id IS

'Conductor propietario asociado';



-- ==========================================================
-- FIN MIGRATION 0005
-- ==========================================================