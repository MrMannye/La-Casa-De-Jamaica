import Link from 'next/link'
import { workshops, workshopPrice, workshopWeekday } from '../data/workshops'

export function MonthlyWorkshops() {
  return (
    <section
      id="talleres"
      aria-labelledby="month-title"
      className="grid grid-cols-2 items-center gap-[8%] px-[7%] py-21.25 max-[900px]:gap-[5%] mobile:grid-cols-1 mobile:gap-7 mobile:px-[6%] mobile:py-13.75"
    >
      <div>
        <p className="text-xs leading-[1.7] tracking-[.13em]">
          03 / TALLERES DEL MES
        </p>
        <h2
          id="month-title"
          className="my-5 font-editorial text-[clamp(40px,4.5vw,65px)] leading-[1.1] tracking-[-.04em] mobile:text-[43px]"
        >
          Tu próximo ramo
          <br />
          <em>empieza en octubre.</em>
        </h2>
        <p className="max-w-95 text-base leading-[1.7] text-muted mobile:text-[15px]">
          {workshops.length} fechas para explorar las flores, el diseño y nuevas
          ideas.
        </p>
      </div>
      <div>
        {workshops.slice(0, 3).map((workshop) => (
          <Link
            key={workshop.id}
            href={`/talleres/${workshop.id}`}
            className="group flex items-center gap-4.5 border-b border-wine/20 py-4.5 text-base leading-[1.4] first:border-t hover:text-[#98384f] mobile:text-[15px]"
          >
            <span className="min-w-11.5 text-center font-editorial text-[31px]">
              {String(workshop.day).padStart(2, '0')}
              <small className="mt-1.5 block font-sans text-[10px] tracking-[.09em] text-muted">
                OCT
              </small>
            </span>
            <span className="flex-1">
              {workshop.name}
              <small className="mt-1.5 block text-xs text-muted">
                {workshopPrice(workshop.price)} MXN ·{' '}
                {workshopWeekday(workshop)}
              </small>
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </Link>
        ))}
        <Link
          href="/talleres"
          className="mt-3 flex items-center justify-between py-4.5 text-sm hover:text-[#98384f]"
        >
          Explorar los {workshops.length} talleres{' '}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}
