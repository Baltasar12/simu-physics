"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GRAPH_POINT_COUNT, CONTROL_LIMITS } from "@/lib/constants";
import { formatPhysicsValue } from "@/lib/format";
import { circularCrossSectionArea, conductorResistance, millimetersToMeters, resistivityAtTemperature } from "@/physics/electrical";
import type { ElectricalResults, Material } from "@/types/physics";

interface PhysicsChartsProps {
  material: Material;
  lengthMeters: number;
  diameterMillimeters: number;
  temperatureCelsius: number;
  results: ElectricalResults;
}

function valuesBetween(min: number, max: number): number[] {
  return Array.from({ length: GRAPH_POINT_COUNT }, (_, index) => min + (index / (GRAPH_POINT_COUNT - 1)) * (max - min));
}

function ChartTooltip({ active, payload, label, xUnit }: { active?: boolean; payload?: Array<{ value?: number }>; label?: number; xUnit: string }) {
  if (!active || !payload?.[0] || label === undefined) return null;
  return <div className="chart-tooltip"><span>{formatPhysicsValue(label)} {xUnit}</span><strong>R = {formatPhysicsValue(Number(payload[0].value))} Ω</strong></div>;
}

interface ChartCardProps { title: string; relation: string; data: Array<{ x: number; resistance: number }>; xLabel: string; xUnit: string; point: { x: number; y: number }; }

function ChartCard({ title, relation, data, xLabel, xUnit, point }: ChartCardProps) {
  return (
    <article className="chart-card">
      <div className="chart-title"><div><h3>{title}</h3><p>{xLabel} ({xUnit})</p></div><span>{relation}</span></div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 2, bottom: 6 }}>
            <CartesianGrid stroke="#e4e9ef" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="x" tickFormatter={(value) => formatPhysicsValue(Number(value), 2)} minTickGap={25} tick={{ fill: "#697687", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#cfd7e1" }} />
            <YAxis width={58} tickFormatter={(value) => formatPhysicsValue(Number(value), 2)} tick={{ fill: "#697687", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip xUnit={xUnit} />} />
            <Line type="monotone" dataKey="resistance" stroke="#1f6fb2" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            <ReferenceDot x={point.x} y={point.y} r={5} fill="#c97920" stroke="white" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-axis-label">Resistencia R (Ω)</p>
    </article>
  );
}

export function PhysicsCharts({ material, lengthMeters, diameterMillimeters, temperatureCelsius, results }: PhysicsChartsProps) {
  const rho = results.resistivityOhmMeters;
  const currentArea = results.areaSquareMeters;
  const lengthData = valuesBetween(CONTROL_LIMITS.length.min, CONTROL_LIMITS.length.max).map((x) => ({ x, resistance: conductorResistance(rho, x, currentArea) }));
  const diameterData = valuesBetween(CONTROL_LIMITS.diameter.min, CONTROL_LIMITS.diameter.max).map((x) => ({ x, resistance: conductorResistance(rho, lengthMeters, circularCrossSectionArea(millimetersToMeters(x))) }));
  const temperatureData = valuesBetween(CONTROL_LIMITS.temperature.min, CONTROL_LIMITS.temperature.max).map((x) => ({ x, resistance: conductorResistance(resistivityAtTemperature(material.resistivity, material.temperatureCoefficient, x, material.referenceTemperature), lengthMeters, currentArea) }));

  return (
    <section className="charts-section" aria-labelledby="charts-heading">
      <div className="section-title-row"><div><span className="panel-index">05</span><h2 id="charts-heading">Relaciones</h2></div><p>Las otras variables permanecen constantes</p></div>
      <div className="charts-grid">
        <ChartCard title="R vs. Longitud" relation="R ∝ L" data={lengthData} xLabel="Longitud L" xUnit="m" point={{ x: lengthMeters, y: results.resistanceOhms }} />
        <ChartCard title="R vs. Diámetro" relation="R ∝ 1/d²" data={diameterData} xLabel="Diámetro d" xUnit="mm" point={{ x: diameterMillimeters, y: results.resistanceOhms }} />
        <ChartCard title="R vs. Temperatura" relation="modelo lineal" data={temperatureData} xLabel="Temperatura T" xUnit="°C" point={{ x: temperatureCelsius, y: results.resistanceOhms }} />
      </div>
    </section>
  );
}
