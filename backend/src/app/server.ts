// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la fábrica que inicializa y configura la app
import { buildApp } from "./app.js"; 
import { env } from "../config/env.js";

// ==========================================
// ARRANQUE Y CONFIGURACIÓN DEL SERVIDOR
// ==========================================

/**
 * Función de Arranque (Bootstrap)
 * 
 * Se encarga de construir la aplicación mediante la fábrica, definir el puerto
 * de escucha y levantar el servidor HTTP para empezar a recibir peticiones.
 */


async function startServer() {
  try {
    // 1. Instancia la aplicación con toda la configuración previa (plugins, rutas, errores)
    const app = await buildApp();

    // 2. Define el puerto de escucha (usa variables de entorno o el puerto 3000 por defecto)
    const PORT = env.PORT;

    // 3. Pone al servidor en modo "escucha" (Listen)
    // Usamos '0.0.0.0' como host para permitir conexiones externas (vital para Docker o redes locales)
    await app.listen({ 
      port: PORT, 
      host: "0.0.0.0" 
    });

    // Nota: El log de "Servidor corriendo en el puerto..." se maneja automáticamente 
    // gracias a la configuración de 'logger' que le inyectamos a Fastify en app.ts.

  } catch (error) {
    // 4. Control de fallos críticos en el arranque del sistema
    // Si la base de datos no conecta o un plugin falla, imprimimos el error y cerramos el proceso
    console.error("❌ Error crítico al arrancar el servidor:", error);
    process.exit(1); 
  }
}

// Ejecuta la función para iniciar el backend
startServer();
