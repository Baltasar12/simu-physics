import type { Material } from "@/types/physics";

/**
 * Fuente principal: “Tema 5 Corriente Eléctrica, Resistencias Fuentes y
 * Circuitos”, tablas 25.1 y 25.2, páginas 6 y 7 del PDF.
 * Sears, capítulo 25, sección 25.2, páginas 6–7 del PDF, reproduce las tablas.
 *
 * Sólo se incluyen materiales con rho(20 °C) y alfa disponibles en el material.
 * Todos los valores se almacenan en SI: Ω·m y °C⁻¹.
 */
export const MATERIALS: readonly Material[] = [
  { id: "silver", name: "Plata", resistivity: 1.47e-8, temperatureCoefficient: 0.0038, referenceTemperature: 20, conductorColor: "#b9c3cd", source: "Tablas 25.1 y 25.2" },
  { id: "copper", name: "Cobre", resistivity: 1.72e-8, temperatureCoefficient: 0.00393, referenceTemperature: 20, conductorColor: "#c8753d", source: "Tablas 25.1 y 25.2" },
  { id: "aluminum", name: "Aluminio", resistivity: 2.75e-8, temperatureCoefficient: 0.0039, referenceTemperature: 20, conductorColor: "#9aa8b5", source: "Tablas 25.1 y 25.2" },
  { id: "tungsten", name: "Tungsteno", resistivity: 5.25e-8, temperatureCoefficient: 0.0045, referenceTemperature: 20, conductorColor: "#66717b", source: "Tablas 25.1 y 25.2" },
  { id: "lead", name: "Plomo", resistivity: 22e-8, temperatureCoefficient: 0.0043, referenceTemperature: 20, conductorColor: "#64748b", source: "Tablas 25.1 y 25.2" },
  { id: "mercury", name: "Mercurio", resistivity: 95e-8, temperatureCoefficient: 0.00088, referenceTemperature: 20, conductorColor: "#7f91a5", source: "Tablas 25.1 y 25.2" },
  { id: "manganin", name: "Manganina", resistivity: 44e-8, temperatureCoefficient: 0, referenceTemperature: 20, conductorColor: "#a87a55", source: "Tablas 25.1 y 25.2" },
  { id: "constantan", name: "Constantán", resistivity: 49e-8, temperatureCoefficient: 0.00001, referenceTemperature: 20, conductorColor: "#8e6f56", source: "Tablas 25.1 y 25.2" },
  { id: "nichrome", name: "Nicromel", resistivity: 100e-8, temperatureCoefficient: 0.0004, referenceTemperature: 20, conductorColor: "#6f7784", source: "Tablas 25.1 y 25.2" },
] as const;

export const DEFAULT_MATERIAL_ID = "copper";

export function getMaterial(materialId: string): Material {
  const material = MATERIALS.find(({ id }) => id === materialId);
  if (!material) throw new Error(`Material desconocido: ${materialId}`);
  return material;
}
