# Limpieza del repositorio — Estable 35

## Limpiezas incorporadas a main

- PR #3: retirados los ZIP compilados de Estable 28 a 34 (~105 MiB).
- PR #4: retiradas 371 capturas historicas de verificacion de Estable 26 a 34 (~100 MiB).
- PR #5: retiradas tres muestras graficas historicas de Estable 23/29 (~6.3 MiB).

Estas eliminaciones afectan al arbol de trabajo actual, no reescriben el historial Git. Los archivos siguen recuperables desde commits anteriores. Algunos enlaces historicos a descargas o capturas de esas versiones ya no funcionaran en main.

## Elementos preservados intencionalmente

- `index.html` y `descargas/argentum-idle-estable35.zip` para jugar/descargar la version actual.
- `src/`, `scripts/`, `tests/`, `assets/manifest.json`, `assets/originals/`, `assets/optimized/`, `assets/runtime/`, `assets/illustrations/`.
- `arte/produccion-estable31.json` y `arte/produccion-estable34.json`, utilizados por `scripts/production-art.cjs`.
- Capturas de Estable 35 para la validacion actual, y los documentos/galerias historicas livianos para consulta.

Se compararon las cuatro carpetas `assets/` con `assets/manifest.json`: todos los archivos de esas carpetas aparecen referenciados por el manifiesto. Esto NO prueba que cada imagen sea visible en el juego, pero impide clasificarlas como sobrantes de manera segura.

## Evitar volver a acumular peso

- No versionar capturas temporales ni nuevas galerias de pruebas por defecto; publicar solo las evidencias puntuales necesarias.
- Mantener en `descargas/` unicamente el ZIP de la version vigente. Distribuciones antiguas pueden archivarse fuera del arbol activo (por ejemplo en Releases).
- No ejecutar generacion/optimizacion de arte para cambios de logica o CSS que no lo requieran.
- No reescribir el historial Git para ahorrar espacio sin un respaldo externo verificado, una ventana de mantenimiento y un plan para reconfigurar clones y ramas.
- Para medir el impacto real sobre Codex, registrar por separado tiempos de checkout, lectura de archivos, edicion, arte, pruebas y publicacion. La limpieza por si sola no garantiza sesiones mas rapidas.

## Alcance de la verificacion

Se verificaron los paths y manifiesto en GitHub, asi como la incorporacion de cada PR a main. No se ejecutaron las pruebas automatizadas del juego ni se midieron tiempos de Codex desde esta limpieza. Ningun archivo de codigo o recurso runtime fue modificado.
