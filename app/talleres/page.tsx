import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { WorkshopCalendar } from '../components/workshop-calendar'
import { WorkshopCommunity } from '../components/workshop-community'

export const metadata: Metadata = {
  title: 'Talleres de octubre 2026 — La Casita de Jamaica',
  description:
    'Explora los 14 talleres de octubre de 2026: calendario, fechas, precios y consultas en Mercado de Jamaica, CDMX.',
}

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ taller?: string | string[] }>
}) {
  const { taller } = await searchParams
  return (
    <>
      <SiteHeader workshopsPage />
      <main id="main">
        <section className="mx-auto max-w-[1600px] px-[7%] pt-43.75 pb-13.5 mobile:px-[6%] mobile:pt-35.5 mobile:pb-6.25">
          <Link
            href="/"
            className="mb-9.5 inline-block text-[13px] text-muted hover:text-wine mobile:mb-7.25 mobile:text-xs"
          >
            ← Volver a La Casita
          </Link>
          <div className="relative flex items-center justify-between gap-7.5 mobile:block">
            <div>
              <p className="text-xs leading-[1.7] tracking-[.13em] mobile:max-w-[75%] mobile:text-[10px]">
                TALLERES · FLORES · COMUNIDAD
              </p>
              <h1 className="mt-5 font-editorial text-[clamp(65px,7.2vw,108px)] leading-[1.02] tracking-tighter mobile:mt-4.5 mobile:text-[clamp(49px,11vw,70px)]">
                Octubre se crea
                <br />
                <em>con las manos.</em>
              </h1>
            </div>
            <div
              aria-hidden="true"
              className="mr-[4%] flex size-47.5 shrink-0 rotate-[8deg] flex-col items-center justify-center rounded-full border border-wine bg-yellow max-[900px]:mr-0 max-[900px]:size-37.5 mobile:absolute mobile:-top-3.5 mobile:right-0 mobile:size-17.5"
            >
              <span className="text-[11px] tracking-[.14em] mobile:text-[6px] mobile:tracking-[.07em]">
                AGENDA FLORAL
              </span>
              <strong className="font-editorial text-[80px] leading-[1.1] font-normal tracking-[-.06em] max-[900px]:text-[65px] mobile:text-[30px]">
                Oct
              </strong>
              <span className="text-[11px] tracking-[.14em] mobile:text-[6px] mobile:tracking-[.07em]">
                2026 · CDMX
              </span>
            </div>
          </div>
          <div className="mt-8.5 flex items-end justify-between gap-6 border-b border-wine/20 pb-10 mobile:mt-5.75 mobile:block mobile:pb-7">
            <p className="text-base leading-[1.7] text-muted mobile:text-[15px]">
              Un mes para aprender, probar algo nuevo
              <br className="mobile:hidden" /> y darle forma a tu siguiente
              idea.
            </p>
            <a
              href="#agenda"
              className="flex items-center gap-6.25 border-b border-wine pb-2 text-sm mobile:mt-5 mobile:inline-flex mobile:text-[13px]"
            >
              Elige tu taller <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section
          id="agenda"
          aria-labelledby="agenda-title"
          className="mx-auto max-w-[1600px] px-[7%] pt-3.75 pb-20 gallery-tablet:px-[4%] mobile:px-[6%] mobile:pb-12.5"
        >
          <div className="flex items-end justify-between gap-6.25 mobile:block">
            <div>
              <p className="text-xs leading-[1.7] tracking-[.13em]">
                EL CALENDARIO DE LA CASITA
              </p>
              <h2
                id="agenda-title"
                className="mt-3.75 font-editorial text-[clamp(32px,3.5vw,49px)] leading-[1.15] tracking-[-.035em] mobile:mt-3.25 mobile:text-[34px]"
              >
                Hazle espacio a las flores.
              </h2>
            </div>
            <a
              href="/assets/talleres/calendario-octubre-2026.png"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 border-b border-wine/20 pb-1.5 text-[13px] mobile:mt-5 mobile:inline-block mobile:text-xs"
            >
              Ver cartel original ↗
            </a>
          </div>
          <WorkshopCalendar
            initialWorkshopId={typeof taller === 'string' ? taller : undefined}
          />
        </section>
        <WorkshopCommunity />
      </main>
      <SiteFooter />
    </>
  )
}
