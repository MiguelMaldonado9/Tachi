-- ==========================================================
-- TACHI
-- Auth Sync
-- Migration: 0002
-- ==========================================================

CREATE OR REPLACE FUNCTION app.handle_new_user()

RETURNS TRIGGER

LANGUAGE plpgsql

SECURITY DEFINER

SET search_path = public, auth, app

AS $$

BEGIN

    INSERT INTO public.users (

        id,

        email,

        full_name,

        status

    )

    VALUES (

        NEW.id,

        NEW.email,

        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            ''
        ),

        'PENDING'

    );

    RETURN NEW;

END;

$$;

-- ==========================================================
-- TRIGGER
-- ==========================================================
CREATE TRIGGER handle_new_user

AFTER INSERT

ON auth.users

FOR EACH ROW

EXECUTE FUNCTION app.handle_new_user();