# Guía oral - TP4 Bobinas de Helmholtz

Física II 2026, UNSTA. Complemento de [la guía teórica](TP4_BOBINAS_HELMHOLTZ.md). Preparar la pantalla a 1280 px o más, preset Helmholtz óptimo y resolución baja. Aplicar las entradas numéricas con Enter o al salir del campo. Esperar que desaparezca “Actualizando…” antes de leer un resultado.

## Recorrido conceptual de la exposición

1. **Qué simulamos.** “Calculamos el campo magnético generado por dos bobinas circulares y buscamos una región central donde su magnitud cambie menos del 1%.” Mostrar la cuarta experiencia integrada a los tres laboratorios previos.
2. **Qué es el par Helmholtz.** Son dos bobinas coaxiales idénticas, con igual corriente y el mismo sentido. En la configuración clásica la distancia entre centros coincide con su radio. Señalar ambas estructuras en planos YZ.
3. **Qué es B.** Es un vector con componentes Bx, By y Bz; su magnitud se mide en teslas. El dibujo orienta las flechas, pero el valor físico se lee en la sonda.
4. **Por qué la corriente es fuente.** Las cargas en movimiento que forman una corriente generan campo magnético. Aquí calculamos la fuente; en el módulo anterior estudiábamos la fuerza que el campo produce sobre una carga.
5. **Biot-Savart.** Cada elemento dℓ del conductor aporta dB=(μ0I/4π)(dℓ×r)/|r|³. r va desde el elemento hacia la sonda. El producto vectorial y la mano derecha dan el sentido.
6. **Campo de una espira.** Sobre su eje, las componentes transversales se cancelan por simetría. La integral deja Bx=μ0IR²/[2(R²+(x−x0)²)³ᐟ²]. La guía contiene la parametrización y la deducción.
7. **Por qué N vueltas.** Si las vueltas son coincidentes, cada una aporta lo mismo; el campo se multiplica por N. La escena dibuja una estructura por bobina para representar ese conjunto ideal.
8. **Superposición.** Sumamos B1 y B2 componente a componente. Cuando las corrientes se oponen, también se oponen sus contribuciones axiales; sumar solo magnitudes ocultaría la cancelación.
9. **Qué significa D.** Es la distancia centro a centro. Los centros son −D/2 y +D/2 sobre X. El cociente D/R permite comparar geometrías a distinta escala.
10. **Por qué D=R.** Por simetría B′(0)=0. Con dos bobinas iguales y paralelas, B″(0) es proporcional a D²−R². Al elegir D=R también desaparece esa curvatura; la variación axial inicial es de orden x⁴.
11. **Campo homogéneo.** Se desea que cambie poco en un volumen útil. No alcanza con que una flecha tenga el mismo color: hay que calcular y comparar valores.
12. **Cómo medimos el 1%.** Usamos ε=abs(|B(p)|−|B(0)|)/|B(0)|. La nube verde muestra muestras con ε<0,01. El criterio controla magnitud, no identidad del vector; si el campo central es casi cero, no es aplicable.
13. **Qué hace la sonda.** Evalúa el campo en una posición 3D independiente de la grilla. Se mueve arrastrando el gizmo o mediante números SI. Muestra componentes y magnitud; cerca del filamento aparece una advertencia.
14. **Cómo funciona el mapa.** Calculamos el campo en una grilla 7³, 9³ u 11³. Cada flecha tiene la dirección del vector real. Longitud normalizada y color autoescalado permiten verlo; no equivalen a teslas por metro dibujado.
15. **Qué muestra B(x).** Una trayectoria concreta: y=z=0. Usamos la fórmula analítica axial, con bobinas y sonda señaladas. La magnitud es azul; el selector agrega Bx con signo.
16. **Helmholtz y Anti-Helmholtz.** En el primero los campos centrales se suman y forman una meseta. En el segundo se cancelan si las bobinas son iguales y aparece un gradiente; es útil para otro tipo de experimento, pero la razón respecto de cero no se puede calcular.
17. **Aplicaciones.** Calibración de sensores, compensación de campo ambiental y ensayos de equipos espaciales. NPL, Bartington, NASA y ESA respaldan los ejemplos. Los sistemas reales suelen tener tres ejes e instrumentación adicional.

## Demostración de 5-7 minutos

Duración propuesta: unos 6 minutos. No explicar cada archivo durante la demo; reservar el código para la defensa. La parte de teoría anterior sirve para preparar los conceptos que se introducen en cada acción.

| Tiempo | Acción | Frase para decir |
| --- | --- | --- |
| 0:00-0:40 | Abrir **Helmholtz óptimo**, señalar R=D=0,20 m, N=100, I=1 A. | “El radio y la separación coinciden, y las dos corrientes tienen igual magnitud y sentido.” |
| 0:40-1:15 | Activar campo vectorial y rotar un poco; restablecer vista. | “Estas flechas provienen de Biot-Savart y muestran cómo cada contribución se suma en el espacio.” |
| 1:15-1:55 | Ocultar campo y mostrar zona uniforme; desactivar arrastre para verla sin gizmo. | “Cada punto verde cumple una variación de magnitud menor al 1% respecto del centro.” |
| 1:55-2:40 | Activar sonda, centrarla y mover X a 0,04 m; luego poner X=0,08, Y=0,05, Z=0,03. | “En el centro se cancelan las componentes transversales; fuera del eje podemos medirlas.” |
| 2:40-3:15 | **Colocar sobre eje** y mostrar el gráfico. | “La sonda axial coincide con esta curva analítica; el sombreado es el intervalo homogéneo central.” |
| 3:15-4:00 | Poner D=0,10 m y después 0,30 m; comparar la longitud de la tarjeta. | “Al acercar o alejar las bobinas de D=R aumenta la curvatura y se acorta el intervalo central.” |
| 4:00-4:30 | Pulsar **Helmholtz óptimo** y **Centrar sonda**. | “Recuperamos la meseta: D=R anula la segunda derivada para este par simétrico.” |
| 4:30-5:20 | Elegir **Anti-Helmholtz**, activar campo, añadir Bx firmado en el gráfico. | “Ahora las corrientes opuestas cancelan el centro; Bx cambia de signo y la homogeneidad relativa respecto de cero no está definida.” |
| 5:20-6:00 | **Reiniciar**, poner I1=I2=2 A y comparar B0. | “Duplicar ambas corrientes duplica B de 449,59 a 899,18 microteslas; la variación relativa se conserva.” |

Para una demo de 5 minutos, acortar la rotación y mostrar solo un caso D≠R. Para 7 minutos, terminar con las tres aplicaciones y sus fuentes. Leer magnitudes numéricas: el color se autoescala y por sí solo no demuestra que B se duplicó.

## Defensa del método numérico

Una respuesta breve a cómo se calcula el campo 3D:

“Dividimos la espira en intervalos pequeños. En el punto medio de cada intervalo calculamos la posición del conductor y el vector tangente dℓ. Construimos r desde ese punto hasta la sonda y calculamos dℓ×r. Cada contribución se divide por |r|³ y se multiplica por μ0I/(4π). Sumamos todos los intervalos, multiplicamos por N vueltas y repetimos para la segunda bobina. El resultado final es la suma vectorial de las dos bobinas.”

La cuadratura sigue la curva circular; dℓ es la tangente por Δφ, no una cuerda arbitraria. Se precalculan senos y cosenos. Se usan 128 segmentos para mapa y nube y 256 para sonda. Sobre el eje la fórmula analítica evita ese costo y ofrece una referencia independiente para comprobar el método.

El mapa se calcula en un Web Worker local. Cambiar la cámara o arrastrar la sonda no vuelve a calcular la grilla. Si hay cambios de parámetros consecutivos, se conserva solo el último pendiente. Las flechas usan dos mallas instanciadas para toda la grilla, y la nube un único buffer; N=1000 no crea mil componentes.

## Detalles para preguntas del profesor

**Origen de las ecuaciones.** Semana 1B pp. 6 y 9 y Sears ecs. 28.6, 28.7, 28.15, 28.16 y 28.17. El problema 28.67 describe el par con D=R y propone estudiar derivadas. La fórmula central del par se obtiene sustituyendo en la superposición.

**Sentido de las corrientes.** Antihorario visto desde +X significa I positiva y campo axial hacia +X. Invertir ambas corrientes invierte B, pero conserva |B| y la región definida por magnitud.

**Validez de D=R.** Requiere bobinas idénticas con corriente igual y paralela. B″(0)=6C(D²−R²)/(R²+D²/4)⁷ᐟ². Para N1≠N2 o I1≠I2 no se debe extender esa conclusión sin un análisis adicional.

**Referencia nula.** No dividimos por |Bcentro| si es casi cero. La aplicación declara homogeneidad relativa no aplicable. Un residuo numérico del orden de 10⁻²⁰ T en la sonda central Anti es redondeo, no un resultado físico significativo.

**Precisión.** Los tests comparan el eje contra una fórmula independiente, prueban convergencia fuera del eje y verifican simetrías y linealidad. La coincidencia axial no garantiza igual precisión cerca del conductor. A distancia ≤0,015R del filamento se excluye la lectura porque el modelo ideal es singular.

**La nube verde.** Son muestras aceptadas de un cubo central de 21³ celdas. No es una superficie continua exacta. La estimación de volumen depende de esa resolución y puede sumar regiones separadas. El intervalo axial sí toma únicamente la parte conectada con el origen.

**Escala visual.** La geometría se adapta al viewport. Flechas normalizadas y color relativo permiten ver el patrón; todas las ecuaciones conservan SI. Los valores en teslas están en la sonda y el gráfico usa µT para legibilidad.

**Limitaciones.** Espiras coincidentes y filamento sin espesor, corriente uniforme, vacío/aire, campo estacionario. No se modelan resistencia de bobina, calentamiento, transitorios de inductancia ni el conductor real. Para medir un equipo industrial harían falta geometría real, calibración e incertidumbre.

**Código principal a mostrar.** `physics/helmholtz.ts` para producto vectorial y fórmula axial; `helmholtz.test.ts` para comprobaciones; `helmholtz.worker.ts` y `useHelmholtzMap.ts` para rendimiento; `HelmholtzScene.tsx` para instancias y sonda. No atribuir a Three.js el cálculo físico: Three.js solo dibuja los resultados.

## Preparación de la entrega

Estudiante: Baltasar Barbaglia. Revisar capturas y bibliografía. El TP pide acompañar el HTML con la guía; la exportación `out/` debe abrirse a través de un servidor estático o Electron. La implementación compartida se integra en `main` para la web y en `offline/tp4` para Electron. [El informe](INFORME_TP4.md) registra la validación inicial del módulo; el cierre de ramas y la entrega se documentan en el informe final.
