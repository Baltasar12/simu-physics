import { formatPhysicsValue } from "@/lib/format";
import type { ElectricalResults, Material } from "@/types/physics";

interface ResultsGridProps { material: Material; results: ElectricalResults; currentAmperes: number; temperatureCelsius: number; }

const definitions: Record<string, string> = {
  "ρ(T)": "Resistividad del material a la temperatura seleccionada.",
  A: "Área de la sección circular perpendicular a la corriente.",
  R: "Oposición del conductor: depende del material y de su geometría.",
  V: "Diferencia de potencial necesaria para sostener la corriente indicada.",
  P: "Energía por unidad de tiempo disipada por el conductor.",
  J: "Corriente que atraviesa una unidad de área transversal.",
};

export function ResultsGrid({ material, results, currentAmperes, temperatureCelsius }: ResultsGridProps) {
  const items = [
    { symbol: "ρ(T)", label: "Resistividad", value: formatPhysicsValue(results.resistivityOhmMeters), unit: "Ω·m" },
    { symbol: "A", label: "Área transversal", value: formatPhysicsValue(results.areaSquareMeters), unit: "m²" },
    { symbol: "R", label: "Resistencia", value: formatPhysicsValue(results.resistanceOhms), unit: "Ω", featured: true },
    { symbol: "I", label: "Corriente", value: formatPhysicsValue(currentAmperes), unit: "A" },
    { symbol: "V", label: "Voltaje", value: formatPhysicsValue(results.voltageVolts), unit: "V" },
    { symbol: "P", label: "Potencia", value: formatPhysicsValue(results.powerWatts), unit: "W" },
    { symbol: "J", label: "Densidad de corriente", value: formatPhysicsValue(results.currentDensityAmperesPerSquareMeter), unit: "A/m²" },
    { symbol: "T", label: "Temperatura", value: formatPhysicsValue(temperatureCelsius), unit: "°C" },
  ];
  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="section-title-row"><div><span className="panel-index">03</span><h2 id="results-heading">Resultados</h2></div><p>{material.name} · modelo óhmico</p></div>
      <div className="results-grid">
        {items.map((item) => (
          <article className={`result-card ${item.featured ? "featured" : ""}`} key={item.symbol} title={definitions[item.symbol]}>
            <div><span className="result-symbol">{item.symbol}</span><span>{item.label}</span></div>
            <strong>{item.value} <small>{item.unit}</small></strong>
          </article>
        ))}
      </div>
    </section>
  );
}
