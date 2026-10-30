# Revisión de rendimiento de Estable 41

IMPORTANTE: esta rama contiene la versión 41. La referencia anterior main era Estable 35. Las rutas desarrollo/* de la nota siguiente describen la carpeta local previa a la importación. En esta rama usar src/js para bloques del HTML, src/souls para módulos, src/css para estilos y tests para verificadores. Buscar símbolos, no depender de los nombres viejos de archivos.

Primero auditá y medí los tirones. No cambies balance, arte ni mecánicas para esconderlos. No borres ningún archivo de entrega para Claude.

CLAUDE — LIMPIEZA Y OPTIMIZACIÓN DE ARGENTUM IDLE ONLINE

PEDIDO DE MARIANO
Estuve jugando y siento tirones y bajadas de FPS. Quiero que revises y optimices el juego completo, conservando su diseño y sus mecánicas actuales. Necesito cambios concretos, no solamente recomendaciones. Primero medí dónde se gasta el tiempo; después corregí las causas y comprobá el resultado.

CONTEXTO Y ARCHIVOS
Carpeta: C:\Users\Mariano\Desktop\Juegos cz\Pesca
Versión actual: Estable 41, index.html.
No tengo acceso a GitHub. Trabajamos sobre archivos locales.
index.html es autocontenido y debe seguir funcionando al abrirlo directamente en el navegador, sin instalar nada ni levantar un servidor. Actualmente pesa 58.432.044 bytes, aproximadamente 55,7 MiB. Su tamaño puede afectar carga y memoria; no prueba por sí solo la causa de los FPS bajos.

El juego se construyó durante muchas iteraciones sobre un HTML antiguo. Hay capas de scripts y CSS, funciones envueltas o redefinidas y arte embebido. Se integró el otro juego, Argentum Souls, dentro de un iframe srcdoc, con módulos JavaScript embebidos mediante importmap y data URLs.

Estructura:
- index.html: entrega que uso para jugar.
- LEEME.md: funcionamiento y cambios actuales.
- desarrollo/: fuentes de las integraciones, compiladores y verificaciones.
- recursos/: ilustraciones y capturas. El HTML ya contiene los recursos necesarios.
- Entrenamiento/: fuentes originales aportadas de Argentum Souls. Conservar como referencia.
- respaldos/: versiones anteriores y archivos históricos comprimidos.

FUENTES IMPORTANTES PARA ENTENDER LA VERSIÓN ACTUAL
- desarrollo/compilar-41.cjs: parte de respaldos/index-estable40.html, adapta módulos Souls, incrusta arte y agrega las capas 41.
- desarrollo/hud-41.js y hud-41.css: cabecera compacta, ilustraciones de pestañas, paletas de cañas y precios de pesca.
- desarrollo/souls-41.js y souls-41.css: ilustraciones de entrenamiento/equipo y distribución compacta.
- desarrollo/souls-modulos.json: módulos ya adaptados de la integración 39, antes de los ajustes 41.
- desarrollo/souls-modulos-41.json: módulos finales parcheados de la versión 41.
- desarrollo/souls-integrado-41.html: documento del iframe final.
- desarrollo/unificacion-39.js y .css: puente de progreso/oro, integración de pestañas, venta automática y pesca.
- desarrollo/restauracion-40.js: recuperación del HUD inferior y cañas horizontales, corrección del cambio de caña durante la preparación.
- desarrollo/compilar-souls.cjs: documenta las adaptaciones del juego original de entrenamiento.

No recompiles solamente la versión 39: perderías correcciones posteriores. Si reorganizás los compiladores, dejá una única ruta reproducible hacia la entrega final. Evitá arreglar solamente el HTML generado dejando fuentes que reviertan el cambio al compilar.

PUNTOS CONCRETOS PARA PERFILAR (SOSPECHAS, NO CAUSAS DEMOSTRADAS)
1. MutationObserver global en desarrollo/hud-41.js:
   Observa document.body con childList y subtree y ejecuta e241Decorate, que busca las cuatro pestañas. Puede dispararse por cada cambio de cualquier HUD o texto. Sustituir por decoración al construir las pestañas o por observación acotada y agrupada si el perfil confirma trabajo excesivo.

2. MutationObserver en desarrollo/souls-41.js:
   Observa todo #soulsApp con childList y subtree. decorate41 recorre modos, atributos, equipo, tienda, estaciones, encabezados y aviso de nivel. También modifica DOM. El controlador actualiza textos durante el entrenamiento, así que puede haber muchas ejecuciones aunque ningún icono necesite cambios. Integrar el arte en los renderizadores originales y actualizar sólo cuando cambie el estado correspondiente.

3. Data URLs enormes repetidas en estilos:
   art41, gearArt41 y e241Art interpolan el PNG base64 completo en el atributo style de cada icono. Aunque el navegador pueda reutilizar la imagen, se duplican cadenas y atributos muy grandes, y pueden reconstruirse reiteradamente. Definir cada imagen una sola vez por documento con CSS/clases o un mecanismo compartido, manteniendo el HTML autocontenido y las transparencias.

4. Reconstrucción de interfaz:
   Revisar e16Page, e188UpdateHud, updateLive, renderProgress, renderInventory, renderShop y escrituras innerHTML/textContent. En economy.js, renderProgress escribe monedas y reconstruye #skills; otros renderizadores actualizan atributos/avisos con frecuencia. No reconstruir tiendas, listas, imágenes o paneles estáticos dentro del ciclo de animación si sus datos no cambiaron.

5. Animación y simulación:
   Inventariar requestAnimationFrame, setInterval, setTimeout y listeners acumulados por las capas históricas. Comprobar si al cambiar pestañas o personajes quedan bucles duplicados. Entrenamiento y arenas deben pausar correctamente fuera de su pestaña y con la ventana oculta. Mantener el reloj de simulación estable y la precisión de los controles; no acelerar ni ralentizar el juego por depender de los FPS.

6. Canvas y fondos:
   TrainingRenderer dibuja el fondo ilustrado en cada frame. Medir coste de drawImage, resolución interna, escalado, filtros y efectos. Considerar precalcular superficies/fondos estáticos y adaptar resolución con límites razonables, sin degradar gratuitamente las ilustraciones. Evitar asignaciones grandes por frame.

7. Resize/layout:
   El iframe tiene ResizeObserver y un callback a IdleSoulsHost.resize. La versión 41 calcula su alto desde el viewport. Revisar mediciones y escrituras de tamaño, mountStage, canvas y cabecera para evitar ciclos de resize o layout forzado repetido. Medir antes de cambiar.

8. Guardado:
   Revisar persist/saveRoster/commit y la frecuencia del guardado compartido. Agrupar escrituras costosas sin perder progreso ni cambiar el modelo de propiedad por personaje. No guardar estructuras enormes en cada frame. Conservar guardado al salir/cambiar actividad y el comportamiento ante cierre.

9. Capas antiguas y recursos:
   Identificar código y arte realmente sin uso antes de retirarlos. No borrar funciones antiguas sólo porque tienen un prefijo de versión anterior: algunas están capturadas y llamadas desde wrappers nuevos. Distinguir también secciones ocultas que todavía sostienen lógica de progreso. Primero crear respaldo y mapa de dependencias.

QUÉ DEBE CONSERVARSE
- Personajes, oro, inventario, cañas obtenidas, encargos reclamados, colecciones, récords y XP.
- Guardado principal v7: localStorage con clave argentum-idle-save-v1 e IndexedDB argentum-idle. Revisar implementación real antes de tocar serialización.
- state.ui.souls contiene el progreso del juego integrado; state.gold es el oro compartido. No crear un segundo monedero independiente.
- Una sesión vieja del iframe no puede modificar ni gastar el oro de otro personaje.
- Importar el mismo progreso Souls no duplica monedas.
- Cuatro pestañas visibles: Pesca, Entrenamiento, Arenas, Equipo y sala.
- HUD inferior de pesca: zona, caña horizontal, última captura y XP. Tiene que volver al regresar de entrenamiento/arenas/tienda.
- Cañas horizontales anteriores y sus paletas. No reemplazarlas por los dibujos verticales de otra iteración.
- La burbuja aparece automáticamente y se explota para iniciar. Se puede cambiar caña durante la preparación: abrir tienda/selector pausa las burbujas. Durante una captura real no se cambia equipo.
- Se puede reclamar Faro de las Tinieblas y otros encargos mientras espera una burbuja. Mantener bloqueo durante una captura activa y evitar recompensas duplicadas.
- Capturas nuevas se venden automáticamente una sola vez y dejan comprobantes de especie para los encargos. Los comprobantes se consumen una vez; las capturas históricas no se borran. Los peces guardados anteriores se pueden vender desde configuración sin duplicar oro.
- Mantener el balance actual durante la optimización. La versión 41 paga entre 15% y 40% más por pez según nivel; equipo/estaciones cuestan 25% menos que en 40 y sala aproximadamente 33% menos. No volver a multiplicar precios al reconstruir la UI.
- Cinco minijuegos de entrenamiento. Primer fallo que rompe combo produce destello rojo; los fallos siguientes con combo cero no repiten destello. Un acierto lo rearma. No volver a la interrupción de tres fallos.
- Avisos de nivel compactos fuera del campo de las manzanas. Esquiva acelera más con el combo y la patada mantiene las longitudes de articulaciones.
- Cien arenas, cuatro enemigos por arena, ataques alternados, velocidad x3 y siguiente arena directa tras ganar. No duplicar primer premio al repetir.
- Estética medieval pintada como las zonas de pesca, no fotorrealista ni genérica. Equipo inicial usado, mejoras progresivamente más cuidadas: ilustración cambia en 0–4, 5–9 y 10+. La realeza azul/dorada se reserva para mucho más adelante. No hacer todo marrón.

FORMA DE TRABAJO Y ENTREGA
1. Respaldar el HTML actual antes de editar. No tocar ni borrar partidas reales del navegador para las pruebas.
2. Perfilar pesca, captura activa, entrenamiento (especialmente Defensa y Esquiva), arenas y tienda. Registrar mismo equipo, viewport y secuencia antes/después. Incluir tiempos de frame, frames lentos, tareas largas y memoria si están disponibles. Separar coste de carga inicial de caídas de FPS durante juego.
3. Resolver primero el trabajo repetitivo por frame, observadores amplios y reconstrucciones DOM. Consolidar capas gradualmente con pruebas, sin una reescritura enorme a ciegas.
4. Mantener pruebas en contextos de navegador aislados. Hay verificadores existentes: desarrollo/verificar-40.cjs y verificar-41.cjs, y resultados VERIFICACION-40.json y VERIFICACION-41.json. El verificador 39 cubre integración adicional pero tiene expectativas económicas antiguas: adaptar sus números de manera razonada antes de usarlo sobre 41.
5. Los verificadores 40 y 41 pasaron 49 comprobaciones funcionales en la entrega anterior. Eso NO fue una medición de FPS ni demuestra buen rendimiento. Agregar mediciones de rendimiento reales y no prometer una tasa sin medir.
6. Probar apertura directa de index.html, recarga, cambio de personaje, guardado, cambio entre las cuatro pestañas, selector de cañas, reclamo del faro y uso en PC/móvil. Revisar consola y crecimiento de listeners/DOM/memoria tras cambiar pestañas repetidamente.
7. Dejar index.html listo para jugar y fuentes actualizadas. Mantener la carpeta raíz ordenada. No borrar respaldos ni originales aportados de Entrenamiento como parte de una limpieza automática.
8. Entregar resumen breve: causas confirmadas, cambios hechos, cifras comparables antes/después, verificaciones ejecutadas y problemas que queden. Si no podés medir FPS en tu entorno, aclararlo y dejar instrumentación/instrucciones concretas para medir; no inventar una mejora porcentual.

OBJETIVO FINAL
Que se sienta fluido conservando lo que ya construimos. Prioridad a FPS estables, respuesta inmediata de controles y menos tirones, sin perder progreso ni sacrificar el HUD o el arte para esconder el problema.

