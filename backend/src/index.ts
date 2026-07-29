// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Inicializa y carga las variables de entorno del archivo .env en 'process.env' (Debe ir primero)
import "dotenv/config"; 

// Importa la fábrica que inicializa y configura la app (plugins, rutas, errores)
import { buildApp } from "./app/app.js"; 

// ==========================================
// ARRANQUE Y CONFIGURACIÓN DEL ENTORNO
// ==========================================

// Define el puerto de escucha (usa la variable de entorno del sistema o el puerto 3000 por defecto)
const PORT = Number(process.env.PORT) || 3000;

/**
 * Función Principal de Arranque (Main Bootstrap)
 * 
 * Invoca la construcción de la aplicación Fastify, levanta el servidor HTTP 
 * en red local/externa y gestiona los bloqueos críticos del sistema.
 */
async function start() {
  // 1. Instancia la aplicación con toda la configuración modular cargada
  const app = await buildApp();

  try {
    // 2. Pone al servidor en modo "escucha" (Listen)
    // Usamos '0.0.0.0' como host para permitir conexiones externas (Docker, redes locales, etc.)
    await app.listen({ 
      port: PORT, 
      host: "0.0.0.0", 
    });

    // 3. Imprime el mensaje de éxito en la consola del desarrollador
    console.log(`🚀 Tachi Backend running on port ${PORT}`);

  } catch (error) {
    // 4. Captura fallos graves en el encendido (ej. base de datos inaccesible o puerto ocupado)
    // Registra el error detallado a través del logger oficial de la app
    app.log.error(error);
    
    // Apaga el proceso del sistema operativo inmediatamente con un código de salida por error (1)
    process.exit(1);
  }
}

// Ejecuta la inicialización global del backend
start();
