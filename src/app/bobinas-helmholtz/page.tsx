import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { HelmholtzLab } from "@/components/simulator/HelmholtzLab";

export default function HelmholtzPage() {
  return (
    <main className="lab-page helm-page">
      <div className="lab-intro">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Inicio
        </Link>
        <div className="lab-intro-copy">
          <div>
            <span className="chapter-label">
              Experiencia 04 · TP4 Física II
            </span>
            <h1>
              Bobinas de
              <br />
              Helmholtz
            </h1>
          </div>
          <p>
            Construí un campo desde sus fuentes. Explorá dos bobinas en 3D, medí
            con la sonda y descubrí por qué una separación igual al radio
            produce una región central especialmente homogénea.
          </p>
        </div>
        <div className="source-note">
          <BookOpen size={18} />
          <span>
            <strong>Fuente del modelo</strong>TP4 UNSTA 2026 · Semana 1B, pp. 6
            y 9 · Sears 28.2, 28.5 y problema 28.67
          </span>
        </div>
      </div>
      <HelmholtzLab />
    </main>
  );
}
