import { type DashboardCourse, type DemoBooking } from '../../data/dashboard'
import { workshopPrice } from '../../data/workshops'
import { roundButton, StatusBadge } from './shared'

export function BookingTable({
  rows,
  courses,
  onOpen,
}: {
  rows: DemoBooking[]
  courses: DashboardCourse[]
  onOpen: (booking: DemoBooking, trigger: HTMLElement) => void
}) {
  if (!rows.length)
    return (
      <div className="px-5 py-13.75 text-center">
        <span aria-hidden="true" className="text-[33px] text-[#786974]">
          ⌕
        </span>
        <h3 className="my-3 font-editorial text-[26px]">
          No encontramos reservas
        </h3>
        <p className="text-[13px] text-[#786974]">
          Prueba otro nombre o ajusta los filtros.
        </p>
      </div>
    )
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Tabla de reservas"
      className="relative mt-5 overflow-x-auto focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#ae6537] max-[760px]:mt-3"
    >
      <table className="w-full border-collapse text-left text-[13px] max-[760px]:min-w-162.5 max-[760px]:text-xs">
        <thead>
          <tr>
            {[
              'Reserva / persona',
              'Taller',
              'Lugares',
              'Importe',
              'Estado',
              '',
            ].map((label, index) => (
              <th
                key={index}
                scope="col"
                className="border-b border-[#501c3216] p-3 text-[10px] font-medium tracking-[.07em] whitespace-nowrap text-[#786974] uppercase max-[760px]:p-2.5 max-[760px]:text-[9px]"
              >
                {label || <span className="sr-only">Detalle</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((booking) => {
            const course = courses.find((item) => item.id === booking.courseId)!
            const cell =
              'border-b border-[#501c320e] px-3 py-4 leading-[1.4] group-last:border-b-0 max-[760px]:px-2.5 max-[760px]:py-3.5'
            return (
              <tr key={booking.id} className="group">
                <td className={cell}>
                  <strong className="block font-medium">{booking.name}</strong>
                  <small className="mt-1.25 block text-[11px] text-[#786974]">
                    {booking.id} · {booking.created.slice(8)} sep
                  </small>
                </td>
                <td className={`${cell} max-w-62.5`}>
                  <span>{course.name}</span>
                  <small className="mt-1.25 block text-[11px] text-[#786974]">
                    {course.day} de octubre
                  </small>
                </td>
                <td className={cell}>{booking.quantity}</td>
                <td className={`${cell} whitespace-nowrap`}>
                  {workshopPrice(booking.amount)}
                </td>
                <td className={cell}>
                  <StatusBadge status={booking.status} />
                </td>
                <td className={cell}>
                  <button
                    type="button"
                    aria-label={`Ver reserva ${booking.id}`}
                    onClick={(event) => onOpen(booking, event.currentTarget)}
                    className={roundButton}
                  >
                    ↗
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
