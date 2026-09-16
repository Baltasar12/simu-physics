# Informe final: magnetismo y cierre de corriente eléctrica

Fecha de validación: 16 de septiembre de 2026.

## 1. Estado inicial encontrado

El proyecto era una aplicación Next.js 16 con React 19, TypeScript estricto, Recharts y Vitest. La Etapa 1 ya tenía una experiencia funcional de corriente, resistividad y resistencia, diez pruebas unitarias y las rutas de magnetismo como páginas preparadas sin simulación. El árbol Git estaba limpio antes de comenzar la segunda entrega.

## 2. PDF revisados

- `Tema 5 Corriente Eléctrica, Resistencias Fuentes y Circuitos.pdf`: corriente, deriva, densidad de corriente, resistividad, temperatura, resistencia, ley de Ohm y potencia.
- `Cap. 25 Sears.pdf`: respaldo de la Etapa 1; en especial ecuaciones 25.2-25.4 y ejemplo 25.1 para velocidad de deriva.
- `Contenidos de Clase Semana 1A Campo B y Fuerza Magnética.pdf`: fuerza magnética, regla de la mano derecha, tesla, líneas de campo y movimiento circular.
- `Cap. 27 Campo B y Fuerzas.pdf`: ejemplos numéricos, signo de la carga, radio, velocidad angular, período y frecuencia.

Los cuatro archivos originales permanecen en la raíz, fuera de `public/`, sin conversiones ni modificaciones. Sus SHA-256 finales coinciden con el inicio:

- Cap. 25: `F2DE57F983D472FC4511C29A5574881369A4F9659A07662FC430B8013420E5BC`.
- Cap. 27: `36BCB76C7F55E5622428A627DF2D7ED120B3C4050599A476321058B76E8D13E8`.
- Semana 1A: `13416E2D465E120C6BE7B25BC87E43F185A028F9ABABB9F673F53D291AB89947`.
- Tema 5: `44934639E1E3A68B1D3C0FE0E322B5CCF49F38B77ECB47DB0D6CF6EB287207D9`.

## 3. Conceptos encontrados

El alcance confirmado comprende producto vectorial, dependencia angular, regla de la mano derecha, inversión por signo de carga, campo uniforme, trabajo magnético nulo, rapidez constante, fuerza centrípeta y movimiento circular. Para la primera etapa se confirmó que la corriente depende de la concentración, carga, área y rapidez de deriva.

## 4. Ecuaciones confirmadas

- Corriente y deriva: `I=n|q|v_d A`, `v_d=I/(n|q|A)=J/(n|q|)`.
- Densidad de corriente: `J=I/A`.
- Fuerza vectorial: `F=q(v×B)`.
- Magnitud: `|F|=|q|vB sen θ`.
- Fuerza centrípeta: `|q|vB=mv²/r` cuando `v` es perpendicular a `B`.
- Radio: `r=mv/(|q|B)`.
- Velocidad angular: `ω=|q|B/m`.
- Período y frecuencia: `T=2π/ω` y `f=ω/(2π)`.

## 5. Alcance implementado

`/campo-magnetico` permite modificar carga, signo, rapidez, campo, dirección y ángulo; dibuja el campo con `×` o `•`, muestra vectores, magnitud, dirección, regla de la mano derecha, producto vectorial y gráficos. `/movimiento-circular` anima la solución analítica, muestra `v` tangente y `F` hacia el centro, ofrece pausa y reinicio, autoescala y resultados orbitales. `/resistencia` incorpora ahora la densidad de portadores `n`, el cálculo físico de `v_d`, su ecuación y su representación.

## 6. Archivos creados

- Física y datos: `src/physics/magnetism.ts`, `src/physics/magnetism.test.ts`, `src/types/magnetism.ts`, `src/data/particles.ts`.
- Interfaz: `MagneticLab`, `MagneticControls`, `MagneticResults`, `MagneticTheory`, `MagneticCharts`, `MagneticPrimitives`, `MagneticForceSimulation` y `CircularMotionSimulation` dentro de `src/components/`.
- Documentación: `docs/MAGNETISMO_FISICA.md`, `docs/GUIA_EXPOSICION_MAGNETISMO.md` y este informe.

## 7. Archivos modificados

Se actualizaron las páginas de inicio, campo magnético y movimiento circular; navegación y estilos globales; README, arquitectura, teoría eléctrica, informe de PDF y roadmap. Para velocidad de deriva se modificaron tipos, constantes, modelo y tests eléctricos, controles, coordinador de estado, SVG, resultados y explicaciones de la Etapa 1.

## 8. Funciones físicas nuevas

`degreesToRadians`, `angleComponents`, `crossProduct`, `magneticForceVector`, `magneticForceMagnitude`, `velocityAtAngle`, `circularMotion` y `orbitSample` forman el modelo magnético puro. `driftVelocity` completa el modelo eléctrico con validación de magnitudes y el valor redondeado `|q|=1,60×10⁻¹⁹ C` usado por Sears.

## 9. Componentes nuevos

Los ocho componentes magnéticos separan coordinación, controles, resultados, teoría, gráficos y primitivas SVG. Esta división evita mezclar estado React con ecuaciones y permite probar el modelo sin abrir el navegador.

## 10. Producto vectorial utilizado

El modelo calcula el producto cartesiano completo. Para la órbita con `B=(0,0,Bz)`, resulta `F=q(vyBz,-vxBz,0)`. La magnitud se calcula independientemente con `|q|vB sen θ`; ambas formulaciones se verifican entre sí en los tests.

## 11. Convención de coordenadas

`+x` apunta a la derecha, `+y` hacia arriba y `+z` hacia el observador. El símbolo `•` representa `+z` y `×` representa `-z`. Sólo al dibujar se invierte la coordenada vertical porque SVG hace crecer `y` hacia abajo.

## 12. Dirección de la fuerza

Para carga positiva se usa directamente `v×B`; para carga negativa el resultado se invierte. Cambiar sólo `q` o sólo `B` invierte `F`; cambiar ambos recupera la dirección original. Cuando se invierte `B` en la experiencia angular se conserva el vector velocidad y se transforma `θ` en `180°-θ`.

## 13. Trayectoria circular

La órbita no se integra por pasos. `orbitSample` evalúa la solución analítica para posición y velocidad en cada tiempo. El signo de `qBz` determina el sentido de giro, la rapidez permanece constante, `v` es tangente y la fuerza calculada es radial hacia el centro.

## 14. Autoescala

El radio inicial equivale a 100 unidades SVG. La escala se mantiene mientras el radio dibujado queda entre 35 y 145 unidades y se adapta fuera de ese intervalo. El radio físico siempre se conserva en metros y una barra informa la equivalencia visual. Una vuelta visual dura seis segundos y representa un período físico `T`.

## 15. Casos especiales

- `B=0` o `q=0`: fuerza nula y movimiento rectilíneo uniforme.
- `v=0`: partícula en reposo.
- `θ=0°` o `180°`: fuerza magnética nula.
- Entradas no finitas, subnormales o fuera de rango: se rechazan y se conserva el último estado válido.

## 16. Tests agregados

Se agregaron 37 pruebas magnéticas: magnitud, direcciones, combinaciones de signo, ángulos, producto vectorial, invariantes orbitales en 24 fases, casos nulos, ejemplo 27.1 y validaciones. Se añadieron dos pruebas eléctricas para deriva: ejemplo 25.1, proporcionalidades, corriente nula y parámetros inválidos.

## 17. Resultado de tests

`npm test`: 2 archivos, 49 pruebas aprobadas, 0 fallas.

En navegador se aprobaron 26 comprobaciones de regresión: dirección y magnitud de fuerza, gráficos, órbita, pausa, reinicio, signo, autoescala, casos nulos, presets, validación de entrada, las cuatro rutas a 1440, 820 y 390 px, conservación de resistencia y ausencia de errores. Además se verificó la fórmula de deriva, su resultado inicial `4,68×10⁻⁵ m/s`, la respuesta inversa a `n` y su presentación responsive.

## 18. Resultado de lint

`npm run lint`: aprobado sin advertencias ni errores de ESLint.

## 19. Resultado del build

`npm run build`: aprobado con Next.js 16.3.4. Las rutas `/`, `/resistencia`, `/campo-magnetico` y `/movimiento-circular` se generan como contenido estático.

## 20. Estado de la Etapa 1

La experiencia conserva material, geometría, temperatura, ley de Ohm, potencia, densidad de corriente y gráficos. El nuevo requisito docente se integró sin reemplazar esos cálculos: `n` es explícita, `v_d` se muestra en SI, la flecha electrónica tiene sentido opuesto a la corriente y la animación declara su amplificación visual. El ejemplo 25.1 produce `1,5×10⁻⁴ m/s` en el modelo puro.

## 21. Git status

El árbol contiene exclusivamente los cambios locales de esta entrega: páginas, documentación, modelo, componentes y tests descritos arriba. No se modificaron dependencias. No se hizo commit, push, PR ni deploy.

## 22. Limitaciones

Los campos son uniformes, no se resuelven ecuaciones de Maxwell ni colisiones microscópicas, y las partículas no irradian. La órbita supone `v` perpendicular a `B`; el caso oblicuo se reserva para una hélice futura. Las escalas visuales de flechas y tiempo son pedagógicas. En deriva, `n` es independiente del selector de material porque los PDF sólo aportan un valor numérico para cobre.

## 23. Contenido deliberadamente no implementado

Movimiento helicoidal, fuerza sobre conductores, espiras, torque, dipolos, motores, efecto Hall, inducción, circuitos serie/paralelo, Kirchhoff, fuentes con resistencia interna, electromagnetismo 3D y métodos numéricos de campo. Son ampliaciones distintas del alcance confirmado.

## Cómo funciona esta etapa explicado para exponer

### Campo y fuerza

El usuario modifica `q`, `v`, `B` o `θ` → React actualiza el estado → `magnetism.ts` construye los vectores y calcula `F=q(v×B)` → la interfaz dibuja campo, velocidad y fuerza → resultados, gráficos y explicación se actualizan con el mismo modelo.

### Movimiento circular

El usuario modifica `m`, `q`, `v` o `B` → se calcula `F_B` → se obtiene `r=mv/(|q|B)` → el signo de `qB` fija el sentido → la solución analítica genera la trayectoria → `v` queda tangente → `F` apunta al centro → SVG actualiza la animación.

### Velocidad de deriva

El usuario modifica `I`, `d` o `n` → React actualiza el estado → `electrical.ts` calcula `A`, `J` y `v_d=I/(n|q|A)` → el resultado numérico y la etiqueta del SVG cambian → la animación amplificada aumenta o disminuye para comunicar la dependencia sin confundirla con la escala física.

## Demostración de 5 minutos

| Tiempo    | Experimento       | Qué modificar                           | Qué observar                       | Fórmula     | Frase para decir                                                         |
| --------- | ----------------- | --------------------------------------- | ---------------------------------- | ----------- | ------------------------------------------------------------------------ |
| 0:00-0:40 | 1. Paralelo       | En Campo y fuerza, poner `θ=0°`         | `F=0` y desaparece la flecha       | `F=\|q\|vB sen 0°=0` | “Una componente paralela al campo no siente fuerza magnética.” |
| 0:40-1:20 | 2. Perpendicular  | Cambiar a `θ=90°`                       | Fuerza máxima                      | `F=\|q\|vB` | “A noventa grados toda la rapidez contribuye a la fuerza.” |
| 1:20-2:00 | 3. Signo          | Pasar `q` de positiva a negativa        | Misma magnitud, dirección opuesta  | `F=q(v×B)`  | “El signo no cambia cuánto vale la fuerza; invierte hacia dónde apunta.” |
| 2:00-2:50 | 4. Órbita         | Entrar a Movimiento circular y reanudar | `v` tangente y `F` hacia el centro | `F_B=mv²/r` | “La fuerza no acelera a lo largo del movimiento: curva la trayectoria.”  |
| 2:50-3:40 | 5. Campo doble    | Duplicar `B`                            | El radio se reduce a la mitad      | `r=mv/(\|q\|B)` | “Más campo produce más curvatura y, por eso, menor radio.” |
| 3:40-4:25 | 6. Carga opuesta  | Invertir sólo el signo de `q`           | Mismo radio, giro opuesto          | `r` usa `\|q\|`; el sentido usa `qB` | “El módulo de la carga fija el radio y el signo fija el sentido.” |
| 4:25-5:00 | Cierre de Etapa 1 | En Resistencia, cambiar `n` | `v_d` disminuye cuando `n` aumenta | `v_d=I/(n\|q\|A)` | “Más portadores necesitan una deriva media menor para transportar la misma corriente.” |
