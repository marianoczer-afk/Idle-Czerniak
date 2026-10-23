# Estable 27 · interfaz general y expansión de Pesca

Base: Estable 26, commit `7f253b9`. Las fuentes siguen siendo `src/` y los recursos `assets/`; `index.html` es exclusivamente la distribución generada.

## Qué cambia

Cabecera de dos filas: identidad, clase/raza, nivel y XP **general** a la izquierda; marca a la derecha; pestañas y configuración debajo. Usa `state.xp`, `levelFromXp` y `xpFor`, sin nuevas fórmulas. Por ejemplo, nivel 6 con 800 XP dentro del nivel muestra **800 / 1.702 XP**. La XP de Pesca sigue separada. El `+X XP` superior se superpone durante 1,75 s; no reserva espacio, no aparece por cargar/importar y no concede experiencia.

Configuración reúne los controles originales de JSON, descarga completa, copia completa, enlace a Estable 26, cambio/eliminación de personaje, estado técnico del guardado y DEV. Se conserva el autoguardado y su señal de error; no existe botón de guardado manual. No se reescribieron IndexedDB/localStorage. Se eliminan los controles redundantes del lateral; Descansar, con su botón y validaciones originales, y las estadísticas de sesión quedan en Combate. El menú admite Escape y clic exterior; las pestañas conservan teclado y desplazamiento horizontal en móvil.

El HUD inferior mantiene **118 px**, posición y distribución. Su hoja CSS permanece idéntica a la base; las pruebas geométricas siguen pasando. El HUD de Combate no se rediseña. El acceso deliberado desde el último pez descuenta ahora la cabecera completa para mostrar correctamente la XP de Pesca.

## Contenido real incorporado

| Zona nueva | Acceso | Especies propias y niveles | Compartida |
|---|---:|---|---|
| Ruinas Sumergidas | 88 | Gobio rúnico 88; Nautilo de bronce 90; Congrio del archivo 92 | Calamar abisal |
| Cavernas de Cristal | 94 | Tetra prismático 94; Ajolote de cuarzo 96; Esturión geoda 97 | Pez de cristal |
| Abismo Primordial | 99 | Isópodo fósil 99; Quimera de ámbar 99; Titán ammonita 100 | Pez linternilla |

Total: **13 zonas, 50 especies, 50 ofertas de cañas entre 90 IDs históricos, 32 encargos**. No se agregan cañas: Astral y las especializaciones existentes cubren los pesos; no se tocan sus estadísticas ni precios. Santuario sigue entrando en 85, conserva sus especies exclusivas hasta 98, XP/oro y encargos. La nueva especie mítica requiere nivel 100 y completa colección; no bloquea las misiones ni otras zonas.

### Siete encargos nuevos

Todos cuentan progreso histórico, no consumen peces y se reclaman una sola vez. La insignia queda en la ficha del Atlas. Se conserva exactamente el contenido de los 25 encargos anteriores.

| ID / encargo | Zona | Objetivos | Premio |
|---|---|---|---|
| `manglar_cartografo` · Cartógrafo de las raíces | Manglar | Descubrir sábalo y arquero; 10 capturas locales | Insignia + 1.200 oro |
| `manglar_salto` · El salto entre raíces | Manglar | Tarpón de 40 kg; 3 especies | Insignia + 2.500 oro |
| `volcan_cuaderno` · Cuaderno de ceniza | Volcán | Descubrir pez de fumarolas y mero; 8 capturas locales | Insignia + 3.000 oro |
| `volcan_guardian` · Guardián de la bahía | Volcán | 3 especies; 15 capturas; récord local de 100 kg | Insignia + 5.000 oro |
| `ruinas_censo` · El censo del archivista | Ruinas | 18 capturas locales; 2 especies propias | Insignia + 6.000 oro |
| `cristal_bitacora` · Luz bajo la piedra | Cristal | Descubrir tetra y ajolote; ajolote de 4 kg | Insignia + 8.500 oro |
| `primordial_sondeo` · El último sondeo | Primordial | 25 capturas locales; 2 especies propias; récord local de 150 kg | Insignia + 12.000 oro |

Cristal y Primordial se diferenciaron de la propuesta inicial para evitar tres misiones iguales con otro contador. El ajolote y la quimera son capturas accesibles; no se exige esturión geoda ni Titán. Los niveles efectivos de los encargos intermedios derivan de sus especies: arquero 54, tarpón 60, mero 76 y tercera especie volcánica 79. No se agrega un requisito de nivel artificial.

### Aparición y dificultad

Se conserva la fórmula de pesos relativos y suerte de Estable 26. **`rarity` no es un porcentaje directo.** Se midió la distribución normalizada y se ajustaron únicamente los pesos de las especies nuevas: congrio .025, ajolote .035, geoda .0125, quimera .035 y Titán .006. La primera combinación hacía al congrio más frecuente que los comunes con suerte alta; la calibración evita ese resultado. No se cambia ningún pez antiguo ni la probabilidad dentro de sus zonas originales.

En `arte/verificacion/estable27/distribuciones.json` están las probabilidades efectivas con Astral/nivel 100, además de 10.000 selecciones reproducibles por zona. Todas suman 1 y la desviación medida queda por debajo de 2,5 puntos porcentuales. No son porcentajes universales: cambian con nivel, capacidad y suerte. Se verificaron también desbloqueos 87/88, 93/94, 98/99 y 100.

XP/oro base nuevos quedan entre 1.080–2.600 XP y 1.650–6.500 oro, por debajo del Guardián histórico (2.800 / 7.500). No se promete igualdad de rentabilidad por minuto: las duraciones y decisiones del jugador varían. Los perfiles nuevos diferencian carreras del congrio, cambios cortos del tetra y persistencia del Titán, sin modificar el motor ni perfiles anteriores. La valoración final del desafío necesita sesiones de juego del usuario.

## Compatibilidad de maestrías

La migración lee el catálogo congelado de Estable 26 por ID, incluyendo sus 25 encargos y las reglas de Manglar/Volcán sin principales. Antes de aplicar el nuevo conjunto, acredita los hitos que esos registros ya demuestran. Añade únicamente `ui.fishingMasteryVersion`, `ui.fishingMasteryEarned` y, al reclamar, `ui.fishingQuestRewards`; se conserva v7 y los campos históricos/desconocidos.

Las estrellas se combinan con los bits ya acreditados mediante OR; nunca se restan. Los cuatro encargos intermedios son **complementarios** y no entran en el denominador de maestría. Las tres zonas nuevas tienen un encargo principal cada una. Una misión futura sin clasificación explícita no se convierte automáticamente en principal. Nuevas estrellas ganadas se acreditan antes de serializar el autoguardado.

Se probó importación JSON real de cinco personajes anteriores a la extensión, incluidos inactivos: oro, XP, inventario, equipo, campos desconocidos y medallas conservados; idempotencia y recarga verificadas. No se tocaron perfiles del usuario.

## Arte integrado

Se crearon **116 ilustraciones**: 50 peces, 50 cañas, 13 paisajes y 3 recursos de interfaz (lateral, flotador y agua del minijuego). Son ilustraciones generadas e integradas, **pendientes de tu revisión artística**, no placeholders presentados como definitivos. Reemplazan las representaciones activas anteriores de peces/cañas y los paisajes; los archivos antiguos se conservan, incluyendo el arte de las 40 cañas históricas. Las seis ilustraciones compactas de cabeceras ya existentes se mantienen; los textos siguen siendo HTML.

Cada entidad tiene un SVG individual editable que encuadra su ilustración sin deformarla. Se comparten **12 atlas** para incrustar cada imagen nueva una sola vez. Los límites se revisaron visualmente y se utiliza clipping explícito para impedir que aparezcan fragmentos de celdas vecinas. El pez y la caña se muestran con `meet`; los paisajes usan `slice` para cubrir su espacio sin estirar. Los SVG individuales referencian su original compartido: no duplican el PNG entero en 116 archivos.

Originales PNG intactos; runtime WebP calidad 90, mismas dimensiones, sin reducir resolución. Esto es compresión con pérdida controlada, **no** conversión píxel idéntica; las tres conversiones antiguas sin pérdida continúan identificadas por separado. Galería de todas las ilustraciones: `arte/galeria-estable27.html`, sin acceso a partidas. Manifiesto de producción actualizado y capturas de las tres categorías guardadas.

## Tamaño y rendimiento

| Medida | Estable 26 | Estable 27 |
|---|---:|---:|
| HTML completo | 10.618.382 bytes | 16.191.156 bytes |
| Recursos únicos runtime decodificados | 7.522.958 bytes | 11.643.338 bytes |

El HTML crece 5.572.774 bytes por el catálogo artístico y los módulos nuevos. Las 12 imágenes nuevas suman 30.931.571 bytes originales y **4.120.380 bytes runtime**. Todos los originales y variantes, conservados para desarrollo, suman 50.982.322 bytes, sin contar SVG/manifiestos/galería/capturas.

Medición enfocada: seis finalizaciones de salmón, viewport 390 px y CPU Chromium limitada a 4×, descartando el primer calentamiento para la mediana: Estable 26 **167 ms**, Estable 27 **189 ms**; máximo observado de esta última 218 ms. No mide un teléfono físico ni demuestra rendimiento igual en todos los dispositivos. Datos en `arte/verificacion/estable27/rendimiento.json`. No se agregan observadores globales de mutaciones ni bucles de animación para el arte; se reutilizan el ciclo de página y las cachés existentes.

## Verificación y límites

Suite completa: **126 pruebas aprobadas, cero fallos**. Después de calibrar aparición se repitieron las 8 pruebas de expansión; después del ajuste final de encuadres/clipping, las 11 de build y expansión también aprobaron. Se verifican cabecera/configuración, navegación y teclado, guardado/error, importación de cinco v7, descargas, DEV, descanso/combate, minijuego, cañas, Atlas, registros, XP y dimensiones del HUD en Chromium escritorio/móvil simulado. `build`, `build:check` y auditoría de sintaxis aprobados.

La apertura directa file:// y el despliegue remoto de Pages tienen las limitaciones del entorno administrado ya documentadas: no se afirma una prueba local desde disco ni un teléfono físico. El HTML descargado sí se inicia sin fuentes ni imágenes externas mediante el servidor aislado de pruebas. Las probabilidades antiguas y el HUD se contrastan con regresiones y huellas de fuente; los módulos intervenidos se declaran expresamente en la prueba de integridad.

Verificación final de entrega: cuatro pruebas adicionales de cabecera/configuración y ambas descargas aprobadas tras pulir el indicador de error y la hora del último guardado. El build también rechaza encuadres fuera del atlas, IDs duplicados o un catálogo de encuadres desactualizado. Las capturas finales están en `arte/verificacion/estable27/`.
