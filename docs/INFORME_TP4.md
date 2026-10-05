# Informe de implementación — TP4 Bobinas de Helmholtz

Física II 2026 · Ingeniería Informática · UNSTA. Verificación inicial del módulo: 05/10/2026. Fecha de entrega indicada por la consigna: 07/10/2026. Este informe conserva el estado de esa implementación; la consolidación posterior de ramas y el portable actualizado se registran en `INFORME_ENTREGA_TP4.md`.

## 1. Estado inicial y estrategia Git

El checkout original `E:\CODIGO\SimuladorFisica` estaba en `feature/desktop-offline`, con cambios de Electron sin commit. `main`, `origin/main` y el HEAD de desktop coincidían en `e9683018561e177f73fa1e94967250078950d4bc`.

Para conservar ese trabajo se creó un worktree administrado desde `main`, con árbol inicialmente limpio y rama `feature/tp4-helmholtz`:

```text
C:\Users\Baltasar\.codex\worktrees\tp4-helmholtz\SimuladorFisica
```

Se inspeccionaron estado, ramas locales/remotas, historial, scripts, configuración, rutas, física, gráficos, documentación y Electron. Antes de programar se entregó el resumen de diez puntos solicitado. La base web pasó 49 tests, lint y build. El TP4 comparte la arquitectura web y puede exportarse estáticamente; su rama no incorpora las dependencias ni los archivos específicos de Electron.

El checkout original conserva exactamente su conjunto inicial de cambios pendientes: `.gitignore`, `README.md`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `package-lock.json`, `docs/DESKTOP_OFFLINE.md`, `electron-builder.yml` y `electron/`. No se hizo commit, push, merge, deploy ni release en ninguno de los dos checkouts.

## 2. PDF y correspondencia con la consigna

Se leyeron los tres documentos, extrayendo texto y revisando visualmente las páginas con ecuaciones. Las fórmulas escaneadas se comprobaron en la imagen de página.

| Fuente local | Contenido utilizado |
| --- | --- |
| `TP 4 Inf 2008 Bobinas de Helmhotlz.pdf` | Una página. La consigna corresponde a Física II 2026 aunque el nombre incluya 2008. Define simulador 3D, variables independientes, sonda, homogeneidad <1%, gráfico axial y guía teórica; fecha 07/10/2026. |
| `Contenidos de Clase Semana 1B Torque y Fuentes de B.pdf` | 13 páginas. μ0 en p. 4, Biot-Savart en p. 6 y campo axial de una espira en p. 9. |
| `Cap. 28 Fuentes B.pdf` | 36 páginas. Biot-Savart, página impresa 961; deducción de espira, 967–968; problema Helmholtz 28.67, página 990. |

Se mantuvieron las ecuaciones propuestas compatibles con el material. La expresión central del par se dedujo a partir de la fórmula axial y superposición; no se atribuyó como una fórmula impresa literalmente en la consigna. El problema 28.67 respalda la relación D=R y la anulación de derivadas centrales. Torque, solenoides y toroides no se añadieron como laboratorios de este TP.

Los PDF originales siguen en el checkout original; no se modificaron ni se incluyeron en recursos de la aplicación. SHA-256 inicial y final idénticos:

```text
TP 4 Inf 2008 Bobinas de Helmhotlz.pdf
26ABEFD0872AC434DD2A0CAC0518ECB638B43721CF629D293A3C3A658255D793

Contenidos de Clase Semana 1B Torque y Fuentes de B.pdf
262E7F8022B6C3B5DD5C3D1FC75590B92EFC60631780DB191A01A7C83E36B2A4

Cap. 28 Fuentes B.pdf
48BACACAC97A245CFC123442798ABA11F10ED514ACEBED78D54C8CCB99053EBE
```

## 3. Archivos y dependencias

| Archivo nuevo | Responsabilidad |
| --- | --- |
| `src/app/bobinas-helmholtz/page.tsx` | Página y presentación del cuarto laboratorio. |
| `src/types/helmholtz.ts` | Contratos físicos, resultados y configuraciones. |
| `src/data/helmholtz.ts` | Valores iniciales, límites, tolerancia y resoluciones. |
| `src/physics/helmholtz.ts` | Biot-Savart 3D, superposición, solución axial, homogeneidad y límites. |
| `src/physics/helmholtz.test.ts` | 19 casos de validación física. |
| `src/physics/helmholtz.worker.ts` | Cálculo local de matriz y nube fuera del hilo de interfaz. |
| `src/components/simulator/HelmholtzLab.tsx` | Estado, coordinación de controles, resultados, presets y escena. |
| `src/components/simulator/useHelmholtzMap.ts` | Ciclo de vida del worker, cola de configuración más reciente y resultados coherentes. |
| `src/components/simulations/HelmholtzScene.tsx` | Bobinas, flechas instanciadas, nube, ejes, cámara y sonda arrastrable. |
| `src/components/controls/HelmholtzControls.tsx` | Controles físicos y presets. |
| `src/components/controls/HelmholtzNumber.tsx` | Edición numérica con aplicación al salir o pulsar Enter. |
| `src/components/results/HelmholtzProbe.tsx` | Posición SI, componentes, magnitud y advertencia cerca del filamento. |
| `src/components/charts/HelmholtzChart.tsx` | Magnitud axial, componente firmada opcional, referencias y CSV en SI. |
| `src/components/theory/HelmholtzTheory.tsx` | Explicaciones dinámicas, ecuaciones y deducción D=R. |
| `src/app/icon.svg` | Icono local del laboratorio, sin dependencia de red. |
| `scripts/build-static.mjs` | Exportación estática portable entre shells mediante Node. |
| `docs/TP4_BOBINAS_HELMHOLTZ.md` | Guía teórica, manual, código, capturas, aplicaciones y bibliografía. |
| `docs/GUIA_EXPOSICION_TP4.md` | Guion oral y demo de seis minutos con nueve pasos. |
| `docs/INFORME_TP4.md` | Este informe. |
| `docs/assets/tp4/*.png` | Siete capturas reales de la aplicación construida. |

Archivos existentes modificados: `src/app/page.tsx`, `layout.tsx`, `globals.css`, `src/lib/constants.ts`, `package.json`, `package-lock.json`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `README.md`, `docs/ARQUITECTURA.md` y `docs/ROADMAP.md`.

Dependencias nuevas fijadas: `three@0.186.1`, `@react-three/fiber@9.8.1`, `@react-three/drei@10.7.9` y `@types/three@0.186.0`. Se verificaron sus peer dependencies con React 19.2.8, Next 16.3.4 y TypeScript 5.9.2. Las herramientas de inspección y navegador no se añadieron como dependencias de la aplicación.

Nuevo script: `npm run build:static` establece `STATIC_EXPORT=1` y genera `out/`. `npm run build` conserva la configuración web. ESLint y TypeScript excluyen los recursos generados: la exportación contiene también un recurso del worker con extensión `.ts`, que no debe volver a tratarse como fuente del proyecto en builds posteriores.

Se revisó la documentación local de Next para `use client`, carga diferida, exportación estática e iconos. La página y el layout mantienen prerenderizado; únicamente el Canvas se carga con `dynamic(..., { ssr: false })` dentro de un componente cliente.

## 4. Modelo físico

El eje común es X. Las bobinas circulares ocupan planos YZ con centros −D/2 y +D/2. Corriente antihoraria vista desde +X tiene signo positivo y produce B axial hacia +X. R, D, N1, N2, I1, I2 y sentidos son independientes; toda operación física usa metros, amperes y teslas.

La espira se parametriza como `(x0, R cos φ, R sin φ)`. Se integra Biot-Savart por cuadratura de punto medio: cada contribución usa el vector tangente `dℓ`, el producto `dℓ × r` y el denominador `|r|³`. No se usa una animación como sustituto del campo. N multiplica la contribución ideal de una espira y los dos campos se suman componente a componente, con sus signos.

En el eje se utiliza la solución analítica:

```text
Bx(x) = Σ μ0 Nj Ij R² / (2[R²+(x−xj)²]^(3/2))
```

Para bobinas idénticas, paralelas y activas, la simetría anula B′x(0); B″x(0) es proporcional a D²−R². Por eso D=R anula la curvatura central. En ese caso `B0=(4/5)^(3/2) μ0NI/R`. D=R no etiqueta como óptima una configuración con vueltas o corrientes diferentes ni ambas corrientes apagadas.

La nube acepta estrictamente `abs(|B(p)|−|B(0)|)/|B(0)| < 0.01`. Controla magnitud; no afirma igualdad de dirección en cada punto. El intervalo axial es el tramo conectado que contiene el origen, obtenido con la función analítica y refinamiento por bisección. Se informa D/R, campo central, longitud axial, error máximo de puntos aceptados y volumen estimado por celdas.

La referencia central casi nula desactiva las métricas relativas, especialmente en Anti-Helmholtz. Su campo central se cancela y el campo cambia alrededor del origen: existe gradiente. En el filamento y su proximidad definida por `0.015R`, la sonda informa que el modelo no es válido y no inventa una lectura cero. Las funciones rechazan parámetros o posiciones no finitos.

## 5. Interacción 3D y documentación

La escena contiene dos toros con etiquetas N/I y flechas del sentido de corriente, ejes XYZ, matriz vectorial, nube verde y sonda. OrbitControls permite rotar, acercar y panear; hay restablecimiento y pantalla completa. TransformControls mueve la sonda sobre ejes o planos y bloquea la cámara durante el arrastre. Los controles numéricos permiten llegar a cualquier posición del volumen y colocar la sonda sobre X o en el centro.

Las lecturas muestran Bx, By, Bz y |B| en T. El gráfico siempre incluye |B|; opcionalmente incorpora Bx con signo, centros de bobina, sonda axial e intervalo <1%. CSV exporta posición y campos en SI. Los presets Helmholtz, óptimo, Anti y personalizado permanecen editables.

Las flechas tienen escala visual normalizada y color relativo al percentil 90: no representan metros por tesla ni permiten comparar colores entre configuraciones. Cada toro representa N vueltas coincidentes; no se renderiza una geometría por vuelta. Los rótulos se generan con canvas y tipografías del sistema. No se cargan modelos, texturas, fuentes o scripts externos.

La guía incluye portada con Baltasar Barbaglia, deducciones, manual y explicación por archivos. Sus siete capturas reales muestran configuración óptima, matriz, nube, sonda fuera del eje, gráfico, Anti y curva firmada. Las cuatro aplicaciones documentadas son calibración de magnetómetros, compensación ambiental, ensayos espaciales y caracterización de contaminación magnética, respaldadas por NPL, documentación técnica Bartington/GMW, NASA y ESA.

## 6. Rendimiento medido

Se compararon resoluciones antes de fijar las constantes. Mediciones locales en Node, promedio de cinco repeticiones después de calentamiento; dependen del equipo y no son una promesa de FPS.

| Segmentos por espira | Error vectorial relativo frente a 1024 segmentos en (0.08, 0.16, 0.02) m | Tiempo de 1000 sondas |
| --- | ---: | ---: |
| 96 | 5.28×10⁻¹⁰ | 12.25 ms |
| 128 | 3.14×10⁻¹³ | 16.20 ms |
| 180 | 6.06×10⁻¹⁶ | 22.44 ms |
| 256 | 7.50×10⁻¹⁶ | 32.52 ms |

Se eligieron 128 para matriz/nube y 256 para la sonda. Estos errores se refieren al punto ensayado, no a una cota para todo el espacio ni a puntos muy próximos al conductor.

| Cálculo, configuración inicial | Tiempo medio |
| --- | ---: |
| Matriz 7³ | 5.90 ms |
| Matriz 9³ | 12.91 ms |
| Matriz 11³ | 23.89 ms |
| Nube 21³ | 152.52 ms, 2299 puntos aceptados |

La nube y matriz se calculan en un Web Worker empaquetado localmente. Se reutilizan senos/cosenos y la nube cuando solo cambia la calidad de la matriz. Se mantiene un trabajo en curso y únicamente la última configuración pendiente; los resultados viejos no sustituyen la configuración actual. La interfaz y escena usan el mismo resultado físico mientras se muestra “Actualizando…”.

El campo se dibuja con dos InstancedMesh para astas/puntas y un buffer para la nube. El canvas utiliza renderizado por demanda. Rotar cámara y mover sonda produjo **cero nuevos trabajos de mapa** en la instrumentación del worker. Al salir de la ruta quedaron cero workers; al volver se creó uno. La sonda tiene cálculo independiente de mayor resolución. Se liberan worker y texturas de rótulos.

## 7. Validación final

| Validación | Resultado |
| --- | --- |
| `npm test` | 68 tests aprobados, tres archivos: 49 anteriores + 19 de Helmholtz. |
| `npm run lint` | Aprobado. |
| `npm run build` | Aprobado, incluye la nueva ruta y las anteriores. |
| `npm run build:static` | Aprobado. Recursos locales, incluida la escena y el worker. |
| `npm run build:desktop` en checkout original | Aprobado para la versión desktop existente de tres laboratorios. |
| Navegador sobre exportación estática | Cuarto laboratorio, controles, sonda 3D, singularidad, curva, presets, resolución y rutas anteriores comprobados. |
| Electron aislado con `app://laboratorio` | Exportación TP4 cargada con el protocolo de Electron existente; recarga y modificación de corrientes con red deshabilitada aprobadas. |
| Responsive | 390×844 px, sin desbordamiento horizontal. |
| `git diff --check` | Sin errores de espacios. |

Los 19 casos físicos cubren linealidad en corriente y vueltas; superposición con signos; cuatro posiciones axiales comparadas con la solución analítica; campo de una espira; expresión central del par y ejemplo de Sears; Anti y gradiente; inversión simultánea; componentes transversales, simetría rotacional y convergencia fuera del eje; singularidad; D=R y curvatura; intervalo; nube; referencias nulas; detección del caso óptimo; posiciones finitas y límites de sonda.

Valores comprobados con R=D=0.2 m, N1=N2=100, I1=I2=1 A:

- Campo central: **0.0004495881427866065 T**.
- Intervalo axial <1%: ±0.06274920503958135 m; longitud **0.1254984100791627 m**.
- Longitudes al cambiar D a 0.1 y 0.3 m: 0.04015444 y 0.04604788 m, menores que para D=R.
- Sonda en (0.08, 0.05, 0.03) m: Bx=0.000452691900694293 T, By=0.000010413000441823575 T, Bz=0.0000062478002650941275 T.
- Sonda sobre el eje x=0.08 m: error relativo frente a fórmula analítica **1.61×10⁻¹⁵**.
- Duplicar ambas corrientes: campo central **0.000899176285573213 T**.
- Anti: centro analítico cero; integración de sonda con residuo de redondeo ≈1.32×10⁻²⁰ T.
- Arrastre real del manipulador 3D modificó Y; resolución alta mostró 1331 posiciones de mapa.

Se comprobaron navegación y carga de `/`, `/resistencia`, `/campo-magnetico` y `/movimiento-circular`. Las sesiones finales estática y Electron terminaron sin errores de página o consola y no solicitaron recursos externos. Three.js avisa que `THREE.Clock` está deprecado porque Fiber lo utiliza internamente; es una advertencia de dependencia, sin impedir interacción ni cálculo. No se editó `node_modules` para ocultarla.

## 8. Límites e incorporación futura a Electron

El modelo supone vueltas coincidentes, radio común, filamento sin espesor, corriente uniforme, magnetostática y vacío/aire aproximado por el μ0 de clase. No calcula resistencia, calor, inductancia ni transitorios. La matriz y la nube son muestreos; el volumen es estimado dentro de ±0.6R, puede incluir conjuntos desconectados y no prueba una frontera continua. El intervalo axial tiene su propia definición conectada. WebGL requiere soporte gráfico; sin él se informa y permanecen los resultados numéricos.

La prueba Electron usó una copia temporal del proceso principal, apuntando al `out/` del worktree TP4; no integró ramas ni sustituyó el ejecutable existente. **El portable de `feature/desktop-offline` continúa siendo la versión anterior, sin el cuarto laboratorio.** Su incorporación queda como tarea posterior explícita.

Estrategia de integración: revisar y registrar el TP4 en su rama; integrar la funcionalidad compartida en la línea web y después en desktop. Al resolver `package.json`, lockfile y configuración, conservar tanto dependencias/scripts Electron como Three/Fiber/Drei y admitir los indicadores `DESKTOP_EXPORT` y `STATIC_EXPORT`. Repetir tests, lint, build web, build desktop y prueba offline antes de generar el portable actualizado. Esto evita introducir Electron en la rama web o perder la configuración desktop pendiente.

## 9. Estado de entrega

La etapa web compartida del TP4 está completa según el criterio solicitado. Los cambios están sin staging ni commit en `feature/tp4-helmholtz`, con HEAD todavía `e968301`. Los PDF conservan sus hashes. El desktop original conserva sus modificaciones. No hubo push, merge, deploy ni release.

Para trabajar sobre esta implementación, usar el directorio del worktree indicado al principio. Ejecutar `npm run dev` desde allí y abrir `/bobinas-helmholtz`. Guía de entrega: [TP4_BOBINAS_HELMHOLTZ.md](TP4_BOBINAS_HELMHOLTZ.md). Guion oral: [GUIA_EXPOSICION_TP4.md](GUIA_EXPOSICION_TP4.md).
