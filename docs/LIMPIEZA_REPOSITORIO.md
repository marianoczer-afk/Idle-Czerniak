# Limpieza conservadora del repositorio

Se retiraron del arbol de trabajo los ZIP de distribucion de Estable 28 a Estable 34. Son compilados historicos, no fuentes de codigo. Estable 35, `index.html`, `src/`, `assets/`, `tests/` y las ilustraciones originales se conservan.

Las versiones historicas siguen recuperables desde commits anteriores de Git. Esta operacion no reescribe el historial y por lo tanto no reduce automaticamente el tamaño total de la base Git ni garantiza reducir el tiempo de Codex.

No borrar `assets/originals`, `assets/runtime`, `assets/optimized`, `assets/manifest.json` ni los recursos del build sin analizar sus referencias. Los archivos `arte/verificacion/` y galerias historicas quedan pendientes de una segunda revision, ya que pueden ser evidencia o estar enlazados desde documentacion.

Para evitar nuevo crecimiento, publicar solamente el ZIP de la version actual en `descargas/` y conservar versiones antiguas fuera de la rama principal o como artefactos de GitHub Releases.
