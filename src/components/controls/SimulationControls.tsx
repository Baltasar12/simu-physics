import { RotateCcw } from "lucide-react";
import { MATERIALS } from "@/data/materials";
import { CONTROL_LIMITS } from "@/lib/constants";
import { formatFixed, formatPhysicsValue } from "@/lib/format";
import type { ControlVariable } from "@/types/physics";

interface SimulationControlsProps {
  materialId: string;
  lengthMeters: number;
  diameterMillimeters: number;
  currentAmperes: number;
  temperatureCelsius: number;
  carrierDensityPerCubicMeter: number;
  onMaterialChange: (value: string) => void;
  onValueChange: (
    variable: Exclude<ControlVariable, "material">,
    value: number,
  ) => void;
  onReset: () => void;
}

interface RangeControlProps {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  help: string;
  onChange: (value: number) => void;
}

function RangeControl({
  id,
  label,
  symbol,
  unit,
  value,
  min,
  max,
  step,
  digits = 1,
  help,
  onChange,
}: RangeControlProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="control-group">
      <div className="control-label-row">
        <label htmlFor={id}>
          {label} <span>{symbol}</span>
        </label>
        <output htmlFor={id}>
          {formatFixed(value, digits)} <small>{unit}</small>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${percentage}%` } as React.CSSProperties}
        aria-describedby={`${id}-help`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="range-bounds" aria-hidden="true">
        <span>{min}</span>
        <span>
          {max} {unit}
        </span>
      </div>
      <p className="control-help" id={`${id}-help`}>
        {help}
      </p>
    </div>
  );
}

export function SimulationControls(props: SimulationControlsProps) {
  const carrierDensityExponent = Math.log10(props.carrierDensityPerCubicMeter);
  const carrierDensityLimits = CONTROL_LIMITS.carrierDensity;

  return (
    <section
      className="lab-panel controls-panel"
      aria-labelledby="controls-heading"
    >
      <div className="panel-heading">
        <div>
          <span className="panel-index">01</span>
          <h2 id="controls-heading">Variables</h2>
        </div>
        <button className="reset-button" type="button" onClick={props.onReset}>
          <RotateCcw aria-hidden="true" size={15} /> Restablecer
        </button>
      </div>

      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="material">
            Material <span>ρ₀, α</span>
          </label>
        </div>
        <select
          id="material"
          value={props.materialId}
          onChange={(event) => props.onMaterialChange(event.target.value)}
        >
          {MATERIALS.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
        <p className="control-help">
          La resistividad es una propiedad del material; no describe la
          geometría del conductor.
        </p>
      </div>

      <RangeControl
        id="length"
        label="Longitud"
        symbol="L"
        unit="m"
        value={props.lengthMeters}
        {...CONTROL_LIMITS.length}
        digits={2}
        help="Distancia entre los extremos del tramo conductor."
        onChange={(value) => props.onValueChange("length", value)}
      />
      <RangeControl
        id="diameter"
        label="Diámetro"
        symbol="d"
        unit="mm"
        value={props.diameterMillimeters}
        {...CONTROL_LIMITS.diameter}
        digits={1}
        help="Se convierte a metros antes de calcular el área circular."
        onChange={(value) => props.onValueChange("diameter", value)}
      />
      <RangeControl
        id="current"
        label="Corriente"
        symbol="I"
        unit="A"
        value={props.currentAmperes}
        {...CONTROL_LIMITS.current}
        digits={1}
        help="Tasa de transferencia de carga. No modifica directamente R en este modelo."
        onChange={(value) => props.onValueChange("current", value)}
      />
      <div className="control-group">
        <div className="control-label-row">
          <label htmlFor="carrier-density">
            Densidad de portadores <span>n</span>
          </label>
          <output htmlFor="carrier-density">
            {formatPhysicsValue(props.carrierDensityPerCubicMeter)}{" "}
            <small>m⁻³</small>
          </output>
        </div>
        <input
          id="carrier-density"
          type="range"
          min={carrierDensityLimits.minExponent}
          max={carrierDensityLimits.maxExponent}
          step={carrierDensityLimits.step}
          value={carrierDensityExponent}
          style={
            {
              "--range-progress": `${((carrierDensityExponent - carrierDensityLimits.minExponent) / (carrierDensityLimits.maxExponent - carrierDensityLimits.minExponent)) * 100}%`,
            } as React.CSSProperties
          }
          aria-describedby="carrier-density-help"
          onChange={(event) =>
            props.onValueChange(
              "carrierDensity",
              10 ** Number(event.target.value),
            )
          }
        />
        <div className="range-bounds" aria-hidden="true">
          <span>10²⁷</span>
          <span>10³⁰ m⁻³</span>
        </div>
        <p className="control-help" id="carrier-density-help">
          Cantidad de portadores libres por volumen. El valor inicial 8,5 × 10²⁸
          m⁻³ corresponde al cobre del ejemplo 25.1 de Sears.
        </p>
      </div>
      <RangeControl
        id="temperature"
        label="Temperatura"
        symbol="T"
        unit="°C"
        value={props.temperatureCelsius}
        {...CONTROL_LIMITS.temperature}
        digits={0}
        help="Rango pedagógico del modelo lineal indicado por Sears."
        onChange={(value) => props.onValueChange("temperature", value)}
      />
    </section>
  );
}
