# Desarrollo vigente — Estable 34

Mapa de sistemas: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md). Hallazgos y plan medido: [docs/AUDITORIA_ARQUITECTURA.md](docs/AUDITORIA_ARQUITECTURA.md).

`index.html` es el juego offline generado. Editar `src/`; no abrir `src/template.html` como juego. Node 24 y `npm ci` bastan para compilar. Chromium/Playwright se usan para navegador; Pillow es opcional para herramientas de imágenes.

```sh
npm run build
npm run test:fast
# Solo si afecta captura/persistencia/migraciones:
npm run test:smoke
# Casos dirigidos de Pesca vigente, con capturas:
npm run test:fishing34
# Integración completa, con fallos históricos conocidos; no confundir con subconjuntos:
npm run test:full
```

`npm run dev` compila una vez y sirve la raíz en el puerto 8000. Reconstruir y recargar después de editar. El build verifica sintaxis, marcadores y hashes, incorpora recursos y escribe atómicamente el HTML. `build:check` no modifica el HTML; `.build-cache/` acelera Base64. `build:profile` imprime tiempos y cantidades a stderr.

No generar ni convertir arte por cambiar lógica. Solo si cambia metadata de encuadres: `npm run art:prepare` y build. La metadata activa combina `arte/produccion-estable31.json` y las adiciones de `arte/produccion-estable34.json`, con 342 encuadres y 44 láminas compartidas. Solo si cambia un PNG elegible: `npm run assets:optimize`; las variantes existentes verificadas por hash se reutilizan. No volver a importar láminas históricas ni regenerar galerías de rutina.

`python3 scripts/package-release.py` prepara un ZIP offline y verifica su contenido; se usa para una entrega de juego, no para cada edición de documentación/herramientas. Pages sirve el `index.html` raíz ya compilado. Los cambios de esta auditoría se preparan en rama de revisión, sin publicar en `main`.

Las notas antiguas, incluidas referencias a catálogos artísticos reemplazados, se conservan en [docs/HISTORIAL_DESARROLLO_25_34.md](docs/HISTORIAL_DESARROLLO_25_34.md). No son instrucciones para regenerar la versión actual.
