import type {
  ControlVariable,
  ElectricalResults,
  Material,
} from "@/types/physics";

interface DynamicExplanationProps {
  activeVariable: ControlVariable;
  material: Material;
  results: ElectricalResults;
}

const labels: Record<ControlVariable, string> = {
  material: "Cambiaste el material",
  length: "Cambiaste la longitud",
  diameter: "Cambiaste el diámetro",
  current: "Cambiaste la corriente",
  temperature: "Cambiaste la temperatura",
  carrierDensity: "Cambiaste la densidad de portadores",
};

export function DynamicExplanation({
  activeVariable,
  material,
}: DynamicExplanationProps) {
  const explanations: Record<ControlVariable, React.ReactNode> = {
    material: (
      <>
        Al elegir <strong>{material.name}</strong> cambia la resistividad ρ. Con
        la misma longitud y área, un valor mayor de ρ produce una resistencia
        mayor según R = ρL/A.
      </>
    ),
    length: (
      <>
        L está en el numerador de R = ρL/A. Si ρ y A permanecen constantes, la
        resistencia es directamente proporcional a la longitud: duplicar L
        duplica R.
      </>
    ),
    diameter: (
      <>
        El área crece con el cuadrado del diámetro: A = π(d/2)². Como A está en
        el denominador de R = ρL/A, un conductor más grueso ofrece menos
        resistencia. Con I y n constantes, también reduce J = I/A y v
        <sub>d</sub> = I/(n|q|A).
      </>
    ),
    temperature:
      material.temperatureCoefficient === 0 ? (
        <>
          La tabla aproxima α = 0 para la manganina cerca de temperatura
          ambiente. En este modelo lineal, modificar T no cambia ρ ni R de forma
          apreciable.
        </>
      ) : (
        <>
          La resistividad cambia según ρ(T) = ρ₀[1 + α(T − T₀)]. Para{" "}
          {material.name}, α = {material.temperatureCoefficient}; al subir T
          aumenta ρ y, por tanto, R.
        </>
      ),
    current: (
      <>
        La corriente no entra en R = ρL/A, por eso no cambia directamente la
        resistencia. Con R constante, V crece como V = IR y la potencia como P =
        I²R. Además, v<sub>d</sub> = I/(n|q|A): con n y A constantes, duplicar I
        duplica la rapidez de deriva.
      </>
    ),
    carrierDensity: (
      <>
        n cuenta los portadores libres por unidad de volumen. De v<sub>d</sub> =
        I/(n|q|A) se ve que, con I y A constantes, más portadores permiten
        transportar la misma corriente con una deriva media menor.
      </>
    ),
  };

  return (
    <section
      className="explanation-card"
      aria-labelledby="explanation-heading"
      aria-live="polite"
    >
      <span className="explanation-kicker">Interpretación del cambio</span>
      <h2 id="explanation-heading">¿Qué está ocurriendo?</h2>
      <div className="explanation-content">
        <span className="change-indicator">{labels[activeVariable]}</span>
        <p>{explanations[activeVariable]}</p>
      </div>
    </section>
  );
}
