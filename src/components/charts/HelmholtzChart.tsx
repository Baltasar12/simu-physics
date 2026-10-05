import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AxialInterval, CoilPairInputs } from "@/types/helmholtz";
import type { Vector3 } from "@/types/magnetism";
import { sampleAxialField } from "@/physics/helmholtz";
import { TESLA_TO_MICROTESLA } from "@/data/helmholtz";

export function HelmholtzChart({
  inputs: p,
  probe,
  interval,
}: {
  inputs: CoilPairInputs;
  probe: Vector3;
  interval: AxialInterval | null;
}) {
  const [signed, setSigned] = useState(false);
  const raw = useMemo(() => sampleAxialField(p), [p]);
  const data = useMemo(
    () =>
      raw.map((s) => ({
        ...s,
        bx: s.bx * TESLA_TO_MICROTESLA,
        magnitude: s.magnitude * TESLA_TO_MICROTESLA,
      })),
    [raw],
  );
  const exportCsv = () => {
    const csv =
      "x_m,Bx_T,magnitude_T\n" +
      raw.map((s) => `${s.x},${s.bx},${s.magnitude}`).join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "helmholtz-eje.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="chart-card helm-chart" aria-labelledby="axial-title">
      <div className="chart-title">
        <div>
          <h2 id="axial-title">Campo sobre el eje B(x)</h2>
          <p>Solución analítica · y=z=0 · 241 posiciones · SI</p>
        </div>
        <div className="helm-chart-actions">
          <label htmlFor="helm-chart-mode">Magnitud y componente</label>
          <select
            id="helm-chart-mode"
            value={signed ? "signed" : "magnitude"}
            onChange={(e) => setSigned(e.target.value === "signed")}
          >
            <option value="magnitude">Magnitud |B|</option>
            <option value="signed">|B| y componente axial Bx</option>
          </select>
          <button onClick={exportCsv}>Exportar CSV</button>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 800, height: 300 }}
        >
          <LineChart
            data={data}
            margin={{ top: 26, right: 30, left: 16, bottom: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
            <XAxis
              dataKey="x"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => Number(v).toFixed(2)}
              label={{ value: "Posición x (m)", position: "bottom", offset: 8 }}
            />
            <YAxis
              width={72}
              tickFormatter={(v) => Number(v).toPrecision(3)}
              label={{ value: "B (µT)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              labelFormatter={(v) => `x = ${Number(v).toFixed(4)} m`}
              formatter={(v, name) => [
                `${Number(v).toFixed(4)} µT`,
                name === "magnitude" ? "|B|" : "Bx",
              ]}
            />
            {interval ? (
              <ReferenceArea
                x1={interval.min}
                x2={interval.max}
                fill="#57b88c"
                fillOpacity={0.14}
              />
            ) : null}
            <ReferenceLine
              x={-p.separation / 2}
              stroke="#bc7927"
              strokeDasharray="5 3"
              label={{
                value: "Bobina 1",
                position: "insideTopLeft",
                fontSize: 11,
              }}
            />
            <ReferenceLine
              x={p.separation / 2}
              stroke="#d76b61"
              strokeDasharray="5 3"
              label={{
                value: "Bobina 2",
                position: "insideTopRight",
                fontSize: 11,
              }}
            />
            <ReferenceLine x={0} stroke="#718599" strokeDasharray="2 4" />
            <ReferenceLine y={0} stroke="#718599" />
            {Math.hypot(probe.y, probe.z) < 1e-8 ? (
              <ReferenceLine
                x={probe.x}
                stroke="#0893a5"
                label={{
                  value: "Sonda",
                  position: "insideBottomRight",
                  fontSize: 11,
                }}
              />
            ) : null}
            <Line
              dataKey="magnitude"
              name="magnitude"
              type="linear"
              stroke="#173d68"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            {signed ? (
              <Line
                dataKey="bx"
                name="bx"
                type="linear"
                stroke="#b56525"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="control-help">
        Azul continuo: |B|. {signed ? "Marrón discontinuo: Bx con signo. " : ""}
        Sombreado: intervalo central con variación de magnitud &lt;1%. Las
        flechas 3D usan otra escala visual.
      </p>
    </section>
  );
}
