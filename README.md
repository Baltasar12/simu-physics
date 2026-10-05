# Laboratorio Virtual de Electromagnetismo

Aplicación web educativa universitaria con tres experiencias funcionales: corriente y resistencia, campo y fuerza magnética, y movimiento circular de partículas cargadas. La primera experiencia incluye la velocidad de deriva `v_d=I/(n|q|A)`, con densidad de portadores explícita y el ejemplo de cobre de Sears. Las ecuaciones se implementan como funciones puras y las visualizaciones SVG utilizan unidades SI con escalas pedagógicas explícitas.

## Stack

Next.js 16 con App Router, React 19, TypeScript estricto, Tailwind CSS 4, SVG, Recharts, Lucide React y Vitest. La segunda entrega no agrega dependencias a la aplicación.

## Requisitos e instalación

Node.js 20.9 o posterior y npm para la web. Para construir la versión desktop con Electron 44 se requiere Node.js 22.12 o posterior.

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Validación

```bash
npm test
npm run lint
npm run build
```

Los tests verifican las funciones físicas y las propiedades geométricas de la solución analítica. Las pruebas de navegador realizadas para esta entrega están registradas en el informe.

## Aplicación de escritorio offline

La versión Windows reutiliza las mismas páginas, componentes y modelos físicos. Para abrir una vista local con Electron o generar el ejecutable portable:

```bash
npm run dev:desktop
npm run dist:portable
```

El segundo comando genera `dist/Laboratorio-Electromagnetismo-Portable.exe` para Windows x64. El build web habitual continúa siendo `npm run build`. La compilación desktop exporta archivos estáticos a `out/` y Electron los carga desde un protocolo local; el ejecutable no consulta Vercel durante su uso. Consultá [la guía de escritorio](docs/DESKTOP_OFFLINE.md) para requisitos, arquitectura, pruebas y limitaciones.

## Módulos

1. `/resistencia`: Corriente, Resistividad y Resistencia. Material, geometría, corriente, temperatura, densidad de portadores, velocidad de deriva, ley de Ohm, potencia, conductor SVG y gráficos.
2. `/campo-magnetico`: Campo y Fuerza Magnética. Carga y signo, rapidez, campo, dirección, ángulo, producto vectorial, regla de la mano derecha y gráficos de fuerza.
3. `/movimiento-circular`: Movimiento Circular de Partículas Cargadas. Masa, carga, rapidez, campo, órbita analítica, velocidad tangente, fuerza centrípeta, radio, ω, período, frecuencia y autoescala.

Los presets de protón y electrón usan valores redondeados del capítulo 27 de Sears. Las entradas exactas aceptan notación científica y se aplican con Enter. Para animar la órbita, pulsar **Reanudar**; se puede pausar o reiniciar. Los casos B = 0, q = 0 y v = 0 se representan explícitamente sin divisiones por cero.

El simulador de fuerza incluye una vista lateral para mostrar el ángulo verdadero cuando la velocidad tiene una componente fuera de la pantalla. Al invertir B se conserva v y θ se transforma en 180° − θ.

## Estructura

```text
src/
├── app/          # rutas y páginas
├── components/   # controles, resultados, SVG, teoría y gráficos
├── data/         # materiales y partículas con fuentes
├── physics/      # ecuaciones y validaciones puras
├── lib/          # formatos, constantes y conversiones
└── types/        # contratos TypeScript
docs/             # teoría, exposición, arquitectura y validación
```

## Documentación

- [Teoría eléctrica](docs/EXPLICACION_FISICA.md).
- [Teoría magnética y referencias a los PDF](docs/MAGNETISMO_FISICA.md).
- [Guía oral y demostración de cinco minutos](docs/GUIA_EXPOSICION_MAGNETISMO.md).
- [Arquitectura](docs/ARQUITECTURA.md).
- [Informe de implementación y validación](docs/INFORME_ETAPA_2.md).
- [Roadmap](docs/ROADMAP.md).

## Estado y publicación

Los tres módulos están implementados. Los PDF se conservan intactos en la raíz como referencias locales y no se copian a `public/` ni al bundle. No se realizó commit, push, PR ni deploy en esta entrega.

El proyecto puede desplegarse posteriormente en Vercel cuando se solicite. No requiere backend, base de datos ni variables de entorno; se instala con npm y se compila con `npm run build`.
