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

## Entrada a la casita

`app/components/casita-entrance.tsx` reproduce la fachada del prototipo con su
imagen original (`public/assets/casita-entrada.webp`). Una escena sticky de
310svh amplía la puerta y revela el hero con una máscara arqueada ligada al
scroll. La geometría se recalcula al redimensionar; volver hacia arriba revierte
la entrada. El botón «Entrar» y el enlace de salto permiten llegar directamente
al hero con el foco en su título, también mediante teclado.

El control «Reducir movimiento» respeta inicialmente la preferencia del sistema.
En ese modo, o si el navegador no soporta la máscara, fachada y hero se muestran
como secciones normales sin zoom. Los enlaces del hero y la navegación permanecen
inactivos mientras están ocultos por la fachada. La imagen es conceptual, creada
para el prototipo; no representa una fotografía del local real.

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

## Lint y formato

- `pnpm lint`: revisa Next.js, TypeScript y las clases Tailwind (desconocidas,
  duplicadas, concatenadas o en conflicto).
- `pnpm lint:fix`: aplica las correcciones automáticas disponibles de ESLint.
  Incluye las clases canónicas de Tailwind, por ejemplo `min-h-[220px]` →
  `min-h-55`, también con variantes como `mobile:`. La conversión de píxeles
  a la escala rem asume un tamaño raíz de 16 px (`rootFontSize` en ESLint).
- `pnpm format`: formatea los archivos y ordena las clases Tailwind con Prettier.
- `pnpm format:check`: comprueba el formato sin modificar archivos.

ESLint usa `eslint-plugin-better-tailwindcss` para Tailwind 4. Prettier usa
el plugin oficial `prettier-plugin-tailwindcss`; ambos leen `app/globals.css`
para reconocer los colores y variantes del proyecto. El estilo configurado usa
dos espacios, comillas simples y no añade punto y coma en JavaScript/TypeScript.
Esto no equivale a habilitar todas las reglas de StandardJS.

Los selectores de GSAP y las clases CSS propias están permitidos explícitamente
en `eslint.config.mjs`. Prettier se encarga del orden y el formato; ESLint mantiene
las reglas de corrección para evitar cambios de formato contradictorios.

En VS Code, instala las extensiones recomendadas del espacio de trabajo:
ESLint, Prettier y Tailwind CSS IntelliSense. La configuración de `.vscode`
activa el formateo y las correcciones de ESLint al guardar.
