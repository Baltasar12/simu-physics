import type { ElectricalInputs, ElectricalResults } from "@/types/physics";
import { ELEMENTARY_CHARGE_COULOMBS } from "@/lib/constants";

function requireFinite(value: number, label: string): void {
  if (!Number.isFinite(value))
    throw new RangeError(`${label} debe ser un número finito.`);
}

function requirePositive(value: number, label: string): void {
  requireFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} debe ser mayor que cero.`);
}

export function millimetersToMeters(millimeters: number): number {
  requirePositive(millimeters, "El diámetro");
  return millimeters / 1000;
}

export function circularCrossSectionArea(diameterMeters: number): number {
  requirePositive(diameterMeters, "El diámetro");
  const radiusMeters = diameterMeters / 2;
  return Math.PI * radiusMeters ** 2;
}

export function resistivityAtTemperature(
  resistivityAtReference: number,
  temperatureCoefficient: number,
  temperatureCelsius: number,
  referenceTemperatureCelsius: number,
): number {
  requirePositive(resistivityAtReference, "La resistividad de referencia");
  requireFinite(temperatureCoefficient, "El coeficiente térmico");
  requireFinite(temperatureCelsius, "La temperatura");
  requireFinite(referenceTemperatureCelsius, "La temperatura de referencia");

  const resistivity =
    resistivityAtReference *
    (1 +
      temperatureCoefficient *
        (temperatureCelsius - referenceTemperatureCelsius));
  requirePositive(resistivity, "La resistividad calculada");
  return resistivity;
}

export function conductorResistance(
  resistivityOhmMeters: number,
  lengthMeters: number,
  areaSquareMeters: number,
): number {
  requirePositive(resistivityOhmMeters, "La resistividad");
  requirePositive(lengthMeters, "La longitud");
  requirePositive(areaSquareMeters, "El área transversal");
  return (resistivityOhmMeters * lengthMeters) / areaSquareMeters;
}

export function ohmsLawVoltage(
  currentAmperes: number,
  resistanceOhms: number,
): number {
  requireFinite(currentAmperes, "La corriente");
  if (currentAmperes < 0)
    throw new RangeError("La corriente no puede ser negativa.");
  requirePositive(resistanceOhms, "La resistencia");
  return currentAmperes * resistanceOhms;
}

export function electricalPower(
  currentAmperes: number,
  resistanceOhms: number,
): number {
  requireFinite(currentAmperes, "La corriente");
  if (currentAmperes < 0)
    throw new RangeError("La corriente no puede ser negativa.");
  requirePositive(resistanceOhms, "La resistencia");
  return currentAmperes ** 2 * resistanceOhms;
}

export function currentDensity(
  currentAmperes: number,
  areaSquareMeters: number,
): number {
  requireFinite(currentAmperes, "La corriente");
  if (currentAmperes < 0)
    throw new RangeError("La corriente no puede ser negativa.");
  requirePositive(areaSquareMeters, "El área transversal");
  return currentAmperes / areaSquareMeters;
}

export function driftVelocity(
  currentAmperes: number,
  areaSquareMeters: number,
  carrierDensityPerCubicMeter: number,
  chargeMagnitudeCoulombs = ELEMENTARY_CHARGE_COULOMBS,
): number {
  requireFinite(currentAmperes, "La corriente");
  if (currentAmperes < 0)
    throw new RangeError("La corriente no puede ser negativa.");
  requirePositive(areaSquareMeters, "El área transversal");
  requirePositive(carrierDensityPerCubicMeter, "La densidad de portadores");
  requirePositive(chargeMagnitudeCoulombs, "La magnitud de la carga");
  return (
    currentAmperes /
    (carrierDensityPerCubicMeter * chargeMagnitudeCoulombs * areaSquareMeters)
  );
}

export function calculateElectricalState(
  inputs: ElectricalInputs,
): ElectricalResults {
  const areaSquareMeters = circularCrossSectionArea(inputs.diameterMeters);
  const resistivityOhmMeters = resistivityAtTemperature(
    inputs.resistivityAtReference,
    inputs.temperatureCoefficient,
    inputs.temperatureCelsius,
    inputs.referenceTemperatureCelsius,
  );
  const resistanceOhms = conductorResistance(
    resistivityOhmMeters,
    inputs.lengthMeters,
    areaSquareMeters,
  );
  const voltageVolts = ohmsLawVoltage(inputs.currentAmperes, resistanceOhms);
  return {
    areaSquareMeters,
    resistivityOhmMeters,
    resistanceOhms,
    voltageVolts,
    powerWatts: electricalPower(inputs.currentAmperes, resistanceOhms),
    currentDensityAmperesPerSquareMeter: currentDensity(
      inputs.currentAmperes,
      areaSquareMeters,
    ),
    driftVelocityMetersPerSecond: driftVelocity(
      inputs.currentAmperes,
      areaSquareMeters,
      inputs.carrierDensityPerCubicMeter,
    ),
  };
}
