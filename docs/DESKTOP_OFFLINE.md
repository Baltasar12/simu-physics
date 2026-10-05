# Versión de escritorio offline

## Qué hace cada herramienta

React implementa los controles, resultados, gráficos y simulaciones SVG. Los modelos de `src/physics/` son los mismos en web y escritorio. Next.js organiza las cuatro rutas y construye sus HTML, CSS, JavaScript y datos de navegación. Electron aporta una ventana de Windows y un navegador Chromium incluido en la aplicación. electron-builder reúne Electron y los archivos exportados en un EXE portable.

No hay una segunda aplicación React ni un servidor Next.js dentro del EXE. La versión desktop no abre una URL de Vercel.

## Compilaciones separadas

Desde la raíz del repositorio, con Node.js 22.12 o posterior y npm instalados **solo en la computadora de desarrollo**:

```powershell
npm ci
npm test
npm run lint
npm run build
npm run build:desktop
npm run dev:desktop
npm run dist:portable
```

`npm run build` conserva el build web para Vercel. `build:desktop` activa `DESKTOP_EXPORT=1` únicamente para ese proceso y hace que Next.js use `output: "export"`. `dev:desktop` reconstruye la exportación y la abre en Electron; sirve como vista previa local y no ofrece recarga automática al editar. `dist:portable` ejecuta el build desktop y el empaquetado completo en orden. La salida final es `dist/Laboratorio-Electromagnetismo-Portable.exe`.

No se debe configurar `DESKTOP_EXPORT` en el entorno de producción de Vercel. La rama y la configuración de producción de Vercel no se modifican al ejecutar estos comandos localmente.

## Qué se incluye

La exportación real de Next.js 16.3.4 contiene `index.html`, un HTML y un `.txt` por cada simulador, recursos CSS/JS en `_next/static/` y otros `.txt` de React Server Components en la raíz y en carpetas de cada ruta. Estos archivos se copian íntegramente al directorio `resources/web` del paquete. `electron/package.json` y `electron/main.cjs` forman el paquete mínimo de Electron. `electron/skip-dependencies.cjs` impide que electron-builder incorpore las dependencias del proyecto Next.js al ASAR: la interfaz ya está compilada en `out/`.

Los PDF de la raíz, el código fuente, los tests y `.next/` no se empaquetan. La compilación requiere Internet para instalar o descargar herramientas cuando aún no están en caché; **la ejecución del EXE no lo requiere**.

## Cómo se cargan los recursos locales

El proceso principal de Electron registra `app://laboratorio/` como esquema local seguro y estándar. Traduce `/` a `index.html` y cada ruta fija a su HTML. Los CSS, JS y datos `.txt` se resuelven dentro de `resources/web`; las peticiones RSC de Next 16 que usan puntos se mapean a las subcarpetas que produjo la exportación. Las query strings se ignoran para localizar el archivo. Una petición a un recurso inexistente recibe 404.

La ventana usa `nodeIntegration: false`, `contextIsolation: true` y `sandbox: true`. No hay preload ni IPC. El protocolo impide acceder a rutas fuera del paquete; se bloquean nuevas ventanas, navegación a otros orígenes y permisos no utilizados. Los HTML se sirven con una Content Security Policy que permite los recursos locales y calcula hashes para los scripts inline generados por Next.js. La aplicación no necesita que React acceda al sistema de archivos.

## Distribución y requisitos

Copiá **solo** `dist/Laboratorio-Electromagnetismo-Portable.exe` a una carpeta o pendrive y abrilo en Windows 10/11 x64. La computadora de destino no necesita Node.js, npm, instalación de la aplicación, administrador en condiciones normales ni conexión a Internet. El EXE puede extraer recursos en `%TEMP%` al arrancar; por eso se necesita permiso de escritura y espacio libre allí. Electron también puede guardar caché o datos de perfil del usuario en AppData. “Portable” no significa que no deje archivos temporales.

El ejecutable de esta entrega no tiene firma digital. Windows SmartScreen o políticas institucionales pueden advertir o impedir su ejecución, especialmente desde USB. No se debe desactivar SmartScreen ni el antivirus para distribuirlo. Una organización podría requerir autorización de su área de sistemas.

## Cómo validar la entrega

1. Ejecutar `npm test`, `npm run lint`, `npm run build` y `npm run dist:portable`.
2. Abrir el EXE en Windows y navegar desde la portada a los tres laboratorios. Probar enlaces, volver, atrás/adelante y recargar cada ruta.
3. En resistencia, variar material, longitud, diámetro, corriente y temperatura; revisar resultados, SVG y los tres gráficos.
4. En campo magnético, variar carga, rapidez, campo, ángulo y signo; revisar dirección, vectores y gráfico.
5. En movimiento circular, variar masa, carga, rapidez y campo; revisar radio, sentido, gráfico, reanudar, pausar y reiniciar.
6. Cortar la conexión a Internet de forma controlada y repetir la navegación y los controles. Cerrar y volver a abrir el EXE.
7. Repetir desde otra carpeta y, si está disponible, desde un pendrive y desde un Windows x64 sin Node.js instalado.

En la implementación se probó el EXE real con emulación de red offline de Chromium: las cuatro rutas, recarga, navegación cliente, controles representativos, gráficos y animación funcionaron sin solicitudes remotas observadas. Esto no sustituye una prueba en otra computadora, con adaptador de red desconectado ni desde un pendrive físico.

## Git y Vercel

El trabajo desktop se desarrolla en `feature/desktop-offline`; `main` conserva la versión web. La configuración de Vercel no se cambia, y no hace falta desplegar el EXE. Los despliegues de producción visibles de `simu-physics` provienen de `main`, incluido el commit `e968301`; el ajuste de rama de producción del proyecto no pudo consultarse mediante la conexión y debe confirmarse en el panel. Las implementaciones física, React y las rutas se comparten. El repositorio ignora `out/`, `dist/`, `.next/` y los PDF locales.
