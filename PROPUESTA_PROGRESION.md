# Progresión de Pesca — análisis y propuesta, sin implementación

Base real: Estable 23 conserva balance y contenido de Estable 22. Esta es la Etapa B y una propuesta para la Etapa D; ninguna misión, requisito, precio o recompensa de abajo se aplica automáticamente al juego.

## Distribución actual

| Zona | Acceso de Pesca | Especies en la zona / al entrar | Última especie | Encargos | Recompensas actuales |
|---|---:|---:|---:|---:|---|
| Muelle del pueblo | 1 | 5 / 2 | 6 | 1 | Caña del Viejo Pescador |
| Río del Bosque | 8 | 6 / 4 | 11 | 8 | Guardarríos + Coleccionista + 6 Custodio del Río |
| Costa de las Brumas | 18 | 6 / 4 | 30 | 1 | Caña de las Brumas |
| Laguna Esmeralda | 22 | 5 / 3 | 28 | 1 | Instinto de pescador: +5% a la XP de pesca para siempre |
| Arrecife de Coral | 32 | 5 / 2 | 38 | 1 | Caña Coralina: +11,5% de barra de control y picadas 16% más rápidas |
| Fosa de las Sombras | 43 | 5 / 2 | 50 | 1 | Pulso del abismo: +8 px de control permanente |
| Manglares Susurrantes | 52 | 4 / 1 | 60 | 0 | Sin encargos |
| Lago del Glaciar | 62 | 4 / 1 | 71 | 6 | 6 cañas Pacto Boreal |
| Bahía Volcánica | 73 | 4 / 1 | 82 | 0 | Sin encargos |
| Santuario Celestial | 85 | 4 / 1 | 98 | 6 | 6 cañas Legado de las Mareas |

Hay 41 especies distintas y 48 pertenencias a zonas (algunas especies se comparten). Río concentra 8/25 encargos (32%); Glaciar y Santuario concentran otros 12. Entre Laguna, Arrecife y Fosa hay un único encargo por zona; Manglares y Volcán no tienen ninguno.

No hay un vacío de especies hasta 100: Santuario incorpora especies en 85, 89, 93 y 98. Sí hay poca variedad de **objetivos** intermedios y predominan los seis desafíos de captura/peso repetidos por familia en las zonas con más encargos.

## Inventario completo de encargos

No existe requisito de categoría Común/Grande/Enorme/Legendario en estos 25 encargos. Las entregas aceptan todas las categorías; los desafíos se basan en capturas, especies y peso histórico. No debe confundirse una especie con “legendaria” en su nombre con una categoría de ejemplar.

| ID / zona | Encargo | Objetivos reales | Recompensa |
|---|---|---|---|
| `e17_viejo` / muelle | El encargo del viejo pescador | Alcanzá habilidad de Pesca 6; Entregá 12 Mojarra; Entregá 8 Bagre; Entregá 4 Trucha | Caña del Viejo Pescador |
| `e171_rio` / rio | Los secretos del río | Alcanzá habilidad de Pesca 12; Entregá 7 Lucio; Entregá 4 Anguila eléctrica | Caña del Guardarríos |
| `e171_costa` / costa | El encargo del capitán | Alcanzá habilidad de Pesca 24; Entregá 9 Lubina; Entregá 5 Atún gigante | Caña de las Brumas |
| `laguna` / laguna | El naturalista de la laguna | Alcanzá habilidad de Pesca 22; Entregá 4 Perca esmeralda; Entregá 3 Cangrejo azul | Instinto de pescador: +5% a la XP de pesca para siempre |
| `arrecife` / arrecife | El secreto del arrecife | Alcanzá habilidad de Pesca 32; Entregá 4 Pez luna; Entregá 3 Caballito de mar | Caña Coralina: +11,5% de barra de control y picadas 16% más rápidas |
| `abismo` / abismo | La mirada del abismo | Alcanzá habilidad de Pesca 43; Entregá 4 Pez linternilla; Entregá 2 Calamar abisal | Pulso del abismo: +8 px de control permanente |
| `coleccionista` / rio | El trofeo de las corrientes | Conseguí 5 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 8 kg | Caña del Coleccionista |
| `e208_rod_custodio_pulso` / rio | Custodio del Río: Pulso Certero | Conseguí 12 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 2 kg | Custodio del Río · Pulso Certero |
| `e208_rod_custodio_cauce` / rio | Custodio del Río: Cauce Indomable | Conseguí 18 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 3 kg | Custodio del Río · Cauce Indomable |
| `e208_rod_custodio_destello` / rio | Custodio del Río: Destello | Conseguí 25 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 2 kg | Custodio del Río · Destello |
| `e208_rod_custodio_fortuna` / rio | Custodio del Río: Faro de Fortuna | Conseguí 15 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 4 kg | Custodio del Río · Faro de Fortuna |
| `e208_rod_custodio_titan` / rio | Custodio del Río: Ancla de Titanes | Conseguí 10 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 6 kg | Custodio del Río · Ancla de Titanes |
| `e208_rod_custodio_reliquia` / rio | Custodio del Río: Relicario | Conseguí 30 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 4 kg | Custodio del Río · Relicario |
| `e208_rod_boreal_pulso` / glaciar | Pacto Boreal: Pulso Certero | Conseguí 12 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 75 kg | Pacto Boreal · Pulso Certero |
| `e208_rod_boreal_cauce` / glaciar | Pacto Boreal: Cauce Indomable | Conseguí 18 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 100 kg | Pacto Boreal · Cauce Indomable |
| `e208_rod_boreal_destello` / glaciar | Pacto Boreal: Destello | Conseguí 25 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 60 kg | Pacto Boreal · Destello |
| `e208_rod_boreal_fortuna` / glaciar | Pacto Boreal: Faro de Fortuna | Conseguí 15 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 125 kg | Pacto Boreal · Faro de Fortuna |
| `e208_rod_boreal_titan` / glaciar | Pacto Boreal: Ancla de Titanes | Conseguí 10 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 225 kg | Pacto Boreal · Ancla de Titanes |
| `e208_rod_boreal_reliquia` / glaciar | Pacto Boreal: Relicario | Conseguí 30 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 150 kg | Pacto Boreal · Relicario |
| `e208_rod_eterno_pulso` / santuario | Legado de las Mareas: Pulso Certero | Conseguí 12 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 360 kg | Legado de las Mareas · Pulso Certero |
| `e208_rod_eterno_cauce` / santuario | Legado de las Mareas: Cauce Indomable | Conseguí 18 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 480 kg | Legado de las Mareas · Cauce Indomable |
| `e208_rod_eterno_destello` / santuario | Legado de las Mareas: Destello | Conseguí 25 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 288 kg | Legado de las Mareas · Destello |
| `e208_rod_eterno_fortuna` / santuario | Legado de las Mareas: Faro de Fortuna | Conseguí 15 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 600 kg | Legado de las Mareas · Faro de Fortuna |
| `e208_rod_eterno_titan` / santuario | Legado de las Mareas: Ancla de Titanes | Conseguí 10 capturas; Descubrí 2 especies distintas; Capturá un pez de al menos 1.080 kg | Legado de las Mareas · Ancla de Titanes |
| `e208_rod_eterno_reliquia` / santuario | Legado de las Mareas: Relicario | Conseguí 30 capturas; Descubrí 3 especies distintas; Capturá un pez de al menos 720 kg | Legado de las Mareas · Relicario |

## Nivel anunciado frente a nivel efectivo

- Custodio del Río figura como familia orientativa de nivel 18, pero sus desafíos no tienen ese bloqueo. La zona abre a 8 y el lucio de nivel 8 alcanza 14 kg; todos los umbrales de 2–6 kg de los seis desafíos son alcanzables allí desde ese nivel. Contar capturas históricas hace que varias cañas se habiliten juntas. Es una explicación concreta de la sensación de muchas recompensas tempranas; no se cambia retroactivamente.
- Pacto Boreal es una familia orientativa de 65, pero sus umbrales son 60, 75, 100, 125, 150 y 225 kg. Antes del bacalao de 68, el mayor pez local pesa 16 kg. El desafío de 60 kg puede completarse desde 68; 75 kg con bacalao exige prácticamente el extremo máximo redondeado de su rango. Los demás necesitan esturión blanco de nivel 71. Para un objetivo divertido, 75 kg no debe presentarse como razonablemente obtenible a 68.
- Legado de las Mareas tiene umbrales de 288–1080 kg. Con carpa celeste de 85 (máximo 160 kg) y cometa de 89 (10 kg) no se puede completar ninguno. La raya de 93 alcanza 650 kg: habilita los cuatro umbrales menores; los de 720 y 1080 kg requieren Guardián de las Mareas de nivel 98. Este es un cierre real de juego, no contenido resoluble al entrar al Santuario.
- Guardarríos requiere realmente Pesca 12, Brumas 24, Viejo Pescador 6 y Coralina 32. Arrecife pide caballito de nivel 33 y Fosa pide calamar de 45: el acceso a la misión no significa que ya estén disponibles todas las especies de entrega. Sus objetivos muestran la habilidad requerida y el registro de captura; conviene explicitar el nivel de cada especie en una futura mejora de texto.

## Economía y utilidad de cañas

27 cañas por oro y 23 de encargo están entre las 50 ofertas actuales. Las 40 ofertas históricas retiradas no se eliminan si fueron adquiridas. Las cañas no suben de nivel; los niveles de familias son agrupaciones visuales, salvo los requisitos reales de encargos ya mencionados.

- Bambú cuesta 170 oro y tiene 28% de resiliencia, superior a los 22% de Astral. Sigue teniendo un nicho, pero su capacidad de 60 kg limita los peces grandes.
- Astral cuesta 29.000 oro y admite hasta 3.000 kg, con control 49 y resiliencia 22. Una oferta Celestial posterior puede costar más de 400.000 oro y seguir teniendo el mismo límite de peso: la mejora está en otros atributos. Esto puede hacer poco atractivos varios escalones caros; merece medir compras/equipamiento antes de introducir más cañas o retocar precios.
- La capacidad no aumenta un peso por multiplicación: excluye especies cuyo mínimo supera el límite y recorta el máximo muestreable. Una caña pequeña puede sacar un ejemplar pequeño de una especie grande si alcanza su mínimo. No es un fallo de selección aleatoria.
- El control aporta puntos de cobertura; resiliencia reduce desplazamiento y espacia cambios. Atracción reduce espera y toques; suerte modifica pesos relativos de especies con `rarity`; trofeos modifica categorías. No son mejoras intercambiables.

## XP, oro y dificultad: alcance de los cálculos

La tabla siguiente es un promedio de XP base y precio base **por captura exitosa** al nivel de acceso de cada zona, con capacidad suficiente y suerte 0. Reutiliza la fórmula de pesos real. Excluye calidad, perks, fallos, tiempos de interacción, venta posterior y duración del minijuego: no es una estimación de XP/hora ni de oro/hora.

| Zona / nivel de referencia | XP base media | Valor base medio |
|---|---:|---:|
| Muelle del pueblo / 1 | 16.0 | 10.0 |
| Río del Bosque / 8 | 45.6 | 33.7 |
| Costa de las Brumas / 18 | 120.1 | 103.4 |
| Laguna Esmeralda / 22 | 194.2 | 174.9 |
| Arrecife de Coral / 32 | 234.5 | 233.5 |
| Fosa de las Sombras / 43 | 516.2 | 627.3 |
| Manglares Susurrantes / 52 | 420.0 | 580.0 |
| Lago del Glaciar / 62 | 530.0 | 780.0 |
| Bahía Volcánica / 73 | 690.0 | 1180.0 |
| Santuario Celestial / 85 | 950.0 | 1700.0 |

La entrada a Manglares ofrece menos XP base por captura que la entrada a Fosa, y abre con una sola especie. Se suman especies en 54, 57 y 60, pero no un encargo. Es prioritario darle objetivos propios antes de agregar más especies. No alcanza esta observación para modificar una fórmula de XP: faltan datos de duración y éxito con jugadores reales.

Las probabilidades de especies se normalizan por zona, nivel, suerte y capacidad. Las categorías de ejemplar se sortean aparte. Las funciones de movimiento, ganancia/pérdida y perfiles del Arrecife permanecen intactos; las regresiones de balance siguen pasando. La mejora de habilidad en cobertura tiene un tope temprano y el peso/rareza no equivalen a dificultad de seguimiento: una recompensa no debe exigir solo repetir una especie muy rara.

## Propuesta concreta para revisión — todavía no implementada

Conservar todos los encargos actuales en sus zonas e IDs. Añadir primero cuatro objetivos intermedios, sin nuevas especies, zonas ni cañas y sin exigir categorías raras:

| Nombre propuesto | Zona / habilidad | Objetivos propuestos | Recompensa propuesta | Motivo |
|---|---|---|---|---|
| Cartógrafo de las raíces | Manglares / 54 | Descubrir sábalo y pez arquero en la zona; registrar 10 capturas locales. Histórico, sin entregar peces. | Insignia Cartógrafo de las raíces + 1.200 oro, una vez. | Da un primer objetivo al entrar sin bloquear por una especie rara o un récord extremo. |
| El salto entre raíces | Manglares / 60 | Registrar un tarpón local de 40 kg y 3 especies distintas. Sin consumir peces. | Insignia Salto del Manglar + 2.500 oro, una vez. | Usa la especie de 60 y premia preparar capacidad; no pide su peso máximo ni una categoría. |
| El cuaderno de ceniza | Bahía Volcánica / 76 | Descubrir pez lava y mero obsidiana; registrar 8 capturas locales. Histórico. | Insignia Cronista de ceniza + 3.000 oro, una vez. | Ofrece una meta alcanzable antes del dragón de 82. |
| Guardián de la bahía | Bahía Volcánica / 80 | Descubrir 3 especies locales, 15 capturas y un récord local de 100 kg. Histórico. | Insignia Guardián de la bahía + 5.000 oro, una vez. | Completar con lava/mero/escorpión; no obliga a encontrar al dragón. Un mero de 100 kg está dentro de su rango 30–190. |

Estas recompensas son propuestas editoriales, no un nuevo balance aprobado. Su coste real debe compararse con el ritmo de venta antes de incorporarlas. No hay entrega de inventario, por lo que no se cambia el oro perdido por vender/entregar. Los objetivos usan especies y rangos existentes; no requieren nuevos sistemas de clima, ítems o cebo.

### Compatibilidad de maestrías antes de añadir encargos

Actualmente la segunda estrella del Atlas depende de **todos** los encargos definidos en la zona; cuando no existen, se acredita con la primera especie. Añadir misiones a Manglares/Volcán sin considerar esto puede quitar temporalmente una estrella/medalla ya visible. Por eso no se implementa la propuesta automáticamente.

Antes de expandir hay que acordar un contrato de encargos principales/extra o hitos versionados que conserve la maestría acreditada y permita a los personajes existentes aprovechar sus registros históricos. Las futuras insignias extra no deberían invalidar una medalla ya ganada. Cualquier extensión compatible se probará con v7 y sin borrar ni reemplazar campos antiguos.

## Decisión para esta entrega

No sumar peces ni cañas: ya hay variedad hasta 98, pero faltan identidad artística y metas intermedias. No trasladar ni endurecer las misiones actuales. Priorizar fuentes limpias, cuatro objetivos laterales para revisar y claridad entre nivel orientativo y nivel efectivo. No se implementó ningún cambio de contenido o balance de esta propuesta.
