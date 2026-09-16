"use client";

import { useMemo, useState } from "react";
import { MagneticCharts } from "@/components/charts/MagneticCharts";
import { MagneticControls } from "@/components/controls/MagneticControls";
import { MagneticResults } from "@/components/results/MagneticResults";
import { CircularMotionSimulation } from "@/components/simulations/CircularMotionSimulation";
import { MagneticForceSimulation } from "@/components/simulations/MagneticForceSimulation";
import {
  MagneticExplanation,
  MagneticTheory,
} from "@/components/theory/MagneticTheory";
import { MAGNETIC_INITIAL, PARTICLES } from "@/data/particles";
import {
  circularMotion,
  magneticForceVector,
  velocityAtAngle,
} from "@/physics/magnetism";
import type { MagneticInputs, MagneticVariable } from "@/types/magnetism";

export function MagneticLab({ circular = false }: { circular?: boolean }) {
  const [inputs, setInputs] = useState<MagneticInputs>(MAGNETIC_INITIAL);
  const [preset, setPreset] = useState("proton");
  const [active, setActive] = useState<MagneticVariable>("preset");
  const [resetVersion, setResetVersion] = useState(0);
  const change = (variable: MagneticVariable, value: number) => {
    setActive(variable);
    if (variable === "charge" || variable === "mass" || variable === "sign")
      setPreset("custom");
    setInputs((p) => {
      if (variable === "sign")
        return { ...p, charge: Math.abs(p.charge) * value };
      if (variable === "charge")
        return { ...p, charge: value * (p.charge < 0 ? -1 : 1) };
      if (variable === "direction")
        return {
          ...p,
          direction: value === 1 ? 1 : -1,
          angle: !circular && value !== p.direction ? 180 - p.angle : p.angle,
        };
      return { ...p, [variable]: value };
    });
  };
  const choosePreset = (id: string) => {
    setPreset(id);
    setActive("preset");
    const particle = PARTICLES.find((p) => p.id === id);
    if (particle)
      setInputs((p) => ({
        ...p,
        charge: particle.charge,
        mass: particle.mass,
      }));
  };
  const { state, force } = useMemo(
    () => ({
      state: circularMotion(
        inputs.mass,
        inputs.charge,
        inputs.speed,
        inputs.field * inputs.direction,
      ),
      force: magneticForceVector(
        inputs.charge,
        velocityAtAngle(inputs.speed, inputs.angle, inputs.direction),
        { x: 0, y: 0, z: inputs.field * inputs.direction },
      ),
    }),
    [inputs],
  );
  const reset = () => {
    setInputs(MAGNETIC_INITIAL);
    setPreset("proton");
    setActive("preset");
    setResetVersion((v) => v + 1);
  };
  return (
    <>
      <div className="lab-workspace">
        <MagneticControls
          inputs={inputs}
          circular={circular}
          preset={preset}
          onChange={change}
          onPreset={choosePreset}
          onReset={reset}
        />
        {circular ? (
          <CircularMotionSimulation
            key={`${resetVersion}/${inputs.mass}/${inputs.charge}/${inputs.speed}/${inputs.field}/${inputs.direction}`}
            inputs={inputs}
            state={state}
          />
        ) : (
          <MagneticForceSimulation inputs={inputs} force={force} />
        )}
      </div>
      <MagneticResults
        inputs={inputs}
        circular={circular}
        state={state}
        force={force}
        particle={
          PARTICLES.find((p) => p.id === preset)?.name ?? "Personalizada"
        }
      />
      <div className="explanation-model-grid">
        <MagneticExplanation
          inputs={inputs}
          circular={circular}
          state={state}
          force={force}
          active={active}
        />
        <MagneticTheory circular={circular} />
      </div>
      <MagneticCharts inputs={inputs} circular={circular} />
    </>
  );
}
