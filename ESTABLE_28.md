# Estable 28 · reconocimientos y progresión regional

Base: Estable 27, commit `4c2724e`. Se mantienen 13 zonas, 50 especies, 50 ofertas y 90 IDs históricos de cañas. El juego distribuible sigue siendo un único `index.html`, sin recursos externos.

## Cambios implementados

- Sala de Trofeos desplegable: 37 encargos, 13 colecciones y 13 maestrías, con IDs únicos. Cuenta reconocimientos, no vuelve a contar sus objetivos ni concede premios al abrirla. Filtros por estado/zona/tipo; obtenidos primero, dificultad en ambos sentidos, zona y tipo. Detalles accesibles por clic en móvil, requisitos reales y enlace al Atlas. No se inventan fechas históricas.
- **13 medallas realmente diferentes**: campana del muelle; escudo de roble fluvial; brújula de mareas; loto de jade; corona coralina; relicario kraken; arco de raíces; lanza glacial; yunque volcánico; astrolabio celeste; libro de ruinas; roseta de cuarzo; ammonita entre mandíbulas fósiles. No son recolores de una moneda. Las insignias individuales usan familias visuales de entrega, peso y exploración; colección usa un bestiario, separado de maestría.
- Los 50 peces reciben ilustraciones nuevas de fantasía pintada. Se conservan especie, estadísticas y progreso. Peces no descubiertos muestran ambientes misteriosos propios de su región, con tres variantes; no muestran el pez real, su nombre ni una silueta exacta. Subir de nivel habilita capturar, no descubre. Se distinguen los requisitos pendientes.
- Colecciones y Diario ordenan fácil→difícil por referencia normalizada real y estable. El Diario también ofrece difícil→fácil. La rareza de especie es independiente del tamaño/calidad del ejemplar. Se retira la estrella decorativa de Pez fantasma. Criterios y límites en [PROGRESION_28.md](PROGRESION_28.md).
- Atlas distingue principales y complementarios. Su botón **Ir** respeta el nivel y bloquea viajar durante burbujas/captura con aviso; no cancela una captura silenciosamente. Conserva las estrellas históricas.
- Selector de zonas con paisajes reutilizados, nombre/requisito HTML, activo dorado y regiones bloqueadas atenuadas. Tienda con fondos integrados y cabecera de equipo, manteniendo cañas completas, filtros, comparativas y controles. Lateral con fondo ilustrado completo e iconos SVG de atributos. Se reducen emojis de Pesca sin tocar Combate.
- Cinco encargos complementarios reconocen cantidades locales guardadas y ofrecen una alternativa a comprar **cañas existentes** en Manglar, Volcán, Ruinas, Cristal y Primordial. Sus especialidades dan razones distintas para conseguirlas; no añaden más equipo ni concentran otra tanda en Río. Los 32 encargos anteriores no se reequilibran.
- Los premios de colección pendientes pasan a ser visuales. No se retira oro histórico ni se reinician reclamos. Los encargos con oro conservan sus premios económicos. Maestría no entrega oro ni equipo adicional.

## HUD y compatibilidad

El HUD inferior mide exactamente **118 px** antes y después, tanto a 1366 como a 390 px de ancho. Se compararon también las posiciones, anchos y alturas de zona, caña, pez y experiencia contra el HTML del commit de Estable 27: coinciden exactamente. No se ensanchó el pez sacrificando otra sección. La hoja canónica `117-fishing-hud-css.css` permanece idéntica. Combate conserva su HUD.

No hay nueva migración ni formato de guardado: continúa v7, cinco personajes. La Sala deriva su información de capturas, banderas, propiedad y máscaras existentes. Los nuevos reclamos usan el mapa opcional `ui.fishingQuestRewards` ya presente. Se preservan IDs, campos desconocidos, cañas retiradas poseídas, categorías y récords históricos. Un personaje que ya posea la recompensa no recibe otra copia ni oro; la insignia solo se reclama una vez.

Las cantidades locales se basan en `fishingWeights.byZone[zone].species[id]`. No se atribuyen capturas globales antiguas a una zona sin prueba. Si ese detalle no existe en una partida antigua, harán falta nuevas capturas locales para ese objetivo. Las estrellas acreditadas no se pierden por ello.

## Recursos y tamaño

Originales intactos en `assets/originals/`, incluyendo los de Estable 27. Metadata vigente en `arte/produccion-estable28.json`; 136 ilustraciones con viewports SVG individuales y clipping explícito, compartiendo 15 imágenes runtime. Las nuevas láminas se convierten a WebP calidad 90 sin cambiar resolución: es compresión con pérdida, no igualdad de píxeles. No se recorta destructivamente el original. Las cañas y paisajes anteriores se conservan.

Se quitaron del HTML las URLs de peces antiguos que estaban completamente reemplazadas por el catálogo nuevo, y el atlas antiguo de seis peces tiene aliases de compatibilidad. Se conserva la ilustración de equipo histórico y el arte de clases, enemigos, navegación y otros sistemas. Los originales retirados del runtime siguen archivados.

| Distribución | Bytes |
|---|---:|
| HTML Estable 27 | 16.191.156 |
| HTML Estable 28 | 15.061.904 |
| Reducción | 1.129.252 (6,97%) |
| ZIP solo del juego | 11.090.749 |

No se añadieron animaciones, temporizadores ni observadores para trofeos. La decoración sigue el ciclo existente de página; los filtros usan estado en memoria por personaje. Los fondos comparten atlas, no repiten el PNG en cada tarjeta. Se corrigió una regresión detectada durante las pruebas: el recorte de fondos permitía que las filas flex se comprimieran e impedía el scroll interno; `flex-shrink:0` conserva su altura y la continuidad nativa del desplazamiento.

## Pruebas ejecutadas

- Suite completa: **131/131**, sin fallos. Incluye probabilidad normalizada y simulación semillada; Pesca, fases y scroll; Combate/magia; cañas y comparativas; Atlas; Diario/récords; XP Drops/Level Up; cinco personajes, importación/exportación reales, IndexedDB, fallback localStorage, carga y guardados históricos.
- Tras los últimos retoques de iconos/textos: **23/23** comprobaciones específicas de build/trofeos y regresiones de Pesca/Diario/selectores/HUD. Tras ajustar límites de celda de medallas: **8/8** de build, recursos y trofeos. La versión del botón de descarga y el HTML descargado se comprobaron además en una pasada dirigida.
- Chromium real en perfiles aislados, escritorio 1366 px y móvil 390 px; colecciones también a 1024 px. Sin errores de ejecución en las pruebas. La geometría antes/después está en `arte/verificacion/estable28/hud-geometria-*.json`.
- Catálogos runtime comparados contra 27: mismos IDs y todos sus campos numéricos, niveles, listas de especies, precios, estadísticas a nivel 1/100 y desbloqueos. Solo cambian arte y la estrella decorativa del nombre indicado. Evidencia en `catalogos-sin-cambios.json`.
- Recompensas alternativas, duplicados, oro/inventario intactos, reclamos de colección sin oro, acreditaciones históricas, filtros y 13 medallas distintas comprobados. Las medidas no dependen de otorgar premios de verdad a una partida del usuario.
- ZIP validado por CRC y comparación byte a byte: contiene únicamente el mismo `index.html` completo. `npm run build:check` comprueba que el HTML coincide con las fuentes.
- Progresión: 3.000 simulaciones por zona sobre pesos reales, con supuestos y límites explícitos; ver `PROGRESION_28.md` y `arte/verificacion/estable28/progresion.json`.

Las capturas de verificación usan personajes sintéticos, no partidas del usuario. La revisión artística final queda abierta a tus preferencias; una prueba automática no evalúa gusto visual.

## Entrega

- Jugar: https://marianoczer-afk.github.io/Idle-Czerniak/?v=28
- Galería sin acceso a guardados: https://marianoczer-afk.github.io/Idle-Czerniak/arte/galeria-estable28.html
- HTML: abrir `index.html` en GitHub y pulsar **Download raw file**.
- ZIP solo del juego: `descargas/argentum-idle-estable28.zip`, mismo botón **Download raw file**. Extraer y abrir `index.html` con el navegador.
- `descargas/estable28.json` incluye tamaños y SHA-256. Para reproducir el paquete: `python3 scripts/package-release.py`.

La subida a `main` se verifica separadamente al publicar. Esta máquina no permite certificar el despliegue de Pages mediante su API. No se afirma una prueba en un teléfono físico; se usó Chromium con viewport móvil. `file://` está bloqueado por el navegador administrado: se probó el HTML descargado exacto servido localmente y sin solicitudes externas. Los tiempos humanos hasta nivel 100 y la economía histórica de Astral requieren otra evaluación; no se alteraron a ciegas en esta entrega.
