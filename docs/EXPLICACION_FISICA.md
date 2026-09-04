# Explicación física para la exposición

## 1. Corriente y movimiento de cargas

La corriente eléctrica describe la transferencia de carga a través de una sección por unidad de tiempo:

`I = dQ/dt`

`I` es la corriente en ampere (A), `Q` la carga en coulomb (C) y `t` el tiempo en segundos (s). Un ampere equivale a un coulomb por segundo. En la simulación, el control `I` fija esa tasa de transferencia. Fuente: **Tema 5**, sección Corriente Eléctrica, páginas 3–4; **Sears 25.1**, páginas 3–4 del PDF.

La **corriente convencional** se define en el sentido en que fluirían cargas positivas. En un metal, las cargas móviles son electrones negativos, así que su velocidad de deriva apunta en sentido contrario. El SVG usa una flecha hacia la derecha para `I` y electrones hacia la izquierda. La velocidad animada está amplificada: comunica el sentido, no el valor real de `v_d`.

El material relaciona corriente y velocidad de deriva con:

`I = n|q|v_d A`

`n` es la cantidad de portadores por unidad de volumen [m⁻³], `|q|` la magnitud de la carga de cada portador [C], `v_d` la rapidez de deriva [m/s] y `A` el área transversal [m²]. Esta relación se explica, pero `n` y `v_d` no son controles en la primera etapa.

## 2. Densidad de corriente

`J = I/A`

La densidad de corriente `J` se mide en A/m² y expresa cuánta corriente atraviesa cada unidad de área transversal. En la interfaz aparece como resultado. Si `I` aumenta con la misma área, `J` aumenta. Si el diámetro aumenta, el área aumenta y `J` disminuye. Fuente: **Tema 5**, Densidad de Corriente, página 5; **Sears**, ecuación 25.3, página 4.

## 3. Resistividad y resistencia

La resistividad se define por:

`ρ = E/J`

`ρ` [Ω·m] es una propiedad del material; `E` [V/m] es el campo eléctrico y `J` [A/m²] la densidad de corriente. Un valor mayor de `ρ` significa que hace falta más campo eléctrico para producir la misma densidad de corriente. La simulación toma `ρ₀` de la tabla 25.1. Fuente: **Tema 5**, Resistividad, página 6; **Sears 25.2**, página 6.

La resistencia del conductor es:

`R = ρL/A`

`R` se mide en ohm (Ω), `L` en metros y `A` en m². A diferencia de la resistividad, la resistencia pertenece al conductor concreto: depende del material **y** de la geometría.

- Si aumenta `L`, las cargas atraviesan un tramo más largo y `R` aumenta proporcionalmente.
- Si aumenta `A`, hay más sección disponible para el flujo y `R` disminuye.
- Si cambia el material, cambia `ρ`, aun si `L` y `A` son iguales.

Fuente: **Tema 5**, Resistencia, página 8; **Sears 25.3**, páginas 8–9.

## 4. Diámetro y área transversal

Para una sección circular:

`A = π(d/2)²`

`d` es el diámetro. La interfaz lo muestra en milímetros, pero el modelo lo convierte primero a metros. El área usa el radio `d/2` y queda en m². Esto importa porque duplicar el diámetro cuadruplica el área y reduce la resistencia a una cuarta parte, si todo lo demás permanece constante.

La simulación representa el conductor más grueso al aumentar `d`. No se dibuja a escala real: es una representación pedagógica de la relación geométrica.

## 5. Temperatura

El modelo lineal es:

`ρ(T) = ρ₀[1 + α(T − T₀)]`

`ρ₀` es la resistividad tabulada a la temperatura de referencia `T₀ = 20 °C`; `α` es el coeficiente térmico en °C⁻¹; `T` es la temperatura elegida. Luego se calcula `R(T) = ρ(T)L/A`. Equivalentemente, con geometría constante, el material presenta `R(T)=R₀[1+α(T−T₀)]`.

Se desprecia la dilatación térmica: `L` y `A` no cambian por temperatura. Así se aísla el efecto de `ρ`, tal como hace la aproximación mostrada en clase. Sears indica que el modelo lineal es adecuado para metales en un intervalo pequeño, aproximadamente hasta 100 °C; la simulación no pasa de ese valor. Fuente: **Tema 5**, Resistividad y Temperatura, página 7, y Resistencia, V y Temperatura, página 9; **Sears**, ecuaciones 25.6 y 25.12, páginas 7 y 9.

`α` indica cuánto cambia proporcionalmente la resistividad por cada grado respecto de `T₀`. Para manganina, la tabla aproxima `α = 0`; por eso la línea de temperatura es horizontal en este modelo.

## 6. Ley de Ohm

`V = IR`

`V` es el voltaje [V], `I` la corriente [A] y `R` la resistencia [Ω]. Para el conductor óhmico de la experiencia, `R` queda determinada por material, geometría y temperatura. Cambiar `I` no modifica directamente `R`; en cambio, el voltaje necesario cambia proporcionalmente. Fuente: **Tema 5**, página 8–9; **Sears**, ecuación 25.11, página 8.

En un dispositivo real, aumentar la corriente puede calentarlo y el calentamiento puede modificar su resistencia. Aquí `I` y `T` son controles independientes para estudiar cada causa por separado.

## 7. Potencia eléctrica

`P = VI = I²R = V²/R`

La potencia `P` se mide en watt (W) y es la rapidez con la que se transfiere o disipa energía. La simulación calcula `V = IR` y luego usa la forma `P = I²R`. Si `R` permanece constante y `I` se duplica, `P` se cuadruplica. Fuente: **Tema 5**, Potencia Eléctrica, página 17; **Sears 25.5**, páginas 18–19.

## 8. Limitaciones del modelo

- Conductor uniforme y sección transversal circular.
- Material y resistividad homogéneos.
- Temperatura uniforme.
- Conductor óhmico; `R` no depende directamente de `I`.
- Aproximación térmica lineal entre 0 y 100 °C.
- Dilatación térmica despreciada.
- Sin contactos, resistencia interna de fuente ni circuito externo.
- Los electrones animados no resuelven colisiones ni reproducen su rapidez real.
- No se usan métodos numéricos de campo ni una simulación microscópica.

Es una simulación educativa del modelo de clase: muestra con claridad las dependencias entre variables, no todos los detalles de un conductor real.
