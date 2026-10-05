# Roadmap

## Etapa 1 — completada

Corriente, resistividad y resistencia: material, geometría, temperatura, ley de Ohm, potencia, densidad de corriente y velocidad de deriva `v_d=I/(n|q|A)`. Incluye control explícito de `n`, valor físico en SI, visualización SVG amplificada, explicación dinámica, derivación, ejemplo 25.1 de Sears y gráficos.

## Etapa 2 — completada

Campo y Fuerza Magnética: carga y signo, velocidad, campo, dirección y ángulo. Modelo puro `F⃗=q(v⃗×B⃗)` y `F=|q|vB sen θ`, producto vectorial, vistas frontal y lateral, regla de la mano derecha, ×/•, resultados SI, explicación dinámica y gráficos seleccionables. Los estados nulos y la inversión de vectores están probados.

## Etapa 3 — completada (incluida en la segunda entrega)

Movimiento Circular de Partículas Cargadas: `v ⟂ B`, `r=mv/(|q|B)`, `ω=|q|B/m`, período y frecuencia confirmados en Sears. Trayectoria analítica SVG, v tangente, F centrípeta, pausa/reinicio, autoescala espacial y temporal explícita. B=0 y q=0 producen movimiento rectilíneo; v=0 produce reposo. Incluye derivación de r y guía de exposición.

Validación de la entrega: ver [INFORME_ETAPA_2.md](INFORME_ETAPA_2.md).

## Etapa 4 — completada: TP4 Bobinas de Helmholtz

Ruta `/bobinas-helmholtz`, dos bobinas 3D, R/D/N1/N2/I1/I2 y sentidos independientes, presets editables, cálculo vectorial por Biot-Savart, mapa instanciado, sonda arrastrable y numérica, componentes SI, nube de variación <1%, intervalo axial analítico, D/R, condición D=R, Anti con referencia nula y gráfico axial con CSV. Worker local y exportación estática compatibles con uso offline.

Validación: 68 tests aprobados (19 nuevos), lint, build web, exportación estática, navegación de los laboratorios anteriores y prueba aislada offline con el protocolo de Electron. PDF originales intactos. Guía teórica con siete capturas y cuatro aplicaciones; guion de exposición con demo de seis minutos. Ver [INFORME_TP4.md](INFORME_TP4.md), [TP4_BOBINAS_HELMHOLTZ.md](TP4_BOBINAS_HELMHOLTZ.md) y [GUIA_EXPOSICION_TP4.md](GUIA_EXPOSICION_TP4.md).

Desarrollo compartido registrado en `feature/tp4-helmholtz` e integrado en `main` para Vercel y `offline/tp4` para Windows. El EXE con cuatro laboratorios se validó con transporte HTTP deshabilitado para la aplicación. Carpeta y ZIP de entrega preparados, con guía Markdown y capturas; conversión PDF pendiente por falta de un flujo confiable en el repositorio. Ver [el informe final](INFORME_ENTREGA_TP4.md). No se hizo push, deploy, upload ni envío de correo.

## Extensiones posteriores

- Movimiento helicoidal.
- Fuerza magnética sobre conductores.
- Espiras, torque y dipolos magnéticos.
- Motores.
- Efecto Hall.
- Fuentes de fem y resistencia interna.
- Resistencias en serie y paralelo.
- Leyes de Kirchhoff.
