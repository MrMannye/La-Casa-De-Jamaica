import Link from 'next/link';
import { SiteHeader } from '../../components/site-header';

export default function WorkshopNotFound() {
  return <><SiteHeader workshopsPage /><main id="main" className="mx-auto min-h-svh max-w-3xl px-[6%] pt-[190px] pb-20"><p className="text-xs tracking-[.13em]">LA CASITA DE JAMAICA</p><h1 className="mt-6 mb-5 font-editorial text-5xl leading-[1.1]">No encontramos este taller.</h1><p className="leading-[1.7] text-muted">Puedes consultar las actividades disponibles en el calendario de octubre.</p><Link href="/talleres" className="mt-8 inline-block rounded-full bg-wine px-6 py-4 text-sm text-cream">Volver al calendario ↗</Link></main></>;
}
