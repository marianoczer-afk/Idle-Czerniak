# Diario de Pesca — Estable 18

El Diario reúne únicamente especies capturadas: ilustración existente, capturas, peso máximo y mejor categoría. Su ficha se inserta después de la fila seleccionada y se recoloca al cambiar el ancho de pantalla. Una segunda selección cierra la ficha; otra especie la reemplaza.

El guardado v7 conserva `ui.fishingWeights.bySpecies[id].bestKg` y las cantidades previas. La categoría histórica `e18Fishing.bySpecies[id].best` indica la mejor categoría conseguida, pero no la categoría del ejemplar más pesado. Por eso no se utiliza para inventar récords por categoría ni etiquetar el peso absoluto histórico.

Las próximas capturas añaden `categoryBestKg` (normal, large, huge, legendary) y `bestCategory` cuando superan el peso máximo absoluto. El registro utiliza el peso real de la sesión y la categoría del resultado de esa misma captura. No se modifican sorteos, pesos, premios ni fórmulas. No hay migración destructiva ni cambio de versión de guardado.

La colección local conserva especies ocultas, progreso y logro; sus tarjetas descubiertas muestran la ilustración y el nombre, dejando los datos históricos en el Diario. El Atlas conserva sus condiciones y recompensas. Las zonas mencionadas en la ficha se limitan a las accesibles por nivel actual.

Los XP Drops priorizan el contador del HUD inferior y duran un segundo con aparición, desplazamiento de ocho píxeles y desvanecimiento. Se elimina el antiguo brillo verde de captura. Las ganancias cercanas actualizan el texto existente sin reiniciar su animación. Se conservan la celebración dorada de nivel, exclusión de carga/importación/offline y movimiento reducido.
