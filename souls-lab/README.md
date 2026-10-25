# Argentum Souls Lab — prototipo separado

## Estado
Primera iteración jugable para estudiar el *feeling* de entrenamiento y arena inspirado en la estructura de Swords and Souls (Flash). **No es todavía la versión artística ni de balance final.**

- Entrada de desarrollo: `souls-lab/index.html` (abrir por servidor HTTP junto a `feel.js`).
- Vista descargable: `souls-lab/standalone.html` contiene ambos scripts integrados; descargar y abrir con doble clic, sin servidor ni conexión. Es una copia de prueba, **no editarla**: los cambios deben realizarse en `index.html` / `feel.js` y luego regenerar la copia.
- Código base: HTML que aportó el usuario, conservado y mejorado sin modificar Estable 35.
- Mejora incremental: `souls-lab/feel.js`. No requiere bundler ni librerías externas.
- El juego principal permanece en `src/` y en el `index.html` raíz; no hay vínculo ni cambio en sus 143 bloques.
- El progreso del laboratorio se guarda en `localStorage['argentum_souls_fiel_v2']`, **no** en el guardado v7 de Argentum Idle.
- `window.ArgentumSoulsBridge.exportProgress()` devuelve un objeto simple con estadísticas, equipo, estaciones, monedas y victorias para diseñar un adaptador de integración posterior. **No importar automáticamente este objeto al save v7**.

## Mecánicas de esta iteración
1. **Fuerza:** tres alturas de manzanas, estrella trasera, barrido de espadazo que puede cortar varios objetos, encadenado rápido, desplazamiento y partículas.
2. **Defensa:** orientación continua del escudo con puntero, bloqueo por ángulo y efectos de impacto.
3. **Precisión:** objetivos temporizados, clic, centro perfecto, blancos móviles y partículas.
4. **Esquiva:** señales por dirección, respuesta con flechas, salto/agachada/dash.
5. **Crítico:** calavera de amague (esperar), exclamación para saltar, segunda pulsación en el aire para conectar.
6. **Combo:** fallar reinicia combo, perfectos bonifican, misión por disciplina.
7. **Arena:** selector de 3 o 5 rivales, jefe final, ataque automático con habilidades, recompensas, escalado básico.
8. **Tienda:** equipo y estaciones que bonifican el entrenamiento.
9. **Controles:** teclado, puntero, botones táctiles y sonido activable.

## Antes de integrarlo
- Comparar fotograma a fotograma contra referencias grabadas de la versión Flash: anticipación, animación, ventanas de impacto, velocidades, escalado y cancelaciones.
- Sustituir figuras geométricas y emojis provisionales por personajes y arte **originales**, con animaciones consistentes.
- Probar en navegador real a 1366px y 390px, sonido, teclado y touch. Esta iteración tuvo **verificación de sintaxis y prueba simulada de lógica/DOM**, no una inspección visual en navegador real.
- Diseñar niveles, economía, progresión de rivales y balance con datos medibles; la curva actual es provisional.
- Diseñar adaptador de estado con migración/compatibilidad v7, sin tocar datos históricos ni duplicar monedas o niveles.
- Elegir qué pestañas del Idle se reemplazarán **después** de validar este prototipo; no borrar ninguna en esta rama.

## Flujo de desarrollo
Trabajar exclusivamente en `souls-lab/` para iterar los minijuegos. Al integrarlo, dividir lógica de combate, entrenamiento, economía y presentación en módulos compatibles con el build de `src/` y agregar pruebas de persistencia, navegador y regresión. No incorporar directamente el HTML prototipo dentro del `index.html` generado.
