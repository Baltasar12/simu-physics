# Guía para exponer: campo, fuerza y movimiento circular

## Antes de empezar

Abrir la web y recorrer las experiencias 02 y 03. Usar Restablecer para volver a protón, q = +1,60×10⁻¹⁹ C, m = 1,67×10⁻²⁷ kg, v = 10⁵ m/s, B = 0,1 T entrando y θ = 90°. Las entradas exactas aceptan notación científica; confirmar con Enter. En movimiento circular pulsar Reanudar.

Fuentes: Semana 1A pp. 5–10 y 13–14; Sears 27.2–27.4. El detalle de referencias, variables y supuestos está en [MAGNETISMO_FISICA.md](MAGNETISMO_FISICA.md).

## 1. Qué es un campo magnético

“El campo magnético describe una propiedad del espacio que puede ejercer una fuerza sobre cargas en movimiento. No necesito poner la partícula de prueba para que el campo exista”.

## 2. Qué representa B

“B es un vector: indica intensidad y dirección del campo. Su unidad es el tesla. B no es una fuerza: la fuerza depende además de la carga y de cómo se mueve”.

Variables que conviene nombrar: q [C], v [m/s], B [T], F [N], m [kg], r [m]. θ se controla en grados; el programa lo convierte a radianes para calcular el seno.

## 3. Qué significan × y •

“La cruz representa una flecha que se aleja: el campo entra en la pantalla. El punto representa una flecha que se acerca: el campo sale. Los símbolos distribuidos por toda la zona representan un campo uniforme”.

Señalar la leyenda textual y el selector Dirección de B. Las líneas de campo indican B, no F ni la trayectoria de la partícula.

## 4. Qué ocurre al introducir una carga en movimiento

“La carga puede experimentar una fuerza perpendicular a su velocidad y al campo. No basta con que haya campo: si la carga está en reposo, esta fuerza es cero”.

## 5. Fórmula vectorial

`F⃗B = q(v⃗ × B⃗)`.

“El símbolo × entre vectores significa producto vectorial. Nos da una dirección perpendicular a ambos. Multiplicar por q invierte esa dirección cuando la carga es negativa”.

No confundir el símbolo de producto vectorial de la fórmula con las cruces que dibujan el campo entrando.

## 6. Qué representa sin θ

`FB = |q|vB sin θ`.

“El seno selecciona qué fracción de la velocidad es perpendicular al campo: v⊥ = v sin θ. La componente paralela no contribuye a la fuerza”.

Mostrar el diagrama lateral: allí se ve la velocidad completa y el ángulo real. El diagrama frontal muestra la proyección perpendicular. No afirmar que θ es un ángulo entre dos flechas dibujadas en la vista frontal.

## 7. Demostración: θ = 0°

Modificar el ángulo exacto a 0 y confirmar. Observar F = 0 y desaparición de la flecha de fuerza.

“La velocidad es paralela a B. Como sin 0° = 0, no hay fuerza magnética”.

Repetir a 180° si hay tiempo: “Ahora es antiparalela, pero el seno también es cero”.

## 8. Demostración: θ = 90°

Modificar θ a 90°. Observar F = 1,60×10⁻¹⁵ N con los valores iniciales.

“Velocidad y campo son perpendiculares. El seno vale uno y la fuerza es máxima para los valores actuales de q, v y B”.

## 9. Regla de la mano derecha

Señalar v a la derecha, B entrando y F hacia arriba. “Para una carga positiva, oriento los dedos hacia v y los curvo hacia B. El pulgar muestra la fuerza”.

## 10. Qué cambia con carga negativa

Cambiar únicamente Tipo de carga a Negativa. “La fuerza conserva su magnitud porque la fórmula escalar usa |q|, pero invierte su sentido”.

Para este experimento no seleccionar Electrón: ese preset cambia también la masa. La prueba del signo debe conservar todas las demás variables.

También se puede invertir B: invierte F. Si θ no era 90°, el control muestra ahora 180° − θ porque conserva la velocidad física al invertir B.

## 11. Por qué la fuerza no cambia la rapidez

“La fuerza siempre es perpendicular a la velocidad. Su potencia es F punto v, que vale cero. Entonces no realiza trabajo ni modifica la energía cinética: cambia la dirección del movimiento, no su rapidez”.

Evitar decir que la fuerza magnética frena la carga.

## 12. Cómo aparece el movimiento circular

Entrar en Movimiento circular, restablecer y pulsar Reanudar. Señalar la flecha v tangente y la fuerza hacia el centro. Pausar en distintos puntos.

“Ahora fijamos θ = 90°. La fuerza sigue siendo perpendicular a la velocidad en cada punto, por eso curva continuamente la trayectoria. La rapidez permanece constante”.

## 13. Igualación con fuerza centrípeta

`FB = |q|vB` y `Fc = mv²/r`.

“La fuerza magnética proporciona la fuerza centrípeta. No son dos fuerzas que se suman: es la misma fuerza, identificada por su origen y por el efecto que produce”.

## 14. Derivación del radio

Escribir o señalar, en este orden:

1. `|q|vB = mv²/r`.
2. Para v distinta de cero: `|q|B = mv/r`.
3. Despejando: `r = mv/(|q|B)`.

“Más masa o rapidez implica un radio mayor. Más campo o magnitud de carga implica un radio menor. El signo de q afecta el giro, pero no el tamaño del radio”.

Si preguntan por tiempo: “ω = |q|B/m, T = 2π/ω y f = ω/(2π). Se muestran los valores físicos; la animación estira el tiempo para poder observarlos”.

## 15. Experimentos adicionales para ensayar

Partir de Restablecer en cada fila. Cambiar solo la variable indicada. En la experiencia circular, Reanudar después del cambio.

| Qué modificar | Qué observar | Fórmula y explicación oral |
|---|---|---|
| B de 0,1 a 0,2 T | F pasa de 1,60×10⁻¹⁵ a 3,20×10⁻¹⁵ N; r de 0,0104375 a 0,00521875 m | “Duplico B: F se duplica y r se reduce a la mitad”, F = \|q\|vB; r ∝ 1/B |
| v de 100000 a 200000 m/s | F y r se duplican; período no cambia | “La fuerza aumenta, pero el movimiento requiere un radio mayor”, r ∝ v |
| m de 1,67e-27 a 3,34e-27 kg | r se duplica; F no cambia | “Más masa significa menor curvatura para igual fuerza”, r ∝ m |
| \|q\| de 1,6e-19 a 3,2e-19 C | F se duplica; r se reduce a la mitad | “Una mayor carga interactúa más fuertemente con B”, F ∝ \|q\| y r ∝ 1/\|q\| |
| Solo signo positivo → negativo | mismo F y r, giro opuesto | “Cambia el sentido, no el módulo”, F⃗ = q(v⃗ × B⃗) |
| Solo B entrando → saliendo | mismo r, giro opuesto | “Invertir el campo también invierte la fuerza” |
| B a 0 | recta; sin radio orbital | “Sin campo no hay fuerza magnética” |
| \|q\| a 0 | partícula neutra, recta | “La fuerza es proporcional a la carga” |
| v a 0 | reposo; sin círculo ni flechas | “Una carga quieta no siente esta fuerza magnética” |

## Demostración de 5 minutos

| Tiempo | Acción | Observar / fórmula | Frase para decir |
|---|---|---|---|
| 0:00–0:35 | Abrir campo y fuerza, Restablecer; señalar B y leyenda | q, v, B, θ y ×/• | “El campo es un vector medido en tesla; las cruces indican que entra”. |
| 0:35–1:10 | Poner θ = 0° | F = 0; sin flecha, F = \|q\|vB sin θ | “Como la velocidad es paralela al campo, el seno y la fuerza valen cero”. |
| 1:10–1:45 | Poner θ = 90° | fuerza máxima, F = \|q\|vB | “Ahora toda la velocidad es perpendicular al campo”. |
| 1:45–2:20 | Cambiar solo signo de q | misma magnitud, fuerza invertida | “El signo invierte la dirección del producto vectorial”. |
| 2:20–3:25 | Abrir movimiento circular, Restablecer y Reanudar; pausar en un punto | v tangente, F al centro; \|q\|vB = mv²/r | “La fuerza cambia la dirección, no la rapidez; proporciona la fuerza centrípeta”. |
| 3:25–4:10 | Poner B = 0,2 T y Reanudar | radio menor; r = mv/(\|q\|B) | “Duplico el campo y el radio se reduce a la mitad”. |
| 4:10–4:45 | Cambiar solo el signo y Reanudar | mismo radio y giro contrario | “La magnitud de la carga no cambió: el radio es el mismo, pero gira al revés”. |
| 4:45–5:00 | Señalar radio físico, barra y tiempo | autoescala y período físico | “La escala espacial y temporal permite ver una órbita microscópica; los resultados mantienen las unidades reales”. |

## Cómo funciona el programa, explicado para exponer

**Campo y fuerza:** el usuario modifica q, v, B o θ → React guarda el estado → las funciones puras de `magnetism.ts` calculan v y F → SVG dibuja los vectores → resultados, gráficos y explicación se actualizan con esos valores.

**Movimiento circular:** el usuario modifica m, q, v o B → se calcula FB → se determina si hay reposo, recta o círculo → se calcula r y el sentido a partir de qB → se obtiene la solución analítica → v permanece tangente y F apunta al centro → `requestAnimationFrame` actualiza el tiempo visual del SVG.

**Separación de responsabilidades:** la física usa SI y coordenadas cartesianas; el dibujo convierte a píxeles, invierte Y y ajusta las escalas. Cambiar el tamaño del dibujo o pausarlo no modifica el resultado físico.
