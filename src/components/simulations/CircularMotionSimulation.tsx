"use client";

import { useEffect, useState } from "react";
import { circularMotion, orbitSample } from "@/physics/magnetism";
import { MAGNETIC_INITIAL } from "@/data/particles";
import { formatPhysicsValue as fmt } from "@/lib/format";
import type { CircularState, MagneticInputs } from "@/types/magnetism";
import {
  FieldLegend,
  physicsToScreen,
  UniformField,
  VectorArrow,
  VECTOR_COLORS,
} from "./MagneticPrimitives";

const VISUAL_PERIOD_SECONDS = 6;
const initialOrbit = circularMotion(
  MAGNETIC_INITIAL.mass,
  MAGNETIC_INITIAL.charge,
  MAGNETIC_INITIAL.speed,
  MAGNETIC_INITIAL.direction * MAGNETIC_INITIAL.field,
);
const BASE_PIXELS_PER_METER = 100 / initialOrbit.radius!;
const MIN_RADIUS_PIXELS = 35,
  MAX_RADIUS_PIXELS = 145;

export function CircularMotionSimulation({
  inputs: p,
  state,
}: {
  inputs: MagneticInputs;
  state: CircularState;
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running || state.kind === "stationary") return;
    let frame = 0,
      previous: number | null = null;
    const animate = (now: number) => {
      if (previous !== null) {
        const delta = Math.min((now - previous) / 1000, 0.05);
        setElapsed((t) => t + delta);
      }
      previous = now;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [running, state.kind]);
  const visualRadius =
    state.kind === "circular"
      ? Math.max(
          MIN_RADIUS_PIXELS,
          Math.min(MAX_RADIUS_PIXELS, state.radius * BASE_PIXELS_PER_METER),
        )
      : 0;
  const scale = state.kind === "circular" ? visualRadius / state.radius : 1;
  const time =
    state.kind === "circular"
      ? ((elapsed % VISUAL_PERIOD_SECONDS) / VISUAL_PERIOD_SECONDS) *
        state.period
      : elapsed;
  const sample = orbitSample(
    state,
    p.speed,
    p.charge,
    p.direction * p.field,
    time,
  );
  const origin = { x: 360, y: 220 };
  const point =
    state.kind === "circular"
      ? physicsToScreen(
          {
            x: sample.position.x - sample.center.x,
            y: sample.position.y - sample.center.y,
            z: 0,
          },
          origin,
          scale,
        )
      : { x: 80 + ((elapsed * 75) % 560), y: 220 };
  if (state.kind === "stationary") point.x = 360;
  const vNorm = Math.hypot(sample.velocity.x, sample.velocity.y);
  const fNorm = Math.hypot(sample.force.x, sample.force.y);
  const vEnd = physicsToScreen(
    sample.velocity,
    { x: 0, y: 0 },
    vNorm ? 65 / vNorm : 0,
  );
  const fEnd = physicsToScreen(
    sample.force,
    { x: 0, y: 0 },
    fNorm ? Math.min(60, visualRadius * 0.8) / fNorm : 0,
  );
  return (
    <section
      className="lab-panel simulation-panel magnetic-view"
      aria-labelledby="orbit-title"
    >
      <div className="panel-heading">
        <h2 id="orbit-title">Trayectoria de la partícula</h2>
        <span className="live-badge">θ = 90°</span>
      </div>
      <div className="animation-actions">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          disabled={state.kind === "stationary"}
        >
          {running ? "Pausar" : "Reanudar"}
        </button>
        <button
          type="button"
          onClick={() => {
            setElapsed(0);
            setRunning(false);
          }}
        >
          Reiniciar trayectoria
        </button>
      </div>
      <svg
        className="magnetic-svg"
        viewBox="0 0 720 440"
        role="img"
        aria-label={
          state.kind === "circular"
            ? `Órbita ${state.orientation > 0 ? "antihoraria" : "horaria"}. Velocidad tangente y fuerza hacia el centro.`
            : state.reason
        }
      >
        <rect width="720" height="440" rx="14" fill="#f3f7fb" />
        <UniformField fieldZ={p.direction * p.field} />
        {state.kind === "circular" && (
          <g>
            <circle
              data-testid="orbit-path"
              cx={360}
              cy={220}
              r={visualRadius}
              fill="none"
              stroke="#1f6fb2"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <circle cx={360} cy={220} r="3" fill="#173d68" />
            <text x="370" y="212" className="magnetic-svg-label">
              Centro
            </text>
            <line
              x1={360}
              y1={220}
              x2={point.x}
              y2={point.y}
              stroke="#97a8bb"
              strokeDasharray="3 4"
            />
          </g>
        )}
        {state.kind === "straight" && (
          <path d="M 40 220 H 680" stroke="#97a8bb" strokeDasharray="5 5" />
        )}
        <VectorArrow
          x={point.x}
          y={point.y}
          dx={vEnd.x}
          dy={vEnd.y}
          label="v"
          color={VECTOR_COLORS.velocity}
          testId="velocity-arrow"
        />
        <VectorArrow
          x={point.x}
          y={point.y}
          dx={fEnd.x}
          dy={fEnd.y}
          label="FB"
          color={VECTOR_COLORS.force}
          testId="force-arrow"
        />
        <circle
          data-testid="orbit-particle"
          cx={point.x}
          cy={point.y}
          r="13"
          fill="white"
          stroke="#173d68"
          strokeWidth="3"
        />
        <text
          x={point.x}
          y={point.y + 5}
          textAnchor="middle"
          fill="#173d68"
          fontWeight="800"
        >
          {p.charge === 0 ? "0" : p.charge < 0 ? "−" : "+"}
        </text>
        <text x="24" y="30" className="magnetic-svg-label">
          {state.kind === "circular"
            ? `Giro ${state.orientation > 0 ? "antihorario" : "horario"}`
            : state.reason}
        </text>
        <text x="24" y="420" className="magnetic-svg-label">
          {state.kind === "circular"
            ? `Radio físico: ${fmt(state.radius)} m`
            : state.kind === "straight"
              ? "Movimiento rectilíneo uniforme"
              : "Partícula en reposo"}
        </text>
      </svg>
      <FieldLegend fieldZ={p.direction * p.field} />
      {state.kind === "circular" && (
        <svg
          className="magnetic-scale"
          viewBox="0 0 720 45"
          role="img"
          aria-label={`Barra de escala: ${fmt(100 / scale)} metros`}
        >
          <path
            d="M24 8 v10 h100 v-10"
            stroke="#173d68"
            strokeWidth="2"
            fill="none"
          />
          <text x="145" y="22" className="magnetic-svg-label">
            {fmt(100 / scale)} m
          </text>
        </svg>
      )}
      <div className="scale-note">
        <strong>Visualización autoescalada</strong>
        {state.kind === "circular" ? (
          <p>
            La barra representa {fmt(100 / scale)} m. El radio se ajusta al
            encuadre si resulta demasiado pequeño o grande. El valor físico
            siempre figura en metros.
          </p>
        ) : (
          <p>
            La posición se reinicia al salir del encuadre para repetir la
            demostración rectilínea.
          </p>
        )}
        {state.kind === "circular" && (
          <p>
            Una vuelta visual dura {VISUAL_PERIOD_SECONDS} s y representa un
            período físico de {fmt(state.period)} s. Esta escala temporal no
            modifica la rapidez física.
          </p>
        )}
      </div>
      <p className="simulation-note">
        La flecha v es tangente; la flecha FB apunta al centro y es
        perpendicular a v. Cambiar parámetros reinicia la trayectoria en pausa.
        Pulsá Reanudar para observar el movimiento.
      </p>
    </section>
  );
}
