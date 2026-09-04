export const CONTROL_LIMITS = {
  length: { min: 0.1, max: 10, step: 0.1, initial: 2 },
  diameter: { min: 0.5, max: 10, step: 0.1, initial: 2 },
  current: { min: 0, max: 10, step: 0.1, initial: 2 },
  temperature: { min: 0, max: 100, step: 1, initial: 20 },
} as const;

export const GRAPH_POINT_COUNT = 64;
