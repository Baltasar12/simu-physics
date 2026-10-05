# Cierre de ramas y entrega — TP4

Baltasar Barbaglia · Ingeniería Informática, UNSTA · Física II 2026.

Verificado el 05/10/2026. Consigna: entrega 07/10/2026. Este informe actualiza el estado histórico de [INFORME_TP4.md](INFORME_TP4.md).

## 1. Mapa inicial comprobado antes de integrar

| Referencia | HEAD inicial | Contenido y estado |
| --- | --- | --- |
| `main` | `e968301` | Web con tres laboratorios; sin checkout propio. Seguimiento de `origin/main`. |
| `origin/main` | `e968301` | Única rama del remoto confirmada por `git ls-remote --heads origin`. |
| `feature/tp4-helmholtz` | `e968301` | TP4 completo, cambios sin staging/commit, en worktree separado. |
| `feature/desktop-offline` | `e968301` | Checkout original con implementación Electron sin commit. |
| `offline/tp4` | No existía | Ausente localmente y en el remoto; se creó a partir del checkout desktop conservando sus cambios. |

Consultas: `git branch -a`, `git worktree list --porcelain`, `git log --graph --decorate --oneline --all`, estados de ambos checkouts, configuración Git, remoto y documentación. No se inició ninguna integración antes de informar este mapa.

## 2. Rama online y Vercel

Proyecto conectado: `simu-physics`, ID `prj_4WDODfKW4GqBx6kz8F0pHAGj6JnE`, equipo `team_udVmLF6ucEbEWSwP4ci9HHo7`. La consulta de producción encontró dos despliegues READY procedentes de `main`: `e968301` y `6620379`. Por lo tanto, la rama utilizada según evidencia de despliegues es **main**; inicialmente era idéntica a `origin/main` y no contenía cambios adicionales.

Dominio de producción asociado y verificado: **https://simu-physics.vercel.app**. La respuesta del proyecto no expuso el ajuste de Production Branch; queda su confirmación manual en Settings → Git del panel. No se inventó esa configuración ni se modificó el proyecto Vercel.

`main` incorporó TP4 por fast-forward. Tiene Inicio y `/resistencia`, `/campo-magnetico`, `/movimiento-circular`, `/bobinas-helmholtz`. No incorpora Electron, electron-builder, scripts desktop, `DESKTOP_EXPORT`, protocolo app ni configuración del portable. El script `build:static` sigue siendo una exportación general opcional; el build web normal no activa `output:"export"`.

La URL pública todavía contiene el despliegue anterior. La nueva versión de cuatro laboratorios está validada **localmente**, pendiente de push/publicación autorizados. El correo conserva un placeholder hasta comprobar TP4 en producción.

## 3. Registro e integración

| Commit | Rama / función |
| --- | --- |
| `1de9fb5` — `feat(physics): add Helmholtz coil laboratory` | TP4 compartido: código, tests, guía con nombre completo y capturas. Integrado en `main` por fast-forward, sin commit de merge adicional. |
| `172fffc` — `feat(desktop): package offline laboratory with Electron` | Conserva todo el trabajo Electron previamente sin commit, registrado en `offline/tp4`. |
| `0b83d07` — `feat(desktop): integrate Helmholtz into offline TP4` | Merge local de TP4 en `offline/tp4`, con resolución combinada de configuración y lockfile. Código con el que se construyó y probó el EXE. |

El staging de TP4 se revisó por nombre: no incluyó PDF, `out/`, `dist/`, `node_modules`, temporales ni Electron. `feature/desktop-offline` conserva su referencia histórica `e968301`; sus cambios antes no registrados están preservados en `172fffc`, no descartados. No se creó una rama desktop adicional a la solicitada `offline/tp4`.

Conflictos efectivos: `package.json`, `package-lock.json`, `next.config.ts` y `eslint.config.mjs`. Se resolvieron leyendo ambas versiones. El manifest conserva dependencias 3D y desktop. El lock se consolidó con las resoluciones de ambas ramas y se normalizó mediante npm, manteniendo `cross-env@10.1.0` como dependencia desktop declarada; Drei conserva la resolución transitiva necesaria. `npm ci` instaló la configuración combinada correctamente. No se usó selección automática ours/theirs.

Se conservaron README, documentación y exclusiones; TypeScript excluye `out/`, `dist/` y `tmp/`, para no volver a compilar fuentes copiadas entre recursos generados. `entrega/` está ignorado: los binarios y el ZIP no ingresan en Git.

Scripts de `offline/tp4`:

- `npm run build`: Next web normal.
- `npm run build:static`: `STATIC_EXPORT=1`, exportación general.
- `npm run build:desktop`: `DESKTOP_EXPORT=1`, exportación para Electron.
- `npm run dist:portable`: build desktop seguido de electron-builder con `--publish never`.

La configuración offline centraliza `isStaticBuild = STATIC_EXPORT === "1" || DESKTOP_EXPORT === "1"`. Los scripts conservan intenciones diferentes. `git diff main offline/tp4 -- src` no encontró diferencias: **la física y la interfaz de los cuatro laboratorios son idénticas**.

## 4. Validación ejecutada

| Rama / fase | Resultado |
| --- | --- |
| TP4 antes del commit | 68 tests, lint, build web y build estático aprobados. |
| `main` después de integrar | 68 tests, lint y build web aprobados. Prueba de navegador sobre `next start` en puerto 3003 aprobada. |
| `offline/tp4` después de integrar | 68 tests, lint, build web, build estático y build desktop aprobados. |
| Portable real | `npm run dist:portable` completó Electron 44.4.5/electron-builder 26.15.3 para Windows x64. EXE real ejecutado y comprobado mediante CDP. |

Navegador online: Canvas WebGL, worker, matriz/nube, OrbitControls, restablecimiento, arrastre real de TransformControls, sonda numérica fuera del eje, gráfico, presets, D/R, singularidad y navegación de los cuatro laboratorios. Sin errores de consola/página ni peticiones remotas; responsive 390×844 sin desbordamiento.

Portable: Inicio y cuatro laboratorios cargaron desde `app://laboratorio`; resistencia cambió resultados al variar longitud; fuerza respondió al anular B; movimiento circular reanudó y pausó; Helmholtz tuvo contexto WebGL, un worker, matriz de 1331 posiciones en resolución alta, nube y gráfica. El arrastre real modificó la posición de sonda, la comparación axial tuvo error relativo ≈1.61×10⁻¹⁵, duplicar ambas I duplicó B y Anti canceló el centro. Cámara y sonda produjeron cero nuevos trabajos de mapa.

CSV: se pulsó el botón del EXE, se descargó un archivo real y se verificaron `x_m,Bx_T,magnitude_T` y 241 muestras. La descarga de prueba se conservó solo en `tmp/`, fuera del paquete.

### Prueba de red offline

La ejecución se probó en el EXE empaquetado, no únicamente en una copia del proceso principal. Se deshabilitó la red HTTP de su contexto Chromium mediante CDP. Una petición HTTP de control a un servidor local activo falló con **`net::ERR_INTERNET_DISCONNECTED`**. Para distinguir ese fallo del bloqueo CSP, el bypass se activó únicamente durante la petición de control y se desactivó con recarga antes de la prueba funcional; el producto no cambió su CSP.

`navigator.onLine` permaneció `true` en Electron, por lo que no se utilizó como prueba de conectividad. La comprobación válida fue el fallo de transporte HTTP. Después, todos los laboratorios, recarga, worker y descarga CSV funcionaron. Las peticiones observadas de la aplicación fueron locales; no hubo Vercel, CDN, Google Fonts, APIs ni recursos remotos. Sin errores de consola/página. Se observó únicamente la advertencia deprecada de `THREE.Clock` usada internamente por Fiber.

No se deshabilitó el adaptador de red de Windows ni se probó en otra computadora o pendrive físico. La desconexión se aplicó a la aplicación bajo prueba; la comunicación de Codex permaneció disponible.

## 5. Ejecutable y paquete

EXE generado:

```text
E:\CODIGO\SimuladorFisica\dist\Laboratorio-Electromagnetismo-Portable.exe
100521577 bytes = 100.521577 MB = 95.864846 MiB
SHA-256: 59F6C12B9E84A2565B647215F743C1AD68640637B12BDF58728568FE9DFF1C4F
```

Después de validar se preparó:

```text
E:\CODIGO\SimuladorFisica\entrega\TP4-Baltasar-Barbaglia\
  Laboratorio-Electromagnetismo-Portable.exe
  TP4_Bobinas_Helmholtz_Baltasar_Barbaglia.md
  README_ENTREGA.txt
  assets\tp4\                         (7 capturas necesarias para la guía)
```

El EXE copiado tiene el mismo hash que el probado. El ZIP agrupa esa carpeta para entregar mediante un único enlace:

```text
E:\CODIGO\SimuladorFisica\entrega\TP4-Baltasar-Barbaglia.zip
101350206 bytes = 101.350206 MB = 96.655088 MiB
SHA-256: 6040B2DADBEAF16081200D2FCC0D6D000F6DC04E3C2DB829BCCE340DE37D4C8E
```

El ZIP es mayor que el EXE porque incluye guía y capturas; la compresión no reduce significativamente un portable ya comprimido. No se confirmó el límite del correo de UNSTA. Se propone descarga por enlace por su tamaño, conservando toda la funcionalidad. No se subió ningún archivo a almacenamiento ni se creó una GitHub Release.

## 6. Guía y correo

La guía fuente [TP4_BOBINAS_HELMHOLTZ.md](TP4_BOBINAS_HELMHOLTZ.md) contiene Baltasar Barbaglia, UNSTA, carrera, Física II 2026, TP4, fundamentos, deducciones, manual, código, siete capturas, cuatro aplicaciones y bibliografía. Se revisó también [GUIA_EXPOSICION_TP4.md](GUIA_EXPOSICION_TP4.md).

**Conversión a PDF pendiente:** no hay un pipeline confiable configurado en el repositorio para convertir Markdown y ecuaciones LaTeX conservando presentación. Se comprobaron las herramientas disponibles; no se instalaron conversores arbitrarios. La entrega incluye la fuente Markdown y sus capturas. Antes de enviar, producir y revisar `TP4_Bobinas_Helmholtz_Baltasar_Barbaglia.pdf` con una herramienta apropiada y actualizar el paquete si corresponde.

El [borrador de correo](BORRADOR_EMAIL_TP4.md) incluye destinatario `nestor.leal@unsta.edu.ar`, asunto, cuerpo formal, placeholders para descarga y versión web, adjuntos y pasos previos. **No se envió.**

## 7. Avisos de dependencias

`npm audit` informó ocho avisos: siete altos y uno crítico. Los paquetes señalados fueron Next, eslint-config-next y sus herramientas transitivas de glob, además de http-cache-semantics/brace-expansion. No se aplicó `npm audit fix --force`, cuya propuesta para ESLint cambia de versión mayor y resulta incompatible con la configuración actual.

El crítico [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) corresponde a la implementación Node de `next/og ImageResponse` con valores de atacante en SVG; el aviso señala corrección en 16.3.6. La búsqueda de `next/og` e `ImageResponse` en `src/` no encontró uso: por esa evidencia, la vía descrita no está presente en este proyecto. El portable sirve estáticos y no incorpora un servidor Next. Los avisos de paquetes quedan registrados para una actualización controlada antes de futuras publicaciones, sin alterar el modelo físico validado. Consulta del aviso primario: 05/10/2026.

## 8. Estado Git y pendientes

Worktrees finales:

- `E:\CODIGO\SimuladorFisica`: `offline/tp4` con cuatro laboratorios y Electron.
- `C:\Users\Baltasar\.codex\worktrees\tp4-helmholtz\SimuladorFisica`: `main` con cuatro laboratorios, sin Electron. El nombre del directorio del worktree no es el nombre de su rama actual.

Los commits de documentación posteriores no cambian el código validado ni el EXE. `feature/tp4-helmholtz` permanece en `1de9fb5`; `feature/desktop-offline` permanece en `e968301`; `origin/main` permanece en el commit publicado anterior. No se borraron ramas ni se perdió trabajo.

Se repitieron los SHA-256 de los tres PDF originales y coinciden con los del informe inicial: consigna `26ABEFD0…55D793`, clase `262E7F80…E36B2A4`, Sears `48BACACA…53EBE`. No ingresaron en ningún commit ni paquete. Se comprobaron estados finales sin cambios pendientes de código y `git diff --check`.

Pendientes antes de enviar/publicar:

1. Convertir y revisar la guía PDF; incorporar la versión final al paquete.
2. Elegir almacenamiento, autorizar la subida y obtener un enlace descargable para el profesor.
3. Confirmar el ajuste Production Branch de Vercel, autorizar push/publicación y verificar TP4 en el dominio antes de completar el enlace del mail.
4. Revisar actualización de dependencias según los avisos registrados.
5. Completar placeholders, verificar adjuntos/enlaces y enviar el correo únicamente con autorización explícita.

Se hicieron commits y merges **locales autorizados por la estrategia final**. No se hizo push, deploy, upload, Release ni envío de correo.
