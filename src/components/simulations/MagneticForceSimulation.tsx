import {
  angleComponents,
  degreesToRadians,
  velocityAtAngle,
} from "@/physics/magnetism";
import { formatPhysicsValue as fmt } from "@/lib/format";
import type { MagneticInputs, Vector3 } from "@/types/magnetism";
import {
  FieldLegend,
  UniformField,
  VectorArrow,
  VECTOR_COLORS,
} from "./MagneticPrimitives";

export function MagneticForceSimulation({
  inputs: p,
  force,
}: {
  inputs: MagneticInputs;
  force: Vector3;
}) {
  const { sin, cos } = angleComponents(p.angle);
  const velocity = velocityAtAngle(p.speed, p.angle, p.direction);
  const forceLength =
    force.y === 0
      ? 0
      : 35 +
        65 *
          Math.sqrt(sin) *
          Math.min(
            1,
            Math.sqrt((Math.abs(p.charge) * p.speed * p.field) / 3.2e-12),
          );
  const speedLength = p.speed === 0 ? 0 : 70 + 50 * Math.sqrt(p.speed / 1e6);
  const theta = degreesToRadians(p.angle);
  // Side view: +z is upward, +x right; B can point along either side of z.
  const ox = 160,
    oy = 140,
    arc = 40;
  return (
    <section
      className="lab-panel simulation-panel magnetic-view"
      aria-labelledby="force-scene-title"
    >
      <div className="panel-heading">
        <h2 id="force-scene-title">Fuerza sobre la carga</h2>
        <span className="live-badge">Instantánea vectorial</span>
      </div>
      <p className="control-help">
        Vista frontal del plano xy. +x a la derecha, +y arriba. B es
        perpendicular a esta pantalla.
      </p>
      <svg
        className="magnetic-svg"
        viewBox="0 0 720 440"
        role="img"
        aria-label={`Carga ${p.charge < 0 ? "negativa" : p.charge === 0 ? "neutra" : "positiva"}. Velocidad proyectada a la derecha. Fuerza ${force.y === 0 ? "nula" : force.y > 0 ? "hacia arriba" : "hacia abajo"}.`}
      >
        <rect width="720" height="440" rx="14" fill="#f3f7fb" />
        <UniformField fieldZ={p.direction * p.field} />
        <text x="24" y="28" className="magnetic-svg-label">
          Plano xy · proyección de v
        </text>
        <VectorArrow
          x={315}
          y={215}
          dx={speedLength * sin}
          dy={0}
          label={p.angle === 90 ? "v" : "v⊥"}
          color={VECTOR_COLORS.velocity}
          testId="velocity-arrow"
        />
        <VectorArrow
          x={315}
          y={215}
          dx={0}
          dy={-Math.sign(force.y) * forceLength}
          label="FB"
          color={VECTOR_COLORS.force}
          testId="force-arrow"
        />
        <circle
          cx={315}
          cy={215}
          r={18}
          fill="white"
          stroke="#173d68"
          strokeWidth={3}
        />
        <text
          x={315}
          y={221}
          textAnchor="middle"
          fill="#173d68"
          fontWeight={800}
        >
          {p.charge === 0 ? "0" : p.charge < 0 ? "−" : "+"}
        </text>
        {force.y === 0 && (
          <text
            x={315}
            y={280}
            textAnchor="middle"
            className="magnetic-svg-label"
          >
            Fuerza magnética nula
          </text>
        )}
        <text x="24" y="386" className="magnetic-svg-label">
          v⊥ = {fmt(velocity.x)} m/s
        </text>
        <text x="24" y="414" className="magnetic-svg-label">
          vz = {fmt(velocity.z)} m/s ·{" "}
          {velocity.z === 0
            ? "en el plano"
            : velocity.z > 0
              ? "sale de la pantalla"
              : "entra en la pantalla"}
        </text>
      </svg>
      <FieldLegend fieldZ={p.direction * p.field} />
      <div className="angle-detail">
        <svg
          viewBox="0 0 320 280"
          role="img"
          aria-label={`Vista lateral xz, ángulo ${p.angle} grados entre velocidad y campo`}
        >
          <line x1="20" y1={oy} x2="290" y2={oy} stroke="#cbd4df" />
          <line x1={ox} y1="20" x2={ox} y2="265" stroke="#cbd4df" />
          <text x="275" y="163" fontSize="14">
            +x
          </text>
          <text x="175" y="22" fontSize="14">
            +z
          </text>
          <VectorArrow
            x={ox}
            y={oy}
            dx={0}
            dy={-p.direction * 90}
            label={p.field === 0 ? "eje B" : "B"}
            color={VECTOR_COLORS.field}
          />
          <VectorArrow
            x={ox}
            y={oy}
            dx={85 * sin}
            dy={-p.direction * 85 * cos}
            label={p.speed === 0 ? "dirección v" : "v"}
            color={VECTOR_COLORS.velocity}
          />
          {p.angle > 0 && (
            <path
              d={`M${ox},${oy - p.direction * arc} A${arc},${arc} 0 0 ${p.direction > 0 ? 1 : 0} ${ox + arc * sin},${oy - p.direction * arc * cos}`}
              fill="none"
              stroke="#be6420"
              strokeWidth="2"
            />
          )}
          <text
            x={ox + 55 * Math.sin(theta / 2) + 8}
            y={oy - p.direction * 55 * Math.cos(theta / 2)}
            fill="#be6420"
            fontSize="16"
          >
            θ
          </text>
        </svg>
        <div>
          <h3>El ángulo real se ve de lado</h3>
          <p>
            θ = {fmt(p.angle)}° · sin(θ) = {fmt(sin)}
          </p>
          <p>
            La velocidad se descompone en v⊥ = v sin θ y v∥ = v cos θ. Solo v⊥
            produce fuerza. El dibujo principal muestra su proyección; este
            diagrama xz muestra la dirección completa.
          </p>
          <p className="control-help">
            B = 0 o v = 0: θ queda como dirección configurada; el vector nulo no
            tiene ángulo físico.
          </p>
        </div>
      </div>
      <p className="simulation-note">
        Flechas normalizadas y escala pedagógica. Se muestra un instante del
        movimiento, no una trayectoria recta bajo fuerza.
      </p>
    </section>
  );
}
