"use client";

import { useEffect, useMemo, useState } from "react";
import { PhysicsCharts } from "@/components/charts/PhysicsCharts";
import { SimulationControls } from "@/components/controls/SimulationControls";
import { ResultsGrid } from "@/components/results/ResultsGrid";
import { ConductorSimulation } from "@/components/simulations/ConductorSimulation";
import { DynamicExplanation } from "@/components/theory/DynamicExplanation";
import { PhysicalModel } from "@/components/theory/PhysicalModel";
import { DEFAULT_MATERIAL_ID, getMaterial } from "@/data/materials";
import { CONTROL_LIMITS } from "@/lib/constants";
import {
  calculateElectricalState,
  millimetersToMeters,
} from "@/physics/electrical";
import type { ControlVariable } from "@/types/physics";

interface ModelContextTool {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
}

declare global {
  interface Document {
    readonly modelContext?: ModelContextTool;
  }
}

const INITIAL = {
  materialId: DEFAULT_MATERIAL_ID,
  lengthMeters: CONTROL_LIMITS.length.initial,
  diameterMillimeters: CONTROL_LIMITS.diameter.initial,
  currentAmperes: CONTROL_LIMITS.current.initial,
  temperatureCelsius: CONTROL_LIMITS.temperature.initial,
  carrierDensityPerCubicMeter: CONTROL_LIMITS.carrierDensity.initial,
};

function readToolNumber(
  values: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
): number | undefined {
  const value = values[key];
  if (value === undefined) return undefined;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new RangeError(`${key} debe estar entre ${min} y ${max}.`);
  }
  return value;
}

export function ElectricalLab() {
  const [materialId, setMaterialId] = useState<string>(INITIAL.materialId);
  const [lengthMeters, setLengthMeters] = useState<number>(
    INITIAL.lengthMeters,
  );
  const [diameterMillimeters, setDiameterMillimeters] = useState<number>(
    INITIAL.diameterMillimeters,
  );
  const [currentAmperes, setCurrentAmperes] = useState<number>(
    INITIAL.currentAmperes,
  );
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(
    INITIAL.temperatureCelsius,
  );
  const [carrierDensityPerCubicMeter, setCarrierDensityPerCubicMeter] =
    useState<number>(INITIAL.carrierDensityPerCubicMeter);
  const [activeVariable, setActiveVariable] =
    useState<ControlVariable>("material");

  const material = getMaterial(materialId);
  const results = useMemo(
    () =>
      calculateElectricalState({
        resistivityAtReference: material.resistivity,
        temperatureCoefficient: material.temperatureCoefficient,
        referenceTemperatureCelsius: material.referenceTemperature,
        temperatureCelsius,
        lengthMeters,
        diameterMeters: millimetersToMeters(diameterMillimeters),
        currentAmperes,
        carrierDensityPerCubicMeter,
      }),
    [
      material,
      temperatureCelsius,
      lengthMeters,
      diameterMillimeters,
      currentAmperes,
      carrierDensityPerCubicMeter,
    ],
  );

  const changeValue = (
    variable: Exclude<ControlVariable, "material">,
    value: number,
  ) => {
    setActiveVariable(variable);
    if (variable === "length") setLengthMeters(value);
    if (variable === "diameter") setDiameterMillimeters(value);
    if (variable === "current") setCurrentAmperes(value);
    if (variable === "temperature") setTemperatureCelsius(value);
    if (variable === "carrierDensity") setCarrierDensityPerCubicMeter(value);
  };

  const reset = () => {
    setMaterialId(INITIAL.materialId);
    setLengthMeters(INITIAL.lengthMeters);
    setDiameterMillimeters(INITIAL.diameterMillimeters);
    setCurrentAmperes(INITIAL.currentAmperes);
    setTemperatureCelsius(INITIAL.temperatureCelsius);
    setCarrierDensityPerCubicMeter(INITIAL.carrierDensityPerCubicMeter);
    setActiveVariable("material");
  };

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const update = (input: unknown) => {
      if (typeof input !== "object" || input === null)
        throw new Error("Se esperaba un objeto de parámetros.");
      const values = input as Record<string, unknown>;
      const nextLength = readToolNumber(values, "lengthMeters", 0.1, 10);
      const nextDiameter = readToolNumber(
        values,
        "diameterMillimeters",
        0.5,
        10,
      );
      const nextCurrent = readToolNumber(values, "currentAmperes", 0, 10);
      const nextTemperature = readToolNumber(
        values,
        "temperatureCelsius",
        0,
        100,
      );
      const nextCarrierDensity = readToolNumber(
        values,
        "carrierDensityPerCubicMeter",
        1e27,
        1e30,
      );
      if (nextLength !== undefined) setLengthMeters(nextLength);
      if (nextDiameter !== undefined) setDiameterMillimeters(nextDiameter);
      if (nextCurrent !== undefined) setCurrentAmperes(nextCurrent);
      if (nextTemperature !== undefined) setTemperatureCelsius(nextTemperature);
      if (nextCarrierDensity !== undefined)
        setCarrierDensityPerCubicMeter(nextCarrierDensity);
      return { updated: true };
    };
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: "configure_electrical_simulation",
            title: "Configurar simulación eléctrica",
            description:
              "Modifica la geometría, corriente, temperatura o densidad de portadores visible del laboratorio.",
            inputSchema: {
              type: "object",
              properties: {
                lengthMeters: { type: "number", minimum: 0.1, maximum: 10 },
                diameterMillimeters: {
                  type: "number",
                  minimum: 0.5,
                  maximum: 10,
                },
                currentAmperes: { type: "number", minimum: 0, maximum: 10 },
                temperatureCelsius: {
                  type: "number",
                  minimum: 0,
                  maximum: 100,
                },
                carrierDensityPerCubicMeter: {
                  type: "number",
                  minimum: 1e27,
                  maximum: 1e30,
                },
              },
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: update,
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => undefined);
    } catch {
      /* WebMCP es una mejora progresiva en navegadores compatibles. */
    }
    return () => lifecycle.abort();
  }, []);

  return (
    <>
      <div className="lab-workspace">
        <SimulationControls
          materialId={materialId}
          lengthMeters={lengthMeters}
          diameterMillimeters={diameterMillimeters}
          currentAmperes={currentAmperes}
          temperatureCelsius={temperatureCelsius}
          carrierDensityPerCubicMeter={carrierDensityPerCubicMeter}
          onMaterialChange={(value) => {
            setMaterialId(value);
            setActiveVariable("material");
          }}
          onValueChange={changeValue}
          onReset={reset}
        />
        <ConductorSimulation
          material={material}
          lengthMeters={lengthMeters}
          diameterMillimeters={diameterMillimeters}
          currentAmperes={currentAmperes}
          temperatureCelsius={temperatureCelsius}
          driftVelocityMetersPerSecond={results.driftVelocityMetersPerSecond}
        />
      </div>
      <ResultsGrid
        material={material}
        results={results}
        currentAmperes={currentAmperes}
        temperatureCelsius={temperatureCelsius}
      />
      <div className="explanation-model-grid">
        <DynamicExplanation
          activeVariable={activeVariable}
          material={material}
          results={results}
        />
        <PhysicalModel activeVariable={activeVariable} />
      </div>
      <PhysicsCharts
        material={material}
        lengthMeters={lengthMeters}
        diameterMillimeters={diameterMillimeters}
        temperatureCelsius={temperatureCelsius}
        results={results}
      />
    </>
  );
}
