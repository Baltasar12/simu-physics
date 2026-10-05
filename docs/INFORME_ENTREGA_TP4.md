# Cierre final de ramas y entrega - TP4

Baltasar Barbaglia · Ingeniería Informática, UNSTA · Física II 2026.

Verificado el 05/10/2026. Consigna: entrega 07/10/2026. Este informe actualiza el estado histórico de [INFORME_TP4.md](INFORME_TP4.md).

**Actualización posterior al cierre local, 05/10/2026:** Baltasar confirmó que ya subió el paquete a Google Drive y envió personalmente el correo al profesor. También autorizó publicar `main` y todas las ramas locales existentes en `origin`. No se solicitó volver a subir archivos ni enviar otro correo. La URL de Drive no fue informada en este chat. Se mantienen separadas la rama web `main` y la rama Electron `offline/tp4`.

Las secciones siguientes conservan el registro del cierre local previo a esa autorización: guía PDF terminada y revisada; paquete EXE + PDF + README y ZIP final comprobados; web y portable con cuatro laboratorios. Los pendientes de envío y subida indicados allí quedaron resueltos por el usuario; corresponde comprobar ahora la publicación Git y el deployment automático de Vercel.

Antes de este cierre se comprobaron `git worktree list`, `git branch -a`, `git status` y `git log --oneline --decorate --graph --all`: `main` estaba en `8977d59` y `offline/tp4` en `e3ba24c`, ambos limpios, coherentes con este informe. Los commits `1de9fb5`, `172fffc` y `0b83d07` existen. El EXE conservaba el SHA-256 registrado. Las modificaciones de este cierre se limitan a documentación y archivos de entrega.

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

La URL pública todavía contiene el despliegue anterior. La nueva versión de cuatro laboratorios está validada **localmente**, pendiente de push/publicación autorizados. El correo ya incluye la URL real, pero debe enviarse después de verificar TP4 en producción.

Consulta final del conector Vercel, 05/10/2026: último deployment de producción `dpl_37kEPefFwiFYTShkFvBiVQnhL4xD`, READY, referencia `main`, commit `e9683018561e177f73fa1e94967250078950d4bc`. El deployment anterior también procede de `main`. El ajuste Production Branch no fue expuesto por el conector: **confirmación manual pendiente** en Settings > Git. No se cambió configuración ni se solicitó un deployment.

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

Cierre final sobre `main`, 05/10/2026: se repitieron `npm test` (68/68, tres archivos), `npm run lint` y `npm run build`, todos aprobados. El build enumera las cinco rutas requeridas. Se comprobó además HTTP 200 en `/`, `/resistencia`, `/campo-magnetico`, `/movimiento-circular` y `/bobinas-helmholtz` sobre `next start` local, puerto 3003. `main` no declara Electron ni `build:desktop` y no tiene archivos rastreados en `electron/`.

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
  TP4_Bobinas_Helmholtz_Baltasar_Barbaglia.pdf
  README_ENTREGA.txt
```

El EXE copiado tiene el mismo hash que el probado. El ZIP agrupa esa carpeta para entregar mediante un único enlace:

```text
E:\CODIGO\SimuladorFisica\entrega\TP4-Baltasar-Barbaglia.zip
101420443 bytes = 101.420443 MB = 96.722072 MiB
SHA-256: 437654A197D0F22B36D6687CF4E73F3D8CAC521CB2B98DBE5D6EF30D8DF49C87
```

El ZIP se regeneró y se abrió para verificar sus tres entradas, longitudes, CRC y SHA-256 de cada archivo. El EXE leído **desde el ZIP** tiene exactamente el hash del portable validado. No se reconstruyó ni modificó el ejecutable.

Para el profesor se eligieron solamente EXE, PDF y README. El Markdown y las capturas fuente permanecen en `docs/` y Git; la copia anterior del paquete se conservó en `tmp/pdfs/material-entrega-original/`, fuera del ZIP. El PDF incorpora las siete imágenes y no necesita esa carpeta.

**Subida preparada:** archivo `E:\CODIGO\SimuladorFisica\entrega\TP4-Baltasar-Barbaglia.zip`, nombre `TP4-Baltasar-Barbaglia.zip`, destino propuesto Google Drive. Después de autorizar la subida, obtener un enlace con permiso de descarga para el profesor y comprobarlo desde su condición de acceso. Sustituir `[ENLACE DE DESCARGA]` en el correo. El ZIP se entrega por enlace; el PDF de menos de 1 MB se adjunta directamente. No se subió ningún archivo ni se creó una GitHub Release.

## 6. Guía y correo

La guía fuente [TP4_BOBINAS_HELMHOLTZ.md](TP4_BOBINAS_HELMHOLTZ.md) contiene Baltasar Barbaglia, UNSTA, carrera, Física II 2026, TP4, fundamentos, deducciones, manual, código, siete capturas, cuatro aplicaciones y bibliografía. Se revisó también [GUIA_EXPOSICION_TP4.md](GUIA_EXPOSICION_TP4.md).

**PDF final:**

```text
E:\CODIGO\SimuladorFisica\entrega\TP4-Baltasar-Barbaglia\TP4_Bobinas_Helmholtz_Baltasar_Barbaglia.pdf
18 páginas A4
922077 bytes = 0.922077 MB = 0.879361 MiB
SHA-256: 41457263357D9848B3B554B6ADD234D6E90F009F316469D919D25FC6A58051A1
```

Se investigó el entorno antes de convertir. Se utilizaron Node, marked y Playwright del runtime existente, Chrome 154 instalado y Poppler/Python disponibles. No había Pandoc ni un motor TeX instalado y no se instalaron nuevas dependencias del proyecto. Se generó HTML de entrega con estilos de impresión y MathJax 3.2.2 (componente TeX/SVG descargado solo para la conversión). Las doce ecuaciones se imprimieron como vectores; las siete capturas originales se incorporaron al PDF. El resultado no usa JavaScript ni requiere Internet, MathJax o los archivos fuente para abrirse.

Se renderizaron **las 18 páginas** con Poppler a PNG y se inspeccionaron visualmente una por una: portada, títulos, márgenes, doce ecuaciones, letras griegas, subíndices/superíndices, tablas, capturas, bibliografía y numeración. Sin páginas vacías, caracteres faltantes, imágenes ausentes ni texto cortado. Las tablas largas repiten el encabezado al continuar; algunas páginas tienen espacio libre por los cambios de sección. La comprobación de extracción encontró los datos de identidad y secciones requeridos, siete imágenes y once enlaces; no reemplaza la revisión visual.

Se aclaró el paso de apertura del portable en el manual y que Bx se dibuja con línea discontinua; no se modificó ninguna ecuación ni simulación. Los tres PDF originales de la materia se conservaron.

El [correo final preparado](BORRADOR_EMAIL_TP4.md) incluye destinatario `nestor.leal@unsta.edu.ar`, asunto, cuerpo formal con los cuatro módulos, URL real `https://simu-physics.vercel.app`, placeholder único `[ENLACE DE DESCARGA]` y el PDF como adjunto. **No se envió.**

## 7. Avisos de dependencias

Versiones instaladas comprobadas en este cierre: **Next 16.3.4**, **ESLint 9.39.5**; en `offline/tp4`, **Electron 44.4.5** y **electron-builder 26.15.3**. No se cambiaron manifests ni lockfiles.

`npm audit --json`, consulta 05/10/2026:

| Rama | Total | Altos | Críticos | Paquetes señalados |
| --- | --- | --- | --- | --- |
| `main` | 7 | 6 | 1 | `next`, `@next/eslint-plugin-next`, `eslint-config-next`, `brace-expansion`, `braces`, `fast-glob`, `micromatch`. |
| `offline/tp4` | 8 | 7 | 1 | Los anteriores más `http-cache-semantics`. |

Los totales corresponden a paquetes afectados informados por npm, no a siete/ocho fallos independientes de la aplicación. Los avisos no críticos se ubican en herramientas de lint/glob y, en desktop, caché HTTP de herramientas. No se aplicó `npm audit fix --force`, cuya propuesta para `eslint-config-next` cambia de serie mayor a 14.2.35; tampoco se introdujo una actualización mayor de ESLint.

El crítico [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) corresponde a la implementación Node de `next/og ImageResponse` con valores de atacante en SVG; afecta 16.2.0 a 16.3.5 y se corrige en 16.3.6. La búsqueda actual de `next/og` e `ImageResponse` en `src/` no encontró uso: por esa evidencia y el alcance del aviso, la vía descrita no está presente en este proyecto. El portable sirve estáticos y no incorpora un servidor Next. Consulta del aviso primario: 05/10/2026.

**Decisión antes de entregar: conservar 16.3.4 y las dependencias validadas.** El patch 16.3.6 está dentro de la misma serie y sería un cambio acotado, pero no se presume ausencia de regresiones y aquí no se utiliza la función afectada. No se retrasa el cierre ni se reemplaza el EXE por esa actualización. Una actualización posterior debe partir de un respaldo Git y repetir tests, lint, build web, build estático y build desktop; cualquier regresión exige revertir. Los avisos continúan registrados y no se afirma que el audit quede limpio.

## 8. Estado Git y pendientes

Worktrees finales:

- `E:\CODIGO\SimuladorFisica`: `offline/tp4` con cuatro laboratorios y Electron.
- `C:\Users\Baltasar\.codex\worktrees\tp4-helmholtz\SimuladorFisica`: `main` con cuatro laboratorios, sin Electron. El nombre del directorio del worktree no es el nombre de su rama actual.

Los commits de documentación posteriores no cambian el código validado ni el EXE. `feature/tp4-helmholtz` permanece en `1de9fb5`; `feature/desktop-offline` permanece en `e968301`; `origin/main` permanece en el commit publicado anterior. No se borraron ramas ni se perdió trabajo.

Se repitieron los SHA-256 de los tres PDF originales y coinciden con los del informe inicial: consigna `26ABEFD0…55D793`, clase `262E7F80…E36B2A4`, Sears `48BACACA…53EBE`. No ingresaron en ningún commit ni paquete. Se comprobaron estados finales sin cambios pendientes de código y `git diff --check`.

El commit que debe publicarse es el **HEAD final de `main`**, incluyendo los commits de TP4 y documentación de entrega. Resolverlo con `git rev-parse main` al autorizar el push; el código físico sigue siendo el registrado en `1de9fb5`. La rama `offline/tp4` tiene su commit local de documentación final y conserva el código del EXE construido desde `0b83d07`. No se agregaron binarios a Git.

Pendientes antes de enviar/publicar:

- [ ] Autorizar push de `main`.
- [ ] Verificar Production Branch en el panel y los cuatro laboratorios en Vercel después de publicar.
- [ ] Autorizar y subir el ZIP a Google Drive, comprobar la descarga.
- [ ] Colocar el enlace en el correo y adjuntar el PDF final.
- [ ] Autorizar y enviar el correo.

Se hicieron commits y merges **locales autorizados por la estrategia final**. No se hizo push, deploy, upload, Release ni envío de correo.
