import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '../../components/site-header'
import { SiteFooter } from '../../components/site-footer'
import {
  WorkshopDetails,
  WorkshopPhoto,
} from '../../components/workshop-details'
import {
  workshops,
  workshopFullDate,
  workshopPrice,
} from '../../data/workshops'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return workshops.map(({ id }) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const workshop = workshops.find((item) => item.id === id)
  if (!workshop) return { title: 'Taller no encontrado — La Casita de Jamaica' }
  return {
    title: `${workshop.name} — La Casita de Jamaica`,
    description: `${workshopFullDate(workshop)} · ${workshopPrice(workshop.price)} MXN. Consulta horario, materiales y disponibilidad en Mercado de Jamaica, CDMX.`,
  }
}

export default async function WorkshopPage({ params }: Props) {
  const { id } = await params
  const workshop = workshops.find((item) => item.id === id)
  if (!workshop) notFound()
  const index = workshops.findIndex((item) => item.id === id)
  const previous = workshops[index - 1]
  const next = workshops[index + 1]
  return (
    <>
      <SiteHeader workshopsPage />
      <main
        id="main"
        className="mx-auto max-w-360 px-[7%] pt-43.75 pb-20 mobile:px-[6%] mobile:pt-35.5 mobile:pb-12.5"
      >
        <nav
          aria-label="Ruta de navegación"
          className="mb-8 flex flex-wrap gap-2 text-xs leading-[1.7] text-muted"
        >
          <Link href="/" className="hover:underline">
            La Casita
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/talleres#agenda" className="hover:underline">
            Talleres de octubre
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {String(workshop.day).padStart(2, '0')} OCT
          </span>
        </nav>
        <article className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-wine/20 bg-[#fffcf5] mobile:grid-cols-1">
          <div className="min-h-145 mobile:aspect-4/3 mobile:min-h-0">
            <WorkshopPhoto workshop={workshop} priority />
          </div>
          <WorkshopDetails workshop={workshop} />
        </article>
        <nav
          aria-label="Más talleres"
          className="mt-8 grid grid-cols-2 gap-6 border-b border-wine/20 pb-8 text-sm leading-[1.6] mobile:text-xs"
        >
          <div>
            {previous && (
              <Link
                href={`/talleres/${previous.id}`}
                className="inline-block hover:underline"
              >
                <span className="mb-1 block text-xs text-muted">
                  ← Taller anterior · {previous.day} OCT
                </span>
                {previous.name}
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link
                href={`/talleres/${next.id}`}
                className="inline-block hover:underline"
              >
                <span className="mb-1 block text-xs text-muted">
                  Siguiente taller · {next.day} OCT →
                </span>
                {next.name}
              </Link>
            )}
          </div>
        </nav>
        <Link
          href="/talleres#agenda"
          className="mt-8 inline-flex items-center gap-5 rounded-full border border-wine px-6 py-3.5 text-sm transition-colors hover:bg-wine hover:text-cream"
        >
          ← Ver el calendario completo
        </Link>
      </main>
      <SiteFooter />
    </>
  )
}
