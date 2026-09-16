# Arquitectura explicada de forma simple

## Organización

- `src/app/`: rutas de Next.js. La portada está en `page.tsx`; las experiencias tienen sus propias carpetas.
- `src/components/`: piezas visuales separadas por función: controles, resultados, SVG, teoría y gráficos.
- `src/physics/`: ecuaciones como funciones puras. No conoce React ni la interfaz.
- `src/data/`: tabla de materiales extraída de los PDF.
- `src/types/`: formas TypeScript compartidas por datos, modelo e interfaz.
- `src/lib/`: constantes, conversiones y formatos reutilizables.
- `docs/`: material de estudio, decisiones y roadmap.

## Por qué la física está separada

`physics/electrical.ts` contiene funciones como `circularCrossSectionArea`, `resistivityAtTemperature` y `conductorResistance`. Esto permite probar cada ecuación sin abrir la página y evita duplicar cálculos entre tarjetas y gráficos. Los componentes React reciben valores, llaman al modelo y muestran el resultado.

## Recorrido de un cambio

1. El usuario mueve un slider.
2. React guarda el nuevo valor en el estado de `ElectricalLab`.
3. `calculateElectricalState` recibe material, longitud, diámetro, corriente, temperatura y densidad de portadores.
4. El modelo convierte mm a m; calcula `A`, `ρ(T)`, `R`, `V`, `P`, `J` y `v_d`.
5. React entrega el mismo resultado a las tarjetas, el SVG, la explicación y los gráficos.
6. Sólo se vuelve a dibujar la interfaz; no hay petición a un servidor.

## SVG

`ConductorSimulation` dibuja un conductor horizontal con SVG. `L` controla el ancho pedagógico y `d` el espesor. Una flecha representa la corriente convencional y círculos con signo negativo se animan en sentido opuesto. El SVG escribe el valor físico de `v_d`; la duración visual amplificada responde a sus cambios relativos y se limita para conservar legibilidad. El color identifica el material y una barra numérica muestra temperatura; ninguna información depende sólo del color.

## Gráficos

`PhysicsCharts` genera 64 puntos para cada relación con las mismas funciones físicas. Recharts dibuja `R-L`, `R-d` y `R-T`. En cada gráfico se modifica sólo la variable del eje horizontal y se mantienen constantes las demás. El punto naranja marca el estado actual.

## Por qué no hay backend

El modelo necesita pocos cálculos deterministas y no guarda usuarios ni datos. Todo puede ejecutarse en el navegador, con respuesta inmediata. Next.js aporta rutas, estructura, optimización y un build listo para desplegar en Vercel.

## Despliegue posterior

La segunda entrega continúa siendo exclusivamente local: no se realizó commit, push, PR ni deploy.

El proyecto se puede conectar a un repositorio y desplegar en Vercel. Como no usa base de datos ni secretos, el proceso sólo necesita instalar dependencias y ejecutar `npm run build`. No se publicó en esta etapa porque la consigna lo prohíbe salvo pedido explícito.

## Magnetismo: misma arquitectura

`src/physics/magnetism.ts` exporta funciones puras, sin React ni píxeles:

- `degreesToRadians`: conversión antes de las funciones trigonométricas.
- `angleComponents`: seno/coseno de 0° a 180° y extremos exactos.
- `crossProduct`: producto vectorial cartesiano general.
- `magneticForceVector`: q multiplicado por v × B, conservando fuerzas microscópicas.
- `magneticForceMagnitude`: |q|vB sin θ, validando finitud y magnitudes.
- `velocityAtAngle`: construcción de v en xz con θ respecto de B.
- `circularMotion`: devuelve un estado discriminado `circular`, `straight` o `stationary`. Radio, ω, período y frecuencia son `null` si no hay órbita.
- `orbitSample`: solución analítica, posición, velocidad, fuerza y centro en SI a un tiempo físico.

`src/types/magnetism.ts` define vectores, entradas, variables activas y los estados orbitales. `src/data/particles.ts` centraliza los presets de Sears, valores iniciales y límites de los controles.

### Componentes

- Las dos páginas son Server Components que incluyen `MagneticLab`, el límite cliente.
- `MagneticLab` coordina estado, presets, última variable modificada y cálculos comunes. No duplica fórmulas.
- `MagneticControls` ofrece sliders, números SI con notación científica, presets, signo, campo y reset. La masa usa slider logarítmico. Valores exactos se aplican con Enter o blur y se validan antes de llegar al modelo.
- `MagneticResults` muestra valores físicos con `formatPhysicsValue`, reutilizado de la etapa eléctrica.
- `MagneticForceSimulation` presenta la vista frontal xy y lateral xz. Explicita proyección y dirección paralela.
- `CircularMotionSimulation` anima la solución analítica con `requestAnimationFrame` y cancela el frame al pausar o desmontar. Su estado temporal queda local: no re-renderiza controles, resultados o gráficos en cada frame. Los cambios físicos reinician la escena con una key; inicia en pausa para facilitar observación y respetar usuarios sensibles al movimiento.
- `MagneticPrimitives` reúne campo uniforme memoizado, flechas con marcadores únicos mediante `useId`, leyenda y conversión de coordenadas.
- `MagneticExplanation` explica el estado actual y el efecto de la variable modificada.
- `MagneticTheory` contiene ecuaciones, mano derecha, unidades, fuentes y derivación del radio.
- `MagneticCharts` usa Recharts, 73 muestras y el punto actual. Permite seleccionar F–θ/F–B/F–v y r–B/r–v/r–m/r–|q|. Usa las funciones físicas originales; excluye estados sin órbita y no conecta discontinuidades.

### Coordenadas y ángulos

El modelo usa +x derecha, +y arriba y +z hacia el observador. `physicsToScreen` invierte Y únicamente al dibujar. Para órbitas con B=(0,0,Bz), F=q(vyBz,−vxBz,0).

Para fuerza con ángulo variable, v=(v sin θ,0,s v cos θ), s=signo(Bz). El frente muestra v⊥, mientras que la vista lateral representa θ verdadero. Invertir B conserva v: cambia s y transforma θ en 180°−θ. Para órbitas, θ está fijo en 90°.

### Escalas espacial y temporal

La escala de referencia se deriva del radio del estado inicial: 100 unidades SVG para ese radio. Se mantiene mientras el radio visual esté entre 35 y 145 unidades; se adapta fuera del rango. La barra de escala usa el mismo viewBox que la escena, de modo que también es correcta en móvil. El resultado r siempre muestra metros.

Cada vuelta visual dura 6 s y equivale a T segundos físicos; el código pasa ese tiempo físico a `orbitSample`. La fuerza se calcula con el vector velocidad real, no a partir de flechas normalizadas. Pausar solo detiene la visualización. Sin fuerza se muestra una recta que se repite al salir del encuadre; sin rapidez se muestra reposo.

### Reutilización y preservación

Se reutilizan el App Router, navegación global, fuentes, tarjetas, estilos de controles, layout responsive, notación científica, biblioteca de iconos, Recharts y Vitest. No se extraen ni modifican innecesariamente los controles eléctricos, cuyas unidades y supuestos son distintos. `electrical.ts`, sus tests, `ElectricalLab` y la ruta `/resistencia` conservan su implementación física.
