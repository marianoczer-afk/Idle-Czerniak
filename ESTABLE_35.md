# Estable 35 — Pesca

- El nombre de la caña conserva sombra de texto y deja de oscurecer toda la franja superior del arte. HUD fijo de 118px.
- El escenario, la pista y las burbujas reutilizan la ilustración de la zona actual. Sin imágenes nuevas para los fondos ni cambios de geometría.
- Nueve encargos complementarios de largo plazo, fuera de Río del Bosque. Usan especies existentes y no consumen peces. Recompensas globales máximas nuevas: +2% XP, +0,4 puntos porcentuales de barra, +1 Resiliencia, +1 Atracción y +3 Suerte. No sustituyen las mejoras regionales y recompensas anteriores.
- Las mejoras se derivan de los flags de reclamo v7: guardar/cargar no vuelve a sumarlas. Los objetivos de categoría usan únicamente cantidades registradas; un récord antiguo no inventa ejemplares. Las capturas por especie siguen siendo locales; las categorías usan el contador global registrado de esa especie.
- Filtros de Trofeos compactos con las mismas opciones y ordenamientos.
- Ocho retratos pulidos: caballito, lucio, trucha, salmón, pez de cristal y variantes legendarias de mantarraya, trucha y perca esmeralda. Un atlas compartido; originales anteriores conservados. No son pinceladas CSS sobre el pez.
- Giros más cortos y amagues durante los cruces, donde antes se fijaba la dirección durante toda la escapada. Los atributos, precios y capacidad de las cañas, probabilidades de calidad/especie, entrada del jugador y fórmulas de ganancia/pérdida de captura se conservan. La bonificación de Suerte solo se obtiene tras reclamar su nuevo encargo.

Código: módulos consolidados `page/render.js`, `hud/update.js`; controlador vigente en `052-e190-polish.js`; datos de los nuevos encargos en `src/catalogs/fishing-mastery.js`. Sin nuevos envoltorios de página o HUD. Combate y otras habilidades no cambian; las únicas modificaciones del núcleo/UI general son los rótulos de versión.

Verificación: `npm test` terminó con 180/180 casos aprobados, sin omisiones (Chromium de escritorio y móvil simulado). Incluye nuevas recompensas, reclamos duplicados, importación/exportación v7, datos históricos, simulación de seguimiento, controles y HUD de 118px. Los siete fallos de la primera integración se resolvieron: uno de alcance visual duplicado en dos anchos y expectativas del gradiente/cantidad de encargos. ZIP verificado por CRC y comparación exacta con el HTML probado. Capturas: `arte/verificacion/estable35/`. No se probó en un teléfono físico.

Tras el retoque final de contraste de la pista se repitieron las siete pruebas dirigidas de presentación y compatibilidad: también aprobaron.

El Santuario otorga Suerte en lugar de XP: su objetivo prolongado puede terminarse al nivel 100, cuando una bonificación de experiencia dejaría de aportar progresión inmediata. Las cinco pruebas de las novedades se repitieron tras este ajuste de datos.
