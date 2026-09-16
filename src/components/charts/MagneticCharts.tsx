"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPhysicsValue as fmt } from "@/lib/format";
import { circularMotion, magneticForceMagnitude } from "@/physics/magnetism";
import { MAGNETIC_LIMITS } from "@/data/particles";
import type { MagneticInputs } from "@/types/magnetism";

type Axis = "angle" | "field" | "speed" | "mass" | "charge";
const LABELS: Record<Axis, string> = {
  angle: "Ángulo θ (°)",
  field: "Campo B (T)",
  speed: "Rapidez v (m/s)",
  mass: "Masa m (kg)",
  charge: "Magnitud |q| (C)",
};

export function MagneticCharts({
  inputs: p,
  circular,
}: {
  inputs: MagneticInputs;
  circular: boolean;
}) {
  const [axis, setAxis] = useState<Axis>(circular ? "field" : "angle");
  const pointX = axis === "charge" ? Math.abs(p.charge) : p[axis];
  const chart = useMemo(() => {
    const { min, max } = MAGNETIC_LIMITS[axis];
    const calculate = (x: number) => {
      const next = { ...p, [axis]: x };
      if (circular)
        return circularMotion(
          next.mass,
          next.charge,
          next.speed,
          next.direction * next.field,
        ).radius;
      return magneticForceMagnitude(
        next.charge,
        next.speed,
        next.field,
        next.angle,
      );
    };
    const data = Array.from({ length: 73 }, (_, i) => {
      const lower =
        circular && (axis === "field" || axis === "charge") ? max / 100 : min;
      const x = lower + ((max - lower) * i) / 72;
      return { x, value: calculate(x) };
    });
    const current = calculate(pointX);
    if (!data.some((d) => d.x === pointX))
      data.push({ x: pointX, value: current });
    data.sort((a, b) => a.x - b.x);
    return { data, current };
  }, [axis, p, circular, pointX]);
  const relation = circular
    ? axis === "field" || axis === "charge"
      ? "Relación inversa"
      : "Relación directa"
    : axis === "angle"
      ? "F ∝ sin θ"
      : "Relación directa";
  const options: Axis[] = circular
    ? ["field", "speed", "mass", "charge"]
    : ["angle", "field", "speed"];
  return (
    <section
      className="charts-section magnetic-chart"
      aria-labelledby="magnetic-chart-title"
    >
      <div className="section-title-row">
        <div>
          <span className="panel-index">05</span>
          <h2 id="magnetic-chart-title">
            Relaciones · {circular ? "radio" : "fuerza"}
          </h2>
        </div>
        <p>Las demás variables permanecen constantes</p>
      </div>
      <article className="chart-card">
        <div className="chart-title">
          <div>
            <label htmlFor="chart-variable">Variable horizontal</label>
            <select
              id="chart-variable"
              value={axis}
              onChange={(e) => setAxis(e.target.value as Axis)}
            >
              {options.map((key) => (
                <option value={key} key={key}>
                  {LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <span>{relation}</span>
        </div>
        <p className="control-help">
          Eje vertical: {circular ? "radio r (m)" : "fuerza FB (N)"}. Punto
          naranja: estado actual.
        </p>
        <div className="chart-wrap">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 600, height: 270 }}
          >
            <LineChart
              data={chart.data}
              margin={{ top: 15, right: 20, left: 10, bottom: 15 }}
              accessibilityLayer
            >
              <CartesianGrid stroke="#e4e9ef" strokeDasharray="3 5" />
              <XAxis
                type="number"
                dataKey="x"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(x: number) => fmt(x, 2)}
                minTickGap={35}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                width={95}
                tickFormatter={(y: number) => fmt(y, 2)}
                tick={{ fontSize: 12 }}
                domain={[0, "auto"]}
              />
              <Tooltip
                formatter={(v) => [
                  v == null
                    ? "Sin órbita"
                    : `${fmt(Number(v))} ${circular ? "m" : "N"}`,
                  circular ? "Radio" : "Fuerza",
                ]}
                labelFormatter={(v) => `${LABELS[axis]}: ${fmt(Number(v))}`}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#1f6fb2"
                strokeWidth={2.5}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
              {chart.current !== null && (
                <ReferenceDot
                  x={pointX}
                  y={chart.current}
                  r={5}
                  fill="#c97920"
                  stroke="white"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="chart-axis-label">{LABELS[axis]}</p>
        <p className="control-help">
          {circular
            ? "Los estados sin órbita circular no tienen radio: se omiten del gráfico. B = 0 y q = 0 son singularidades de la fórmula, no radios nulos."
            : "Al recorrer 0° → 90° → 180°, la fuerza pasa de cero al máximo y vuelve a cero."}
        </p>
      </article>
    </section>
  );
}
