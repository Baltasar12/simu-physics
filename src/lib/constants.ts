export const CONTROL_LIMITS = {
  length: { min: 0.1, max: 10, step: 0.1, initial: 2 },
  diameter: { min: 0.5, max: 10, step: 0.1, initial: 2 },
  current: { min: 0, max: 10, step: 0.1, initial: 2 },
  temperature: { min: 0, max: 100, step: 1, initial: 20 },
  carrierDensity: {
    minExponent: 27,
    maxExponent: 30,
    step: 0.01,
    initial: 8.5e28,
  },
} as const;

/** Magnitud redondeada de la carga del electrón usada por Sears, capítulo 25. */
export const ELEMENTARY_CHARGE_COULOMBS = 1.6e-19;

export const GRAPH_POINT_COUNT = 64;
