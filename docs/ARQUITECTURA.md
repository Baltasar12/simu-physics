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
3. `calculateElectricalState` recibe material, longitud, diámetro, corriente y temperatura.
4. El modelo convierte mm a m; calcula `A`, `ρ(T)`, `R`, `V`, `P` y `J`.
5. React entrega el mismo resultado a las tarjetas, el SVG, la explicación y los gráficos.
6. Sólo se vuelve a dibujar la interfaz; no hay petición a un servidor.

## SVG

`ConductorSimulation` dibuja un conductor horizontal con SVG. `L` controla el ancho pedagógico y `d` el espesor. Una flecha representa la corriente convencional y círculos con signo negativo se animan en sentido opuesto. El color identifica el material y una barra numérica muestra temperatura; ninguna información depende sólo del color.

## Gráficos

`PhysicsCharts` genera 64 puntos para cada relación con las mismas funciones físicas. Recharts dibuja `R-L`, `R-d` y `R-T`. En cada gráfico se modifica sólo la variable del eje horizontal y se mantienen constantes las demás. El punto naranja marca el estado actual.

## Por qué no hay backend

El modelo necesita pocos cálculos deterministas y no guarda usuarios ni datos. Todo puede ejecutarse en el navegador, con respuesta inmediata. Next.js aporta rutas, estructura, optimización y un build listo para desplegar en Vercel.

## Despliegue posterior

El proyecto se puede conectar a un repositorio y desplegar en Vercel. Como no usa base de datos ni secretos, el proceso sólo necesita instalar dependencias y ejecutar `npm run build`. No se publicó en esta etapa porque la consigna lo prohíbe salvo pedido explícito.
