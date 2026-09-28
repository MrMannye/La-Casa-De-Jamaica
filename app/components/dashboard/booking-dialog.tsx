import { useEffect, useRef } from 'react';
import { type DemoBooking, type DashboardCourse } from '../../data/dashboard';
import { workshopFullDate, workshopPrice } from '../../data/workshops';
import { eyebrow, StatusBadge } from './shared';

export function BookingDialog({ booking, course, onClose, trigger }: { booking: DemoBooking; course: DashboardCourse; onClose: () => void; trigger: HTMLElement | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, [trigger]);
  const facts = [
    ['Taller', course.name], ['Fecha del taller', workshopFullDate(course)], ['Lugares', booking.quantity],
    ['Precio por lugar', `${workshopPrice(course.price)} MXN`], ['Total', `${workshopPrice(booking.amount)} MXN`],
  ];
  return <dialog ref={ref} aria-labelledby="booking-detail-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} className="workshop-dialog fixed inset-0 m-auto max-h-[90dvh] w-[min(490px,94vw)] overflow-y-auto rounded-3xl border border-white bg-[#f8f4e9f5] p-[34px] text-wine shadow-[0_30px_100px_#27122550] backdrop-blur-[25px] backdrop:bg-[#32182c72] backdrop:backdrop-blur-[6px] max-[760px]:px-6 max-[760px]:py-7">
    <button type="button" autoFocus onClick={onClose} aria-label="Cerrar detalle" className="absolute top-[15px] right-[15px] grid size-[33px] cursor-pointer place-items-center rounded-full bg-[#501c320c] text-2xl">×</button>
    <p className={`${eyebrow} pr-7`}>DETALLE DE RESERVA · DEMO</p><h2 id="booking-detail-title" className="my-4 font-editorial text-[37px]">{booking.id}</h2><StatusBadge status={booking.status} />
    <p className="mt-5 mb-[15px] font-editorial text-[25px]">{booking.name}</p>
    <dl>{facts.map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] border-b border-[#501c3218] py-3 text-[13px] leading-[1.6] max-[760px]:grid-cols-[95px_1fr] max-[760px]:text-xs"><dt className="text-[#786974]">{label}</dt><dd className={label === 'Total' ? 'font-semibold' : ''}>{value}</dd></div>)}</dl>
    <p className="mt-[18px] mb-3 text-[13px] leading-[1.6]">{booking.status === 'paid' ? 'Esta reserva demo suma ingresos y lugares confirmados.' : booking.status === 'pending' ? 'Pendiente de pago. Todavía no suma ingresos ni lugares confirmados.' : 'Reserva cancelada. No suma ingresos ni lugares confirmados.'}</p>
    <p className="text-[11px] leading-[1.6] text-[#786974]">Persona y transacción ficticias. No se ha procesado ningún pago.</p>
  </dialog>;
}
