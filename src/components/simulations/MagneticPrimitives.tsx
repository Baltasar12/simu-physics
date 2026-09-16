import { useId, memo } from "react";
import type { Vector3 } from "@/types/magnetism";

export const VECTOR_COLORS = {
  velocity: "#147e8d",
  force: "#be6420",
  field: "#1f6fb2",
};

export const UniformField = memo(function UniformField({
  fieldZ,
}: {
  fieldZ: number;
}) {
  return (
    <g
      aria-hidden="true"
      opacity="0.32"
      fill={VECTOR_COLORS.field}
      stroke={VECTOR_COLORS.field}
    >
      {fieldZ !== 0 &&
        Array.from({ length: 54 }, (_, i) => {
          const x = 40 + (i % 9) * 75,
            y = 42 + Math.floor(i / 9) * 66;
          return fieldZ > 0 ? (
            <circle key={i} cx={x} cy={y} r={2.4} />
          ) : (
            <path
              key={i}
              d={`M${x - 4},${y - 4}l8,8m0,-8l-8,8`}
              strokeWidth={1.5}
            />
          );
        })}
    </g>
  );
});

/** The only sign inversion for the SVG coordinate system lives here. */
export function physicsToScreen(
  vector: Vector3,
  origin: { x: number; y: number },
  scale: number,
) {
  return { x: origin.x + vector.x * scale, y: origin.y - vector.y * scale };
}
export function VectorArrow({
  x,
  y,
  dx,
  dy,
  label,
  color,
  testId,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  label: string;
  color: string;
  testId?: string;
}) {
  const id = useId().replaceAll(":", "");
  if (Math.hypot(dx, dy) < 0.0001) return null;
  return (
    <g data-testid={testId}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x}
        y1={y}
        x2={x + dx}
        y2={y + dy}
        stroke={color}
        strokeWidth={3}
        markerEnd={`url(#${id})`}
      />
      <text
        x={x + dx + 9}
        y={y + dy - 9}
        fill={color}
        fontSize={17}
        fontWeight={700}
      >
        {label}
      </text>
    </g>
  );
}
export function FieldLegend({ fieldZ }: { fieldZ: number }) {
  return (
    <div className="magnetic-legend">
      <span>× B entrando · −z</span>
      <span>• B saliendo · +z</span>
      <strong>
        {fieldZ === 0
          ? "Sin campo: B = 0"
          : fieldZ < 0
            ? "Campo actual: × entrando"
            : "Campo actual: • saliendo"}
      </strong>
    </div>
  );
}
