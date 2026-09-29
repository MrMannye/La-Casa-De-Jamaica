import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between gap-8 border-t border-wine/20 px-[7%] py-10 mobile:flex-wrap mobile:gap-6 mobile:px-[6%]">
      <Link
        href="/"
        className="flex items-center gap-5 font-editorial text-[27px] tracking-[-.04em] mobile:text-[24px]"
      >
        la casita de Jamaica <span aria-hidden="true">✳</span>
      </Link>
      <p className="text-xs leading-[1.8] text-muted mobile:order-3 mobile:w-full">
        Hecho de flores. Hecho de momentos.
        <br />
        <span>Talleres · Octubre 2026</span>
        <br />
      </p>
      <a
        href="#main"
        aria-label="Volver al inicio"
        className="grid size-11 place-items-center rounded-full border border-wine/25 text-xl hover:bg-wine hover:text-cream"
      >
        ↑
      </a>
    </footer>
  )
}
