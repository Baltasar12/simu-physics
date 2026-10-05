import { useState } from "react";

/** Borrador local: permite escribir decimales o negativos sin recortar cada tecla. */
export function HelmholtzNumber({
  value,
  onCommit,
  ...props
}: {
  value: number;
  onCommit: (value: number) => void;
  id?: string;
  "aria-label"?: string;
  min: number;
  max: number;
  step: number;
}) {
  const [draft, setDraft] = useState(String(value));
  const commit = () => {
    const n = Number(draft);
    if (draft.trim() !== "" && Number.isFinite(n)) {
      const bounded = Math.min(
        props.max,
        Math.max(props.min, props.step === 1 ? Math.round(n) : n),
      );
      setDraft(String(bounded));
      onCommit(bounded);
    } else setDraft(String(value));
  };
  return (
    <input
      {...props}
      type="number"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") setDraft(String(value));
      }}
    />
  );
}
