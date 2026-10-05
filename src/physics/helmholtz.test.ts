import { describe, expect, it } from "vitest";
import { HELMHOLTZ_INITIAL } from "../data/helmholtz";
import { VACUUM_PERMEABILITY } from "../lib/constants";
import {
  axialFieldFromCoil,
  axialFieldFromPair,
  axialUniformInterval,
  centralReference,
  coilsFromInputs,
  fieldMagnitude,
  idealHelmholtzCenter,
  isOptimalHelmholtz,
  magneticFieldFromCircularCoil,
  magneticFieldFromCoilPair,
  probeField,
  relativeVariation,
  sampleUniformRegion,
  symmetricCentralCurvature,
  clampProbe,
} from "./helmholtz";

const base = HELMHOLTZ_INITIAL;
const point = { x: 0.04, y: 0.05, z: 0.03 };
const coil = { radius: 0.2, centerX: 0, turns: 100, current: 1 };
function expectVector(
  actual: { x: number; y: number; z: number },
  expected: typeof actual,
) {
  for (const axis of ["x", "y", "z"] as const)
    expect(actual[axis]).toBeCloseTo(expected[axis], 12);
}

describe("Biot-Savart y superposición de bobinas", () => {
  it("duplica cada componente al duplicar la corriente o las vueltas", () => {
    const b = magneticFieldFromCircularCoil(point, coil);
    for (const c of [
      { ...coil, current: 2 },
      { ...coil, turns: 200 },
    ])
      expectVector(magneticFieldFromCircularCoil(point, c), {
        x: 2 * b.x,
        y: 2 * b.y,
        z: 2 * b.z,
      });
  });
  it("suma vectores, incluidos los sentidos opuestos", () => {
    const p = { ...base, turns2: 123, direction2: -1 as const };
    const [a, b] = coilsFromInputs(p);
    const ba = magneticFieldFromCircularCoil(point, a),
      bb = magneticFieldFromCircularCoil(point, b);
    expectVector(magneticFieldFromCoilPair(point, p), {
      x: ba.x + bb.x,
      y: ba.y + bb.y,
      z: ba.z + bb.z,
    });
  });
  it.each([0, 0.1, 0.2, -0.3])(
    "coincide con Sears sobre el eje x=%s (error relativo <1e-10)",
    (x) => {
      const numeric = magneticFieldFromCircularCoil(
        { x, y: 0, z: 0 },
        coil,
        128,
      );
      const analytic = axialFieldFromCoil(x, coil);
      expect(Math.abs(numeric.x - analytic) / Math.abs(analytic)).toBeLessThan(
        1e-10,
      );
      expect(Math.hypot(numeric.y, numeric.z)).toBeLessThan(
        Math.abs(analytic) * 1e-12,
      );
    },
  );
  it("cumple Bcentro=μ0NI/(2R), con CCW desde +X dando +Bx", () => {
    expect(
      magneticFieldFromCircularCoil({ x: 0, y: 0, z: 0 }, coil).x,
    ).toBeCloseTo((VACUUM_PERMEABILITY * 100) / (2 * 0.2), 12);
  });
  it("cumple la expresión central Helmholtz y el ejemplo Sears 28.67", () => {
    expect(axialFieldFromPair(0, base)).toBeCloseTo(
      idealHelmholtzCenter(0.2, 100, 1),
      12,
    );
    expect(magneticFieldFromCoilPair({ x: 0, y: 0, z: 0 }, base).x).toBeCloseTo(
      idealHelmholtzCenter(0.2, 100, 1),
      12,
    );
    expect(idealHelmholtzCenter(0.08, 300, 6)).toBeCloseTo(0.0202314664253, 10);
  });
  it("cancela el centro Anti-Helmholtz y produce un gradiente", () => {
    const anti = { ...base, direction2: -1 as const };
    expect(
      fieldMagnitude(magneticFieldFromCoilPair({ x: 0, y: 0, z: 0 }, anti)),
    ).toBeLessThan(1e-18);
    expect(axialFieldFromPair(0.01, anti)).toBeCloseTo(
      -axialFieldFromPair(-0.01, anti),
      12,
    );
    expect(Math.abs(axialFieldFromPair(0.01, anti))).toBeGreaterThan(1e-6);
    expect(centralReference(anti)).toBeNull();
  });
  it("invierte el vector pero conserva magnitud al invertir ambas corrientes", () => {
    const b = magneticFieldFromCoilPair(point, base);
    const inverse = magneticFieldFromCoilPair(point, {
      ...base,
      direction1: -1,
      direction2: -1,
    });
    expectVector(inverse, { x: -b.x, y: -b.y, z: -b.z });
    expect(fieldMagnitude(inverse)).toBeCloseTo(fieldMagnitude(b), 12);
  });
  it("tiene componentes transversales fuera del plano central y converge fuera del eje", () => {
    const p = { x: 0.08, y: 0.16, z: 0.02 };
    const reference = magneticFieldFromCoilPair(p, base, 1024);
    const numeric = magneticFieldFromCoilPair(p, base, 128);
    const error = fieldMagnitude({
      x: numeric.x - reference.x,
      y: numeric.y - reference.y,
      z: numeric.z - reference.z,
    });
    expect(error / fieldMagnitude(reference)).toBeLessThan(1e-6);
    expect(Math.abs(numeric.y)).toBeGreaterThan(1e-6);
  });
  it("respeta simetría rotacional fuera del eje", () => {
    const b = magneticFieldFromCoilPair(point, base);
    const rotated = magneticFieldFromCoilPair(
      { x: point.x, y: -point.z, z: point.y },
      base,
    );
    expectVector(rotated, { x: b.x, y: -b.z, z: b.y });
  });
  it("no fabrica lecturas finitas en el filamento singular", () => {
    const p = { x: -base.separation / 2, y: base.radius, z: 0 };
    expect(probeField(p, base)).toEqual({
      field: null,
      magnitude: null,
      nearConductor: true,
    });
    expect(() => magneticFieldFromCoilPair(p, base)).toThrow(RangeError);
    expect(
      Number.isFinite(
        probeField({ x: p.x, y: p.y + 0.02, z: 0 }, base).magnitude,
      ),
    ).toBe(true);
    expect(() =>
      magneticFieldFromCircularCoil({ x: NaN, y: 0, z: 0 }, coil),
    ).toThrow(RangeError);
  });
});

describe("Homogeneidad y condición Helmholtz", () => {
  it("anula B' y B'' centrales solo en D=R para el par simétrico", () => {
    const h = base.radius * 1e-3;
    const curvature = (p: typeof base) =>
      (axialFieldFromPair(h, p) -
        2 * axialFieldFromPair(0, p) +
        axialFieldFromPair(-h, p)) /
      h ** 2;
    const optimum = Math.abs(curvature(base));
    for (const ratio of [0.5, 1.5]) {
      const p = { ...base, separation: base.radius * ratio };
      expect(optimum).toBeLessThan(Math.abs(curvature(p)) * 1e-4);
      expect(curvature(p)).toBeCloseTo(symmetricCentralCurvature(p), 7);
    }
    expect(symmetricCentralCurvature(base)).toBe(0);
    expect(axialFieldFromPair(h, base)).toBeCloseTo(
      axialFieldFromPair(-h, base),
      15,
    );
  });
  it("da un intervalo central más largo al usar D=R", () => {
    const optimal = axialUniformInterval(base)!;
    expect(optimal.length / base.radius).toBeCloseTo(0.62749, 4);
    for (const ratio of [0.5, 1.5])
      expect(
        axialUniformInterval({ ...base, separation: base.radius * ratio })!
          .length,
      ).toBeLessThan(optimal.length);
    expect(
      relativeVariation(
        Math.abs(axialFieldFromPair(optimal.max, base)),
        centralReference(base),
      )!,
    ).toBeCloseTo(0.01, 9);
  });
  it("el muestreo aceptado satisface estrictamente <1%, sin inventar volumen", () => {
    const region = sampleUniformRegion(base, 9);
    expect(region.points.length).toBeGreaterThan(0);
    expect(region.maxVariation).toBeLessThan(0.01);
    expect(region.estimatedVolume).toBeCloseTo(
      region.points.length * region.spacing ** 3,
      12,
    );
    for (const p of region.points)
      expect(
        relativeVariation(
          fieldMagnitude(magneticFieldFromCoilPair(p, base)),
          region.reference,
        )!,
      ).toBeLessThan(0.010001);
  });
  it("desactiva métricas relativas con Bcentro nulo", () => {
    const p = { ...base, direction2: -1 as const };
    expect(relativeVariation(1, 0)).toBeNull();
    expect(relativeVariation(0, null)).toBeNull();
    expect(axialUniformInterval(p)).toBeNull();
    expect(sampleUniformRegion(p).points).toEqual([]);
    expect(centralReference({ ...base, current1: 0, current2: 0 })).toBeNull();
  });
  it("no etiqueta como óptimo D=R con bobinas desiguales o apagadas", () => {
    expect(isOptimalHelmholtz(base)).toBe(true);
    expect(isOptimalHelmholtz({ ...base, turns2: 99 })).toBe(false);
    expect(isOptimalHelmholtz({ ...base, current1: 0, current2: 0 })).toBe(
      false,
    );
  });
  it("limita la sonda al volumen y mantiene posiciones finitas", () => {
    expect(clampProbe({ x: 100, y: -100, z: NaN }, base)).toEqual({
      x: 0.4,
      y: -0.30000000000000004,
      z: 0,
    });
  });
});
