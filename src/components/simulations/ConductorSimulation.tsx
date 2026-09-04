import { formatFixed } from "@/lib/format";
import type { Material } from "@/types/physics";

interface ConductorSimulationProps {
  material: Material;
  lengthMeters: number;
  diameterMillimeters: number;
  currentAmperes: number;
  temperatureCelsius: number;
}

const ELECTRONS = [0.08, 0.22, 0.37, 0.53, 0.69, 0.84];

export function ConductorSimulation({ material, lengthMeters, diameterMillimeters, currentAmperes, temperatureCelsius }: ConductorSimulationProps) {
  const conductorWidth = 300 + (lengthMeters / 10) * 360;
  const conductorHeight = 38 + (diameterMillimeters / 10) * 74;
  const x = (760 - conductorWidth) / 2;
  const y = 180 - conductorHeight / 2;
  const animationDuration = currentAmperes === 0 ? 0 : Math.max(1.3, 6.2 - currentAmperes * 0.42);
  const thermalLevel = Math.round(temperatureCelsius);

  return (
    <section className="lab-panel simulation-panel" aria-labelledby="simulation-heading">
      <div className="panel-heading">
        <div><span className="panel-index">02</span><h2 id="simulation-heading">Conductor</h2></div>
        <span className="live-badge"><i /> Actualización en tiempo real</span>
      </div>
      <div className="simulation-meta">
        <strong>{material.name}</strong>
        <span>{formatFixed(temperatureCelsius, 0)} °C</span>
      </div>
      <svg className="conductor-svg" viewBox="0 0 760 350" role="img" aria-labelledby="conductor-title conductor-desc">
        <title id="conductor-title">{`Representación del conductor de ${material.name}`}</title>
        <desc id="conductor-desc">El largo y espesor responden a los controles. La corriente convencional apunta a la derecha y los electrones se desplazan conceptualmente a la izquierda.</desc>
        <defs>
          <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".34" />
            <stop offset=".32" stopColor={material.conductorColor} />
            <stop offset="1" stopColor="#16283f" stopOpacity=".24" />
          </linearGradient>
          <marker id="arrow-current" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1da5b8" /></marker>
          <marker id="arrow-electron" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#173d68" /></marker>
          <clipPath id="conductor-clip"><rect x={x} y={y} width={conductorWidth} height={conductorHeight} rx={conductorHeight / 2} /></clipPath>
        </defs>

        <line x1={x} x2={x + conductorWidth} y1="52" y2="52" stroke="#7c8997" strokeWidth="1.5" />
        <line x1={x} x2={x} y1="42" y2="63" stroke="#7c8997" />
        <line x1={x + conductorWidth} x2={x + conductorWidth} y1="42" y2="63" stroke="#7c8997" />
        <text x="380" y="38" textAnchor="middle" className="svg-measure">L = {formatFixed(lengthMeters, 2)} m</text>

        <rect x={x} y={y} width={conductorWidth} height={conductorHeight} rx={conductorHeight / 2} fill="url(#metal)" stroke={material.conductorColor} strokeWidth="3" />
        <ellipse cx={x + conductorWidth - conductorHeight / 2} cy="180" rx={conductorHeight / 2 - 3} ry={conductorHeight / 2 - 3} fill={material.conductorColor} fillOpacity=".72" />
        <line x1={x + 18} x2={x + conductorWidth - 18} y1="180" y2="180" stroke="#ffffff" strokeOpacity=".25" strokeDasharray="5 8" />

        <g clipPath="url(#conductor-clip)" className={currentAmperes === 0 ? "electrons paused" : "electrons"} style={{ "--electron-duration": `${animationDuration}s` } as React.CSSProperties}>
          {ELECTRONS.map((position, index) => (
            <g key={position} transform={`translate(${x + conductorWidth * position} ${index % 2 ? 195 : 165})`} style={{ animationDelay: `${index * -.65}s` }}>
              <circle r="13" fill="#eaf5ff" stroke="#173d68" strokeWidth="2" />
              <text y="5" textAnchor="middle" className="electron-label">−</text>
            </g>
          ))}
        </g>

        <line x1={x + 18} x2={x + conductorWidth - 10} y1={y + conductorHeight + 47} y2={y + conductorHeight + 47} stroke="#1da5b8" strokeWidth="4" markerEnd="url(#arrow-current)" opacity={currentAmperes === 0 ? .25 : 1} />
        <text x={x + 18} y={y + conductorHeight + 34} className="svg-current">Corriente convencional · I = {formatFixed(currentAmperes, 1)} A</text>
        <line x1={x + conductorWidth - 10} x2={x + 38} y1={y - 35} y2={y - 35} stroke="#173d68" strokeWidth="2" markerEnd="url(#arrow-electron)" opacity={currentAmperes === 0 ? .25 : .8} />
        <text x={x + conductorWidth - 10} y={y - 46} textAnchor="end" className="svg-electron">movimiento conceptual de e⁻</text>

        <line x1={x + conductorWidth + 30} x2={x + conductorWidth + 30} y1={y} y2={y + conductorHeight} stroke="#7c8997" />
        <line x1={x + conductorWidth + 22} x2={x + conductorWidth + 38} y1={y} y2={y} stroke="#7c8997" />
        <line x1={x + conductorWidth + 22} x2={x + conductorWidth + 38} y1={y + conductorHeight} y2={y + conductorHeight} stroke="#7c8997" />
        <text x={x + conductorWidth + 48} y="184" className="svg-measure">d = {formatFixed(diameterMillimeters, 1)} mm</text>
      </svg>
      <div className="temperature-strip">
        <span>0 °C</span><div><i style={{ width: `${thermalLevel}%` }} /></div><strong>{thermalLevel} °C</strong><span>100 °C</span>
      </div>
      <p className="simulation-note">La velocidad de las partículas está amplificada para comunicar el sentido; no representa la velocidad de deriva real.</p>
    </section>
  );
}
