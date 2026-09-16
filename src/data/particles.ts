// Rounded values printed in Sears, Cap. 27 PDF p.13 (book p.928), examples 27.3–27.4.
// These are the course's values, not a claim of current metrological precision.
export const ELEMENTARY_CHARGE = 1.6e-19;
export const PARTICLES = [
  { id: "proton", name: "Protón", charge: ELEMENTARY_CHARGE, mass: 1.67e-27 },
  {
    id: "electron",
    name: "Electrón",
    charge: -ELEMENTARY_CHARGE,
    mass: 9.11e-31,
  },
] as const;
export const MAGNETIC_INITIAL = {
  charge: PARTICLES[0].charge,
  mass: PARTICLES[0].mass,
  speed: 1e5,
  field: 0.1,
  direction: -1 as const,
  angle: 90,
};
export const MAGNETIC_LIMITS = {
  charge: { min: 0, minPositive: 1e-21, max: 3.2e-18, step: 1.6e-20 },
  mass: { min: 1e-31, max: 1e-25 },
  speed: { min: 0, minPositive: 1, max: 1e6, step: 1e4 },
  field: { min: 0, minPositive: 1e-6, max: 2, step: 0.01 },
  angle: { min: 0, max: 180, step: 1 },
};
