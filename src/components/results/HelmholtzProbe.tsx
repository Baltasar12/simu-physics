import type { CoilPairInputs } from "@/types/helmholtz";
import type { Vector3 } from "@/types/magnetism";
import {
  clampProbe,
  probeField,
  relativeVariation,
  centralReference,
} from "@/physics/helmholtz";
import { formatPhysicsValue } from "@/lib/format";
import { WIRE_EXCLUSION_RADII } from "@/data/helmholtz";
import { HelmholtzNumber } from "@/components/controls/HelmholtzNumber";

export function HelmholtzProbe({
  inputs,
  point,
  onMove,
}: {
  inputs: CoilPairInputs;
  point: Vector3;
  onMove: (p: Vector3) => void;
}) {
  const sample = probeField(point, inputs);
  const error =
    sample.magnitude === null
      ? null
      : relativeVariation(sample.magnitude, centralReference(inputs));
  return (
    <section className="helm-probe" aria-labelledby="probe-title">
      <div className="section-title-row">
        <h2 id="probe-title">Sonda de campo</h2>
        <p>Arrastrá el marcador o ingresá metros y aplicá con Enter.</p>
      </div>
      <div className="helm-probe-position">
        {(["x", "y", "z"] as const).map((axis) => (
          <label key={axis}>
            {axis.toUpperCase()} (m)
            <HelmholtzNumber
              key={`${axis}/${point[axis]}`}
              aria-label={`Sonda ${axis.toUpperCase()} (m)`}
              step={0.005}
              min={
                -(axis === "x"
                  ? inputs.separation / 2 + 1.5 * inputs.radius
                  : 1.5 * inputs.radius)
              }
              max={
                axis === "x"
                  ? inputs.separation / 2 + 1.5 * inputs.radius
                  : 1.5 * inputs.radius
              }
              value={Number(point[axis].toFixed(5))}
              onCommit={(value) =>
                onMove(clampProbe({ ...point, [axis]: value }, inputs))
              }
            />
          </label>
        ))}
        <button onClick={() => onMove({ x: 0, y: 0, z: 0 })}>
          Centrar sonda
        </button>
        <button onClick={() => onMove({ x: point.x, y: 0, z: 0 })}>
          Colocar sobre eje
        </button>
      </div>
      {sample.nearConductor ? (
        <p className="helm-warning" role="status">
          Punto demasiado próximo al conductor ideal para este modelo. Lectura
          no definida; alejála al menos{" "}
          {formatPhysicsValue(inputs.radius * WIRE_EXCLUSION_RADII)} m del
          filamento.
        </p>
      ) : (
        <>
          <div className="results-grid helm-probe-results" aria-live="polite">
            {(["x", "y", "z", "magnitude"] as const).map((axis) => (
              <div
                className={`result-card ${axis === "magnitude" ? "featured" : ""}`}
                key={axis}
              >
                <div>
                  {axis === "magnitude"
                    ? "Magnitud |B|"
                    : `Componente B${axis}`}{" "}
                  <span>T</span>
                </div>
                <strong
                  data-testid={`probe-${axis}`}
                  data-value={
                    axis === "magnitude"
                      ? sample.magnitude
                      : sample.field![axis]
                  }
                >
                  {formatPhysicsValue(
                    axis === "magnitude"
                      ? sample.magnitude!
                      : sample.field![axis],
                    5,
                  )}{" "}
                  <small>T</small>
                </strong>
              </div>
            ))}
          </div>
          <p className="control-help">
            {error === null
              ? "La variación relativa no es aplicable: Bcentro ≈ 0."
              : `Variación de |B| respecto del centro: ${(100 * error).toFixed(3)}%${error < 0.01 ? " · Este punto cumple <1%." : ""}`}{" "}
            {Math.hypot(point.y, point.z) > 1e-8
              ? "La sonda está fuera del eje; el gráfico muestra otra trayectoria."
              : "La sonda está sobre el eje del gráfico."}
          </p>
        </>
      )}
    </section>
  );
}
