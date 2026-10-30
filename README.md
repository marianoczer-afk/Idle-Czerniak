# Argentum Idle Online — Estable 41

**Revisión de rendimiento 1:** ilustraciones compartidas y menos reconstrucción de interfaz. Mediciones, condiciones y límites en [docs/RENDIMIENTO-41.md](docs/RENDIMIENTO-41.md). El aspecto, las mecánicas y los datos del jugador se conservan.

Versión actual de Pesca, Entrenamiento, Arenas y Equipo y sala. Abrí index.html directamente para jugar. No requiere servidor.

Las fuentes reconstruyen exactamente la versión local 41, sin optimización de rendimiento ni cambios de mecánicas en esta importación. Las versiones anteriores se conservan en el historial Git. Los TXT para Claude permanecen en la carpeta local original.

## Para trabajar

Leer docs/ARQUITECTURA.md y docs/PARA-CLAUDE.md. Node compila sin dependencias: npm run build. npm run build:check verifica equivalencia. npm run test:fast comprueba bytes y SHA-256.

Para las pruebas de navegador: npm install, npx playwright install chromium, npm run test:full. En Windows se puede usar Edge existente con la variable PLAYWRIGHT_CHANNEL=msedge. Usar perfiles aislados, nunca partidas del jugador.

No editar el HTML generado: editar src y compilar. El contenido del iframe está en src/souls, sus módulos siguen embebidos al compilar. No hace falta leer los Base64 de index.html.
