# Cierre de Pesca: propuesta pendiente, sin contenido nuevo instalado

Base: Estable 25 (`404c184`). Conservamos el inventario ya auditado: 10 zonas, 41 especies únicas / 48 pertenencias, 50 ofertas entre 90 IDs históricos, 25 encargos. No se repitió una auditoría de balance; se reutilizan `PROPUESTA_PROGRESION.md`, `BALANCE_PESCA.md` y el inventario, actualizado automáticamente para vincular recursos.

## Tres destinos opcionales

La propuesta legible por herramientas está en [`arte/propuesta-expansion26.json`](arte/propuesta-expansion26.json): identifica cada especie, peso, XP/oro base orientativos, dificultad, equipo existente y encargo. **Son valores para prototipar, no probabilidades ni cambios aplicados.** Serían 9 especies nuevas (50 totales), ninguna caña nueva.

| Destino / acceso | Identidad y especies propias | Compartida / equipo sugerido | Encargo y premio propuesto |
|---|---|---|---|
| Ruinas Sumergidas · 88 | Archivo submarino de bronce. Gobio rúnico 88, Nautilo de bronce 90, Congrio del archivo 92 | Calamar abisal; Astral / Juramento Abisal · Pulso | Censo: 18 capturas locales y 2 especies propias descubiertas. Insignia + 6.000 oro |
| Cavernas de Cristal · 94 | Cuarzo violeta, fauna translúcida inquieta. Tetra prismático 94, Ajolote de cuarzo 96, Esturión geoda 97 | Pez de cristal; Aurora Glacial o Pacto Boreal · Cauce; Astral viable | Bitácora: 22 capturas locales y 2 propias. Insignia + 8.500 oro |
| Abismo Primordial · 99 | Bioluminiscencia ámbar y fósiles. Isópodo fósil 99, Quimera de ámbar 99, Titán ammonita 100 | Pez linternilla; Astral / Bóveda Celestial · Pulso / Legado · Titanes | Sondeo: 25 capturas locales y 2 propias. Insignia + 12.000 oro |

Cada zona tendría cuatro especies contando la compartida: estrella 1 con dos descubiertas, estrella 2 con su único encargo principal, estrella 3 con cuatro. El mítico final se pide para colección, nunca para desbloquear la pesca ni el siguiente destino. El Santuario sigue entrando en 85, conserva su carpa/cometa/raya/guardián exclusivos y sus hitos 93 y 98; no se convierte en un paso descartable. Los nuevos destinos son alternativas de especialización y colección, no mejoras automáticas de rentabilidad.

La dificultad propuesta (2,4–4,0 en la escala existente) debe validarse con las fórmulas actuales y sesiones manuales antes de aprobarse: congrio con cambios largos, tetra con cambios cortos, titán con persistencia pero sin acelerar el control del jugador. No se agregan nuevas mecánicas por especie en esta etapa. La caña Astral actual soporta 3.000 kg: todos los pesos propuestos son accesibles con equipo existente. Las variantes Titanes conservan margen para trofeos; Cauce favorece peces inquietos; Pulso favorece precisión. Ningún encargo exige la captura de un ejemplar mítico ni su consumo.

XP base nueva 1.080–2.600 y oro base 1.650–6.500 mantienen al Guardián de las mareas (2.800 / 7.500) como hito singular. No equivalen a rentabilidad por minuto: antes de implementación hay que medir distribución, duración, venta y suerte por equipo. No fijamos todavía probabilidades nuevas. Compartir especies antiguas mantiene variedad, pero debe respetar su nivel actual y no aumentar globalmente su probabilidad. Las zonas antiguas conservan sus colecciones, recompensas, objetivos e identidades; nunca se mueven encargos ya completados.

## Equipamiento y objetivos

No hacen falta más cañas de inicio ni 80–100 ofertas ahora. Las seis especializaciones ya cubren control, resiliencia, atracción, suerte, capacidad y trofeos. Las 40 variantes retiradas continúan equipables cuando ya se poseen. No eliminar IDs ni convertir compras anteriores en otra cosa.

Puntos para un futuro ajuste autorizado: Astral (29.000 oro / 3.000 kg) reduce el incentivo de comprar capacidad cara; Bóveda Celestial cuesta mucho más, aunque aporta otras estadísticas. Bambú tiene una resiliencia útil a bajo precio pero su límite de 60 kg conserva un nicho específico. Custodio duplica seis desafíos tempranos y puede obtenerse antes del nivel orientativo de su familia. Los encargos de peso Celestial tardíos concentran dependencia en raya/guardián. No corregir esto alterando ahora precios, requisitos, recompensas o probabilidades.

Primero sumar los cuatro encargos **complementarios** ya descritos para Manglar y Volcán en `PROPUESTA_PROGRESION.md`. No redistribuir los 25 históricos ni esconder una recompensa ya adquirida. Usar captura local, descubrimiento y récord histórico que el guardado acredita. No pedir «capturar con esta caña», clima, rachas o una fecha: v7 no conserva esa evidencia histórica. La bitácora del Ajolote tampoco debe exigir una captura anterior a su introducción.

## Maestría compatible: diseño para implementar después

La referencia congelada ya está en `arte/mastery-baseline26.json`, fuera del runtime. Congelar por ID el conjunto principal de los 25 encargos actuales y la regla actual de estrella 2 para Manglar/Volcán sin encargos. Los nuevos encargos de zonas existentes llevarán `masteryRole: supplemental`, nunca entrarán implícitamente en el denominador. Para zonas nuevas, declarar explícitamente sus IDs principales. Validar al registrar contenido que todos los IDs existan y que un encargo no cambie de zona. La clasificación por defecto de una misión nueva debe ser complementaria, no principal.

Antes de cargar una expansión que agregue especies a zonas antiguas, calcular los hitos con el catálogo anterior y registrar de forma aditiva `ui.fishingMasteryEarned[zoneId]` como máscara de tres bits, conservando campos desconocidos. Cada lectura haría OR entre hitos ya acreditados y progreso derivado. Exportar/importar debe conservar ese campo opcional; nunca reducir bits. Guardados sin extensión conservan el cálculo histórico; guardar un ID de versión del catálogo permite reconstruir su denominador. Esto requiere pruebas de actualización desde v7 real antes de habilitarlo. **Esta entrega no modifica el guardado ni cambia el cálculo de estrellas.**

Casos obligatorios futuros: medalla vieja + nuevos complementarios; dos estrellas + nuevas especies; importación anterior sin campo; recompensa ya reclamada; zona sin encargos; nueva zona pendiente. Un encargo complementario puede dar insignia propia sin revocar ninguna estrella/medalla vieja.
