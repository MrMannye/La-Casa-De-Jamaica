# La Casita de Jamaica — Next.js

Base creada con la estructura equivalente a:

```bash
pnpm create next-app
```

Configuración inicial:

- Next.js + TypeScript
- App Router
- Tailwind CSS 4 con PostCSS, colores de marca y variantes responsive
- GSAP + `@gsap/react` + ScrollTrigger
- `next/image` con el WebP original ya optimizado (sin recompresión)
- Fuentes Editorial regular e itálica alojadas en `public/fonts`
- Hero del prototipo UX/UI: pantalla completa, header flotante y control de movimiento
- Galería de cuatro ramos con imágenes originales, franja infinita con pausa y vista ampliada

Los estilos del hero están en las clases Tailwind de `app/page.tsx`.
Los colores, las fuentes y los puntos de adaptación están en `app/globals.css`.
La galería vive en `app/components/bouquet-gallery.tsx`: cuatro columnas en escritorio,
dos hasta 1100 px y una hasta 700 px. La vista ampliada admite las flechas del teclado,
Escape, cierre exterior y retorno del foco a la tarjeta. Las animaciones respetan
la preferencia de movimiento del sistema y el control de la página.
Los enlaces a talleres conservan destinos provisionales hasta implementar esas secciones.

```bash
pnpm install
pnpm dev
```

El proyecto usa pnpm 9.0.6, indicado en `packageManager`.
Para verificar la compilación de producción: `pnpm build`.
