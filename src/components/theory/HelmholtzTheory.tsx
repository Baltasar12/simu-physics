import type { CoilPairInputs, CoilVariable } from "@/types/helmholtz";
import { isOptimalHelmholtz, isSymmetricParallel } from "@/physics/helmholtz";
import { formatFixed } from "@/lib/format";

export function HelmholtzExplanation({
  inputs: p,
  active,
}: {
  inputs: CoilPairInputs;
  active: CoilVariable | "preset";
}) {
  const opposite = p.direction1 !== p.direction2;
  const effect = active.startsWith("current")
    ? "Biot-Savart es lineal en I. Duplicar ambas corrientes duplica el vector B en cada punto y mantiene la variación relativa."
    : active.startsWith("turns")
      ? "Cada vuelta coincidente contribuye por igual: el campo de esa bobina es proporcional a N. Cambiar solo una bobina puede romper la simetría."
      : active === "radius"
        ? "El radio modifica toda la geometría. Con D/R fijo, Bcentro escala como 1/R; con D fijo no existe esa proporcionalidad simple."
        : active === "separation"
          ? "La separación cambia la superposición. En un par idéntico y paralelo, D=R anula la curvatura axial central y crea una meseta especialmente plana."
          : "La mano derecha determina el signo: corriente antihoraria vista desde +X produce campo axial hacia +X. Cambiar el sentido invierte su contribución vectorial.";
  return (
    <article className="explanation-card">
      <span className="explanation-kicker">Lectura del experimento</span>
      <h2>¿Qué está ocurriendo?</h2>
      <div className="explanation-content">
        <span className="change-indicator">
          D/R = {formatFixed(p.separation / p.radius)}
        </span>
        <p>{effect}</p>
        <p>
          {p.current1 === 0 && p.current2 === 0
            ? "Ambas corrientes están apagadas: B=0 en todo el modelo. La homogeneidad relativa respecto del campo central no es aplicable."
            : isOptimalHelmholtz(p)
            ? "Bobinas idénticas, corrientes iguales y paralelas, D=R: configuración Helmholtz óptima. La zona central varía poco, aunque no es uniforme en todo el espacio."
            : opposite
              ? "Las corrientes opuestas tienden a cancelar el campo en el centro. La cancelación exacta requiere bobinas iguales y magnitudes de corriente iguales; alrededor aparece un gradiente."
              : isSymmetricParallel(p)
                ? "El par es simétrico y paralelo. Probá D<R y D>R y compará la longitud del intervalo central con el preset óptimo."
                : "Esta configuración es personalizada. D=R por sí solo no asegura la condición Helmholtz si las vueltas o corrientes son diferentes."}
        </p>
      </div>
    </article>
  );
}

export function HelmholtzTheory() {
  return (
    <section className="model-section magnetic-theory">
      <span className="chapter-label">Modelo físico</span>
      <h2>De la corriente al campo</h2>
      <div className="helm-equations">
        <div>
          <small>Biot-Savart · producto vectorial</small>
          <strong>dB⃗ = (μ₀I/4π) (dℓ⃗ × r⃗)/|r⃗|³</strong>
        </div>
        <div>
          <small>Bobina centrada en x₀ · N vueltas</small>
          <strong>Bₓ(x) = μ₀NIR² / [2(R²+(x−x₀)²)³ᐟ²]</strong>
        </div>
        <div>
          <small>Superposición vectorial</small>
          <strong>B⃗ = B⃗₁ + B⃗₂</strong>
        </div>
        <div>
          <small>Helmholtz idéntico, paralelo y D=R</small>
          <strong>B₀ = (4/5)³ᐟ² μ₀NI/R</strong>
        </div>
      </div>
      <details>
        <summary>¿Por qué D=R?</summary>
        <p>
          Sea a=D/2 y C=μ₀NIR²/2. Bₓ(x)=C[(R²+(x+a)²)⁻³ᐟ²+(R²+(x−a)²)⁻³ᐟ²]. Por
          simetría B′ₓ(0)=0.
        </p>
        <p>
          B″ₓ(0)=6C(4a²−R²)/(R²+a²)⁷ᐟ². Para corrientes no nulas, B″ₓ(0)=0 exige
          4a²=R², es decir D=R. La primera variación axial es de orden x⁴.
        </p>
      </details>
      <details>
        <summary>Qué significa la región &lt;1%</summary>
        <p>
          Referencia: Bᵣₑ𝒻=|B⃗(0)|. Se acepta un punto si
          ||B⃗(p)|−Bᵣₑ𝒻|/Bᵣₑ𝒻&lt;0,01. Se controla magnitud, no igualdad del
          vector completo. La nube es un muestreo, no una frontera exacta.
        </p>
        <p>
          Para Bcentro≈0 no se calcula esta razón. El intervalo axial es el
          tramo conectado que contiene x=0; otras regiones separadas no se suman
          a su longitud.
        </p>
      </details>
      <p className="model-footnote">
        μ₀=4π×10⁻⁷ T·m/A, valor de clase. Medio vacío/aire, espiras
        coincidentes, filamento sin espesor y régimen magnetostático. No incluye
        calentamiento ni transitorios.
      </p>
      <p className="model-footnote">
        Fuentes: Semana 1B, pp. 4, 6 y 9 · Sears 28.2, 28.5 y problema 28.67 (p.
        990). Guía y derivaciones completas en docs/TP4_BOBINAS_HELMHOLTZ.md.
      </p>
    </section>
  );
}
