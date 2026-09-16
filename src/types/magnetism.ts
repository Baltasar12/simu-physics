export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
export type FieldDirection = -1 | 1;
export type MagneticVariable =
  | "charge"
  | "sign"
  | "mass"
  | "speed"
  | "field"
  | "direction"
  | "angle"
  | "preset";
export interface MagneticInputs {
  charge: number;
  mass: number;
  speed: number;
  field: number;
  direction: FieldDirection;
  angle: number;
}
export type CircularState =
  | {
      kind: "stationary" | "straight";
      reason: string;
      force: number;
      radius: null;
      omega: null;
      period: null;
      frequency: null;
      orientation: 0;
    }
  | {
      kind: "circular";
      reason: string;
      force: number;
      radius: number;
      omega: number;
      period: number;
      frequency: number;
      orientation: FieldDirection;
    };
