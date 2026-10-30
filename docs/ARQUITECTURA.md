# Arquitectura de la importación 41

Esta importación reemplaza las fuentes activas 35 por una extracción verificable de la entrega local 41. No consolida ni optimiza sus capas históricas.

- src/template.html conserva exactamente la estructura y ubicación de scripts y estilos.
- src/blocks.json define el orden de bloques clásicos. src/js y src/css contienen sus cuerpos. No tratarlos como módulos ES ni cambiar orden de ejecución.
- src/souls/document.html es el documento del iframe. src/souls contiene los módulos del juego integrado, con nombres legibles. El importmap se reconstruye al compilar.
- src/embedded.json relaciona marcadores con assets y módulos. src/embedded y assets/embedded contienen recursos extraídos. Las referencias {{asset:ID}} se resuelven al compilar; no son URLs en ejecución.
- scripts/build.cjs reconstruye los recursos embebidos y el HTML. El SHA de src/release.json identifica la importación exacta antes de optimizar. Si un cambio futuro autorizado altera la entrega, actualizar ese contrato de forma explícita, con pruebas y explicación.
- Buscar por símbolos en src/js para la pesca; por rutas en src/souls/training, progression, combat para el juego integrado. Los alias capturados de funciones antiguas pueden seguir activos.

La separación de recursos reduce el tamaño de los archivos fuente para revisión. El HTML entregable mantiene sus 58.432.044 bytes originales: esto todavía NO es una optimización de FPS.
