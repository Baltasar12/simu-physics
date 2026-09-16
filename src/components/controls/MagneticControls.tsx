import { useState, type CSSProperties } from "react";
import { MAGNETIC_LIMITS, PARTICLES } from "@/data/particles";
import { formatPhysicsValue } from "@/lib/format";
import type { MagneticInputs, MagneticVariable } from "@/types/magnetism";

interface Props {
  inputs: MagneticInputs;
  circular: boolean;
  preset: string;
  onChange: (variable: MagneticVariable, value: number) => void;
  onPreset: (id: string) => void;
  onReset: () => void;
}

function NumberControl({
  id,
  label,
  unit,
  value,
  min,
  max,
  step,
  minPositive = 0,
  logarithmic = false,
  help,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  minPositive?: number;
  logarithmic?: boolean;
  help: string;
  onChange: (value: number) => void;
}) {
  const [error, setError] = useState("");
  const sliderMin = logarithmic ? Math.log10(min) : min;
  const sliderMax = logarithmic ? Math.log10(max) : max;
  const sliderValue = logarithmic ? Math.log10(value) : value;
  return (
    <div className="control-group">
      <div className="control-label-row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {formatPhysicsValue(value)} <small>{unit}</small>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={logarithmic ? 0.01 : step}
        value={sliderValue}
        aria-valuetext={`${formatPhysicsValue(value)} ${unit}`}
        aria-describedby={`${id}-help`}
        style={
          {
            "--range-progress": `${((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
          } as CSSProperties
        }
        onChange={(e) =>
          onChange(
            logarithmic ? 10 ** Number(e.target.value) : Number(e.target.value),
          )
        }
      />
      <div className="magnetic-number-row">
        <input
          key={value}
          type="number"
          aria-label={`${label} exacto (${unit})`}
          defaultValue={value}
          min={min}
          max={max}
          step="any"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          onBlur={(e) => {
            const input = e.currentTarget;
            const next = input.valueAsNumber;
            if (
              Number.isFinite(next) &&
              next >= min &&
              next <= max &&
              (next === 0 || next >= minPositive)
            ) {
              setError("");
              onChange(next);
            } else {
              input.value = String(value);
              setError(
                "Valor fuera del rango admitido; se conserva el anterior.",
              );
            }
          }}
        />
        <span>{unit} · Enter para aplicar</span>
      </div>
      <p className="control-help" id={`${id}-help`}>
        {help} Rango: {formatPhysicsValue(min)} a {formatPhysicsValue(max)}{" "}
        {unit}.
      </p>
      {minPositive > 0 && (
        <p className="control-help">
          Mínimo distinto de cero: {formatPhysicsValue(minPositive)} {unit}.
        </p>
      )}
      {error && (
        <p className="control-help" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function MagneticControls({
  inputs: p,
  circular,
  preset,
  onChange,
  onPreset,
  onReset,
}: Props) {
  return (
    <section
      className="lab-panel controls-panel magnetic-controls"
      aria-labelledby="magnetic-controls-title"
    >
      <div className="panel-heading">
        <h2 id="magnetic-controls-title">Variables</h2>
        <button type="button" className="reset-button" onClick={onReset}>
          Restablecer
        </button>
      </div>
      <div className="control-group">
        <label htmlFor="particle">Partícula</label>
        <select
          id="particle"
          value={preset}
          onChange={(e) => onPreset(e.target.value)}
        >
          {PARTICLES.map((particle) => (
            <option key={particle.id} value={particle.id}>
              {particle.name}
            </option>
          ))}
          <option value="custom">Personalizada</option>
        </select>
        <p className="control-help">
          Valores redondeados de Sears, ejemplos 27.3–27.4 (PDF p. 13). Editar
          carga o masa activa “Personalizada”.
        </p>
      </div>
      <div className="control-group">
        <label htmlFor="charge-sign">Tipo de carga</label>
        <select
          id="charge-sign"
          value={p.charge < 0 ? -1 : 1}
          onChange={(e) => onChange("sign", Number(e.target.value))}
        >
          <option value={1}>Positiva (+)</option>
          <option value={-1}>Negativa (−)</option>
        </select>
        <p className="control-help">
          Con |q| = 0 la partícula es neutra: no tiene signo.
        </p>
      </div>
      <NumberControl
        id="charge"
        label="Magnitud de carga |q|"
        unit="C"
        value={Math.abs(p.charge)}
        {...MAGNETIC_LIMITS.charge}
        help="El signo se selecciona por separado. Se admite q = 0."
        onChange={(v) => onChange("charge", v)}
      />
      {circular && (
        <NumberControl
          id="mass"
          label="Masa m"
          unit="kg"
          value={p.mass}
          {...MAGNETIC_LIMITS.mass}
          logarithmic
          help="Deslizador logarítmico: recorre varias escalas de masa."
          onChange={(v) => onChange("mass", v)}
        />
      )}
      <NumberControl
        id="speed"
        label="Rapidez v"
        unit="m/s"
        value={p.speed}
        {...MAGNETIC_LIMITS.speed}
        help="Magnitud de la velocidad física."
        onChange={(v) => onChange("speed", v)}
      />
      <NumberControl
        id="field"
        label="Campo B"
        unit="T"
        value={p.field}
        {...MAGNETIC_LIMITS.field}
        help="Intensidad del campo uniforme. B = 0 elimina el campo."
        onChange={(v) => onChange("field", v)}
      />
      <div className="control-group">
        <label htmlFor="field-direction">Dirección de B</label>
        <select
          id="field-direction"
          value={p.direction}
          onChange={(e) => onChange("direction", Number(e.target.value))}
        >
          <option value={-1}>× Entrando en el plano (−z)</option>
          <option value={1}>• Saliendo del plano (+z)</option>
        </select>
        {!circular && (
          <p className="control-help">
            Invertir B conserva la velocidad y cambia θ por 180° − θ. Su seno y
            |F| se conservan.
          </p>
        )}
      </div>
      {!circular && (
        <NumberControl
          id="angle"
          label="Ángulo θ entre v y B"
          unit="°"
          value={p.angle}
          {...MAGNETIC_LIMITS.angle}
          help="θ se mide en el espacio, no entre las proyecciones en pantalla."
          onChange={(v) => onChange("angle", v)}
        />
      )}
      {circular && (
        <p className="control-help">
          Movimiento perpendicular al campo: θ = 90°.
        </p>
      )}
    </section>
  );
}
