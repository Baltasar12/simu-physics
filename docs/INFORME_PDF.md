# Informe breve del material de la materia

## Fuentes revisadas

- **Tema 5 Corriente Eléctrica, Resistencias Fuentes y Circuitos.pdf** (22 páginas): fuente principal para la Etapa 1.
- **Cap. 25 Sears.pdf** (35 páginas): respaldo teórico y ejemplos del capítulo 25.
- **Contenidos de Clase Semana 1A Campo B y Fuerza Magnética.pdf** (17 páginas): alcance de las etapas 2 y 3.
- **Cap. 27 Campo B y Fuerzas.pdf** (41 páginas): respaldo futuro sobre magnetismo.

## Ecuaciones y ubicación aproximada

| Tema                      | Ecuación             | Variables y unidades  | Fuente principal                                              |
| ------------------------- | -------------------- | --------------------- | ------------------------------------------------------------- |
| Corriente                 | `I = dQ/dt`          | I [A], Q [C], t [s]   | Tema 5, Corriente Eléctrica, p. 3–4; Sears 25.1, p. 3 del PDF |
| Deriva                    | `I = n\|q\|v_d A`   | n [m⁻³], q [C], v_d [m/s], A [m²] | Tema 5, p. 3 y 5; Sears 25.1, p. 4       |
| Densidad de corriente     | `J = I/A = n\|q\|v_d` | J [A/m²]                         | Tema 5, p. 5; Sears, ecuación 25.3, p. 4 |
| Resistividad              | `ρ = E/J`            | ρ [Ω·m], E [V/m]      | Tema 5, p. 6; Sears 25.2, p. 6                                |
| Temperatura               | `ρ(T)=ρ₀[1+α(T−T₀)]` | α [°C⁻¹], T y T₀ [°C] | Tema 5, p. 7; Sears, ecuación 25.6, p. 7                      |
| Resistencia               | `R = ρL/A`           | R [Ω], L [m], A [m²]  | Tema 5, p. 8; Sears, ecuación 25.10, p. 8                     |
| Ley de Ohm                | `V = IR`             | V [V], I [A], R [Ω]   | Tema 5, p. 8–9; Sears, ecuación 25.11, p. 8                   |
| Resistencia y temperatura | `R(T)=R₀[1+α(T−T₀)]` | mismas unidades       | Tema 5, p. 9; Sears, ecuación 25.12, p. 9                     |
| Potencia                  | `P=VI=I²R=V²/R`      | P [W]                 | Tema 5, p. 17; Sears 25.5, p. 18–19                           |
| Fuerza magnética futura   | `F⃗=q(v⃗×B⃗)`; `F=\|q\|vB sen θ` | F [N], q [C], v [m/s], B [T] | Contenidos Semana 1A, p. 5–6 |
| Órbita futura             | `R=mv/(\|q\|B)`; `ω=\|q\|B/m` | R [m], ω [rad/s] | Contenidos Semana 1A, p. 13 |

## Valores tabulados usados

Las tablas 25.1 y 25.2 del apunte (páginas 6–7) y de Sears (páginas 6–7 del PDF) sitúan la resistividad a **20 °C** y dan coeficientes aproximados cerca de temperatura ambiente.

| Material   |    ρ₀ [Ω·m] | α [°C⁻¹] |
| ---------- | ----------: | -------: |
| Plata      | 1,47 × 10⁻⁸ |   0,0038 |
| Cobre      | 1,72 × 10⁻⁸ |  0,00393 |
| Aluminio   | 2,75 × 10⁻⁸ |   0,0039 |
| Tungsteno  | 5,25 × 10⁻⁸ |   0,0045 |
| Plomo      |   22 × 10⁻⁸ |   0,0043 |
| Mercurio   |   95 × 10⁻⁸ |  0,00088 |
| Manganina  |   44 × 10⁻⁸ |  0,00000 |
| Constantán |   49 × 10⁻⁸ |  0,00001 |
| Nicromel   |  100 × 10⁻⁸ |   0,0004 |

La tabla de resistividades también contiene oro y acero, pero la tabla de coeficientes no. La tabla de coeficientes contiene latón e hierro, pero no aparecen con resistividad propia en la tabla 25.1 (aparece acero, que no se tomó como equivalente). Se excluyeron esos casos de la simulación térmica para no inventar ni mezclar valores.

## Supuestos y alcance

La Etapa 1 modela un conductor uniforme, circular, homogéneo y óhmico. La temperatura se considera uniforme; se desprecia la dilatación térmica. Sears aclara que la aproximación lineal para metales es adecuada en un intervalo pequeño, aproximadamente hasta 100 °C; por ello la interfaz limita T a 0–100 °C. La animación de electrones muestra sentido, no rapidez microscópica real.

La velocidad de deriva se calcula con `v_d=I/(n|q|A)`. El control `n` parte de `8,5 × 10²⁸ m⁻³`, único valor de concentración numérico aportado en las páginas revisadas (cobre, ejemplo 25.1 de Sears), y utiliza `|q|=1,60 × 10⁻¹⁹ C`. No se asignan densidades inventadas a los demás materiales.

El material cubre además fuentes de fem, resistencia interna, conexiones serie/paralelo, Kirchhoff, fuerza sobre conductores, espiras, torque, efecto Hall y movimiento helicoidal. Quedan fuera de la primera etapa y se registran en el roadmap.

## Revisión de la segunda entrega

Se inspeccionaron visualmente las 17 diapositivas de Semana 1A y las páginas relevantes de Sears 27.2–27.4, incluidos los ejemplos 27.1, 27.3 y 27.4. Son PDF basados principalmente en imágenes: se generaron vistas temporales de lectura, sin modificar ni convertir los archivos originales. El mapa de ecuaciones, páginas, unidades y decisiones de alcance está en [MAGNETISMO_FISICA.md](MAGNETISMO_FISICA.md).

Se confirmó especialmente la ausencia de trabajo magnético, la conservación de rapidez, la orientación del producto vectorial, los valores redondeados de los presets y el origen de ω, T y f. Las sumas SHA-256 de los cuatro PDF se comparan al finalizar además de revisar git status, porque `.gitignore` excluye `*.pdf`.
