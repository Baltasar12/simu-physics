export type ControlVariable = "material" | "length" | "diameter" | "current" | "temperature";

export interface Material {
  id: string;
  name: string;
  resistivity: number;
  temperatureCoefficient: number;
  referenceTemperature: number;
  conductorColor: string;
  source: string;
}

export interface ElectricalInputs {
  resistivityAtReference: number;
  temperatureCoefficient: number;
  referenceTemperatureCelsius: number;
  temperatureCelsius: number;
  lengthMeters: number;
  diameterMeters: number;
  currentAmperes: number;
}

export interface ElectricalResults {
  areaSquareMeters: number;
  resistivityOhmMeters: number;
  resistanceOhms: number;
  voltageVolts: number;
  powerWatts: number;
  currentDensityAmperesPerSquareMeter: number;
}
