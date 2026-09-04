import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CircularMotionPage() {
  return (
    <main className="coming-page">
      <Link href="/" className="back-link"><ArrowLeft size={16} /> Inicio</Link>
      <div className="coming-number">03</div>
      <span className="chapter-label">Tercera etapa · arquitectura preparada</span>
      <h1>Movimiento de<br /><em>Partículas Cargadas</em></h1>
      <p>La simulación futura mostrará una partícula con velocidad perpendicular a un campo uniforme, orbitando con rapidez constante.</p>
      <div className="future-formula">R = mv / (|q|B)<small>ω = |q|B/m</small></div>
      <div className="future-items"><span>masa m</span><span>carga q</span><span>velocidad v</span><span>campo B</span></div>
      <span className="coming-badge">Próximamente</span>
    </main>
  );
}
