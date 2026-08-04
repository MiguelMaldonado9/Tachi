# 🚖 Manual de Operación: Ecosistema Tachi

Este documento contiene los comandos exactos y las instrucciones paso a paso para levantar el backend en TypeScript y la aplicación móvil de Flutter en tu dispositivo físico Infinix Hot 40i.

# 🌐 Parte 1: Levantar el Servidor Backend

Antes de encender la aplicación móvil, el servidor central debe estar corriendo y escuchando peticiones en la red local. (Conectado a la misma red wifi)

Paso Único: Arrancar el Backend Global

Abre una terminal en Visual Studio Code posicionada en la raíz del proyecto (tachi/) y ejecuta:

pnpm dev


# ¿Para qué sirve?:
 Este comando utiliza el gestor de paquetes pnpm para ejecutar el script de desarrollo. Internamente, activa la herramienta tsx watch en la carpeta /backend.

# ¿Qué hace por detrás?:

 1. Enciende el servidor de TypeScript en el puerto 3000.
 2. Establece la conexión en tiempo real con tu base de datos en Supabase.
 3. Monitorea los cambios: Se queda escuchando en la IP de tu computadora (http://192.168.1.11:3000). Si modificas un archivo del backend, el servidor se reinicia automáticamente en un milisegundo para aplicar el cambio.
 
 # 📱 Parte 2: Levantar la Aplicación Móvil (Pasajero)
 
 Una vez que la terminal del backend muestre el mensaje Server listening at http://192.168.1.11:3000, puedes proceder a encender la aplicación en tu celular.
 
 # Paso 1: Conectar el Hardware
 
 1. Conecta tu teléfono Infinix Hot 40i a la computadora mediante el cable USB.
 2. Asegúrate de que en la barra de notificaciones esté activado el modo de Transferencia de archivos o Solo Carga (según el modo que forzó el cuadro flotante la última vez).
 3. Verifica que la Depuración USB esté encendida en las Opciones de Desarrollador de tu Infinix.
 4. Regla de oro: Confirma que tu celular Infinix esté conectado a la misma red Wi-Fi de tu casa que la computadora.
 
 # Paso 2: Navegar a la carpeta del Frontend
 
 * Abre una segunda pestaña de terminal en VS Code (dejando el backend corriendo en la primera) y muévete a la carpeta del pasajero:
 
 cd apps/user_app

# ¿Para qué sirve?: 

Cambia el directorio de trabajo de la consola hacia la aplicación de Flutter del usuario, que es donde viven el archivo pubspec.yaml y el código de las pantallas.

# Paso 3: Lanzar la Aplicación en el Infinix

Ejecuta el comando de compilación nativa apuntando directamente al número de serie de tu teléfono:

flutter run -d 112257046H009553


# ¿Para qué sirve?: 

Compila el código Dart de Tachi, inyecta los iconos oscuros premium que configuramos y despliega la aplicación directamente en la pantalla de tu celular físico.

# Atributo -d: 
Le ordena a Flutter ignorar los navegadores web (Chrome/Edge) e instalar el paquete estrictamente en el dispositivo con ID 112257046H009553 (tu Infinix).

# ⚡ Parte 3: Comandos de Control en Vivo (Hot Reload)

Mientras la aplicación de Flutter esté corriendo en tu celular y la terminal esté abierta, puedes usar estos atajos de teclado presionando la tecla directamente sobre la consola de VS Code:

* r (minúscula) - Hot Reload: Aplica cambios visuales instantáneos (como cambiar un color, un texto o un margen) en menos de un segundo sin reiniciar la app ni perder los datos escritos en los formularios.

* R (mayúscula) - Hot Restart: Reinicia por completo el motor de la aplicación en el teléfono. Es obligatorio usarlo cuando creas archivos lógicos nuevos, cambias rutas de navegación o modificas la estructura del main.dart.

* Ctrl + C - Detener Proceso: Apaga por completo la ejecución de la aplicación o del servidor y libera la memoria RAM de tu computadora.

# 🛠️ Parte 4: Diagnóstico Rápido de Errores (Mantenimiento)

Si en el futuro un comando llega a fallar o no detecta tu teléfono, ejecuta estas herramientas de auxilio en la ruta apps/user_app:

* flutter devices: Te muestra la lista de pantallas conectadas. Úsalo si VS Code no detecta tu Infinix al escribir el comando principal.

* flutter pub get: Descarga y actualiza las librerías del proyecto (como el almacenamiento seguro o los iconos). Úsalo si te salen líneas rojas de error en los import del código.

* dart run flutter_launcher_icons: Vuelve a generar y empaquetar los iconos negros de Tachi en el menú de Android. Úsalo si llegas a cambiar las imágenes en la carpeta de assets.

* flutter doctor: Realiza un escaneo completo de la salud de tu computadora (Android Studio, licencias, SDK, etc.).


# 🚀 Aplica el Cambio en tu Terminal

Una vez que guardes la nueva imagen con el colchón transparente alrededor, ve a la terminal de tu user_app y ejecuta los comandos para que Android procese la nueva escala:

dart run flutter_launcher_icons

# Y luego reinstala limpia en tu Infinix:

flutter run -d 112257046H009553
