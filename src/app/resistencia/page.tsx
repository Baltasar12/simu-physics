import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { ElectricalLab } from "@/components/simulator/ElectricalLab";

export default function ResistancePage() {
  return (
    <main className="lab-page">
      <div className="lab-intro">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Inicio</Link>
        <div className="lab-intro-copy">
          <div><span className="chapter-label">Experiencia 01</span><h1>Corriente, Resistividad<br />y Resistencia</h1></div>
          <p>Modificá una variable por vez y observá cómo responde el conductor. Todos los cálculos se realizan en unidades SI con el modelo enseñado en clase.</p>
        </div>
        <div className="source-note"><BookOpen size={18} /><span><strong>Fuente del modelo</strong>Tema 5 · Sears, capítulo 25</span></div>
      </div>
      <ElectricalLab />
    </main>
  );
}
