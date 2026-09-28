import type { Workshop } from './workshops';

export const statusLabels = { paid: 'Pagado', pending: 'Pendiente', cancelled: 'Cancelado' } as const;
export type BookingStatus = keyof typeof statusLabels;
export type DashboardCourse = Workshop & { capacity: number };
export type DemoBooking = {
  id: string;
  courseId: string;
  name: string;
  quantity: number;
  status: BookingStatus;
  amount: number;
  created: string;
};

// Deliberately fictitious, deterministic data from the UX/UI prototype.
// No personal records, transactions, authentication or live inventory are involved.
export function createDemo(workshops: Workshop[]): { courses: DashboardCourse[]; bookings: DemoBooking[] } {
  const names = ['Lucía Demo', 'Mariana Demo', 'Daniela Demo', 'Sofía Demo', 'Valeria Demo', 'Andrea Demo', 'Camila Demo', 'Ana Demo', 'Renata Demo', 'Paula Demo'];
  const bookings = workshops.flatMap((course, i) => Array.from({ length: 3 + i % 5 }, (_, j): DemoBooking => ({
    id: `LC-${String(i * 10 + j + 1).padStart(4, '0')}`,
    courseId: course.id,
    name: names[(i + j) % names.length],
    quantity: j % 3 === 0 ? 2 : 1,
    status: j === 2 + i % 5 ? 'pending' : j === 1 && i % 4 === 0 ? 'cancelled' : 'paid',
    amount: course.price * (j % 3 === 0 ? 2 : 1),
    created: `2026-09-${String(18 + (i + j) % 11).padStart(2, '0')}`,
  })));
  return { courses: workshops.map(course => ({ ...course, capacity: 12 })), bookings };
}

export function summarize(courses: DashboardCourse[], bookings: DemoBooking[]) {
  const paid = bookings.filter(booking => booking.status === 'paid');
  const pending = bookings.filter(booking => booking.status === 'pending');
  const capacity = courses.reduce((sum, course) => sum + course.capacity, 0);
  const seats = paid.reduce((sum, booking) => sum + booking.quantity, 0);
  return {
    revenue: paid.reduce((sum, booking) => sum + booking.amount, 0),
    purchases: paid.length,
    seats,
    capacity,
    occupancy: capacity ? Math.round(seats / capacity * 100) : 0,
    pending: pending.length,
    pendingAmount: pending.reduce((sum, booking) => sum + booking.amount, 0),
  };
}

export function courseStats(course: DashboardCourse, bookings: DemoBooking[]) {
  const stats = summarize([course], bookings.filter(booking => booking.courseId === course.id));
  return { ...stats, available: Math.max(0, course.capacity - stats.seats) };
}

export function filterBookings(bookings: DemoBooking[], { query = '', courseId = '', status = '' }: { query?: string; courseId?: string; status?: BookingStatus | '' } = {}) {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return bookings.filter(booking =>
    (!query.trim() || normalize(`${booking.name} ${booking.id}`).includes(normalize(query.trim()))) &&
    (!courseId || booking.courseId === courseId) && (!status || booking.status === status));
}

export function newestBookings(bookings: DemoBooking[]) {
  return [...bookings].sort((a, b) => b.created.localeCompare(a.created) || b.id.localeCompare(a.id));
}
