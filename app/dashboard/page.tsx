import type { Metadata } from 'next';
import { Dashboard } from '../components/dashboard/dashboard';

export const metadata: Metadata = {
  title: 'Administración · La Casita de Jamaica',
  description: 'Prototipo del panel administrativo de La Casita de Jamaica. Datos de demostración.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <Dashboard />;
}
