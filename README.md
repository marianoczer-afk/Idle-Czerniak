# Argentum Idle Online

La versión completa actual es **Estable 15**, guardada en [`index.html`](index.html). El juego incluye todas sus ilustraciones y funciona sin compilación.

## Jugar como una página web

La dirección de GitHub Pages para este repositorio es:

**https://marianoczer-afk.github.io/Idle-Czerniak/**

La dirección estará disponible cuando el propietario active GitHub Pages. Si aún no está activado:

1. Abrí [Settings → Pages](https://github.com/marianoczer-afk/Idle-Czerniak/settings/pages).
2. En **Build and deployment → Source**, elegí **Deploy from a branch**.
3. En **Branch**, seleccioná **main** y **/ (root)**. Presioná **Save**.
4. Esperá a que termine la publicación. Podés seguirla en [Actions](https://github.com/marianoczer-afk/Idle-Czerniak/actions).
5. Volvé a **Settings → Pages** y hacé clic en **Visit site**, o abrí la dirección anterior. El encabezado del juego debe decir **Estable 15**.

Después de esa activación, las actualizaciones de `index.html` subidas a `main` se publican automáticamente.

## Descargar desde GitHub

- **Solo el juego:** abrí [`index.html` en GitHub](https://github.com/marianoczer-afk/Idle-Czerniak/blob/main/index.html) y hacé clic en **Download raw file**, el botón con flecha hacia abajo de la barra del archivo. Guardalo como `index.html` y abrilo con Chrome o Edge. Si GitHub avisa que el archivo es demasiado grande para mostrarlo, la descarga sigue disponible.
- **Repositorio completo:** en la pestaña **Code**, hacé clic en el botón verde **Code → Download ZIP**. Extraé el ZIP y abrí `index.html` en Chrome o Edge.

La vista de código de GitHub y el visor de archivos del chat muestran el contenido del HTML; para jugar usá GitHub Pages o abrí el archivo descargado con el navegador.

## Llevar una partida a GitHub Pages

Los guardados pertenecen al navegador y al origen donde jugás. Para pasar del archivo local a la página de GitHub: en el juego anterior usá **Exportar JSON**; después, en el juego de GitHub Pages, usá **Importar JSON**. Conservá el JSON como respaldo. No se reinician ni se modifican partidas al publicar el archivo.

## Desarrollo local

El juego sigue siendo autónomo: HTML, CSS, JavaScript e ilustraciones están en `index.html`. No necesita compilación ni servicios externos.

Para servirlo localmente, desde este directorio:

```sh
python3 -m http.server 8000
```

Los guardados pertenecen al navegador y al origen donde se juega. Conservá el mismo origen para seguir usando tus partidas; el servidor de pruebas utiliza perfiles temporales separados.

## Pruebas de estabilidad

Requiere Node.js 20 o posterior y Chromium:

```sh
npm ci
npx playwright install chromium  # Si no hay Chromium instalado en el sistema
npm test
```

El runner usa `/usr/bin/chromium` si existe. También acepta `CHROMIUM_PATH=/ruta/al/navegador`. Las pruebas levantan su propio servidor y usan contextos nuevos: no acceden al perfil del jugador.

Ver [ESTABILIZACION.md](ESTABILIZACION.md) para el diagnóstico, los cambios y el análisis de probabilidades.

El catálogo de Estable 08, las especialidades, los desafíos y el encuadre del arte se describen en [CATALOGO_CANAS.md](CATALOGO_CANAS.md).

Las ideas seleccionadas de los PDF aportados, priorizando una experiencia simple, se anotan en [REFERENCIAS_FISCH.md](REFERENCIAS_FISCH.md).
