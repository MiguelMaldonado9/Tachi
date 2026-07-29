# Guía de Contribución (Contributing)

¡Bienvenido al monorrepo de **Tachi**! Para mantener la calidad del código, la estabilidad de la arquitectura orientada a eventos y la consistencia en el despliegue con Supabase, seguimos un flujo de trabajo estricto.

---

## 🧭 Flujo de Git (Git Flow)

Adoptamos el modelo estándar de **Git Flow** para la gestión de ramas. Por favor, asegúrate de crear tus ramas desde el origen correcto y apuntar tus *Pull Requests* (PR) de forma adecuada.

### Ramas Principales
* **`main`**: Rama de **Producción**. Contiene únicamente código estable, probado y listo para los usuarios finales. No se permiten *commits* directos aquí.
* **`develop`**: Rama de **Desarrollo**. Es el punto de integración para todas las nuevas características y el estado base para las pruebas de integración.

### Ramas de Soporte (Temporales)
* **`feature/*`**: Ramas para **Nuevas Funcionalidades**. Se crean a partir de `develop` y se vuelven a integrar en `develop`.
  * *Ejemplo:* `feature/auth-login`, `feature/driver-location`
* **`bugfix/*`**: Ramas para **Correcciones**. Se usan para solucionar fallos encontrados en la rama `develop`.
* **`hotfix/*`**: Ramas para **Correcciones Críticas**. Se crean directamente desde `main` para resolver errores urgentes en producción y se integran tanto en `main` como en `develop`.
* **`release/*`**: Ramas para **Preparación de Versiones**. Separan el código de `develop` para congelar funcionalidades, pulir detalles finales y subir la versión en el `CHANGELOG.md`.

---

## 📝 Estándar de Commits (Conventional Commits)

Para que nuestro historial de Git sea legible y podamos automatizar las versiones de software, exigimos que los mensajes de los *commits* sigan la estructura de **Conventional Commits**:

```text
<tipo>(<alcance>): <descripción corta en minúsculas>
```

### Tipos Permitidos
* **`feat`**: Una nueva funcionalidad para el sistema (ej. `feat(auth): add login endpoint with zod validation`).
* **`fix`**: Una corrección de un error en el código (ej. `fix(events): isolate handler loop crash in memory bus`).
* **`docs`**: Cambios exclusivos en la documentación (ej. `docs(readme): update environment variables setup`).
* **`style`**: Cambios que no afectan la lógica del código (espacios, formateo, comillas, punto y coma, etc.).
* **`refactor`**: Modificación de código que no corrige un error ni añade una funcionalidad (ej. optimizar un repositorio).
* **`test`**: Añadir o corregir pruebas unitarias o de integración (ej. `test(events): add fan out subscriber suite via vitest`).
* **`chore`**: Actualizaciones de tareas de mantenimiento, dependencias o configuración del monorrepo.

---

## 🛠️ Proceso para Enviar Cambios

1. **Actualiza tu entorno**: Asegúrate de tener la última versión de la rama `develop` (`git pull origin develop`).
2. **Crea tu rama**: Usa el prefijo correspondiente a tu tarea (ej. `git checkout -b feature/modulo-conductores`).
3. **Escribe código limpio**: Respeta el estándar de comentarios estructurados y los tipos estrictos de TypeScript.
4. **Ejecuta las pruebas**: Corre la suite de pruebas locales (`npm test` o `vitest`) antes de subir tus cambios.
5. **Haz tu Commit**: Sigue el estándar de mensajes (ej. `git commit -m "feat(drivers): model base repository architecture"`).
6. **Abre un Pull Request**: Apunta siempre tu rama de características hacia `develop` para su revisión por pares.
