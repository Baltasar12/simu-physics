# Laboratorio Virtual de Electromagnetismo

Aplicación web educativa universitaria con cuatro experiencias funcionales: corriente y resistencia, campo y fuerza magnética, movimiento circular de partículas cargadas y bobinas de Helmholtz. La primera experiencia incluye la velocidad de deriva `v_d=I/(n|q|A)`, con densidad de portadores explícita y el ejemplo de cobre de Sears. Las ecuaciones se implementan como funciones puras y las visualizaciones SVG/3D utilizan unidades SI con escalas pedagógicas explícitas.

## Stack

Next.js 16 con App Router, React 19, TypeScript estricto, Tailwind CSS 4, SVG, Recharts, Lucide React y Vitest. La segunda entrega no agrega dependencias a la aplicación.

El TP4 agrega Three.js **0.186.1**, React Three Fiber **9.8.1**, Drei **10.7.9** y `@types/three` **0.186.0**. Fiber 9 corresponde a React 19; Drei aporta cámara orbital y traslación. La escena se carga solo en su ruta y todos sus recursos y el Web Worker se empaquetan localmente.

## Requisitos e instalación

Node.js 20.9 o posterior y npm.

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
npm run build:static
```

Los tests verifican las funciones físicas y las propiedades geométricas de la solución analítica. Las pruebas de navegador realizadas para esta entrega están registradas en el informe.

## Módulos

1. `/resistencia`: Corriente, Resistividad y Resistencia. Material, geometría, corriente, temperatura, densidad de portadores, velocidad de deriva, ley de Ohm, potencia, conductor SVG y gráficos.
2. `/campo-magnetico`: Campo y Fuerza Magnética. Carga y signo, rapidez, campo, dirección, ángulo, producto vectorial, regla de la mano derecha y gráficos de fuerza.
3. `/movimiento-circular`: Movimiento Circular de Partículas Cargadas. Masa, carga, rapidez, campo, órbita analítica, velocidad tangente, fuerza centrípeta, radio, ω, período, frecuencia y autoescala.
4. `/bobinas-helmholtz`: TP4 Física II UNSTA 2026. Dos bobinas en 3D, controles R/D/N/I/sentidos, presets Helmholtz y Anti, mapa vectorial Biot-Savart, sonda arrastrable y numérica, región de magnitud <1%, gráfico axial y CSV.

Los presets de protón y electrón usan valores redondeados del capítulo 27 de Sears. Las entradas exactas aceptan notación científica y se aplican con Enter. Para animar la órbita, pulsar **Reanudar**; se puede pausar o reiniciar. Los casos B = 0, q = 0 y v = 0 se representan explícitamente sin divisiones por cero.

El simulador de fuerza incluye una vista lateral para mostrar el ángulo verdadero cuando la velocidad tiene una componente fuera de la pantalla. Al invertir B se conserva v y θ se transforma en 180° − θ.

Helmholtz inicia con R=D=0,20 m, N1=N2=100 e I1=I2=1 A. Antihorario visto desde +X corresponde a corriente positiva. D=R se destaca solo con bobinas idénticas y corrientes iguales y paralelas. La homogeneidad relativa no se calcula cuando Bcentro≈0. La sonda conserva su precisión al cambiar la resolución visual, y el mapa se calcula en un worker para mantener fluida la cámara.

## Exportación estática y compatibilidad desktop

`npm run build:static` genera `out/` mediante `STATIC_EXPORT=1`, sin modificar el build web normal. El resultado debe servirse por HTTP o un protocolo local de Electron; abrir el HTML con `file://` no reproduce las rutas de Next.js. No requiere APIs, fuentes, texturas o modelos externos durante su uso.

La implementación de `feature/tp4-helmholtz` quedó registrada e integrada en `main` para la web y en `offline/tp4` para la entrega Windows. `main` conserva únicamente la aplicación compartida; Electron, sus dependencias, scripts, protocolo y configuración portable pertenecen a `offline/tp4`. Ver [el cierre de ramas y entrega](docs/INFORME_ENTREGA_TP4.md).

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
- [Guía teórica TP4, manual, capturas y aplicaciones](docs/TP4_BOBINAS_HELMHOLTZ.md).
- [Guía de exposición TP4 y demo de 5-7 minutos](docs/GUIA_EXPOSICION_TP4.md).
- [Informe de implementación y validación TP4](docs/INFORME_TP4.md).
- [Cierre de ramas, portable y paquete TP4](docs/INFORME_ENTREGA_TP4.md).
- [Borrador de correo al profesor](docs/BORRADOR_EMAIL_TP4.md).
- [Arquitectura](docs/ARQUITECTURA.md).
- [Informe de implementación y validación](docs/INFORME_ETAPA_2.md).
- [Roadmap](docs/ROADMAP.md).

## Estado y publicación

Los cuatro módulos están implementados. Los PDF se conservan intactos en la raíz del checkout original como referencias locales y no se copian a `public/` ni al bundle. Se hicieron commits e integraciones locales autorizadas. No se realizó push, deploy ni publicación externa.

Los despliegues de producción observados de Vercel provienen de `main`, con dominio verificado `https://simu-physics.vercel.app`; el ajuste de rama de producción del panel queda pendiente de confirmación. La URL pública conserva el despliegue anterior hasta autorizar publicación. No requiere backend, base de datos ni variables de entorno; se instala con npm y se compila con `npm run build`.
