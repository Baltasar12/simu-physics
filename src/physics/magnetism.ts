import type {
  CircularState,
  FieldDirection,
  Vector3,
} from "../types/magnetism";

function finite(value: number, label: string): void {
  if (!Number.isFinite(value))
    throw new RangeError(`${label} debe ser finito.`);
}
function nonnegative(value: number, label: string): void {
  finite(value, label);
  if (value < 0) throw new RangeError(`${label} no puede ser negativo.`);
}
export function degreesToRadians(degrees: number): number {
  finite(degrees, "Ángulo");
  return (degrees * Math.PI) / 180;
}
export function angleComponents(degrees: number): { sin: number; cos: number } {
  if (degrees < 0 || degrees > 180)
    throw new RangeError("El ángulo debe estar entre 0° y 180°.");
  const radians = degreesToRadians(degrees);
  return {
    sin: degrees === 0 || degrees === 180 ? 0 : Math.sin(radians),
    cos: degrees === 90 ? 0 : Math.cos(radians),
  };
}
export function crossProduct(a: Vector3, b: Vector3): Vector3 {
  [...Object.values(a), ...Object.values(b)].forEach((v) =>
    finite(v, "Componente"),
  );
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}
export function magneticForceVector(
  charge: number,
  velocity: Vector3,
  field: Vector3,
): Vector3 {
  finite(charge, "Carga");
  const cross = crossProduct(velocity, field);
  // Normalize signed zero without discarding small, physically meaningful forces.
  const result = {
    x: charge * cross.x || 0,
    y: charge * cross.y || 0,
    z: charge * cross.z || 0,
  };
  Object.values(result).forEach((v) => finite(v, "Fuerza"));
  return result;
}
export function magneticForceMagnitude(
  charge: number,
  speed: number,
  field: number,
  angle: number,
): number {
  finite(charge, "Carga");
  nonnegative(speed, "Rapidez");
  nonnegative(field, "Campo");
  const force = Math.abs(charge) * speed * field * angleComponents(angle).sin;
  finite(force, "Fuerza");
  return force;
}
/** Velocity in xz; θ is measured from the selected B direction. */
export function velocityAtAngle(
  speed: number,
  angle: number,
  direction: FieldDirection,
): Vector3 {
  nonnegative(speed, "Rapidez");
  const { sin, cos } = angleComponents(angle);
  return { x: speed * sin, y: 0, z: direction * speed * cos };
}
export function circularMotion(
  mass: number,
  charge: number,
  speed: number,
  fieldZ: number,
): CircularState {
  finite(mass, "Masa");
  if (mass <= 0) throw new RangeError("La masa debe ser positiva.");
  finite(charge, "Carga");
  finite(fieldZ, "Campo");
  nonnegative(speed, "Rapidez");
  const empty = {
    force: 0,
    radius: null,
    omega: null,
    period: null,
    frequency: null,
    orientation: 0,
  } as const;
  if (speed === 0)
    return { ...empty, kind: "stationary", reason: "En reposo — v = 0" };
  if (fieldZ === 0 || charge === 0)
    return {
      ...empty,
      kind: "straight",
      reason:
        fieldZ === 0
          ? "Sin trayectoria circular — B = 0"
          : "Sin trayectoria circular — q = 0",
    };
  const omega = Math.abs(charge * fieldZ) / mass;
  const radius = speed / omega;
  const period = (2 * Math.PI) / omega;
  const frequency = omega / (2 * Math.PI);
  for (const value of [omega, radius, period, frequency]) {
    finite(value, "Resultado orbital");
    if (value <= 0)
      throw new RangeError(
        "Parámetros fuera del intervalo numérico del modelo.",
      );
  }
  return {
    kind: "circular",
    reason: "Movimiento perpendicular al campo · θ = 90°",
    force: magneticForceMagnitude(charge, speed, Math.abs(fieldZ), 90),
    radius,
    omega,
    period,
    frequency,
    orientation: -Math.sign(charge * fieldZ) as FieldDirection,
  };
}
/** Exact classical solution, initial position (0,0,0) and velocity (v,0,0). */
export function orbitSample(
  state: CircularState,
  speed: number,
  charge: number,
  fieldZ: number,
  time: number,
) {
  nonnegative(time, "Tiempo");
  nonnegative(speed, "Rapidez");
  if (state.kind !== "circular") {
    return {
      position: {
        x: state.kind === "stationary" ? 0 : speed * time,
        y: 0,
        z: 0,
      },
      velocity: { x: state.kind === "stationary" ? 0 : speed, y: 0, z: 0 },
      force: { x: 0, y: 0, z: 0 },
      center: { x: 0, y: 0, z: 0 },
    };
  }
  const phase = state.omega * time;
  const sin = Math.sin(phase),
    cos = Math.cos(phase);
  const velocity = { x: speed * cos, y: state.orientation * speed * sin, z: 0 };
  return {
    position: {
      x: state.radius * sin,
      y: state.orientation * state.radius * (1 - cos),
      z: 0,
    },
    center: { x: 0, y: state.orientation * state.radius, z: 0 },
    velocity,
    force: magneticForceVector(charge, velocity, { x: 0, y: 0, z: fieldZ }),
  };
}
