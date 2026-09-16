import type { ControlVariable } from "@/types/physics";

interface PhysicalModelProps {
  activeVariable: ControlVariable;
}

const equations = [
  {
    id: "diameter",
    formula: (
      <>
        A = π(d/2)<sup>2</sup>
      </>
    ),
    title: "Área transversal",
    note: "d en metros → A en m²",
  },
  {
    id: "temperature",
    formula: (
      <>
        ρ(T) = ρ<sub>0</sub>[1 + α(T − T<sub>0</sub>)]
      </>
    ),
    title: "Modelo térmico lineal",
    note: "sin dilatación térmica",
  },
  {
    id: "length",
    formula: <>R = ρL/A</>,
    title: "Resistencia del conductor",
    note: "Ω·m × m / m² = Ω",
  },
  {
    id: "current",
    formula: <>V = IR</>,
    title: "Ley de Ohm",
    note: "A × Ω = V",
  },
  {
    id: "current",
    formula: (
      <>
        P = VI = I<sup>2</sup>R
      </>
    ),
    title: "Potencia eléctrica",
    note: "V × A = W",
  },
  {
    id: "diameter",
    formula: <>J = I/A</>,
    title: "Densidad de corriente",
    note: "A/m²",
  },
  {
    id: "carrierDensity",
    formula: (
      <>
        v<sub>d</sub> = I/(n|q|A) = J/(n|q|)
      </>
    ),
    title: "Velocidad de deriva",
    note: "n [m⁻³], |q| = 1,60 × 10⁻¹⁹ C",
  },
];

export function PhysicalModel({ activeVariable }: PhysicalModelProps) {
  return (
    <section className="model-section" aria-labelledby="model-heading">
      <div className="section-title-row">
        <div>
          <span className="panel-index">04</span>
          <h2 id="model-heading">Modelo físico</h2>
        </div>
        <p>Funciones puras · unidades SI</p>
      </div>
      <div className="equation-grid">
        {equations.map((equation, index) => (
          <article
            className={
              equation.id === activeVariable
                ? "equation-card active"
                : "equation-card"
            }
            key={`${equation.title}-${index}`}
          >
            <span>{equation.title}</span>
            <strong>{equation.formula}</strong>
            <small>{equation.note}</small>
          </article>
        ))}
      </div>
      <p className="model-footnote">
        El modelo supone un conductor uniforme, de sección circular, óhmico y a
        temperatura homogénea. Para la deriva usa portadores electrónicos de
        carga |q| = 1,60 × 10⁻¹⁹ C. La densidad n es un parámetro independiente
        porque los apuntes sólo aportan su valor para el cobre del ejemplo 25.1.
      </p>
    </section>
  );
}
