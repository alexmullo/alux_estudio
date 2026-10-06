# Alux Studio — portafolio

Sitio estático de Alex Xavier Mullo Yugla, basado en los archivos originales de Alux Studio. La identidad conserva el crema `#f6f1e9`, azul petróleo `#003b4a`, naranja `#f6921e` y los SVG suministrados.

## Ver el sitio en desarrollo

Desde la raíz del repositorio:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

No necesita instalar dependencias, compilar ni conectarse a servicios externos. Las fuentes Bricolage Grotesque y Open Sans se sirven localmente, con sus licencias OFL incluidas en `assets/fonts/`. El lienzo animado usa Canvas 2D, limita sus cuadros y se pausa fuera de pantalla, en pestañas ocultas o al solicitar reducir movimiento.

## Estructura

- `index.html`: contenido, navegación, perfil y contacto.
- `assets/alux.css`: diseño responsive, composición de tarjetas y efectos.
- `assets/alux.js`: proyectos, filtros, menú móvil y cambio de retrato.
- `assets/alux-motion.js`: adaptación del lienzo animado del archivo original.
- `assets/portraits.json`: rutas de los dos retratos, inicialmente pendientes.
- `assets/*.svg`: logo e iconos originales.
- `assets/fonts/`: fuentes locales y licencias.

## Material pendiente

Los espacios gráficos están señalados como reservas y no simulan trabajos entregados ni videos reproducibles.

- Dos videos destacados, preferentemente 1080 × 1350 (4:5).
- Logos y cuatro trabajos por cliente, también en 4:5.
- Nombres reales para las tres entradas «Próxima marca».
- Enlace de Facebook. Su icono sigue sin enlace hasta recibirlo.
- Las dos fotografías originales de Alex, enviadas como imágenes en el chat pero todavía no disponibles como archivos descargables.

Para incorporar los retratos, guarda las fotos en `assets/` y actualiza `assets/portraits.json`:

```json
{
  "personal": "assets/alex-personal.webp",
  "agency": "assets/alex-inhaus.webp"
}
```

Admite JPG, PNG o WebP: usa la extensión real de cada archivo. El sitio habilita el cambio de retrato al cargar ambas imágenes correctamente. El botón «Inhaus Corp» alterna la foto; el símbolo de al lado abre la agencia en otra pestaña.

Los seis espacios del portafolio se editan en `projects`, dentro de `assets/alux.js`. Instagram y TikTok apuntan a `@alux.estudio`; WhatsApp conserva el contacto de la base original.

## Publicación en GitHub Pages

El archivo `index.html` está en la raíz para publicar directamente desde `main`, carpeta `/ (root)`, sin generar una carpeta `dist`. Configura esa fuente en Settings → Pages del repositorio. Subir los archivos al repositorio y activar GitHub Pages son operaciones distintas.

## Validación

```sh
node --check assets/alux.js
node --check assets/alux-motion.js
```

Además, comprueba en navegador el menú móvil, su cierre con Escape, los filtros Todos / Artistas / Marcas, la apertura de proyectos, los enlaces internos y la preferencia de reducir movimiento. Comprueba que las solicitudes de recursos locales no devuelvan errores.
