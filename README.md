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
La sección «Talleres del mes» muestra las tres primeras fechas y enlaza al calendario.

## Talleres de octubre

- `/talleres`: calendario de octubre de 2026, filtros por categoría, vista rápida,
  ficha modal y lista de actividades en móvil.
- `/talleres/oct-01` (y las demás fechas): página compartible para cada actividad.
- `/talleres?taller=oct-01`: abre directamente la ficha, compatible con los enlaces del prototipo.
- Los datos compartidos están en `app/data/workshops.ts`; las imágenes y el cartel
  originales están en `public/assets/talleres`.
- Fechas, precios y contactos proceden del prototipo. La agenda es fija, no representa
  disponibilidad en tiempo real. Los enlaces de WhatsApp preparan una consulta:
  no realizan reservas ni cobros. Horario, cupo y materiales deben confirmarse.
- Las fichas admiten Escape, cierre exterior, navegación por teclado y retorno del foco.
  En pantallas bajas el contenido se puede desplazar para no ocultar información.

Pruebas de calendario, categorías, imágenes y enlaces de consulta: `pnpm test`.

## Dashboard de demostración

`/dashboard` reproduce el prototipo administrativo con Tailwind: Resumen, Talleres y
Reservas. Las vistas admiten enlaces directos (`#overview`, `#workshops`, `#bookings`),
filtros de categoría, orden por ocupación, búsqueda sin acentos y fichas de reserva.
El modelo determinista está en `app/data/dashboard.ts`; reutiliza la agenda pública.
Solo las reservas demo pagadas suman ingresos y lugares confirmados. Las compras
pueden incluir varios lugares, y los pagos pendientes se contabilizan por separado.

El panel es una **demo pública sin autenticación**, con personas, pagos y cupos
ficticios; no guarda cambios ni conecta con servicios de pagos o reservas. Antes de
usar información real requiere autenticación, autorización y un backend. No incluir
datos personales reales en el modelo del cliente. Las pruebas incluyen la conciliación
de indicadores, estados de pago y filtros del dashboard.

```bash
pnpm install
pnpm dev
```

El proyecto usa pnpm 9.0.6, indicado en `packageManager`.
Para verificar la compilación de producción: `pnpm build`.
