import { formatPhysicsValue } from "@/lib/format";
import type { ElectricalResults, Material } from "@/types/physics";

interface ResultsGridProps {
  material: Material;
  results: ElectricalResults;
  currentAmperes: number;
  temperatureCelsius: number;
}

const definitions: Record<string, string> = {
  "ρ(T)": "Resistividad del material a la temperatura seleccionada.",
  A: "Área de la sección circular perpendicular a la corriente.",
  R: "Oposición del conductor: depende del material y de su geometría.",
  V: "Diferencia de potencial necesaria para sostener la corriente indicada.",
  P: "Energía por unidad de tiempo disipada por el conductor.",
  J: "Corriente que atraviesa una unidad de área transversal.",
  driftVelocity:
    "Rapidez media de deriva: v_d = I/(n|q|A). En metales apunta en sentido opuesto a la corriente convencional.",
};

export function ResultsGrid({
  material,
  results,
  currentAmperes,
  temperatureCelsius,
}: ResultsGridProps) {
  const items = [
    {
      id: "ρ(T)",
      symbol: "ρ(T)",
      label: "Resistividad",
      value: formatPhysicsValue(results.resistivityOhmMeters),
      unit: "Ω·m",
    },
    {
      id: "A",
      symbol: "A",
      label: "Área transversal",
      value: formatPhysicsValue(results.areaSquareMeters),
      unit: "m²",
    },
    {
      id: "R",
      symbol: "R",
      label: "Resistencia",
      value: formatPhysicsValue(results.resistanceOhms),
      unit: "Ω",
      featured: true,
    },
    {
      id: "I",
      symbol: "I",
      label: "Corriente",
      value: formatPhysicsValue(currentAmperes),
      unit: "A",
    },
    {
      id: "V",
      symbol: "V",
      label: "Voltaje",
      value: formatPhysicsValue(results.voltageVolts),
      unit: "V",
    },
    {
      id: "P",
      symbol: "P",
      label: "Potencia",
      value: formatPhysicsValue(results.powerWatts),
      unit: "W",
    },
    {
      id: "J",
      symbol: "J",
      label: "Densidad de corriente",
      value: formatPhysicsValue(results.currentDensityAmperesPerSquareMeter),
      unit: "A/m²",
    },
    {
      id: "driftVelocity",
      symbol: (
        <>
          v<sub>d</sub>
        </>
      ),
      label: "Velocidad de deriva",
      value: formatPhysicsValue(results.driftVelocityMetersPerSecond),
      unit: "m/s",
      featured: true,
    },
    {
      id: "T",
      symbol: "T",
      label: "Temperatura",
      value: formatPhysicsValue(temperatureCelsius),
      unit: "°C",
    },
  ];
  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="section-title-row">
        <div>
          <span className="panel-index">03</span>
          <h2 id="results-heading">Resultados</h2>
        </div>
        <p>{material.name} · modelo óhmico</p>
      </div>
      <div className="results-grid">
        {items.map((item) => (
          <article
            className={`result-card ${item.featured ? "featured" : ""}`}
            key={item.id}
            title={definitions[item.id]}
          >
            <div>
              <span className="result-symbol">{item.symbol}</span>
              <span>{item.label}</span>
            </div>
            <strong>
              {item.value} <small>{item.unit}</small>
            </strong>
          </article>
        ))}
      </div>
    </section>
  );
}
