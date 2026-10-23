# Entrega visual — Estable 23

Base: Estable 22, `6075b03`. Se implementan Etapa A y los cambios de contenedores del HUD autorizados en el punto 11. Las Etapas B y C se entregan como inventarios, análisis y muestra separada. No se implementa la expansión de Etapa D.

## Cambios aplicados

- Cabeceras: el recurso visible ahora mide 40 × 40 px y su columna también mide 40 px, con 10 px de separación al texto. Se utiliza la celda completa de la lámina (300% × 200%), sin el zoom/máscara anterior que cortaba el mapa.
- Colección: se corrige la especificidad de CSS que dejaba prevalecer `display:list-item` sobre el grid deseado. Imagen, título, progreso y flecha se alinean en columnas; el título puede envolver sin superponerse a la ilustración. Atlas, Tienda y Diario conservan 46 px de altura cerrados y un resumen de 44 px.
- Zona del HUD: gana 24 px de ancho en escritorio y 12 px en móvil. Paisaje con `cover`, proporción original y foco centrado; nombre inferior sobre degradado. Las composiciones actuales de paisaje son panorámicas y necesitan revisar su foco cuando se incorpore arte nuevo.
- Caña: el nombre es una superposición superior con degradado, sin una fila reservada. La imagen ocupa el área interior completa y conserva `contain`/`xMidYMid meet`; los símbolos y sus `viewBox` originales no se recortan ni se deforman.
- Último pez: la imagen principal conserva su proporción y el archivo completo. El espacio sobrante usa un fondo suave derivado del mismo recurso; los vectores transparentes conservan el fondo integrado. Este fondo es decorativo y no intercepta las interacciones. Se crea solo al cambiar el pez y permanece estable en las actualizaciones del HUD.

## Dimensiones antes y después

Se comparó el mismo personaje y estado en navegadores nuevos, antes y después de los cambios.

| Elemento | Escritorio 1366 px | Móvil 390 px |
|---|---|---|
| HUD completo | 118 → **118 px** de alto | 118 → **118 px** de alto |
| Posición | Fija, mismo borde inferior | Fija, mismo borde inferior |
| Zona | 104 → 128 px de ancho; 102 px de alto | 48 → 60 px de ancho; 72 px de alto |
| Tarjeta de caña | 357 → 333 px de ancho; 102 px de alto | 126 → 114 px de ancho; 102 px de alto |
| Último pez | 104 × 102 px, sin cambios | 48 × 72 px, sin cambios |
| XP, última captura y progreso | Mismos rectángulos y espacio disponible | Mismos rectángulos y espacio disponible |
| HUD de combate | Sin cambios | Sin cambios |

La redistribución de anchos responde a la autorización del punto 11 del pedido, que sustituye la restricción anterior de mantener también los anchos. La altura y posición continúan siendo restricciones absolutas.

Capturas del estado real del juego:

- [Escritorio antes](arte/verificacion/hud-antes-escritorio.png) / [después](arte/verificacion/hud-despues-escritorio.png).
- [Móvil antes](arte/verificacion/hud-antes-movil.png) / [después](arte/verificacion/hud-despues-movil.png).
- [Cabecera de Colección de Fosa de las Sombras en móvil](arte/verificacion/cabecera-coleccion-movil.png).

## Límites de las fuentes existentes

Se conservaron los 119 recursos embebidos de Estable 22. Varios raster antiguos ya contienen cuerpos incompletos, rótulos de otra especie o siluetas bloqueadas. El contenedor ahora evita cortar el archivo, pero **no reconstruye las partes que faltan dentro de ese archivo**. No se reemplazaron ilustraciones buenas por vectores genéricos para disimularlo. Estos casos se identifican por especie en el inventario y requieren nuevas fuentes individuales.

La muestra independiente de seis ilustraciones permite revisar esa sustitución en un HUD que utiliza el CSS real; no se integra automáticamente al juego. Sus composiciones y anatomías todavía deben validarse antes de una sustitución masiva.

## Contenido y compatibilidad

Las cifras reales, reutilizaciones y prioridades están en [AUDITORIA_ARTISTICA.md](AUDITORIA_ARTISTICA.md), con el [inventario JSON](arte/inventario-estable23.json) regenerable. La distribución de los 25 encargos y cuatro propuestas concretas no implementadas están en [PROPUESTA_PROGRESION.md](PROPUESTA_PROGRESION.md).

No se modifica selección aleatoria, categorías, movimiento/captura, XP, precios, estadísticas, requisitos, recompensas, zonas, IDs ni condiciones de maestría. No se cambian funciones de persistencia ni el esquema v7. Las páginas de muestras no ejecutan el juego ni acceden a localStorage.

## Pruebas

- `npm run audit`: 62 scripts sintácticamente válidos; 67 bloques de estilo correctamente cerrados; HTML autónomo.
- Suite completa: **107/107 pruebas aprobadas**, sin errores de ejecución del navegador.
- Chromium con perfiles aislados y anchos de escritorio/móvil: inicialización, Pesca, Combate, RNG, cañas, Atlas/Diario, filtros, misiones, XP, récords, v7, cinco personajes, exportación/importación JSON, IndexedDB/localStorage y carga.
- Regresión geométrica contra la referencia histórica: solo cambian los dos anchos y la posición de caña autorizados; la altura, sección derecha y combate permanecen iguales. El XP Drop y las fases del minijuego tampoco alteran esos rectángulos.
- Pruebas nuevas recorren las 10 zonas para revisar las cuatro cabeceras; las 41 especies y 90 cañas para verificar proporción/altura y estabilidad de nodos/fondo; y las seis muestras separadas sin acceso a guardados.
- Inspección de capturas reales del navegador en ambos anchos. No se afirma prueba en un teléfono físico, Firefox/Safari o GitHub Pages.

Para regenerar la muestra después de un cambio autorizado en el CSS: `node scripts/build-art-preview.cjs`. Para jugar sigue bastando `index.html`; `arte/muestras.html` y sus recursos son exclusivamente material de revisión.
