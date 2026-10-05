import type {
  CoilPairInputs,
  CoilPreset,
  CoilVariable,
} from "@/types/helmholtz";
import { COIL_LIMITS } from "@/data/helmholtz";
import { formatFixed } from "@/lib/format";
import { HelmholtzNumber } from "./HelmholtzNumber";

interface Props {
  inputs: CoilPairInputs;
  preset: CoilPreset;
  onChange: (key: CoilVariable, value: number) => void;
  onPreset: (preset: CoilPreset) => void;
  onReset: () => void;
}
function ScalarControl({
  name,
  label,
  value,
  unit,
  onChange,
}: {
  name: keyof typeof COIL_LIMITS;
  label: string;
  value: number;
  unit: string;
  onChange: Props["onChange"];
}) {
  const limits = COIL_LIMITS[name];
  const apply = (v: number) => {
    if (Number.isFinite(v))
      onChange(
        name,
        Math.min(
          limits.max,
          Math.max(limits.min, name.startsWith("turns") ? Math.round(v) : v),
        ),
      );
  };
  return (
    <div className="helm-scalar">
      <label htmlFor={`helm-${name}`}>
        {label} <span>{unit}</span>
      </label>
      <HelmholtzNumber
        key={`${name}/${value}`}
        id={`helm-${name}`}
        {...limits}
        value={value}
        onCommit={apply}
      />
      <input
        aria-label={`${label}, deslizador`}
        type="range"
        {...limits}
        value={value}
        onChange={(e) => apply(Number(e.target.value))}
      />
    </div>
  );
}
export function HelmholtzControls({
  inputs: p,
  preset,
  onChange,
  onPreset,
  onReset,
}: Props) {
  return (
    <aside
      className="controls-panel helm-controls"
      aria-label="Parámetros de las bobinas"
    >
      <div className="panel-heading">
        <h2>Configuración</h2>
        <button className="reset-button" onClick={onReset}>
          Reiniciar
        </button>
      </div>
      <div
        className="helm-presets"
        role="group"
        aria-label="Configuraciones predefinidas"
      >
        {(
          [
            ["optimal", "Helmholtz óptimo"],
            ["helmholtz", "Helmholtz"],
            ["anti", "Anti-Helmholtz"],
            ["custom", "Personalizado"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={preset === id}
            onClick={() => onPreset(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <details open>
        <summary>
          Geometría <span>D/R = {formatFixed(p.separation / p.radius)}</span>
        </summary>
        <ScalarControl
          name="radius"
          label="Radio R"
          value={p.radius}
          unit="m"
          onChange={onChange}
        />
        <ScalarControl
          name="separation"
          label="Separación D"
          value={p.separation}
          unit="m"
          onChange={onChange}
        />
        <p className="control-help">
          Centros en −D/2 y +D/2. Radio común; dos planos YZ.
        </p>
      </details>
      {([1, 2] as const).map((n) => {
        const turns = n === 1 ? "turns1" : "turns2",
          current = n === 1 ? "current1" : "current2",
          direction = n === 1 ? "direction1" : "direction2";
        return (
          <details open key={n}>
            <summary>
              Bobina {n} <span>{n === 1 ? "−X" : "+X"}</span>
            </summary>
            <ScalarControl
              name={turns}
              label={`Vueltas N${n}`}
              value={p[turns]}
              unit="vueltas"
              onChange={onChange}
            />
            <ScalarControl
              name={current}
              label={`Corriente I${n}`}
              value={p[current]}
              unit="A"
              onChange={onChange}
            />
            <label className="helm-direction" htmlFor={`helm-${direction}`}>
              Sentido visto desde +X
            </label>
            <select
              id={`helm-${direction}`}
              value={p[direction]}
              onChange={(e) => onChange(direction, Number(e.target.value))}
            >
              <option value={1}>Antihorario (+I)</option>
              <option value={-1}>Horario (−I)</option>
            </select>
          </details>
        );
      })}
      <p className="control-help">
        Números: Enter o salir del campo para aplicar. Los presets pueden
        editarse. Flechas sobre las bobinas indican el sentido real de I.
      </p>
    </aside>
  );
}
