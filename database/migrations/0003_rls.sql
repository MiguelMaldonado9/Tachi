-- ==========================================================
-- TACHI
-- Security
-- Migration: 0003
-- ==========================================================

-- ==========================================================
-- Habilitar Row Level Security
-- ==========================================================

ALTER TABLE public.users
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.roles
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_roles
ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- POLICY
-- USERS permite que un usuario autenticado consulte unicamente su propia perfil
-- Cada usuario puede consultar únicamente su información.
-- ==========================================================

CREATE POLICY users_select_own
ON public.users

FOR SELECT

USING (

    auth.uid() = id

);

-- ==========================================================
-- USERS
-- Cada usuario puede actualizar únicamente su perfil.
-- ==========================================================

CREATE POLICY users_update_own
ON public.users

FOR UPDATE

USING (

    auth.uid() = id

);

-- ==========================================================
-- USER ROLES
-- Cada usuario puede consultar sus propios roles.
-- ==========================================================

CREATE POLICY user_roles_select_own
ON public.user_roles

FOR SELECT

USING (

    auth.uid() = user_id

);

-- ==========================================================
-- ROLES
-- Solo lectura para usuarios autenticados.
-- ==========================================================

CREATE POLICY roles_select_authenticated
ON public.roles

FOR SELECT

TO authenticated

USING (

    true

);