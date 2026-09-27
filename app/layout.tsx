import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Casita de Jamaica',
  description: 'Flores, talleres y comunidad en Mercado Jamaica, Ciudad de México.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
