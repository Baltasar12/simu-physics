import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MagneticFieldPage() {
  return (
    <main className="coming-page">
      <Link href="/" className="back-link"><ArrowLeft size={16} /> Inicio</Link>
      <div className="coming-number">02</div>
      <span className="chapter-label">Segunda etapa · arquitectura preparada</span>
      <h1>Campo y Fuerza<br /><em>Magnética</em></h1>
      <p>Esta experiencia permitirá explorar la fuerza sobre una carga en movimiento, su magnitud y dirección mediante la regla de la mano derecha.</p>
      <div className="future-formula">F⃗ = q(v⃗ × B⃗)<small>F = |q|vB sen(θ)</small></div>
      <div className="future-items"><span>carga q</span><span>velocidad v</span><span>campo B</span><span>ángulo θ</span></div>
      <Link href="/movimiento-circular" className="text-action">Ver tercera etapa <ArrowRight size={17} /></Link>
    </main>
  );
}
