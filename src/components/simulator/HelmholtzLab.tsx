"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { HelmholtzControls } from "@/components/controls/HelmholtzControls";
import { HelmholtzProbe } from "@/components/results/HelmholtzProbe";
import { HelmholtzChart } from "@/components/charts/HelmholtzChart";
import {
  HelmholtzExplanation,
  HelmholtzTheory,
} from "@/components/theory/HelmholtzTheory";
import { HELMHOLTZ_INITIAL } from "@/data/helmholtz";
import {
  axialFieldFromPair,
  axialUniformInterval,
  clampProbe,
  isOptimalHelmholtz,
} from "@/physics/helmholtz";
import { formatFixed, formatPhysicsValue } from "@/lib/format";
import type {
  CoilPairInputs,
  CoilPreset,
  CoilVariable,
  MapQuality,
} from "@/types/helmholtz";
import type { Vector3 } from "@/types/magnetism";
import { useHelmholtzMap } from "./useHelmholtzMap";

// Solo WebGL omite prerenderizado. La página, teoría y resto de la app conservan SSR.
const Scene = dynamic(() => import("@/components/simulations/HelmholtzScene"), {
  ssr: false,
  loading: () => (
    <div className="helm-canvas-fallback">Preparando escena 3D…</div>
  ),
});

export function HelmholtzLab() {
  const [inputs, setInputs] = useState<CoilPairInputs>(HELMHOLTZ_INITIAL);
  const [preset, setPreset] = useState<CoilPreset>("optimal");
  const [active, setActive] = useState<CoilVariable | "preset">("preset");
  const [point, setPoint] = useState<Vector3>({ x: 0, y: 0, z: 0 });
  const [quality, setQuality] = useState<MapQuality>(7);
  const [showField, setShowField] = useState(true),
    [showUniform, setShowUniform] = useState(true);
  const [showProbe, setShowProbe] = useState(true),
    [dragProbe, setDragProbe] = useState(true);
  const [viewVersion, setViewVersion] = useState(0);
  const [screenError, setScreenError] = useState("");
  const viewport = useRef<HTMLDivElement>(null);
  const { map, error: mapError, pending } = useHelmholtzMap(inputs, quality);
  // Toda la lectura física y la escena pertenecen al mismo resultado del worker.
  const p = map?.inputs ?? HELMHOLTZ_INITIAL;
  const field = map?.result.field ?? [];
  const region = map?.result.region ?? {
    points: [],
    reference: null,
    maxVariation: 0,
    spacing: 0,
    estimatedVolume: 0,
  };
  const interval = useMemo(() => axialUniformInterval(p), [p]);
  const probe = clampProbe(point, p);
  const onProbeMove = useCallback((next: Vector3) => setPoint(next), []);
  const change = (key: CoilVariable, value: number) => {
    setActive(key);
    setPreset("custom");
    const next = { ...inputs, [key]: value };
    setInputs(next);
    setPoint((v) => clampProbe(v, next));
  };
  const choosePreset = (id: CoilPreset) => {
    setPreset(id);
    setActive("preset");
    if (id === "custom") return;
    setInputs((previous) => ({
      ...previous,
      turns2: previous.turns1,
      current2: previous.current1,
      direction2:
        id === "anti"
          ? previous.direction1 === 1
            ? -1
            : 1
          : previous.direction1,
      separation: id === "optimal" ? previous.radius : previous.separation,
    }));
  };
  const reset = () => {
    setInputs(HELMHOLTZ_INITIAL);
    setPreset("optimal");
    setActive("preset");
    setPoint({ x: 0, y: 0, z: 0 });
    setViewVersion((v) => v + 1);
  };
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await viewport.current?.requestFullscreen();
      setScreenError("");
    } catch {
      setScreenError(
        "El navegador no permite pantalla completa en esta ventana.",
      );
    }
  };
  return (
    <>
      <div className="lab-workspace helm-workspace">
        <HelmholtzControls
          inputs={inputs}
          preset={preset}
          onChange={change}
          onPreset={choosePreset}
          onReset={reset}
        />
        <section
          className="simulation-panel helm-viewport-panel"
          aria-labelledby="scene-title"
        >
          <div className="panel-heading">
            <div>
              <h2 id="scene-title">Campo magnético en 3D</h2>
              <p className="control-help">
                {isOptimalHelmholtz(p)
                  ? "Configuración Helmholtz óptima"
                  : "Dos bobinas coaxiales · superposición vectorial"}
              </p>
            </div>
            <span className="live-badge" role="status">
              {pending ? "Actualizando…" : "Biot-Savart"}
            </span>
          </div>
          <div className="helm-view-options">
            <label>
              <input
                type="checkbox"
                checked={showField}
                onChange={(e) => setShowField(e.target.checked)}
              />{" "}
              Campo vectorial
            </label>
            <label>
              <input
                type="checkbox"
                checked={showUniform}
                onChange={(e) => setShowUniform(e.target.checked)}
              />{" "}
              Mostrar zona uniforme
            </label>
            <label>
              <input
                type="checkbox"
                checked={showProbe}
                onChange={(e) => setShowProbe(e.target.checked)}
              />{" "}
              Sonda
            </label>
            <label>
              <input
                type="checkbox"
                checked={dragProbe}
                onChange={(e) => setDragProbe(e.target.checked)}
              />{" "}
              Arrastrar sonda
            </label>
            <label>
              Resolución{" "}
              <select
                aria-label="Resolución del mapa"
                value={quality}
                onChange={(e) =>
                  setQuality(Number(e.target.value) as MapQuality)
                }
              >
                <option value={7}>Baja · 7³</option>
                <option value={9}>Media · 9³</option>
                <option value={11}>Alta · 11³</option>
              </select>
            </label>
          </div>
          <div
            className="helm-viewport"
            ref={viewport}
            role="group"
            aria-label="Dos bobinas en planos YZ, campo vectorial, nube de homogeneidad y sonda con controles de traslación"
            aria-describedby="scene-description"
            aria-busy={pending}
            data-field-count={field.length}
            data-uniform-count={region.points.length}
          >
            <Scene
              inputs={p}
              field={field}
              region={region}
              probe={probe}
              onProbeMove={onProbeMove}
              showField={showField}
              showUniform={showUniform}
              showProbe={showProbe}
              dragProbe={dragProbe}
              resetView={viewVersion}
            />
            <div className="helm-view-toolbar">
              <button onClick={() => setViewVersion((v) => v + 1)}>
                Restablecer vista
              </button>
              <button onClick={fullscreen}>Pantalla completa</button>
            </div>
            <span className="helm-view-caption">
              Eje común X · Escala espacial automática
            </span>
          </div>
          <p id="scene-description" className="control-help">
            Izquierdo: rotar · rueda: zoom · derecho: panear. Arrastrá las
            flechas o planos de la sonda; la cámara se bloquea durante ese
            arrastre.
          </p>
          <div className="helm-legend">
            <span>↗ Flechas: dirección de B</span>
            <span>Azul → cian: menor → mayor |B|</span>
            <span>● Verde: región |ΔB|/Bcentro &lt;1%</span>
            <span>○ Blanco: sonda</span>
          </div>
          <p className="control-help">
            Flechas de longitud normalizada y color autoescalado al percentil
            90; no comparan magnitudes entre configuraciones. Una estructura por
            bobina representa N vueltas coincidentes.
          </p>
          {map && region.reference === null ? (
            <p className="helm-warning">
              La homogeneidad relativa respecto del campo central no es
              aplicable porque Bcentro ≈ 0.
            </p>
          ) : null}
          {mapError ? (
            <p className="helm-warning" role="alert">
              No se pudo calcular el mapa 3D. Recargá la página para reiniciar
              el cálculo local.
            </p>
          ) : null}
          {screenError ? <p role="status">{screenError}</p> : null}
        </section>
      </div>
      <section className="results-section" aria-labelledby="homogeneity-title">
        <div className="section-title-row">
          <h2 id="homogeneity-title">Homogeneidad central</h2>
          <p>Referencia: magnitud en el origen</p>
        </div>
        <div className="results-grid helm-metrics">
          <div className="result-card featured">
            <div>Campo central B₀</div>
            <strong
              data-testid="helm-center"
              data-value={Math.abs(axialFieldFromPair(0, p))}
            >
              {formatPhysicsValue(Math.abs(axialFieldFromPair(0, p)), 5)}{" "}
              <small>T</small>
            </strong>
          </div>
          <div className="result-card">
            <div>Relación geométrica D/R</div>
            <strong>{formatFixed(p.separation / p.radius)}</strong>
          </div>
          <div className="result-card">
            <div>Longitud axial con variación &lt;1%</div>
            <strong data-testid="helm-interval" data-value={interval?.length}>
              {interval
                ? `${formatFixed(interval.length, 4)} m`
                : "No aplicable"}
            </strong>
          </div>
          <div className="result-card">
            <div>Máx. variación en nube aceptada</div>
            <strong>
              {region.reference === null
                ? "No aplicable"
                : `${(region.maxVariation * 100).toFixed(3)} %`}
            </strong>
          </div>
        </div>
        <p className="control-help">
          {interval
            ? `Intervalo central: (${formatFixed(interval.min, 5)}, ${formatFixed(interval.max, 5)}) m; extremos delimitan el 1%. `
            : ""}
          Nube: {region.points.length} celdas aceptadas de 21³, dentro de ±0,6R
          por eje. Volumen estimado:{" "}
          {region.reference === null
            ? "no aplicable"
            : `${formatPhysicsValue(region.estimatedVolume)} m³`}
          ; depende del muestreo, puede incluir regiones separadas y no define
          una frontera continua.
        </p>
      </section>
      <HelmholtzProbe inputs={p} point={probe} onMove={onProbeMove} />
      <HelmholtzChart inputs={p} probe={probe} interval={interval} />
      <div className="explanation-model-grid">
        <HelmholtzExplanation inputs={p} active={active} />
        <HelmholtzTheory />
      </div>
    </>
  );
}
