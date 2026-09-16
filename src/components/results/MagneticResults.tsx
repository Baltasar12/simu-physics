import { formatPhysicsValue as fmt } from "@/lib/format";
import { angleComponents, magneticForceMagnitude } from "@/physics/magnetism";
import type { CircularState, MagneticInputs, Vector3 } from "@/types/magnetism";

export function MagneticResults({
  inputs: p,
  circular,
  state,
  force,
  particle,
}: {
  inputs: MagneticInputs;
  circular: boolean;
  state: CircularState;
  force: Vector3;
  particle: string;
}) {
  const values: [string, string, string][] = [
    ["Carga q", fmt(p.charge), "C"],
    ["Rapidez v", fmt(p.speed), "m/s"],
    ["Campo B", fmt(p.field), "T"],
    [
      "Fuerza FB",
      fmt(magneticForceMagnitude(p.charge, p.speed, p.field, p.angle)),
      "N",
    ],
  ];
  if (circular)
    values.push(
      ["Masa m", fmt(p.mass), "kg"],
      [
        "Radio r",
        state.radius === null ? "No hay órbita" : fmt(state.radius),
        state.radius === null ? "" : "m",
      ],
      [
        "Rapidez angular ω",
        state.omega === null ? "No aplica" : fmt(state.omega),
        state.omega === null ? "" : "rad/s",
      ],
      [
        "Período T",
        state.period === null ? "No aplica" : fmt(state.period),
        state.period === null ? "" : "s",
      ],
      [
        "Frecuencia f",
        state.frequency === null ? "No aplica" : fmt(state.frequency),
        state.frequency === null ? "" : "Hz",
      ],
    );
  else
    values.push(
      ["Ángulo θ", fmt(p.angle), "°"],
      ["sin(θ)", fmt(angleComponents(p.angle).sin), "sin unidad"],
    );
  return (
    <section
      className="results-section magnetic-results"
      aria-labelledby="magnetic-results-title"
    >
      <div className="section-title-row">
        <h2 id="magnetic-results-title">Resultados · {particle}</h2>
        <p>Unidades SI</p>
      </div>
      <div className="results-grid">
        {values.map(([label, value, unit]) => (
          <article
            key={label}
            className={`result-card ${label === "Fuerza FB" || label === "Radio r" ? "featured" : ""}`}
          >
            <div>{label}</div>
            <strong>
              {value} <small>{unit}</small>
            </strong>
          </article>
        ))}
      </div>
      <p className="direction-result" role="status">
        {circular
          ? state.kind === "circular"
            ? `Giro ${state.orientation > 0 ? "antihorario" : "horario"} · F hacia el centro; v tangente`
            : state.reason
          : force.y === 0
            ? "Sin fuerza magnética"
            : force.y > 0
              ? "Dirección de F: hacia arriba (+y)"
              : "Dirección de F: hacia abajo (−y)"}
      </p>
    </section>
  );
}
