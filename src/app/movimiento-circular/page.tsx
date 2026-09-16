import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { MagneticLab } from "@/components/simulator/MagneticLab";

export default function CircularMotionPage() {
  return (
    <main className="lab-page magnetic-page">
      <div className="lab-intro">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Inicio
        </Link>
        <div className="lab-intro-copy">
          <div>
            <span className="chapter-label">Experiencia 03</span>
            <h1>
              Movimiento Circular
              <br />
              de Partículas Cargadas
            </h1>
          </div>
          <p>
            Una fuerza perpendicular a la velocidad cambia su dirección. Explorá
            el radio, el sentido de giro y los vectores tangente y centrípeto en
            un campo uniforme.
          </p>
        </div>
        <div className="source-note">
          <BookOpen size={18} />
          <span>
            <strong>Fuente del modelo</strong>Semana 1A, pp. 13–14 · Sears,
            sección 27.4
          </span>
        </div>
      </div>
      <MagneticLab circular />
    </main>
  );
}
