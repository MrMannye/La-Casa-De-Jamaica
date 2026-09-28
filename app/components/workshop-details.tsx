import Image from 'next/image'
import Link from 'next/link'
import {
  type Workshop,
  workshopFullDate,
  workshopImage,
  workshopPrice,
  whatsappLink,
} from '../data/workshops'

export function WorkshopPhoto({
  workshop,
  priority = false,
}: {
  workshop: Workshop
  priority?: boolean
}) {
  return (
    <div className="relative h-full min-h-55 overflow-hidden bg-[#eee7df]">
      <Image
        src={workshopImage(workshop)}
        alt={`Imagen ilustrativa de ${workshop.name}, creada con IA`}
        fill
        unoptimized
        priority={priority}
        sizes="(max-width: 700px) 94vw, 50vw"
        className="object-cover"
      />
      <span className="absolute bottom-2 left-2.5 rounded bg-cream/90 px-2 py-1 text-[10px] text-wine">
        Imagen ilustrativa
      </span>
    </div>
  )
}

export function WorkshopDetails({
  workshop,
  headingId,
  modal = false,
}: {
  workshop: Workshop
  headingId?: string
  modal?: boolean
}) {
  const Title = modal ? 'h2' : 'h1'
  return (
    <div
      className={`flex min-w-0 flex-col justify-center ${modal ? 'p-7 mobile:p-5' : 'p-[clamp(24px,4vw,60px)]'}`}
    >
      <p className="pr-5 text-[10px] leading-[1.7] tracking-widest text-muted">
        TALLER · {workshop.categories.join(' / ').toUpperCase()}
      </p>
      <Title
        id={headingId}
        className={`my-3 font-editorial leading-[1.1] tracking-[-.035em] ${modal ? 'text-[32px] mobile:text-[27px]' : 'text-[clamp(36px,4vw,60px)]'}`}
      >
        {workshop.name}
      </Title>
      <p className="mb-5 text-[23px]">
        {workshopPrice(workshop.price)}{' '}
        <span className="text-xs text-muted">MXN</span>
      </p>
      <dl className="border-t border-wine/20 text-[13px] leading-[1.6]">
        <div className="grid grid-cols-[52px_1fr] gap-3 border-b border-wine/20 py-3">
          <dt className="text-muted">Fecha</dt>
          <dd>
            <time dateTime={`2026-10-${String(workshop.day).padStart(2, '0')}`}>
              {workshopFullDate(workshop)}
            </time>
          </dd>
        </div>
        <div className="grid grid-cols-[52px_1fr] gap-3 border-b border-wine/20 py-3">
          <dt className="text-muted">Lugar</dt>
          <dd>
            Mercado de Jamaica
            <br />
            Carril 3, local 799 · CDMX
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-[1.6] text-muted">
        Confirma horario, cupo y materiales por WhatsApp.
      </p>
      <a
        href={whatsappLink(workshop)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-between gap-4 rounded-full bg-wine px-5 py-4 text-sm text-cream transition-colors hover:bg-[#773449]"
      >
        Consultar mi lugar <span aria-hidden="true">↗</span>
      </a>
      <a
        href={whatsappLink(workshop, true)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs leading-normal underline underline-offset-4"
      >
        Otro contacto: 55 6091 9763 ↗
      </a>
      <p className="mt-3 text-[11px] leading-normal text-muted">
        Consultar no reserva un lugar ni realiza un cobro.
      </p>
      {modal && (
        <Link
          href={`/talleres/${workshop.id}`}
          className="mt-4 border-t border-wine/20 pt-3 text-xs underline underline-offset-4"
        >
          Ver página del taller ↗
        </Link>
      )}
    </div>
  )
}
