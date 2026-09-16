import { describe, expect, it } from "vitest";
import {
  angleComponents,
  circularMotion,
  crossProduct,
  degreesToRadians,
  magneticForceMagnitude,
  magneticForceVector,
  orbitSample,
  velocityAtAngle,
} from "./magnetism";

const dot = (
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
) => a.x * b.x + a.y * b.y + a.z * b.z;
describe("fuerza magnética", () => {
  it("convierte grados a radianes", () =>
    expect(degreesToRadians(90)).toBe(Math.PI / 2));
  it.each([0, 180])("fuerza nula a %s grados", (a) =>
    expect(magneticForceMagnitude(2, 3, 4, a)).toBe(0),
  );
  it("máxima a 90°", () =>
    expect(magneticForceMagnitude(-2, 3, 4, 90)).toBe(24));
  it.each([
    [4, 3, 4],
    [2, 6, 4],
    [2, 3, 8],
  ])("proporcional a q, v, B (%s,%s,%s)", (q, v, b) =>
    expect(magneticForceMagnitude(q, v, b, 30)).toBeCloseTo(
      2 * magneticForceMagnitude(2, 3, 4, 30),
    ),
  );
  it("reproduce Sears 27.1 con tolerancia relativa", () =>
    expect(magneticForceMagnitude(1.6e-19, 3e5, 2, 30) / 4.8e-14).toBeCloseTo(
      1,
      12,
    ));
  it("no redondea fuerzas microscópicas a cero", () =>
    expect(magneticForceMagnitude(1.6e-19, 1e5, 0.1, 90)).toBeGreaterThan(0));
  it("producto vectorial de bases y antisimetría", () => {
    expect(crossProduct({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
    expect(crossProduct({ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: -1,
    });
  });
  it.each([
    [2, -4, 24],
    [-2, -4, -24],
    [2, 4, -24],
    [-2, 4, 24],
  ])("dirección q=%s Bz=%s", (q, b, y) =>
    expect(
      magneticForceVector(q, { x: 3, y: 0, z: 0 }, { x: 0, y: 0, z: b }),
    ).toEqual({ x: 0, y, z: 0 }),
  );
  it("producto cruzado perpendicular a ambos vectores", () => {
    const v = { x: 3, y: 7, z: -2 },
      b = { x: -5, y: 4, z: 6 };
    const f = magneticForceVector(-2, v, b);
    expect(dot(f, v)).toBe(0);
    expect(dot(f, b)).toBe(0);
  });
  it.each([0, 30, 90, 150, 180])("coherencia escalar/vectorial a %s°", (a) => {
    const v = velocityAtAngle(3, a, -1),
      f = magneticForceVector(2, v, { x: 0, y: 0, z: -4 });
    expect(Math.hypot(f.x, f.y, f.z)).toBeCloseTo(
      magneticForceMagnitude(2, 3, 4, a),
      12,
    );
    const inverted = velocityAtAngle(3, 180 - a, 1);
    expect(inverted.x).toBeCloseTo(v.x);
    expect(inverted.z).toBeCloseTo(v.z);
  });
  it("rechaza parámetros inválidos", () => {
    expect(() => magneticForceMagnitude(1, -1, 1, 90)).toThrow();
    expect(() => angleComponents(181)).toThrow();
    expect(() => angleComponents(NaN)).toThrow();
    expect(() =>
      magneticForceVector(Infinity, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ).toThrow();
  });
});
describe("órbita magnética", () => {
  it("radio conocido y período/frecuencia", () => {
    const s = circularMotion(2, 3, 6, 4);
    expect(s.kind).toBe("circular");
    expect(s.radius).toBe(1);
    expect(s.omega).toBe(6);
    expect(s.period! * s.frequency!).toBeCloseTo(1);
  });
  it.each([
    [4, 3, 6, 4, 2],
    [2, 3, 12, 4, 2],
    [2, 3, 6, 8, 0.5],
    [2, 6, 6, 4, 0.5],
    [2, -3, 6, 4, 1],
  ])("dependencia m=%s q=%s v=%s B=%s", (m, q, v, b, r) =>
    expect(circularMotion(m, q, v, b).radius).toBe(r),
  );
  it.each([
    [1, 0, 1, "straight"],
    [0, 1, 1, "straight"],
    [1, 1, 0, "stationary"],
  ])("caso q=%s B=%s v=%s", (q, b, v, kind) => {
    const s = circularMotion(1, Number(q), Number(v), Number(b));
    expect(s.kind).toBe(kind);
    expect(s.radius).toBeNull();
    expect(s.force).toBe(0);
  });
  it("rechaza masa nula y no finitos", () => {
    expect(() => circularMotion(0, 1, 1, 1)).toThrow();
    expect(() => circularMotion(1, 1, NaN, 1)).toThrow();
  });
  it.each([
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ])("conserva rapidez, radio y F·v=0 (q=%s B=%s)", (q, b) => {
    const s = circularMotion(2, q, 3, b);
    if (s.kind !== "circular") throw new Error("Debe ser circular");
    for (let i = 0; i <= 24; i++) {
      const p = orbitSample(s, 3, q, b, (s.period * i) / 24);
      const toward = {
        x: p.center.x - p.position.x,
        y: p.center.y - p.position.y,
        z: 0,
      };
      expect(Math.hypot(p.velocity.x, p.velocity.y)).toBeCloseTo(3, 12);
      expect(Math.hypot(toward.x, toward.y)).toBeCloseTo(s.radius, 12);
      expect(dot(p.force, p.velocity)).toBeCloseTo(0, 12);
      expect(dot(p.force, toward)).toBeGreaterThan(0);
      expect(p.force.x).toBeCloseTo(toward.x * 2 * s.omega ** 2, 12);
    }
  });
  it("se mueve recto sin campo y queda quieta sin rapidez", () => {
    expect(orbitSample(circularMotion(1, 1, 2, 0), 2, 1, 0, 3).position.x).toBe(
      6,
    );
    expect(orbitSample(circularMotion(1, 1, 0, 1), 0, 1, 1, 3).position.x).toBe(
      0,
    );
  });
  it("invertir q o B invierte giro; invertir ambos lo conserva", () => {
    const a = circularMotion(1, 1, 1, -1);
    expect(a.orientation).toBe(1);
    expect(circularMotion(1, -1, 1, -1).orientation).toBe(-1);
    expect(circularMotion(1, 1, 1, 1).orientation).toBe(-1);
    expect(circularMotion(1, -1, 1, 1).orientation).toBe(1);
  });
});
