# Campo, fuerza magnética y movimiento circular

## Fuentes revisadas y alcance

Las páginas indicadas son las del archivo PDF, contando desde 1. En Sears se agrega la página impresa cuando ayuda a localizarla. Los originales de la raíz se usan únicamente como referencias locales.

| Tema | Semana 1A Campo B y Fuerza Magnética | Cap. 27 Campo B y Fuerzas (Sears) |
|---|---|---|
| Campo como vector, dirección y líneas | pp. 3, 8–10 | sección 27.2, pp. 3–4; 27.3, pp. 7–8 |
| Fuerza, ángulo, casos paralelo y perpendicular | p. 5 | p. 4 (impresa 919), ecuaciones 27.1–27.2 |
| Producto vectorial, mano derecha, signo negativo | p. 6 | pp. 4–5, figura 27.7 |
| Tesla | p. 7 | p. 5 (impresa 920) |
| × entrando, • saliendo | p. 10 | p. 8 (impresa 923), figura 27.13 |
| Fuerza centrípeta y radio | p. 13 | p. 11 (impresa 926), ecuaciones 27.10–27.11 |
| Rapidez angular ω | p. 13 | p. 11, ecuación 27.12 |
| Trabajo nulo, rapidez constante | pp. 13–14 | p. 11, sección 27.4 |
| Frecuencia f | no desarrollada explícitamente | p. 11: f = ω/(2π) |
| Período T | no desarrollado explícitamente | p. 13 (impresa 928), ejemplo 27.4: T = 2π/ω |
| Constantes de protón y electrón | sin tabla numérica en las diapositivas | p. 7, ejemplo 27.1; p. 13, ejemplos 27.3–27.4 |
| Hélice | p. 14 | pp. 11 y 13; extensión futura |
| Conductores y aplicaciones | pp. 11–12 y 15–16 | contenidos posteriores al núcleo de esta entrega |

Se implementan los dos simuladores solicitados. ω está en clase; T y f se incluyen como resultados complementarios de ese mismo movimiento, confirmados en Sears. No se desarrolla una simulación helicoidal ni de conductores, motores, flujo, Hall o inducción.

## 1. Qué es B

El campo magnético **B** es una magnitud vectorial: a cada punto del espacio le asigna intensidad y dirección. No es una fuerza y no necesita que coloquemos una partícula de prueba para existir. Al introducir una carga móvil, la interacción con ese campo puede producir una fuerza.

La unidad del SI es el tesla: `1 T = 1 N/(A·m) = 1 N·s/(C·m)`.

Una línea de campo es tangente a B en cada punto. En una región uniforme, las líneas son paralelas y equidistantes. No son trayectorias de partículas ni indican por sí solas la dirección de la fuerza.

La representación perpendicular a la pantalla usa:

- `×`: B entra en la pantalla, como la cola de una flecha que se aleja.
- `•`: B sale de la pantalla, como la punta de una flecha que se acerca.

Estas convenciones figuran en Semana 1A p. 10 y Sears p. 8.

## 2. Fuerza magnética

Ecuación vectorial: `F⃗B = q(v⃗ × B⃗)`.

Magnitud: `FB = |q| v B sin(θ)`.

| Símbolo | Significado | Unidad |
|---|---|---|
| q | carga con signo | C |
| v⃗ / v | velocidad / su magnitud (rapidez) | m/s |
| B⃗ / B | campo magnético / su magnitud | T |
| θ | ángulo entre los vectores v y B | grados en controles, radianes al calcular |
| FB | magnitud de la fuerza | N |
| sin θ | fracción de la rapidez perpendicular al campo | sin unidad |

El producto vectorial genera un vector perpendicular tanto a v como a B. Si los vectores son paralelos o alguno es nulo, el resultado es cero.

- θ = 0°: velocidad paralela; sin 0° = 0 → FB = 0.
- θ = 180°: velocidad antiparalela; sin 180° = 0 → FB = 0.
- θ = 90°: sin 90° = 1 → FB = |q|vB, máximo para esos |q|, v y B.
- 0° < θ < 180°: contribuye `v⊥ = v sin θ`; la componente paralela no produce fuerza.

En el código `degreesToRadians(θ)` realiza `θπ/180` antes de usar `Math.sin`. Los extremos 0° y 180° se tratan exactamente como seno cero para evitar flechas debidas al residuo de punto flotante. No se usa un umbral absoluto en newtons: una fuerza de 10⁻¹⁵ N puede ser relevante para una partícula.

## 3. Dirección, signo y regla de la mano derecha

Para q positiva, orientar los dedos hacia v y curvarlos hacia B por el menor ángulo; el pulgar indica v × B, que coincide con F. Para q negativa, la fuerza apunta en sentido opuesto. El valor absoluto de q determina la magnitud, pero el signo determina el sentido.

Coordenadas físicas: +x hacia la derecha, +y hacia arriba, +z hacia el observador. Es un sistema de mano derecha.

Para vectores generales:

`a × b = (ay bz − az by, az bx − ax bz, ax by − ay bx)`.

Para movimiento en el plano xy, `v = (vx, vy, 0)` y `B = (0, 0, Bz)`:

`F = q(vy Bz, −vx Bz, 0)`.

Así, v hacia la derecha y B entrando dan F hacia arriba para q positiva. Invertir q o B invierte F. Invertir ambos recupera F original. El signo procede de la ecuación, no de un ajuste del dibujo.

SVG tiene Y positiva hacia abajo. La conversión visual es `xSVG = origenX + escala·x` y `ySVG = origenY − escala·y`. Las ecuaciones nunca usan coordenadas de pantalla.

### Cómo se muestra un ángulo distinto de 90°

No es posible variar θ entre una flecha completamente contenida en la pantalla y un B siempre perpendicular a ella: ese ángulo sería siempre 90°. Por eso el simulador A usa dos vistas del mismo estado.

- Frente xy: muestra v⊥ hacia +x, F hacia ±y y B con × o •.
- Lateral xz: muestra v completa, B y el arco del ángulo θ real.

Con `s = signo(Bz)`, se construye `v = (v sin θ, 0, s v cos θ)` y `B = (0,0,sB)`. La componente vz también aparece numéricamente. Si se invierte B se conserva el vector v transformando simultáneamente θ en 180° − θ. El seno y la magnitud de la fuerza se conservan, su dirección se invierte.

Si B o v son nulos, el ángulo físico no está definido; el control conserva la orientación configurada para cuando vuelvan a ser no nulos. Esta aclaración figura junto al diagrama.

El simulador A es una instantánea de vectores. No dibuja una trayectoria recta ficticia con fuerza transversal; el movimiento circular se estudia en el simulador B.

## 4. Trabajo y rapidez constante

La potencia instantánea de una fuerza es `P = F⃗ · v⃗`. Para la fuerza magnética `F⃗B ⟂ v⃗`, por lo que `P = 0` y su trabajo es cero. Por el teorema trabajo–energía, no cambia la energía cinética `K = mv²/2`. Con masa constante, tampoco cambia la rapidez.

La fuerza sí cambia la **dirección** de la velocidad. No frena la carga en el modelo ideal. Este razonamiento está en Semana 1A pp. 13–14 y Sears p. 11.

## 5. Derivación del radio

Supuestos: campo uniforme, velocidad inicial perpendicular a B, q ≠ 0, B ≠ 0, m > 0 y v > 0. La fuerza magnética se mantiene perpendicular a la velocidad y tiene magnitud constante: actúa como fuerza centrípeta.

1. Fuerza magnética: `FB = |q|vB`.
2. Fuerza requerida para una trayectoria circular: `Fc = mv²/r`.
3. La fuerza magnética proporciona la centrípeta: `|q|vB = mv²/r`.
4. Dividiendo por v, que aquí es no nula: `|q|B = mv/r`.
5. Despejando: **`r = mv/(|q|B)`**.

No son dos fuerzas distintas que se suman: es la misma fuerza descrita como magnética por su origen y centrípeta por su efecto.

| Cambio, manteniendo las demás variables | Fuerza | Radio |
|---|---|---|
| Duplicar m | no cambia | se duplica |
| Duplicar v | se duplica | se duplica |
| Duplicar \|q\| | se duplica | se reduce a la mitad |
| Duplicar B | se duplica | se reduce a la mitad |
| Invertir solo q | mismo módulo, sentido opuesto | mismo radio, giro opuesto |
| Invertir solo B | mismo módulo, sentido opuesto | mismo radio, giro opuesto |

La rapidez angular es `ω = v/r = |q|B/m` [rad/s]. El período es `T = 2π/ω` [s], y la frecuencia `f = 1/T = ω/(2π)` [Hz]. En este modelo clásico, T y f no dependen de v. Aquí T significa período, no temperatura.

## 6. Solución analítica de la órbita

La partícula parte de `(0,0,0)` con velocidad `(v,0,0)`. Sea `s = −signo(q Bz)` y `φ = ωt`:

`x(t) = r sin φ`

`y(t) = s r(1 − cos φ)`

`vx(t) = v cos φ`

`vy(t) = s v sin φ`

El centro es `(0,sr,0)`. La fuerza se recalcula con `magneticForceVector(q,v,B)` y apunta a ese centro. La identidad `vx² + vy² = v²` conserva la rapidez. No hay integración numérica ni acumulación de error de energía.

La visualización centra la órbita en el panel. Con q positiva y B entrando, s = +1 y el giro es antihorario; al invertir uno de esos signos es horario.

## 7. Casos especiales

- **B = 0**: fuerza nula; movimiento rectilíneo si v > 0. Radio, ω, T y f orbitales se representan como no aplicables, no como Infinity.
- **q = 0**: partícula neutra; mismo tratamiento rectilíneo.
- **v = 0**: reposo; no se dibuja un círculo degenerado ni flechas. Se prioriza reposo si hay varios parámetros nulos.
- **m ≤ 0**: inválido; la interfaz admite únicamente masas positivas y las funciones rechazan este valor.

Los controles permiten notación científica. Para mantener un dominio numérico explícito, admiten q = 0 o 10⁻²¹ ≤ |q| ≤ 3,2×10⁻¹⁸ C; 10⁻³¹ ≤ m ≤ 10⁻²⁵ kg; v = 0 o 1 ≤ v ≤ 10⁶ m/s; B = 0 o 10⁻⁶ ≤ B ≤ 2 T. El slider recorre pasos más amplios y la entrada exacta permite valores intermedios. Un valor inválido conserva el anterior y muestra un aviso.

## 8. Constantes, escala y límites

Los presets usan los valores redondeados impresos en Sears, p. 13: |e| = 1,60×10⁻¹⁹ C, me = 9,11×10⁻³¹ kg y mp = 1,67×10⁻²⁷ kg. Se centralizan en `src/data/particles.ts`. No se presentan como constantes metrológicas exactas.

Para comparar solo el signo, usar el selector positiva/negativa. Cambiar de protón a electrón también modifica la masa: sería incorrecto esperar el mismo radio.

El radio físico siempre figura en metros. En el encuadre se usa una escala de referencia que hace visible el radio inicial con 100 unidades SVG; se conserva mientras el radio visual esté entre 35 y 145 unidades. Fuera de ese intervalo, la escala se adapta para mantenerlo visible. La barra muestra la distancia física correspondiente a 100 unidades SVG y se redimensiona junto con el diagrama.

Una vuelta visual dura 6 segundos y representa el período físico calculado T. Por eso una órbita microscópica se puede observar sin confundir la animación con tiempo real. Pausar no modifica v. Los cambios de parámetros reinician en pausa; Reanudar inicia el movimiento. Sin fuerza, el tramo rectilíneo se repite al salir del encuadre.

Se suponen partículas clásicas, campo uniforme y estático, sin campo eléctrico, colisiones, gravedad, radiación ni pérdidas. No se implementan relatividad, campo no uniforme, hélice, conductores, espiras, torque, motores, Hall, Faraday ni Ampère.
