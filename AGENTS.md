# Argentum Idle Online — Estable 41

Leer docs/ARQUITECTURA.md y docs/PARA-CLAUDE.md. Editar src, no index.html generado; ejecutar npm run build y versionar ambas cosas cuando cambie el juego.

Mantener orden de src/blocks.json y src/template.html. Scripts clásicos globales, alias capturados y módulos del iframe no son intercambiables. Investigar dependencias antes de quitar código histórico. No agregar wrappers de versión para resolver problemas rutinarios.

Conservar v7, campos desconocidos, personajes, inventario, oro compartido, claims, registros, cañas horizontales y HUD inferior. No cambiar balance ni mecánicas por una optimización. No borrar recursos originales sin demostrar que están sin uso. No tocar partidas reales para probar.

Validación: npm run test:fast para fuentes/build, npm run test:smoke para entrenamiento/encargos/archivo directo y npm run test:full para integración transversal. Las pruebas funcionales no demuestran FPS estables. Medir rendimiento con escenarios iguales antes/después. Capturas desktop/móvil solamente cuando cambie el diseño. No declarar una suite completa aprobada por pasar un subconjunto.

Trabajar en rama de revisión; no hacer commit/push directo a main sin aprobación explícita para esa tarea. No fusionar PR automáticamente. No subir node_modules, partidas reales ni capturas temporales. Los archivos para Claude de la carpeta original deben conservarse por pedido de Mariano.
