# TeLlamo

Proyecto para el Hackathon de accesibilidad e inclusión del CPIFP Alan Turing (2.º DAM), con motivo del 3 de diciembre de 2026, Día Internacional de las Personas con Discapacidad.

**TeLlamo** es una caja con seis botones grandes para personas mayores con afasia tras un ictus. Al pulsar un botón, la caja dice la frase en voz alta («Tengo sed», «Me duele»…) y avisa a una app móvil de la familia. La familia responde con un toque («Voy», «Te llamo») y la caja se ilumina en verde para que la persona sepa que la han entendido.

Equipo: Sergio, Ana y Dani.

**Web:** https://sergiore2007.github.io/tellamo/

## Contenido

| Ruta | Qué es |
| --- | --- |
| [`tellamo-web/`](tellamo-web) | Web de presentación del producto, con una demo interactiva (React 19, TypeScript, Tailwind CSS 4, Motion) |
| [`Ficha TeLlamo.pdf`](Ficha%20TeLlamo.pdf) | Ficha de prototipo entregada al hackathon |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Publica la web en GitHub Pages en cada push a `main` |

## Ejecutar la web

```bash
cd tellamo-web
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ para publicar
```
