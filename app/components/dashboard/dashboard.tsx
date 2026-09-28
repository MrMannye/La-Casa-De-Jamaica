'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  workshops,
  workshopImage,
  workshopPrice,
  workshopWeekday,
  workshopCategories,
  type WorkshopFilter,
} from '../../data/workshops'
import {
  createDemo,
  courseStats,
  filterBookings,
  newestBookings,
  summarize,
  statusLabels,
  type BookingStatus,
  type DemoBooking,
} from '../../data/dashboard'
import { BookingTable } from './booking-table'
import { BookingDialog } from './booking-dialog'
import {
  glass,
  glassFrame,
  panel,
  eyebrow,
  panelTitle,
  description,
  textButton,
  primary,
  field,
  fieldLabel,
  roundButton,
  OccupancyProgress,
} from './shared'

const { courses, bookings } = createDemo(workshops)
const summary = summarize(courses, bookings)
const titles = {
  overview: [
    'Tu mes, de un vistazo.',
    'Talleres, lugares y reservas en un mismo espacio.',
    'Resumen',
  ],
  workshops: [
    'Todo listo para florecer.',
    'Revisa la ocupación de cada fecha y consulta sus reservas.',
    'Talleres',
  ],
  bookings: [
    'Cada lugar, una historia.',
    'Sigue las compras y los pagos de tus talleres.',
    'Reservas',
  ],
} as const
type View = keyof typeof titles
const views: View[] = ['overview', 'workshops', 'bookings']
const recent = newestBookings(bookings).slice(0, 5)
const next = courses[0]
const nextStats = courseStats(next, bookings)

export function Dashboard() {
  const [view, setView] = useState<View>('overview')
  const [category, setCategory] = useState<WorkshopFilter>('Todos')
  const [sort, setSort] = useState('date')
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('')
  const [status, setStatus] = useState<BookingStatus | ''>('')
  const [selected, setSelected] = useState<DemoBooking | null>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const courseSelect = useRef<HTMLSelectElement>(null)
  const focusCourse = useRef(false)

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1) as View
      setView(views.includes(hash) ? hash : 'overview')
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  useEffect(() => {
    if (view === 'bookings' && focusCourse.current) {
      courseSelect.current?.focus({ preventScroll: true })
      focusCourse.current = false
    }
  }, [view, courseId])

  const navigate = (target: View) => {
    if (window.location.hash !== `#${target}`)
      window.history.pushState(null, '', `#${target}`)
    setView(target)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const reservationsFor = (id: string) => {
    setQuery('')
    setStatus('')
    setCourseId(id)
    focusCourse.current = true
    navigate('bookings')
  }
  const openBooking = (booking: DemoBooking, trigger: HTMLElement) => {
    lastTrigger.current = trigger
    setSelected(booking)
  }
  const filteredCourses = courses.filter(
    (course) => category === 'Todos' || course.categories.includes(category),
  )
  if (sort === 'occupancy')
    filteredCourses.sort(
      (a, b) =>
        courseStats(b, bookings).seats - courseStats(a, bookings).seats ||
        a.day - b.day,
    )
  const filteredBookings = newestBookings(
    filterBookings(bookings, { query, courseId, status }),
  )
  const selectedSeats = filteredBookings
    .filter((booking) => booking.status === 'paid')
    .reduce((sum, booking) => sum + booking.quantity, 0)
  const metrics = [
    {
      label: 'Cobros confirmados',
      value: workshopPrice(summary.revenue),
      note: 'Brutos · sin descontar comisiones',
      tone: 'income',
    },
    {
      label: 'Compras pagadas',
      value: summary.purchases,
      note: `${summary.seats} lugares confirmados`,
      tone: '',
    },
    {
      label: 'Ocupación del mes',
      value: `${summary.occupancy}%`,
      note: `${summary.seats} de ${summary.capacity} lugares · cupos demo`,
      tone: '',
    },
    {
      label: 'Pagos pendientes',
      value: summary.pending,
      note: `${workshopPrice(summary.pendingAmount)} por confirmar`,
      tone: 'pending',
    },
  ]

  return (
    <div className="dashboard-shell relative isolate min-h-svh bg-[#f3eee9] text-wine">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-1 bg-[radial-gradient(ellipse_at_15%_18%,#dec1c9_0,transparent_48%),radial-gradient(ellipse_at_91%_5%,#f2da8c8f,transparent_44%),radial-gradient(ellipse_at_92%_90%,#d3cbdc,transparent_50%)]"
      />
      <a
        href="#main"
        className="fixed -top-20 left-4 z-50 bg-wine p-4 text-white focus:top-2"
      >
        Saltar al contenido
      </a>
      <aside className="fixed top-4.5 bottom-4.5 left-4.5 z-10 flex w-55.5 flex-col rounded-[22px] border border-[#ffffff35] bg-[linear-gradient(155deg,#582139f0,#411d37e6)] px-5 pt-7.75 pb-5 text-cream shadow-[0_15px_60px_#501c3233] backdrop-blur-[22px] max-[1250px]:w-50 max-[1250px]:px-4 max-[1250px]:pt-6.75 max-[1250px]:pb-4.5 max-[760px]:sticky max-[760px]:inset-auto max-[760px]:top-0 max-[760px]:w-full max-[760px]:gap-3.25 max-[760px]:rounded-t-none max-[760px]:rounded-b-[20px] max-[760px]:px-5 max-[760px]:pt-3.75 max-[760px]:pb-3">
        <Link
          href="/"
          aria-label="La Casita de Jamaica, inicio"
          className="flex items-center gap-2.25 font-editorial text-[26px] leading-[.92] tracking-[-.8px] max-[1250px]:text-2xl max-[760px]:text-[22px]"
        >
          <span
            aria-hidden="true"
            className="text-[43px] text-yellow max-[760px]:text-[35px]"
          >
            ✳
          </span>
          <span>
            la casita
            <small className="block text-2xl max-[1250px]:text-[22px] max-[760px]:text-xl">
              de Jamaica
            </small>
          </span>
        </Link>
        <p className="mt-11.75 mb-4.25 text-[10px] tracking-[.14em] text-[#d5bfc9] max-[760px]:hidden">
          TU ESPACIO DE TRABAJO
        </p>
        <nav
          aria-label="Panel administrativo"
          className="grid gap-2.25 max-[760px]:flex max-[760px]:gap-2"
        >
          {views.map((item, index) => (
            <button
              key={item}
              type="button"
              aria-current={view === item ? 'page' : undefined}
              onClick={() => navigate(item)}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3.25 py-3.5 text-left text-sm text-[#eadbe1] hover:bg-[#ffffff13] aria-[current=page]:border-[#ffffff26] aria-[current=page]:bg-[#ffffff1c] aria-[current=page]:text-white aria-[current=page]:shadow-[inset_0_1px_#ffffff24] max-[760px]:flex-1 max-[760px]:justify-center max-[760px]:gap-1.75 max-[760px]:px-3 max-[760px]:py-2.5 max-[760px]:text-xs max-[360px]:gap-1 max-[360px]:px-1.5 max-[360px]:text-[11px]"
            >
              <span
                aria-hidden="true"
                className="w-6 text-center text-[21px] max-[760px]:w-4.5 max-[760px]:text-[17px]"
              >
                {['◫', '▦', '≡'][index]}
              </span>
              {titles[item][2]}
              {item === 'workshops' && (
                <span className="ml-auto rounded-[5px] bg-[#ffffff12] px-1.5 py-0.75 text-[11px] max-[760px]:hidden">
                  {courses.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto max-[760px]:hidden">
          <div className="border-t border-[#ffffff21] px-0.5 py-6 text-[#dcc5ce]">
            <span aria-hidden="true" className="text-[30px] text-yellow">
              ✳
            </span>
            <p className="mt-2.5 font-editorial text-[19px] leading-[1.4]">
              Un espacio para crear.
              <br />Y para hacerlo crecer.
            </p>
          </div>
          <Link
            href="/talleres"
            className="block border-b border-[#ffffff21] py-3.75 text-xs"
          >
            Ver sitio de talleres ↗
          </Link>
          <div className="mt-5.25 flex items-center gap-2.5 text-[13px]">
            <span className="grid size-8.75 place-items-center rounded-full bg-[#ffffff18] text-[11px]">
              LC
            </span>
            <div>
              La Casita
              <small className="mt-1.25 block text-[10px] text-[#cfb4c1]">
                Administración · Demo
              </small>
            </div>
          </div>
        </div>
      </aside>

      <main
        id="main"
        className="ml-65 max-w-[1700px] px-8.5 pt-7.25 pb-5 max-[1250px]:ml-57.5 max-[1250px]:px-6 max-[1250px]:py-6.5 max-[760px]:ml-0 max-[760px]:px-4.5 max-[760px]:py-5.25"
      >
        <header className="flex items-center justify-between gap-2 text-xs text-[#786974] max-[760px]:text-[11px]">
          <p>
            La Casita / <span>{titles[view][2]}</span>
          </p>
          <div className="flex items-center gap-3.75">
            <span className="rounded-full border border-[#8f705536] bg-[#fff6d285] px-2.75 py-1.75 text-[11px] text-[#78551e] max-[760px]:text-[10px]">
              Modo demostración
            </span>
            <Link
              href="/"
              aria-label="Ir a la página pública"
              className="grid size-8.5 place-items-center rounded-full border border-white bg-[#ffffff90] text-[19px] text-wine"
            >
              ↗
            </Link>
          </div>
        </header>
        <div className="mt-9.25 mb-5.75 flex items-center justify-between gap-6.25 max-[760px]:mt-6.25 max-[760px]:mb-4.25 max-[760px]:block">
          <div>
            <p className={eyebrow}>QUE TODO SIGA FLORECIENDO</p>
            <h1 className="my-2.75 font-editorial text-[clamp(34px,3.1vw,48px)] leading-[1.15] tracking-[-.035em] max-[760px]:text-[36px]">
              {titles[view][0]}
            </h1>
            <p className="text-sm leading-[1.6] text-[#786974]">
              {titles[view][1]}
            </p>
          </div>
          <span className="rounded-xl border border-white bg-white/60 px-4.5 py-3.25 text-[13px] whitespace-nowrap max-[760px]:mt-4.25 max-[760px]:inline-block max-[760px]:px-3.25 max-[760px]:py-2.5 max-[760px]:text-xs">
            ▦ &nbsp; Octubre 2026
          </span>
        </div>
        <div className="mb-6 flex items-center gap-2.25 text-xs leading-[1.6] text-[#776471] max-[760px]:items-start max-[760px]:text-[11px]">
          <span aria-hidden="true" className="text-base">
            ⓘ
          </span>
          <p>
            Ventas, personas y cupos ficticios para explorar el diseño. Talleres
            y precios basados en el calendario de octubre.
          </p>
        </div>
        <section
          aria-label="Indicadores de octubre"
          className="mb-6 grid grid-cols-4 gap-4 max-[1050px]:grid-cols-2 max-[760px]:mb-4.25 max-[760px]:gap-2.75"
        >
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className={`${glassFrame} min-h-36.5 px-5.5 py-5.75 max-[1250px]:px-4 max-[1250px]:py-5 max-[760px]:min-h-33.75 max-[760px]:rounded-[17px] max-[760px]:px-3.5 max-[760px]:py-4.75 ${metric.tone === 'income' ? 'border-[#ffffff42] bg-[linear-gradient(135deg,#602741f0,#501c32de)] text-cream' : metric.tone === 'pending' ? 'border-[#ffffffbd] bg-[linear-gradient(135deg,#fff6d19e,#ffffff80)]' : 'border-[#ffffffbd] bg-[linear-gradient(135deg,#ffffffa6,#ffffff65)]'}`}
            >
              <p
                className={`text-xs max-[760px]:text-[11px] ${metric.tone === 'income' ? 'text-[#e5ced6]' : 'text-[#786974]'}`}
              >
                {metric.label}
              </p>
              <strong className="mt-3.75 mb-3 block text-[32px] font-medium tracking-[-1.2px] tabular-nums max-[1250px]:text-[28px] max-[760px]:mt-3.5 max-[760px]:mb-2.5 max-[760px]:text-[27px]">
                {metric.value}
              </strong>
              <small
                className={`block text-[11px] leading-[1.6] max-[760px]:text-[10px] ${metric.tone === 'income' ? 'text-[#e5ced6]' : 'text-[#786974]'}`}
              >
                {metric.note}
              </small>
            </article>
          ))}
        </section>

        {view === 'overview' && (
          <section aria-label="Resumen" className="dashboard-view">
            <div className="mb-6 grid grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)] gap-5.5 max-[1250px]:grid-cols-[minmax(0,1.6fr)_minmax(245px,1fr)] max-[1050px]:grid-cols-1 max-[760px]:mb-4.25 max-[760px]:gap-4.25">
              <section className={panel}>
                <div className="flex items-center justify-between gap-3.75">
                  <div>
                    <p className={eyebrow}>LA AGENDA EN NÚMEROS</p>
                    <h2 className={panelTitle}>Lugares por taller</h2>
                  </div>
                  <button
                    type="button"
                    className={textButton}
                    onClick={() => navigate('workshops')}
                  >
                    Ver todos ↗
                  </button>
                </div>
                <p className={description}>
                  Lugares pagados · cada barra corresponde a una fecha de
                  octubre.
                </p>
                <div className="mt-8 flex h-55 items-stretch gap-[clamp(4px,1vw,14px)] max-[760px]:mt-6.25 max-[760px]:h-45 max-[760px]:gap-1.5">
                  {courses.map((course) => {
                    const stats = courseStats(course, bookings)
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => reservationsFor(course.id)}
                        aria-label={`${course.name}, ${course.day} de octubre: ${stats.seats} de ${course.capacity} lugares pagados. Ver reservas`}
                        className="group flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2.5 rounded bg-transparent p-0"
                      >
                        <span className="text-[11px] text-[#786974] max-[760px]:text-[10px]">
                          {stats.seats}
                        </span>
                        <span className="relative w-full max-w-6 flex-1 overflow-hidden rounded-[5px] bg-[#501c3207] max-[1050px]:max-w-8">
                          <span
                            style={{ height: `${stats.occupancy}%` }}
                            className="absolute inset-x-0 bottom-0 rounded-[5px] bg-[linear-gradient(0deg,#63243f,#af647d)] group-hover:bg-wine group-hover:bg-none"
                          />
                        </span>
                        <span className="text-[11px] text-[#786974] max-[760px]:text-[10px]">
                          {String(course.day).padStart(2, '0')}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-6 flex justify-between gap-3.75 text-[10px] leading-[1.6] text-[#786974] max-[760px]:gap-2.25 max-[760px]:text-[9px]">
                  <span>
                    <i
                      aria-hidden="true"
                      className="mr-1.25 inline-block size-1.75 rounded-xs bg-[#8a425d]"
                    />
                    Lugares confirmados
                  </span>
                  <span>Cupo demo: 12 por fecha</span>
                </div>
              </section>
              <section
                aria-label="Próximo taller"
                className={`${glass} flex flex-col overflow-hidden max-[1050px]:grid max-[1050px]:grid-cols-[210px_1fr] max-[760px]:grid-cols-[115px_1fr] max-[760px]:rounded-[18px]`}
              >
                <div className="relative h-37.5 max-[1050px]:h-full max-[1050px]:min-h-58.75">
                  <Image
                    src={workshopImage(next)}
                    alt={`Imagen ilustrativa de ${next.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 115px, 350px"
                    className="object-cover object-[center_58%]"
                  />
                  <span className="absolute top-4.25 left-4.5 rounded-[20px] border border-white/60 bg-white/60 px-2.5 py-1.75 text-[9px] tracking-widest backdrop-blur-xl max-[760px]:hidden">
                    PRÓXIMO TALLER
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5.5 max-[760px]:p-4.75">
                  <p className="text-[9px] tracking-[.13em]">
                    {workshopWeekday(next).toUpperCase()} {next.day} · OCTUBRE
                  </p>
                  <h2 className="mt-3 mb-4.75 font-editorial text-[26px] leading-[1.15] tracking-tight max-[760px]:text-2xl">
                    {next.name}
                  </h2>
                  <div className="flex justify-between gap-2.5 text-[11px] max-[760px]:text-[10px]">
                    <span className="text-[#786974]">
                      {nextStats.seats} confirmados
                    </span>
                    <strong className="font-normal">
                      {nextStats.available} disponibles
                    </strong>
                  </div>
                  <OccupancyProgress
                    seats={nextStats.seats}
                    capacity={next.capacity}
                    label={`Ocupación de ${next.name}`}
                  />
                  <button
                    type="button"
                    className={`${primary} mt-auto w-full max-[760px]:p-3 max-[760px]:text-[11px]`}
                    onClick={() => reservationsFor(next.id)}
                  >
                    Ver sus reservas <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </section>
            </div>
            <section className={panel}>
              <div className="flex items-center justify-between gap-3.75">
                <div>
                  <p className={eyebrow}>MOVIMIENTO RECIENTE</p>
                  <h2 className={panelTitle}>Últimas reservas</h2>
                </div>
                <button
                  type="button"
                  className={textButton}
                  onClick={() => navigate('bookings')}
                >
                  Ver reservas ↗
                </button>
              </div>
              <BookingTable
                rows={recent}
                courses={courses}
                onOpen={openBooking}
              />
            </section>
          </section>
        )}

        {view === 'workshops' && (
          <section aria-label="Talleres" className={`dashboard-view ${panel}`}>
            <h2 className={panelTitle}>Tu calendario de talleres</h2>
            <p className={description}>
              Compras pagadas, asistentes confirmados y lugares disponibles.
            </p>
            <div className="flex items-end gap-4 border-b border-[#501c3214] pt-6 pb-4.75 max-[760px]:flex-wrap max-[760px]:gap-3">
              <label
                className={`${fieldLabel} max-[760px]:min-w-32.5 max-[760px]:flex-1`}
              >
                Tipo de taller
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as WorkshopFilter)
                  }
                  className={field}
                >
                  {workshopCategories.map((item) => (
                    <option key={item} value={item}>
                      {item === 'Todos' ? 'Todos los tipos' : item}
                    </option>
                  ))}
                </select>
              </label>
              <label
                className={`${fieldLabel} max-[760px]:min-w-32.5 max-[760px]:flex-1`}
              >
                Ordenar por
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className={field}
                >
                  <option value="date">Fecha del taller</option>
                  <option value="occupancy">Mayor ocupación</option>
                </select>
              </label>
              <span
                role="status"
                className="ml-auto pb-2.75 text-xs text-[#786974] max-[760px]:basis-full max-[760px]:pb-0"
              >
                {filteredCourses.length} fechas
              </span>
            </div>
            <div>
              {filteredCourses.map((course) => {
                const stats = courseStats(course, bookings)
                return (
                  <article
                    key={course.id}
                    className="flex items-center gap-5 border-b border-[#501c3212] py-5.25 last:border-0 max-[1250px]:gap-3.75 max-[1050px]:flex-wrap max-[760px]:gap-3"
                  >
                    <Image
                      src={workshopImage(course)}
                      alt=""
                      width={65}
                      height={65}
                      unoptimized
                      className="size-16.25 rounded-[13px] object-cover max-[760px]:size-13.25"
                    />
                    <div className="min-w-0 flex-1 max-[1050px]:min-w-50 max-[760px]:min-w-0 max-[760px]:basis-[calc(100%-75px)]">
                      <small className="text-[10px] text-[#786974]">
                        {workshopWeekday(course)} {course.day} de octubre ·{' '}
                        {course.categories[0]}
                      </small>
                      <h3 className="my-1.5 text-sm leading-[1.4] font-medium">
                        {course.name}
                      </h3>
                      <span className="text-[11px] text-[#786974]">
                        {workshopPrice(course.price)} MXN / lugar
                      </span>
                    </div>
                    <div className="w-50 max-[1250px]:w-37.5 max-[1050px]:w-auto max-[1050px]:min-w-40 max-[1050px]:flex-1 max-[760px]:pl-16.25">
                      <div className="flex items-baseline justify-between gap-2.25">
                        <strong className="text-[13px] font-medium">
                          {stats.seats} / {course.capacity}
                        </strong>
                        <small className="text-[10px] text-[#786974]">
                          lugares pagados
                        </small>
                      </div>
                      <OccupancyProgress
                        seats={stats.seats}
                        capacity={course.capacity}
                        label={`${stats.seats} de ${course.capacity} lugares confirmados`}
                      />
                      <small className="block text-[10px] text-[#786974]">
                        {stats.available} disponibles · {stats.purchases}{' '}
                        compras pagadas
                      </small>
                    </div>
                    <div className="min-w-21.25 text-right max-[1250px]:hidden">
                      <strong className="text-sm font-medium">
                        {workshopPrice(stats.revenue)}
                      </strong>
                      <small className="mt-1.75 block text-[10px] text-[#786974]">
                        {stats.pending} pago pendiente
                      </small>
                    </div>
                    <button
                      type="button"
                      className={`${roundButton} max-[760px]:ml-2.5`}
                      aria-label={`Ver reservas de ${course.name} del ${course.day} de octubre`}
                      onClick={() => reservationsFor(course.id)}
                    >
                      ↗
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {view === 'bookings' && (
          <section aria-label="Reservas" className={`dashboard-view ${panel}`}>
            <div className="flex items-center justify-between gap-3.75">
              <div>
                <h2 className={panelTitle}>Reservas y pagos</h2>
                <p className={description}>
                  Una compra puede incluir más de un lugar.
                </p>
              </div>
              <button
                type="button"
                className={textButton}
                onClick={() => {
                  setQuery('')
                  setCourseId('')
                  setStatus('')
                }}
              >
                Limpiar filtros
              </button>
            </div>
            <div className="flex items-end gap-4 border-b border-[#501c3214] pt-6 pb-4.75 max-[1050px]:flex-wrap max-[760px]:gap-3">
              <label className={`${fieldLabel} flex-1 max-[1050px]:min-w-37.5`}>
                Buscar
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre o número de reserva"
                  autoComplete="off"
                  className={field}
                />
              </label>
              <label className={`${fieldLabel} flex-1 max-[1050px]:min-w-37.5`}>
                Taller
                <select
                  ref={courseSelect}
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className={field}
                >
                  <option value="">Todos los talleres</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.day} oct · {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <label
                className={`${fieldLabel} max-[1050px]:min-w-37.5 max-[1050px]:flex-1`}
              >
                Estado
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as BookingStatus | '')
                  }
                  className={field}
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="pt-4.25 text-xs text-[#786974] max-[760px]:text-[11px]"
            >
              {filteredBookings.length}{' '}
              {filteredBookings.length === 1 ? 'reserva' : 'reservas'} ·{' '}
              {selectedSeats} lugares pagados en esta selección
            </p>
            <BookingTable
              rows={filteredBookings}
              courses={courses}
              onOpen={openBooking}
            />
          </section>
        )}
        <footer className="flex justify-between gap-5 pt-6.5 text-[11px] text-[#786974] max-[1050px]:block">
          La Casita de Jamaica{' '}
          <span className="text-[10px] max-[1050px]:mt-2.25 max-[1050px]:block">
            Prototipo UX/UI · Corte demo: 28 sep 2026 · Importes en MXN
          </span>
        </footer>
      </main>
      {selected && (
        <BookingDialog
          booking={selected}
          course={courses.find((course) => course.id === selected.courseId)!}
          trigger={lastTrigger.current}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
