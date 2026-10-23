# Navegación de Pesca — Estable 22

Base: Estable 21, commit `a30539b`. Cambios limitados a las interfaces solicitadas; no se agregan zonas, especies, cañas ni misiones.

## Atlas y desplazamiento

Seleccionar una zona conserva la lista y sus botones. Se reemplaza únicamente la ficha, inmediatamente después de su fila; seleccionar otra cierra la anterior. Se conserva el foco con `preventScroll` y el desplazamiento interno. No se usa `scrollTo` ni `scrollIntoView` al seleccionar/cerrar zonas. Se desactiva el anclaje automático del navegador dentro del Atlas, que podía mover la página al cambiar la altura del contenido. Una reconstrucción de la página recuerda y restaura el desplazamiento interno una vez conectado el nuevo contenedor.

El Atlas mantiene `max-height:65vh` y `overflow-y:auto`, con barra visualmente oculta mediante `scrollbar-width:none` y `::-webkit-scrollbar`. El contenedor admite foco por teclado. Atlas y grupos de tienda usan `overscroll-behavior:auto`: el desplazamiento nativo puede continuar hacia la página en ambos extremos. No hay controladores de rueda ni desplazamiento manual paralelo. Como en cualquier lista nativa, al eliminar contenido el navegador limita `scrollTop` al máximo restante; no se agrega espacio vacío para conservar una posición que deja de existir.

Los únicos desplazamientos nuevos deliberados corresponden a los botones explícitos «Ir a comprar» y «Ver encargo», no a la expansión normal del Atlas.

## Dificultad de obtención en el Diario

El selector real usa especies de la zona, requisito de Pesca, capacidad mínima de la caña y pesos relativos normalizados. Las especies con `rarity` reciben el multiplicador de suerte; las demás usan la fórmula existente de nivel/dificultad con mínimo 0,12. Se conserva el factor histórico 0,42 del atún. No hay condiciones adicionales de clima, cebo, misión u horario en esa selección actual. La calidad del ejemplar y su valor no determinan la rareza de aparición de la especie.

«Más difíciles de conseguir», ahora predeterminado, usa una referencia constante:

- Nivel 100 y suerte 0.
- Capacidad suficiente para todas las especies, sin excluir peces por el equipo actual.
- Se normalizan los pesos reales de cada zona; para especies presentes en varias zonas se toma la zona más favorable, es decir, su mayor probabilidad de referencia.
- Primero la menor probabilidad de referencia. En empate, mayor requisito de acceso de esa ruta favorable (`max(zona.req, especie.req)`), luego nombre español e ID.

Esto ordena la dificultad de **encontrar** una especie con acceso completo; no es una predicción de la sesión ni una clasificación de dificultad de mover la barra. La explicación del selector lo aclara y no se muestra un porcentaje como probabilidad actual. Los otros siete ordenamientos y filtros se conservan. El Diario sigue mostrando exclusivamente especies descubiertas.

La fórmula de pesos se extrae literalmente a una función compartida entre selección y referencia. No se modifican probabilidades ni se consume azar para ordenar.

## Tienda y selector de equipamiento

La Tienda elimina la opción «Mis cañas primero» y usa precio ascendente por defecto, conservando sus tres grupos, los órdenes por estadísticas y el filtro reversible «Mis cañas». Las recomendaciones independientes del selector siguen intactas.

En el selector, «Solo mis cañas» se combina con búsqueda y orden. Al equipar, el selector permanece abierto, conserva los filtros y actualiza comparaciones, selección y estado. Las cañas no obtenidas conservan su botón de equipamiento deshabilitado, pero tienen un botón de consulta independiente. Los requisitos reales se distinguen de la simple falta de propiedad; no se crean requisitos a partir de los niveles orientativos de los grupos.

- **Ir a comprar:** cierra el selector, abre la Tienda, limpia los filtros que ocultarían el destino, abre su grupo y destaca la fila. No compra ni cambia el oro; permite consultar aunque falte dinero.
- **Ver encargo:** abre en el Atlas los objetivos reales, progreso, requisito y recompensa. La asociación usa el ID de la caña en las definiciones derivadas, no coincidencias de nombres. No cambia la zona ni detiene la pesca; tampoco entrega peces, reclama o concede premios.

El resaltado temporal respeta movimiento reducido. Los datos de consulta son derivados; no se añaden campos a guardados v7.

## Ilustraciones y HUD

Se conserva exactamente el mismo recurso gráfico de seis ilustraciones. El encuadre CSS acerca los motivos, reduce la máscara que los oscurecía y aumenta moderadamente contraste y tamaño visible dentro del espacio existente. Atlas, Diario y Tienda cerrados siguen midiendo 46 px; el botón de lanzar conserva su tamaño. No se generan recursos nuevos ni se reemplazan las ilustraciones grandes.

Los 119 recursos de imagen embebidos coinciden con Estable 21. La hoja `fishing-hud-css` permanece idéntica byte por byte. Se comparan los 13 rectángulos del HUD con la referencia guardada: altura 118 px, mismas secciones, barra y dimensiones en 1366 y 390 px.

## Verificación

- Suite completa: **99/99 aprobadas**. Dos pruebas adicionales de scroll con catálogo ampliado, teclado y tacto: **2/2 aprobadas**.
- `npm run audit`: sintaxis de 61 scripts y límites de 67 bloques de estilo correctos.
- Pruebas de navegador Chromium, con perfiles temporales independientes y anchos 1366 y 390 px: filtros, órdenes, navegación a compra/encargo, consulta durante pesca activa, requisitos, comparación al equipar y scroll mediante rueda, teclado y eventos táctiles del navegador.
- Pruebas de catálogo ampliado solo en el navegador de prueba: la versión distribuida no suma contenido.
- Regresiones existentes: selección aleatoria, minijuego, captura, XP, combate, cinco personajes, IndexedDB/localStorage, exportación/importación JSON, carga, récords y guardados v7.
- Se revisaron capturas de pantalla de escritorio y móvil para las ilustraciones y el HUD. No se probó un teléfono físico.
- No se ejecutó Firefox: no está instalado y la descarga del navegador de Playwright fue rechazada con HTTP 403 por el proveedor de red del entorno. Se incluyen las reglas estándar y WebKit para ocultar la barra, pero no se afirma una comprobación ejecutada en Firefox/Safari.
