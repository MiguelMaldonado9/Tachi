# Modelo de Dominio - Plataforma Tachi

## Objetivo

Este documento define el modelo de dominio principal de la plataforma Tachi.

El objetivo es identificar las entidades del negocio, sus responsabilidades y relaciones antes de diseñar la base de datos física en PostgreSQL (Supabase).

La autenticación será administrada por Supabase Auth.

Toda la lógica de negocio será responsabilidad del Backend Tachi.

---

## Principios

- Una única fuente de verdad para cada dato.
- No duplicar información.
- Separar autenticación del negocio.
- Escalabilidad desde el MVP hasta producción.
- Arquitectura preparada para microservicios.