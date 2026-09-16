import { ArrowRight, Atom, CircleDotDashed, MoveRight } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "Corriente, Resistividad y Resistencia",
    description: "Modificá el material, la geometría, la corriente y la temperatura. Observá cada relación física en tiempo real.",
    href: "/resistencia",
    status: "Disponible",
    Icon: MoveRight,
  },
  {
    number: "02",
    title: "Campo y Fuerza Magnética",
    description: "Exploración vectorial de la fuerza sobre cargas en movimiento y regla de la mano derecha.",
    href: "/campo-magnetico",
    status: "Disponible",
    Icon: Atom,
  },
  {
    number: "03",
    title: "Movimiento Circular de Partículas Cargadas",
    description: "Trayectorias circulares de partículas bajo la acción de un campo magnético uniforme.",
    href: "/movimiento-circular",
    status: "Disponible",
    Icon: CircleDotDashed,
  },
];

export default function Home() {
  return (
    <main>
      <section className="landing-hero">
        <div className="eyebrow"><span /> Simulación universitaria interactiva</div>
        <h1>Laboratorio Virtual<br /><em>de Electromagnetismo</em></h1>
        <p>
          Explorá cómo cambian los fenómenos eléctricos y magnéticos al modificar
          sus parámetros. De la ecuación a una representación que se puede observar.
        </p>
        <Link className="primary-action" href="/resistencia">
          Abrir primera experiencia <ArrowRight size={18} />
        </Link>
      </section>

      <section className="module-section" aria-labelledby="modules-title">
        <div className="section-heading">
          <p>Recorrido de aprendizaje</p>
          <h2 id="modules-title">Tres fenómenos, un mismo laboratorio</h2>
        </div>
        <div className="module-grid">
          {modules.map(({ number, title, description, href, status, Icon }, index) => (
            <Link className={`module-card ${index === 0 ? "active" : ""}`} href={href} key={href}>
              <div className="module-topline">
                <span>{number}</span>
                <Icon aria-hidden="true" size={23} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="module-status">
                <span className="status-dot" />
                {status}
                <ArrowRight aria-hidden="true" size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
