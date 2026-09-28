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
- Sección «Así es el taller» con tres escenas alternadas y progreso ligado al desplazamiento

Los estilos del hero están en las clases Tailwind de `app/page.tsx`.
Los colores, las fuentes y los puntos de adaptación están en `app/globals.css`.
La galería vive en `app/components/bouquet-gallery.tsx`: cuatro columnas en escritorio,
dos hasta 1100 px y una hasta 700 px. La vista ampliada admite las flechas del teclado,
Escape, cierre exterior y retorno del foco a la tarjeta. Las animaciones respetan
la preferencia de movimiento del sistema y el control de la página.
El recorrido del taller vive en `app/components/workshop-experience.tsx`.
Las tres escenas alternan imagen y texto en escritorio y se apilan en móvil.
La línea de progreso usa las posiciones de las tarjetas sin sus transformaciones de entrada,
se recalcula al cambiar el tamaño o cargar las fuentes y señala el paso actual.
La preferencia de movimiento reducido del sistema elimina las entradas animadas y conserva el indicador de lectura.
El enlace a talleres del mes conserva un destino provisional hasta implementar esa sección.

```bash
pnpm install
pnpm dev
```

El proyecto usa pnpm 9.0.6, indicado en `packageManager`.
Para verificar la compilación de producción: `pnpm build`.
