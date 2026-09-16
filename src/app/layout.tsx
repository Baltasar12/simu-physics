import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorio Virtual de Electromagnetismo",
  description:
    "Simulaciones universitarias interactivas para explorar corriente, resistividad, resistencia y fenómenos magnéticos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Ir al inicio">
            <span className="brand-mark" aria-hidden="true">Φ</span>
            <span>
              <strong>Laboratorio Virtual</strong>
              <small>Electromagnetismo · Facultad de Ingeniería</small>
            </span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link href="/">Inicio</Link>
            <Link href="/resistencia">Resistencia</Link>
            <Link href="/campo-magnetico">Campo y fuerza</Link>
            <Link href="/movimiento-circular">Movimiento circular</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
