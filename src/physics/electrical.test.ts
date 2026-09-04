import { describe, expect, it } from "vitest";
import {
  circularCrossSectionArea,
  conductorResistance,
  currentDensity,
  electricalPower,
  millimetersToMeters,
  ohmsLawVoltage,
  resistivityAtTemperature,
} from "./electrical";

describe("modelo eléctrico", () => {
  const rhoCopper = 1.72e-8;
  const area = 2e-6;

  it("duplica R al duplicar L", () => {
    const base = conductorResistance(rhoCopper, 2, area);
    expect(conductorResistance(rhoCopper, 4, area)).toBeCloseTo(base * 2, 12);
  });

  it("reduce R a la mitad al duplicar A", () => {
    const base = conductorResistance(rhoCopper, 2, area);
    expect(conductorResistance(rhoCopper, 2, area * 2)).toBeCloseTo(base / 2, 12);
  });

  it("devuelve rho0 cuando T = T0", () => {
    expect(resistivityAtTemperature(rhoCopper, 0.00393, 20, 20)).toBe(rhoCopper);
  });

  it("aumenta rho con T para alfa positivo", () => {
    expect(resistivityAtTemperature(rhoCopper, 0.00393, 80, 20)).toBeGreaterThan(rhoCopper);
  });

  it("duplica V al duplicar I con R constante", () => {
    expect(ohmsLawVoltage(4, 10)).toBe(ohmsLawVoltage(2, 10) * 2);
  });

  it("cuadruplica P al duplicar I con R constante", () => {
    expect(electricalPower(4, 10)).toBe(electricalPower(2, 10) * 4);
  });

  it("calcula J = I/A", () => {
    expect(currentDensity(2, 0.5)).toBe(4);
  });

  it("calcula A = pi(d/2)^2", () => {
    expect(circularCrossSectionArea(0.002)).toBeCloseTo(Math.PI * 1e-6, 15);
  });

  it("reproduce el ejemplo 25.1 de Sears", () => {
    const exampleArea = circularCrossSectionArea(millimetersToMeters(1.02));
    expect(exampleArea).toBeCloseTo(8.17e-7, 9);
    // Sears redondea el área y J a tres cifras significativas.
    expect(currentDensity(1.67, exampleArea)).toBeCloseTo(2.04e6, -4);
  });

  it("rechaza geometrías inválidas", () => {
    expect(() => circularCrossSectionArea(0)).toThrow(RangeError);
    expect(() => conductorResistance(rhoCopper, -1, area)).toThrow(RangeError);
  });
});
