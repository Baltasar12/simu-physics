import type { CoilPairInputs } from "../types/helmholtz";

export const HELMHOLTZ_INITIAL: CoilPairInputs = {
  radius: 0.2,
  separation: 0.2,
  turns1: 100,
  turns2: 100,
  current1: 1,
  current2: 1,
  direction1: 1,
  direction2: 1,
};
export const COIL_LIMITS = {
  radius: { min: 0.05, max: 1, step: 0.01 },
  separation: { min: 0, max: 3, step: 0.01 },
  turns1: { min: 1, max: 1000, step: 1 },
  turns2: { min: 1, max: 1000, step: 1 },
  current1: { min: 0, max: 10, step: 0.1 },
  current2: { min: 0, max: 10, step: 0.1 },
} as const;

// Resoluciones independientes: cambiar la grilla no degrada la sonda.
export const FIELD_SEGMENTS = 128;
export const PROBE_SEGMENTS = 256;
export const UNIFORM_GRID_SIZE = 21;
export const UNIFORM_HALF_SIZE_RADII = 0.6;
export const WIRE_EXCLUSION_RADII = 0.015;
export const UNIFORM_TOLERANCE = 0.01;
export const TESLA_TO_MICROTESLA = 1e6;
