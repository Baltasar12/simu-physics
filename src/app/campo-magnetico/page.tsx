import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { MagneticLab } from "@/components/simulator/MagneticLab";

export default function MagneticFieldPage() {
  return (
    <main className="lab-page magnetic-page">
      <div className="lab-intro">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Inicio
        </Link>
        <div className="lab-intro-copy">
          <div>
            <span className="chapter-label">Experiencia 02</span>
            <h1>
              Campo y Fuerza
              <br />
              Magnética
            </h1>
          </div>
          <p>
            Explorá cómo q, v, B y el ángulo determinan la magnitud y la
            dirección de la fuerza. Cambiá el signo y comprobá la regla de la
            mano derecha.
          </p>
        </div>
        <div className="source-note">
          <BookOpen size={18} />
          <span>
            <strong>Fuente del modelo</strong>Semana 1A, pp. 5–10 · Sears,
            secciones 27.2–27.3
          </span>
        </div>
      </div>
      <MagneticLab />
    </main>
  );
}
