import Link from "next/link";
import { formatPhysicsValue as fmt } from "@/lib/format";
import type {
  CircularState,
  MagneticInputs,
  MagneticVariable,
  Vector3,
} from "@/types/magnetism";

const RESPONSE: Record<MagneticVariable, string> = {
  charge:
    "Al aumentar |q|, aumenta proporcionalmente la fuerza. En el caso circular, el radio disminuye en proporción inversa.",
  sign: "Invertir solo el signo de q conserva la magnitud de la fuerza y el radio, pero invierte la fuerza y el sentido de curvatura.",
  mass: "Una masa mayor produce un radio mayor con q, v y B constantes. La fuerza magnética no depende de la masa.",
  speed:
    "La fuerza aumenta proporcionalmente con la rapidez. En el caso circular, el radio también aumenta: r = mv/(|q|B).",
  field:
    "Al aumentar B, la fuerza aumenta proporcionalmente y el radio circular disminuye. Duplicar B duplica F y divide r por dos.",
  direction:
    "Invertir B conserva |F|, pero invierte su dirección y la curvatura. En el módulo de fuerza se conserva v y θ pasa a 180° − θ.",
  angle:
    "Solo la componente perpendicular v sin θ contribuye a la fuerza. A 90° es máxima; a 0° y 180° es nula.",
  preset:
    "Los presets cargan q y m de Sears. Comparar un electrón con un protón cambia la masa además del signo: sus radios no son iguales.",
};

function VectorSymbol({ children }: { children: string }) {
  return (
    <span className="vector-symbol" aria-label={`vector ${children}`}>
      {children}
    </span>
  );
}

export function MagneticExplanation({
  inputs: p,
  circular,
  state,
  force,
  active,
}: {
  inputs: MagneticInputs;
  circular: boolean;
  state: CircularState;
  force: Vector3;
  active: MagneticVariable;
}) {
  let observation =
    force.y === 0
      ? "Sin fuerza magnética en este estado."
      : `La fuerza inicial apunta ${force.y > 0 ? "hacia arriba (+y)" : "hacia abajo (−y)"}.`;
  if (p.field === 0)
    observation =
      "B = 0: no hay campo ni fuerza magnética; una partícula con rapidez no nula continúa en línea recta.";
  else if (p.charge === 0)
    observation =
      "q = 0: la partícula es neutra y la fuerza es nula. Si se mueve, continúa en línea recta.";
  else if (p.speed === 0)
    observation =
      "v = 0: la partícula permanece en reposo y no experimenta fuerza magnética.";
  else if (!circular && (p.angle === 0 || p.angle === 180))
    observation = `La velocidad es ${p.angle === 0 ? "paralela" : "antiparalela"} al campo: sin(${p.angle}°) = 0 y F = 0.`;
  else if (!circular && p.angle === 90)
    observation +=
      " La velocidad es perpendicular a B y la fuerza es máxima para los valores actuales de |q|, v y B.";
  else if (!circular)
    observation +=
      " La componente paralela no contribuye a la fuerza; la trayectoria general sería helicoidal (fuera de esta entrega).";
  if (circular && state.kind === "circular")
    observation = `La órbita tiene radio ${fmt(state.radius)} m y sentido ${state.orientation > 0 ? "antihorario" : "horario"}. En cada instante la fuerza apunta al centro y la velocidad es tangente.`;
  return (
    <section className="explanation-card" aria-live="polite">
      <span className="explanation-kicker">Una variable por vez</span>
      <h2>¿Qué está ocurriendo?</h2>
      <div className="explanation-content">
        <p>{observation}</p>
        <p>{RESPONSE[active]}</p>
        <p>
          <strong>
            La fuerza magnética cambia la dirección del movimiento, no la
            rapidez.
          </strong>{" "}
          Como el producto escalar F · v = 0, su potencia y su trabajo son
          nulos. La energía cinética se conserva en este modelo ideal.
        </p>
      </div>
    </section>
  );
}

export function MagneticTheory({ circular }: { circular: boolean }) {
  return (
    <section
      className="model-section magnetic-theory"
      aria-labelledby="magnetic-model-title"
    >
      <h2 id="magnetic-model-title">Modelo físico</h2>
      {circular ? (
        <>
          <p>
            Cuando v es perpendicular a B, la fuerza magnética proporciona la
            fuerza centrípeta. Son dos descripciones de la misma fuerza.
          </p>
          <ol className="derivation">
            <li>
              Fuerza magnética: <strong>FB = |q|vB</strong>
            </li>
            <li>
              Fuerza centrípeta: <strong>Fc = mv²/r</strong>
            </li>
            <li>
              Igualamos: <strong>|q|vB = mv²/r</strong>
            </li>
            <li>
              Para v ≠ 0: <strong>|q|B = mv/r</strong>
            </li>
            <li>
              Despejamos: <strong>r = mv/(|q|B)</strong>
            </li>
          </ol>
          <div className="formula-strip">
            ω = |q|B/m · T = 2π/ω · f = ω/(2π)
          </div>
          <p>
            r en m; m en kg; q en C; v en m/s; B en tesla; ω en rad/s; T en s y
            f en Hz. T aquí significa período, no temperatura. La masa debe ser
            positiva. Las expresiones orbitales requieren q ≠ 0, B ≠ 0 y v &gt;
            0.
          </p>
          <Link className="text-action" href="/campo-magnetico">
            Volver a la fuerza y al ángulo general →
          </Link>
        </>
      ) : (
        <>
          <div className="formula-strip">
            <VectorSymbol>F</VectorSymbol>
            <sub>B</sub> = q(<VectorSymbol>v</VectorSymbol> ×{" "}
            <VectorSymbol>B</VectorSymbol>)<br />
            FB = |q|vB sin(θ)
          </div>
          <p>
            q: carga [C] · v: rapidez [m/s] · B: campo [T] · θ: ángulo entre los
            vectores v y B · FB: fuerza [N]. El seno no tiene unidad. El cálculo
            convierte grados a radianes.
          </p>
          <h3>Regla de la mano derecha</h3>
          <ol>
            <li>Para q positiva, orientá los dedos en la dirección de v.</li>
            <li>Curvalos hacia B por el ángulo menor.</li>
            <li>El pulgar indica la dirección de la fuerza FB.</li>
            <li>Para q negativa, invertí la dirección obtenida.</li>
          </ol>
          <p>
            Ejemplo frontal: v hacia la derecha y B entrando (×) → F hacia
            arriba para q positiva; hacia abajo para q negativa.
          </p>
          <Link className="text-action" href="/movimiento-circular">
            Ver qué ocurre cuando v es perpendicular a B →
          </Link>
        </>
      )}
      <h3>Qué representa el campo B</h3>
      <p>
        B describe la intensidad y la dirección del campo; no es una fuerza.
        Existe independientemente de la partícula de prueba. Su unidad es 1 T =
        1 N/(A·m). Las líneas son tangentes a B; no indican la dirección de la
        fuerza. En un campo uniforme son paralelas y equidistantes.
      </p>
      <p className="model-footnote">
        Fuentes: Semana 1A, pp. 5–10 y 13–14; Sears, secciones 27.2–27.4, PDF
        pp. 4–8, 11 y 13. Modelo clásico, campo uniforme y estático, sin campo
        eléctrico, colisiones ni pérdidas. Las flechas y el tiempo visual usan
        escalas pedagógicas.
      </p>
    </section>
  );
}
