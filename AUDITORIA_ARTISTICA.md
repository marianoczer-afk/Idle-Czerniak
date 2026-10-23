# Auditoría artística — Estable 23

Base: Estable 22 (`6075b03`). Inventario leído de los catálogos del juego en un perfil temporal, no de las partidas del jugador. Se implementaron cabeceras y contenedores; esta revisión no reemplaza masivamente ilustraciones.

## Resumen comprobado

- 10 zonas, 41 especies distintas y 90 IDs históricos de cañas. Hay 50 ofertas actuales; las 40 retiradas permanecen disponibles si un personaje ya las posee.
- 25 encargos actuales. El detalle de distribución y propuesta se encuentra en [PROPUESTA_PROGRESION.md](PROPUESTA_PROGRESION.md).
- Las 41 especies devuelven 41 recursos/markup con hashes distintos, pero **eso no equivale a 41 ilustraciones propias**: 27 son recortes raster heredados, 8 vectores procedurales y 6 escenas ilustradas del atlas épico.
- Las 90 cañas comparten exactamente 10 escenas del atlas. Las variantes de una familia suelen reutilizar la misma escena y también existen cruces entre familias y cañas importantes.
- Se conservaron los 119 recursos embebidos y los identificadores. La muestra nueva es un archivo separado; el juego continúa funcionando como un único `index.html` sin conexión.

## Fuentes reales y asociación estable

`e189FishSVG(id)` resuelve la especie: `E208_FISH_ART` para las seis escenas, ilustración vectorial para ocho especies posteriores y `E1117_FISH` para el legado raster. `e194RodArt(id)` toma `rod.art` o `E208_ROD_ART` y referencia los símbolos `argentum-rod-N`. El PNG maestro de cañas contiene 10 ilustraciones, no una por ID. `e221ZoneImage` resuelve paisajes existentes y admite el campo opcional `zone.image`.

Los IDs nuevos sin una asociación artística explícita pueden caer en reglas heredadas por subcadena/hash: no garantizan una anatomía correcta. Antes de ampliar el catálogo habrá que validar el manifiesto artístico y marcar recursos faltantes, en lugar de asumir que ese fallback es una ilustración propia. Esta entrega documenta la dependencia y no reescribe la cadena de recursos.

Los hashes y datos completos están en [arte/inventario-estable23.json](arte/inventario-estable23.json). Para regenerar un inventario desde el juego actual: `node scripts/export-art-inventory.cjs`. El script usa perfiles de navegador nuevos y no accede a guardados reales.

## Inventario de especies

Cada fila identifica el ID utilizado para guardar capturas y asociar el arte. “Propia” describe una composición, no la mera existencia de un archivo con nombre distinto.

| ID / especie | Recurso actual | Identidad y trabajo pendiente |
|---|---|---|
| `mojarra` — Mojarra | `raster-f46c1ff266e4` | Reutilización visual de perca plateada; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `bagre` — Bagre | `raster-41cb7d12b0c2` | Reutilización visual de bagre marrón; Bagre reconocible; fuente corta extremidades. Completar mediante nueva ilustración, no zoom. |
| `trucha` — Trucha | `raster-94b3652e951d` | Reutilización visual de pez plateado tipo pejerrey; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `salmon` — Salmón | `raster-c1a37ea56cd2` | Reutilización visual de pargo recortado con rótulo; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `pez_espada` — Pez espada | `raster-44c99dfe7599` | Reutilización visual de corvina plateada; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `carpa_dorada` — Carpa dorada ✨ | `raster-d12c5a9055b5` | Reutilización visual de pez dorado; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `trucha_arcoiris` — Trucha arcoíris ✨ | `raster-23464cb1fba5` | Reutilización visual de pez plateado tipo pejerrey; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `pez_fantasma` — Pez fantasma ★ | `raster-50d078176f7a` | Reutilización visual de silueta bloqueada con ??? y texto ÉPICO; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `lucio` — Lucio | `raster-15c5603f2804` | Reutilización visual de róbalo recortado con rótulo; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `anguila` — Anguila eléctrica | `raster-29f418aaccb3` | Reutilización visual de bagre marrón; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `lubina` — Lubina | `raster-54466e83bb19` | Reutilización visual de pargo naranja; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `atun` — Atún gigante | `raster-cb88f465c733` | Reutilización visual de corvina plateada; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `mantarraya` — Mantarraya legendaria | `argentum-fish-5` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |
| `perca_esmeralda` — Perca esmeralda | `raster-43197f932362` | Reutilización visual de perca plateada; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `cangrejo_azul` — Cangrejo azul | `raster-181556d28c61` | Reutilización visual de pez plateado azulado; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `koi_imperial` — Koi imperial | `raster-4ce9548ee8ea` | Reutilización visual de pargo naranja; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `esturion` — Esturión antiguo | `raster-90e4cccd7a4e` | Reutilización visual de pez plateado tipo pejerrey; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `pez_luna` — Pez luna | `raster-e41efa8d1ae0` | Reutilización visual de pargo recortado con rótulo; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `caballito_mar` — Caballito de mar | `raster-359994df9bc5` | Reutilización visual de pargo recortado con rótulo; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `morena` — Morena oscura | `raster-6f8f93127df2` | Reutilización visual de perca plateada; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `tiburon_arrecife` — Tiburón de arrecife | `raster-d6777fc20fae` | Reutilización visual de silueta bloqueada con ??? y texto LEGENDARIO; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `pez_linternilla` — Pez linternilla | `raster-c1a7d54dbed0` | Reutilización visual de corvina plateada; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `calamar_abismo` — Calamar abisal | `raster-4361b8e3fc50` | Reutilización visual de silueta bloqueada con ??? y texto LEGENDARIO; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `pez_cristal` — Pez de cristal | `raster-1548ccc62913` | Reutilización visual de pez dorado; Prioridad alta: la anatomía mostrada no representa la especie; requiere arte individual. |
| `leviatan` — Cría de leviatán | `argentum-fish-0` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |
| `sabalo_manglar` — Sábalo del manglar | `vector-2dbca6f534b8` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `pez_arquero` — Pez arquero | `raster-890612ceda6a` | Reutilización visual de pez plateado azulado; Revisar identidad y encuadre; no es una composición exclusiva de esta especie. |
| `anguila_manglar` — Anguila de raíces | `vector-8e5efd4f41a0` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `tarpon` — Tarpón plateado | `vector-27d1afa21cb0` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `trucha_alpina` — Trucha alpina | `vector-33c7c12cf25f` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `salvelino` — Salvelino boreal | `vector-e937e77b4644` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `bacalao_hielo` — Bacalao de hielo | `vector-e6ef53891d6b` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `esturion_blanco` — Esturión blanco | `argentum-fish-4` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |
| `pez_lava` — Pez de las fumarolas | `raster-05782005d7bd` | Reutilización visual de silueta bloqueada con ??? y texto LEGENDARIO; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `mero_obsidiana` — Mero de obsidiana | `vector-a3c8788a7ac4` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `pez_escorpion` — Pez escorpión | `raster-f8e1b31c8827` | Reutilización visual de merluza recortada con rótulo; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `dragon_mar` — Dragón marino | `argentum-fish-2` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |
| `carpa_celeste` — Carpa celestial | `vector-63e486a6fa0d` | Vector propio por parámetros, con plantilla de silueta compartida. Funcional; elevar detalle e identidad en una tanda posterior. |
| `pez_cometa` — Pez cometa | `raster-53ef6fecb822` | Reutilización visual de silueta bloqueada con ??? y texto ÉPICO; Prioridad alta: fuente recortada/con texto; preparar ilustración completa, sin rótulos. |
| `raya_aurora` — Raya de la aurora | `argentum-fish-3` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |
| `guardian_mareas` — Guardián de las mareas | `argentum-fish-1` | Escena propia del atlas épico. Conservar; revisar márgenes de aletas, cola y lectura a tamaño HUD. |

### Reutilizaciones visuales de peces

La comparación visual del raster encontró estos grupos. Los recortes tienen tamaños/compresión diferentes, por eso pueden tener hashes distintos pese a representar el mismo dibujo:

- perca plateada: `mojarra`, `perca_esmeralda`, `morena`.
- bagre marrón: `bagre`, `anguila`.
- pez plateado tipo pejerrey: `trucha`, `trucha_arcoiris`, `esturion`.
- pargo recortado con rótulo: `salmon`, `pez_luna`, `caballito_mar`.
- corvina plateada: `pez_espada`, `atun`, `pez_linternilla`.
- pez dorado: `carpa_dorada`, `pez_cristal`.
- silueta bloqueada con ??? y texto ÉPICO: `pez_fantasma`, `pez_cometa`.
- pargo naranja: `lubina`, `koi_imperial`.
- pez plateado azulado: `cangrejo_azul`, `pez_arquero`.
- silueta bloqueada con ??? y texto LEGENDARIO: `tiburon_arrecife`, `calamar_abismo`, `pez_lava`.
- róbalo recortado con rótulo: `lucio`.
- merluza recortada con rótulo: `pez_escorpion`.

La prioridad es corregir fuentes con rótulos/siluetas bloqueadas y especies cuya anatomía es incorrecta (calamar, caballito, cangrejo, anguilas). `object-fit:contain` impide un recorte adicional, pero no puede reconstruir partes ausentes del archivo. No se ocultó este defecto sustituyendo las ilustraciones por iconos genéricos.

## Inventario de cañas

Las escenas actuales ya contienen mango, carrete, punta y adorno. Sus `viewBox` utilizan las celdas reales del maestro; no se cambia el recorte de esos símbolos ni se fuerza `cover` sobre la caña.

| Escena compartida | Descripción | IDs que la utilizan |
|---|---|---|
| `argentum-rod-0` | Madera antigua dorada | `e16_rod`, `e208_rod_junco_pulso`, `e208_rod_junco_cauce`, `e208_rod_junco_destello`, `e208_rod_junco_fortuna`, `e208_rod_junco_titan`, `e208_rod_junco_reliquia`, `e17_rod_viejo` |
| `argentum-rod-1` | Bambú verde | `e161_rod_bamboo`, `e208_rod_sauce_pulso`, `e208_rod_sauce_cauce`, `e208_rod_sauce_destello`, `e208_rod_sauce_fortuna`, `e208_rod_sauce_titan`, `e208_rod_sauce_reliquia`, `e208_rod_nenufar_pulso`, `e208_rod_nenufar_cauce`, `e208_rod_nenufar_destello`, `e208_rod_nenufar_fortuna`, `e208_rod_nenufar_titan`, `e208_rod_nenufar_reliquia`, `e171_rod_rio` |
| `argentum-rod-2` | Metal y rayos azules | `e161_rod_fiber`, `e161_rod_steel` |
| `argentum-rod-3` | Metal náutico dorado | `e208_rod_marea_pulso`, `e208_rod_marea_cauce`, `e208_rod_marea_destello`, `e208_rod_marea_fortuna`, `e208_rod_marea_titan`, `e208_rod_marea_reliquia`, `e208_rod_custodio_pulso`, `e208_rod_custodio_cauce`, `e208_rod_custodio_destello`, `e208_rod_custodio_fortuna`, `e208_rod_custodio_titan`, `e208_rod_custodio_reliquia`, `e171_rod_costa`, `e18_rod_trofeo` |
| `argentum-rod-4` | Coral y nácar | `e192_rod_coral`, `e208_rod_coral_pulso`, `e208_rod_coral_cauce`, `e208_rod_coral_destello`, `e208_rod_coral_fortuna`, `e208_rod_coral_titan`, `e208_rod_coral_reliquia`, `e187_rod_coral` |
| `argentum-rod-5` | Espinas verdes | `e192_rod_laguna`, `e208_rod_mangle_pulso`, `e208_rod_mangle_cauce`, `e208_rod_mangle_destello`, `e208_rod_mangle_fortuna`, `e208_rod_mangle_titan`, `e208_rod_mangle_reliquia` |
| `argentum-rod-6` | Cristal glacial | `e208_rod_escarcha_pulso`, `e208_rod_escarcha_cauce`, `e208_rod_escarcha_destello`, `e208_rod_escarcha_fortuna`, `e208_rod_escarcha_titan`, `e208_rod_escarcha_reliquia`, `e208_rod_boreal_pulso`, `e208_rod_boreal_cauce`, `e208_rod_boreal_destello`, `e208_rod_boreal_fortuna`, `e208_rod_boreal_titan`, `e208_rod_boreal_reliquia` |
| `argentum-rod-7` | Metal y lava | `e208_rod_obsidiana_pulso`, `e208_rod_obsidiana_cauce`, `e208_rod_obsidiana_destello`, `e208_rod_obsidiana_fortuna`, `e208_rod_obsidiana_titan`, `e208_rod_obsidiana_reliquia` |
| `argentum-rod-8` | Astral y luna | `e208_rod_celeste_pulso`, `e208_rod_celeste_cauce`, `e208_rod_celeste_destello`, `e208_rod_celeste_fortuna`, `e208_rod_celeste_titan`, `e208_rod_celeste_reliquia`, `e208_rod_eterno_pulso`, `e208_rod_eterno_cauce`, `e208_rod_eterno_destello`, `e208_rod_eterno_fortuna`, `e208_rod_eterno_titan`, `e208_rod_eterno_reliquia` |
| `argentum-rod-9` | Hueso y cristal abisal | `e192_rod_abyss`, `e208_rod_fosa_pulso`, `e208_rod_fosa_cauce`, `e208_rod_fosa_destello`, `e208_rod_fosa_fortuna`, `e208_rod_fosa_titan`, `e208_rod_fosa_reliquia` |

### Todos los IDs y nombres de cañas

“Retirada” significa fuera de las ofertas nuevas, no eliminada del guardado. Las seis variantes de una misma familia pueden justificar un diseño base compartido, pero futuras mejoras deben distinguir función/material/accesorios, no solo recolorear. Viejo Pescador, Guardarríos, Brumas, Coleccionista y Coralina merecen diseños propios por su papel de recompensa.

| ID | Nombre | Oferta actual | Ilustración |
|---|---|---|---|
| `e16_rod` | Caña sencilla | Sí | `argentum-rod-0` |
| `e161_rod_bamboo` | Caña de bambú | Sí | `argentum-rod-1` |
| `e161_rod_fiber` | Caña de fibra | Sí | `argentum-rod-2` |
| `e161_rod_steel` | Caña reforzada | Sí | `argentum-rod-2` |
| `e192_rod_laguna` | Caña Esmeralda | Sí | `argentum-rod-5` |
| `e192_rod_coral` | Caña de Nácar | Sí | `argentum-rod-4` |
| `e192_rod_abyss` | Caña Astral | Sí | `argentum-rod-9` |
| `e208_rod_junco_pulso` | Junco Dorado · Pulso Certero | Retirada; se conserva si obtenida | `argentum-rod-0` |
| `e208_rod_junco_cauce` | Junco Dorado · Cauce Indomable | Sí | `argentum-rod-0` |
| `e208_rod_junco_destello` | Junco Dorado · Destello | Sí | `argentum-rod-0` |
| `e208_rod_junco_fortuna` | Junco Dorado · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-0` |
| `e208_rod_junco_titan` | Junco Dorado · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-0` |
| `e208_rod_junco_reliquia` | Junco Dorado · Relicario | Retirada; se conserva si obtenida | `argentum-rod-0` |
| `e208_rod_sauce_pulso` | Sauce Ancestral · Pulso Certero | Sí | `argentum-rod-1` |
| `e208_rod_sauce_cauce` | Sauce Ancestral · Cauce Indomable | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_sauce_destello` | Sauce Ancestral · Destello | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_sauce_fortuna` | Sauce Ancestral · Faro de Fortuna | Sí | `argentum-rod-1` |
| `e208_rod_sauce_titan` | Sauce Ancestral · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_sauce_reliquia` | Sauce Ancestral · Relicario | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_marea_pulso` | Marea Errante · Pulso Certero | Retirada; se conserva si obtenida | `argentum-rod-3` |
| `e208_rod_marea_cauce` | Marea Errante · Cauce Indomable | Sí | `argentum-rod-3` |
| `e208_rod_marea_destello` | Marea Errante · Destello | Retirada; se conserva si obtenida | `argentum-rod-3` |
| `e208_rod_marea_fortuna` | Marea Errante · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-3` |
| `e208_rod_marea_titan` | Marea Errante · Ancla de Titanes | Sí | `argentum-rod-3` |
| `e208_rod_marea_reliquia` | Marea Errante · Relicario | Retirada; se conserva si obtenida | `argentum-rod-3` |
| `e208_rod_nenufar_pulso` | Nenúfar Real · Pulso Certero | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_nenufar_cauce` | Nenúfar Real · Cauce Indomable | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_nenufar_destello` | Nenúfar Real · Destello | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_nenufar_fortuna` | Nenúfar Real · Faro de Fortuna | Sí | `argentum-rod-1` |
| `e208_rod_nenufar_titan` | Nenúfar Real · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-1` |
| `e208_rod_nenufar_reliquia` | Nenúfar Real · Relicario | Sí | `argentum-rod-1` |
| `e208_rod_coral_pulso` | Corona Coralina · Pulso Certero | Sí | `argentum-rod-4` |
| `e208_rod_coral_cauce` | Corona Coralina · Cauce Indomable | Sí | `argentum-rod-4` |
| `e208_rod_coral_destello` | Corona Coralina · Destello | Retirada; se conserva si obtenida | `argentum-rod-4` |
| `e208_rod_coral_fortuna` | Corona Coralina · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-4` |
| `e208_rod_coral_titan` | Corona Coralina · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-4` |
| `e208_rod_coral_reliquia` | Corona Coralina · Relicario | Retirada; se conserva si obtenida | `argentum-rod-4` |
| `e208_rod_fosa_pulso` | Juramento Abisal · Pulso Certero | Sí | `argentum-rod-9` |
| `e208_rod_fosa_cauce` | Juramento Abisal · Cauce Indomable | Retirada; se conserva si obtenida | `argentum-rod-9` |
| `e208_rod_fosa_destello` | Juramento Abisal · Destello | Retirada; se conserva si obtenida | `argentum-rod-9` |
| `e208_rod_fosa_fortuna` | Juramento Abisal · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-9` |
| `e208_rod_fosa_titan` | Juramento Abisal · Ancla de Titanes | Sí | `argentum-rod-9` |
| `e208_rod_fosa_reliquia` | Juramento Abisal · Relicario | Retirada; se conserva si obtenida | `argentum-rod-9` |
| `e208_rod_mangle_pulso` | Espina del Manglar · Pulso Certero | Retirada; se conserva si obtenida | `argentum-rod-5` |
| `e208_rod_mangle_cauce` | Espina del Manglar · Cauce Indomable | Sí | `argentum-rod-5` |
| `e208_rod_mangle_destello` | Espina del Manglar · Destello | Retirada; se conserva si obtenida | `argentum-rod-5` |
| `e208_rod_mangle_fortuna` | Espina del Manglar · Faro de Fortuna | Sí | `argentum-rod-5` |
| `e208_rod_mangle_titan` | Espina del Manglar · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-5` |
| `e208_rod_mangle_reliquia` | Espina del Manglar · Relicario | Retirada; se conserva si obtenida | `argentum-rod-5` |
| `e208_rod_escarcha_pulso` | Aurora Glacial · Pulso Certero | Sí | `argentum-rod-6` |
| `e208_rod_escarcha_cauce` | Aurora Glacial · Cauce Indomable | Sí | `argentum-rod-6` |
| `e208_rod_escarcha_destello` | Aurora Glacial · Destello | Retirada; se conserva si obtenida | `argentum-rod-6` |
| `e208_rod_escarcha_fortuna` | Aurora Glacial · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-6` |
| `e208_rod_escarcha_titan` | Aurora Glacial · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-6` |
| `e208_rod_escarcha_reliquia` | Aurora Glacial · Relicario | Retirada; se conserva si obtenida | `argentum-rod-6` |
| `e208_rod_obsidiana_pulso` | Forja del Eclipse · Pulso Certero | Retirada; se conserva si obtenida | `argentum-rod-7` |
| `e208_rod_obsidiana_cauce` | Forja del Eclipse · Cauce Indomable | Retirada; se conserva si obtenida | `argentum-rod-7` |
| `e208_rod_obsidiana_destello` | Forja del Eclipse · Destello | Sí | `argentum-rod-7` |
| `e208_rod_obsidiana_fortuna` | Forja del Eclipse · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-7` |
| `e208_rod_obsidiana_titan` | Forja del Eclipse · Ancla de Titanes | Sí | `argentum-rod-7` |
| `e208_rod_obsidiana_reliquia` | Forja del Eclipse · Relicario | Retirada; se conserva si obtenida | `argentum-rod-7` |
| `e208_rod_celeste_pulso` | Bóveda Celestial · Pulso Certero | Sí | `argentum-rod-8` |
| `e208_rod_celeste_cauce` | Bóveda Celestial · Cauce Indomable | Retirada; se conserva si obtenida | `argentum-rod-8` |
| `e208_rod_celeste_destello` | Bóveda Celestial · Destello | Retirada; se conserva si obtenida | `argentum-rod-8` |
| `e208_rod_celeste_fortuna` | Bóveda Celestial · Faro de Fortuna | Retirada; se conserva si obtenida | `argentum-rod-8` |
| `e208_rod_celeste_titan` | Bóveda Celestial · Ancla de Titanes | Retirada; se conserva si obtenida | `argentum-rod-8` |
| `e208_rod_celeste_reliquia` | Bóveda Celestial · Relicario | Sí | `argentum-rod-8` |
| `e208_rod_custodio_pulso` | Custodio del Río · Pulso Certero | Sí | `argentum-rod-3` |
| `e208_rod_custodio_cauce` | Custodio del Río · Cauce Indomable | Sí | `argentum-rod-3` |
| `e208_rod_custodio_destello` | Custodio del Río · Destello | Sí | `argentum-rod-3` |
| `e208_rod_custodio_fortuna` | Custodio del Río · Faro de Fortuna | Sí | `argentum-rod-3` |
| `e208_rod_custodio_titan` | Custodio del Río · Ancla de Titanes | Sí | `argentum-rod-3` |
| `e208_rod_custodio_reliquia` | Custodio del Río · Relicario | Sí | `argentum-rod-3` |
| `e208_rod_boreal_pulso` | Pacto Boreal · Pulso Certero | Sí | `argentum-rod-6` |
| `e208_rod_boreal_cauce` | Pacto Boreal · Cauce Indomable | Sí | `argentum-rod-6` |
| `e208_rod_boreal_destello` | Pacto Boreal · Destello | Sí | `argentum-rod-6` |
| `e208_rod_boreal_fortuna` | Pacto Boreal · Faro de Fortuna | Sí | `argentum-rod-6` |
| `e208_rod_boreal_titan` | Pacto Boreal · Ancla de Titanes | Sí | `argentum-rod-6` |
| `e208_rod_boreal_reliquia` | Pacto Boreal · Relicario | Sí | `argentum-rod-6` |
| `e208_rod_eterno_pulso` | Legado de las Mareas · Pulso Certero | Sí | `argentum-rod-8` |
| `e208_rod_eterno_cauce` | Legado de las Mareas · Cauce Indomable | Sí | `argentum-rod-8` |
| `e208_rod_eterno_destello` | Legado de las Mareas · Destello | Sí | `argentum-rod-8` |
| `e208_rod_eterno_fortuna` | Legado de las Mareas · Faro de Fortuna | Sí | `argentum-rod-8` |
| `e208_rod_eterno_titan` | Legado de las Mareas · Ancla de Titanes | Sí | `argentum-rod-8` |
| `e208_rod_eterno_reliquia` | Legado de las Mareas · Relicario | Sí | `argentum-rod-8` |
| `e17_rod_viejo` | Caña del Viejo Pescador | Sí | `argentum-rod-0` |
| `e171_rod_rio` | Caña del Guardarríos | Sí | `argentum-rod-1` |
| `e171_rod_costa` | Caña de las Brumas | Sí | `argentum-rod-3` |
| `e18_rod_trofeo` | Caña del Coleccionista | Sí | `argentum-rod-3` |
| `e187_rod_coral` | Caña Coralina | Sí | `argentum-rod-4` |

## Resoluciones y composición recomendadas

| Uso | Recurso de desarrollo recomendado | Presentación |
|---|---|---|
| Pez individual | 768–1024 px de lado largo; fondo transparente o acuático integrado | Anatomía completa, margen de seguridad 5–8%; `contain`. Una sola fuente para HUD, Diario y colección. |
| Raya / calamar / anguila | No forzar el mismo rectángulo pintado: guardar límites por especie | Aletas, tentáculos y cola dentro de los límites; fondo separado para integrar proporciones diferentes. |
| Caña | 1536 × 384 aprox., composición horizontal 4:1 | Mango, reel, punta y adornos completos. Texto del nombre superpuesto, nunca incrustado. |
| Paisaje de zona | 1536 × 512 o mayor, foco central y encuadre opcional por ID | `cover` sin deformación; nombre inferior sobre degradado. Verificar que el foco siga legible en la tarjeta casi cuadrada del móvil. |
| Cabecera | Motivo completo dentro de celda cuadrada de 256–512 px | Recurso visible de 40 × 40 px, sin ampliar la cabecera de 44 px ni invadir texto. |

Las cabeceras actuales comparten una lámina de seis motivos: se corrigió a 300% × 200% (celda completa), se quitó la máscara que cortaba sus bordes y se hizo coincidir la columna de 40 px con la imagen. Colección separa título y progreso con la misma alineación de imagen/texto/flecha.

## Etapa C — muestra separada

[Abrir arte/muestras.html](arte/muestras.html). Incluye Bagre, Calamar abisal, Mantarraya legendaria, Caña de bambú, Caña Coralina y Juramento Abisal · Pulso Certero. Son propuestas para **IDs existentes**, sin nueva estadística ni incorporación al catálogo.

La lámina se refinó para que las cañas fueran horizontales y pudieran leerse en el HUD. La página de muestra comparte la hoja CSS real de Estable 23 y permite alternar pez/caña; no ejecuta la lógica del juego ni toca guardados. Los valores son demostrativos. Las seis propuestas comparten un solo PNG y cada encuadre mantiene la silueta completa.

Antes de integrar: validar anatomía y dirección artística, probar miniaturas y preparar archivos maestros individuales con límites explícitos. No se considera aprobada automáticamente esta muestra ni se reemplazaron los 41 peces/90 cañas.

## Desarrollo y empaquetado futuro

Conviene mantener maestros individuales y un manifiesto por ID fuera del HTML durante el trabajo artístico, y deduplicar recursos al empaquetar. Los IDs de juego deben seguir siendo las claves; el manifiesto puede apuntar varios IDs de una familia a un mismo recurso y añadir límites/foco opcionales. El exportador debe validar archivos e IDs antes de sustituir los recursos actuales.

No se implementa ahora una nueva cadena de empaquetado ni se mueve el arte existente: sería una modificación masiva ajena a Etapa A. Los contratos de catálogo, filtros y Atlas se mantienen y sus regresiones de expansión siguen ejecutándose. La muestra separada permite validar el enfoque sin volver dependiente de archivos externos al juego estable.
