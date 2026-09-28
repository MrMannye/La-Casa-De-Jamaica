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

Los estilos del hero están en las clases Tailwind de `app/page.tsx`.
Los colores, las fuentes y los puntos de adaptación están en `app/globals.css`.
Los enlaces a ramos y talleres tienen destinos provisionales hasta implementar esas secciones.

```bash
pnpm install
pnpm dev
```

El proyecto usa pnpm 9.0.6, indicado en `packageManager`.
Para verificar la compilación de producción: `pnpm build`.
