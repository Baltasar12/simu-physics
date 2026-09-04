const SUPERSCRIPTS: Record<string, string> = {
  "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

function superscript(exponent: number): string {
  return String(exponent).split("").map((character) => SUPERSCRIPTS[character]).join("");
}

export function formatPhysicsValue(value: number, significantDigits = 3): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const absolute = Math.abs(value);
  if (absolute >= 0.01 && absolute < 10000) {
    return new Intl.NumberFormat("es-AR", { maximumSignificantDigits: significantDigits }).format(value);
  }
  const exponent = Math.floor(Math.log10(absolute));
  const coefficient = value / 10 ** exponent;
  const formatted = new Intl.NumberFormat("es-AR", {
    maximumSignificantDigits: significantDigits,
  }).format(coefficient);
  return `${formatted} × 10${superscript(exponent)}`;
}

export function formatFixed(value: number, digits = 2): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
