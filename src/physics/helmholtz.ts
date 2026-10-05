import { VACUUM_PERMEABILITY } from "../lib/constants";
import {
  FIELD_SEGMENTS,
  PROBE_SEGMENTS,
  UNIFORM_GRID_SIZE,
  UNIFORM_HALF_SIZE_RADII,
  UNIFORM_TOLERANCE,
  WIRE_EXCLUSION_RADII,
} from "../data/helmholtz";
import type { Vector3 } from "../types/magnetism";
import type {
  AxialInterval,
  AxialPoint,
  CircularCoil,
  CoilPairInputs,
  FieldSample,
  UniformRegion,
} from "../types/helmholtz";

export const fieldMagnitude = (v: Vector3): number => Math.hypot(v.x, v.y, v.z);

export function coilsFromInputs(
  p: CoilPairInputs,
): [CircularCoil, CircularCoil] {
  return [
    {
      radius: p.radius,
      centerX: -p.separation / 2,
      turns: p.turns1,
      current: p.current1 * p.direction1,
    },
    {
      radius: p.radius,
      centerX: p.separation / 2,
      turns: p.turns2,
      current: p.current2 * p.direction2,
    },
  ];
}

function validateCoil(c: CircularCoil) {
  if (
    ![c.radius, c.centerX, c.turns, c.current].every(Number.isFinite) ||
    c.radius <= 0 ||
    c.turns < 1 ||
    !Number.isInteger(c.turns)
  )
    throw new RangeError(
      "Geometría o corriente inválida para una bobina circular.",
    );
}

/** Distancia geométrica al círculo continuo, independiente de la discretización. */
export function distanceToCoil(p: Vector3, c: CircularCoil): number {
  return Math.hypot(p.x - c.centerX, Math.hypot(p.y, p.z) - c.radius);
}

interface QuadraturePoint {
  cos: number;
  sin: number;
}
const quadratureCache = new Map<number, readonly QuadraturePoint[]>();
function quadrature(segments: number): readonly QuadraturePoint[] {
  if (!Number.isInteger(segments) || segments < 16 || segments > 2048)
    throw new RangeError("La integración requiere entre 16 y 2048 segmentos.");
  let cached = quadratureCache.get(segments);
  if (!cached) {
    cached = Array.from({ length: segments }, (_, k) => {
      const phi = ((k + 0.5) * 2 * Math.PI) / segments;
      return { cos: Math.cos(phi), sin: Math.sin(phi) };
    });
    // Acotada: el producto usa solo 128/256; evita crecimiento con resoluciones externas.
    if (quadratureCache.size >= 8) quadratureCache.clear();
    quadratureCache.set(segments, cached);
  }
  return cached;
}

/**
 * Cuadratura de punto medio sobre la curva circular (no polígono de cuerdas).
 * r_coil=(x0,R cosφ,R sinφ), dl=(0,-R sinφ,R cosφ)dφ.
 * La expansión cartesiana de dl×(p-r_coil) se suma en SI.
 * El filamento no tiene solución finita sobre sí mismo: allí se rechaza la muestra.
 */
export function magneticFieldFromCircularCoil(
  p: Vector3,
  c: CircularCoil,
  segments = PROBE_SEGMENTS,
): Vector3 {
  validateCoil(c);
  if (![p.x, p.y, p.z].every(Number.isFinite))
    throw new RangeError("Posición no finita.");
  if (distanceToCoil(p, c) <= c.radius * WIRE_EXCLUSION_RADII)
    throw new RangeError(
      "Punto demasiado próximo al conductor ideal para este modelo.",
    );
  const samples = quadrature(segments);
  const sum = { x: 0, y: 0, z: 0 };
  if (c.current === 0) return sum;
  const dphi = (2 * Math.PI) / segments;
  const rx = p.x - c.centerX;
  for (const s of samples) {
    const ry = p.y - c.radius * s.cos;
    const rz = p.z - c.radius * s.sin;
    const dly = -c.radius * s.sin * dphi;
    const dlz = c.radius * s.cos * dphi;
    const inverseCube = 1 / Math.hypot(rx, ry, rz) ** 3;
    sum.x += (dly * rz - dlz * ry) * inverseCube;
    sum.y += dlz * rx * inverseCube;
    sum.z -= dly * rx * inverseCube;
  }
  const scale = (VACUUM_PERMEABILITY / (4 * Math.PI)) * c.turns * c.current;
  return { x: sum.x * scale, y: sum.y * scale, z: sum.z * scale };
}

export function magneticFieldFromCoilPair(
  point: Vector3,
  inputs: CoilPairInputs,
  segments = PROBE_SEGMENTS,
): Vector3 {
  const [c1, c2] = coilsFromInputs(inputs);
  const a = magneticFieldFromCircularCoil(point, c1, segments);
  const b = magneticFieldFromCircularCoil(point, c2, segments);
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function probeField(point: Vector3, inputs: CoilPairInputs) {
  const nearConductor = coilsFromInputs(inputs).some(
    (c) => distanceToCoil(point, c) <= c.radius * WIRE_EXCLUSION_RADII,
  );
  if (nearConductor)
    return { field: null, magnitude: null, nearConductor: true };
  const field = magneticFieldFromCoilPair(point, inputs);
  return { field, magnitude: fieldMagnitude(field), nearConductor: false };
}

/** Sears (28.16), trasladada al centro x0; Bx conserva el signo de I. */
export function axialFieldFromCoil(x: number, c: CircularCoil): number {
  validateCoil(c);
  if (!Number.isFinite(x)) throw new RangeError("Posición axial no finita.");
  return (
    (VACUUM_PERMEABILITY * c.turns * c.current * c.radius ** 2) /
    (2 * (c.radius ** 2 + (x - c.centerX) ** 2) ** 1.5)
  );
}
export function axialFieldFromPair(x: number, inputs: CoilPairInputs): number {
  const [a, b] = coilsFromInputs(inputs);
  return axialFieldFromCoil(x, a) + axialFieldFromCoil(x, b);
}
export function idealHelmholtzCenter(
  radius: number,
  turns: number,
  signedCurrent: number,
): number {
  validateCoil({ radius, turns, current: signedCurrent, centerX: 0 });
  return (
    ((4 / 5) ** 1.5 * VACUUM_PERMEABILITY * turns * signedCurrent) / radius
  );
}
export function isSymmetricParallel(p: CoilPairInputs): boolean {
  return (
    p.turns1 === p.turns2 &&
    p.current1 === p.current2 &&
    p.current1 > 0 &&
    p.direction1 === p.direction2
  );
}
export function isOptimalHelmholtz(p: CoilPairInputs): boolean {
  return isSymmetricParallel(p) && Math.abs(p.separation / p.radius - 1) < 1e-8;
}

/** Evita definir homogeneidad relativa con referencia nula/cancelada. */
export function centralReference(p: CoilPairInputs): number | null {
  const [a, b] = coilsFromInputs(p);
  const reference = Math.abs(axialFieldFromPair(0, p));
  const scale =
    Math.abs(axialFieldFromCoil(0, a)) + Math.abs(axialFieldFromCoil(0, b));
  return reference <= Math.max(1e-15, scale * 1e-10) ? null : reference;
}
export function relativeVariation(
  magnitude: number,
  reference: number | null,
): number | null {
  if (
    reference === null ||
    reference <= 1e-15 ||
    !Number.isFinite(magnitude) ||
    !Number.isFinite(reference)
  )
    return null;
  return Math.abs(magnitude - reference) / reference;
}

export function axialUniformInterval(p: CoilPairInputs): AxialInterval | null {
  const ref = centralReference(p);
  if (ref === null) return null;
  const step = p.radius / 200;
  const limit = 2 * p.radius + p.separation / 2;
  const boundary = (sign: number) => {
    let inside = 0;
    for (let a = step; a <= limit + step; a += step) {
      const outside = Math.min(a, limit);
      const error = relativeVariation(
        Math.abs(axialFieldFromPair(sign * outside, p)),
        ref,
      )!;
      if (error >= UNIFORM_TOLERANCE) {
        let lo = inside,
          hi = outside;
        for (let k = 0; k < 32; k++) {
          const mid = (lo + hi) / 2;
          if (
            relativeVariation(
              Math.abs(axialFieldFromPair(sign * mid, p)),
              ref,
            )! < UNIFORM_TOLERANCE
          )
            lo = mid;
          else hi = mid;
        }
        return sign * lo;
      }
      inside = outside;
      if (outside === limit) break;
    }
    return sign * limit;
  };
  const min = boundary(-1),
    max = boundary(1);
  return { min, max, length: max - min };
}

export function sampleAxialField(p: CoilPairInputs, count = 241): AxialPoint[] {
  const extent = 2 * p.radius + p.separation / 2;
  return Array.from({ length: count }, (_, i) => {
    const x = -extent + (2 * extent * i) / (count - 1);
    const bx = axialFieldFromPair(x, p);
    return { x, bx, magnitude: Math.abs(bx) };
  });
}

export function sampleVectorField(
  p: CoilPairInputs,
  size: number,
): FieldSample[] {
  const samples: FieldSample[] = [];
  const ex = p.separation / 2 + 1.2 * p.radius,
    er = 1.35 * p.radius;
  const coils = coilsFromInputs(p);
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      for (let k = 0; k < size; k++) {
        const point = {
          x: ex * ((2 * i) / (size - 1) - 1),
          y: er * ((2 * j) / (size - 1) - 1),
          z: er * ((2 * k) / (size - 1) - 1),
        };
        if (
          coils.some(
            (c) => distanceToCoil(point, c) <= c.radius * WIRE_EXCLUSION_RADII,
          )
        )
          continue;
        const field = magneticFieldFromCoilPair(point, p, FIELD_SEGMENTS);
        const magnitude = fieldMagnitude(field);
        if (magnitude > 1e-18) samples.push({ point, field, magnitude });
      }
  return samples;
}

/** Nube muestreada, no frontera continua ni garantía sobre los puntos intermedios. */
export function sampleUniformRegion(
  p: CoilPairInputs,
  size = UNIFORM_GRID_SIZE,
): UniformRegion {
  const reference = centralReference(p);
  const extent = UNIFORM_HALF_SIZE_RADII * p.radius;
  const spacing = (2 * extent) / size;
  const result: UniformRegion = {
    points: [],
    reference,
    maxVariation: 0,
    spacing,
    estimatedVolume: 0,
  };
  if (reference === null) return result;
  const coils = coilsFromInputs(p);
  // Centros de celdas: volumen = celdas aceptadas × spacing³.
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      for (let k = 0; k < size; k++) {
        const point = {
          x: -extent + (i + 0.5) * spacing,
          y: -extent + (j + 0.5) * spacing,
          z: -extent + (k + 0.5) * spacing,
        };
        if (
          coils.some(
            (c) => distanceToCoil(point, c) <= c.radius * WIRE_EXCLUSION_RADII,
          )
        )
          continue;
        const error = relativeVariation(
          fieldMagnitude(magneticFieldFromCoilPair(point, p, FIELD_SEGMENTS)),
          reference,
        )!;
        if (error < UNIFORM_TOLERANCE) {
          result.points.push(point);
          result.maxVariation = Math.max(result.maxVariation, error);
        }
      }
  result.estimatedVolume = result.points.length * spacing ** 3;
  return result;
}

export function symmetricCentralCurvature(p: CoilPairInputs): number {
  const a = p.separation / 2;
  const c =
    (VACUUM_PERMEABILITY *
      p.turns1 *
      p.current1 *
      p.direction1 *
      p.radius ** 2) /
    2;
  return (
    (6 * c * (4 * a ** 2 - p.radius ** 2)) / (p.radius ** 2 + a ** 2) ** 3.5
  );
}

export function clampProbe(point: Vector3, p: CoilPairInputs): Vector3 {
  const clip = (n: number, limit: number) =>
    Math.max(-limit, Math.min(limit, Number.isFinite(n) ? n : 0));
  return {
    x: clip(point.x, p.separation / 2 + 1.5 * p.radius),
    y: clip(point.y, 1.5 * p.radius),
    z: clip(point.z, 1.5 * p.radius),
  };
}
