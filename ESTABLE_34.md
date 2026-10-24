# Estable 34

Base: Estable 33 (`59e988e`), correspondiente al ZIP adjunto.

- Encargos: las miniaturas de objetivos múltiples quedan en una tira horizontal con adaptación a móvil, sin apilar una fila por pez.
- Captura: se reemplaza la atracción lenta hacia puntos lejanos por rumbo, ráfagas y cambios rápidos de dirección, recuperando el modelo anterior a Estable 31. La entrada del jugador y las fórmulas de progreso se conservan. Resiliencia reduce la velocidad efectiva incluso después del límite máximo; Control conserva su función de cobertura. Se elimina la flecha sobre el punto del pez.
- Zonas: diez apariciones repetidas pasan a ser especies regionales nuevas. Los 60 puestos actuales tienen IDs distintos. Se conservan todos los IDs, capturas, inventario y récords anteriores.
- Arte acotado según lo acordado: diez especies nuevas y catorce variantes pintadas —Enorme/Legendario— de Mojarra, Pez linternilla, Calamar abisal, Sábalo del manglar, Bagre, Pez arquero y Cangrejo azul. Estas variantes reemplazan las pinceladas superpuestas, también en la última captura del HUD. Las demás variantes quedan para otra entrega.

| Zona | Nueva especie en lugar de la compartida |
|---|---|
| Río del Bosque | Barbo de bronce, Dorado del bosque, Pez hoja |
| Costa de las Brumas | Bonito de las brumas |
| Laguna Esmeralda | Gurami de jade |
| Arrecife de Coral | Doncella de coral |
| Fosa de las Sombras | Raya de ónice |
| Ruinas Sumergidas | Sepia del archivo |
| Cavernas de Cristal | Medusa de cuarzo |
| Abismo Primordial | Víbora del primer mar |

Las especies anteriores siguen en sus zonas originales y en el Diario histórico. Los créditos de descubrimiento y objetivos previos se conservan mediante una extensión aditiva de `ui`, congelada una vez al actualizar; no se inventan capturas ni récords de las especies nuevas. No se cambia el guardado v7 ni se reinician personajes. Los pesos de selección de cada puesto se mantienen usando la especie anterior como referencia. La exigencia de captura de las especies nuevas corresponde a su región; precios, XP y rangos de peso conservan la economía del puesto reemplazado.

## Verificación acotada

Ocho pruebas dirigidas aprobadas: objetivos horizontales en 1366/390 px; ausencia de flecha; exclusividad de las especies por zona; créditos históricos idempotentes; captura nueva sin modificar las anteriores; exportación/importación JSON v7 y recarga; diferencias entre cañas y movimiento sin teletransportes ni capturas estáticas en los casos probados; variantes sin pinceladas; retratos completos y cambios de categoría en un HUD de 118 px.

Las simulaciones comparan equipo inicial, apropiado y avanzado con un controlador idéntico. No son tasas de éxito de jugadores reales ni sustituyen la prueba de sensación al jugar. Se usó Chromium con móvil simulado, no un teléfono físico. No se repitió la batería general ni se regeneraron cañas o paisajes.

Se reutilizan las imágenes previas y se comparten cuatro láminas WebP nuevas. Los originales se conservan. Los recortes revisados no tienen píxeles opacos tocando el borde; la medusa utiliza un contorno de recorte para conservar tentáculos y excluir al vecino de la lámina.

[Capturas](arte/verificacion/estable34/index.html) · [Pruebas](arte/verificacion/estable34/pruebas.txt) · [ZIP y hashes](descargas/estable34.json).

Prueba específica: `npm run test:fishing34`. Build: `npm run build`. Paquete autónomo: `python3 scripts/package-release.py`.
