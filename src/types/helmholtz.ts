import type { Vector3 } from "./magnetism";

export interface CoilPairInputs {
  radius: number;
  separation: number;
  turns1: number;
  turns2: number;
  current1: number;
  current2: number;
  direction1: 1 | -1;
  direction2: 1 | -1;
}
export interface CircularCoil {
  radius: number;
  centerX: number;
  turns: number;
  /** Antihorario visto desde +X = positivo; horario = negativo. */
  current: number;
}
export type CoilVariable = keyof CoilPairInputs;
export type CoilPreset = "helmholtz" | "optimal" | "anti" | "custom";
export type MapQuality = 7 | 9 | 11;
export interface FieldSample {
  point: Vector3;
  field: Vector3;
  magnitude: number;
}
export interface UniformRegion {
  points: Vector3[];
  reference: number | null;
  maxVariation: number;
  spacing: number;
  estimatedVolume: number;
}
export interface AxialPoint {
  x: number;
  bx: number;
  magnitude: number;
}
export interface AxialInterval {
  min: number;
  max: number;
  length: number;
}
