'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const bouquets = [
  {
    title: 'Un poquito de sol',
    image: '/assets/sol.webp',
    alt: 'Ramo conceptual amarillo y naranja con flores de cempasúchil en un florero de cerámica',
    mood: 'CÁLIDO & ESPONTÁNEO',
    caption: 'Amarillos, naranjas y ganas de quedarse.',
    description:
      'Amarillos luminosos, naranjas intensos y flores que se mueven con libertad. Una composición para esos días en los que quieres llevarte un pedacito de sol.',
    background: 'bg-[#f2dda0]',
    position: 'object-center',
    dialogPosition: 'object-center',
  },
  {
    title: 'A flor de piel',
    image: '/assets/rosa.webp',
    alt: 'Ramo conceptual de flores rosa suave y rojo cereza envuelto en papel claro',
    mood: 'SUAVE & ROMÁNTICO',
    caption: 'Flores que dicen lo que a veces cuesta.',
    description:
      'Rosas suaves y acentos cereza, juntos en un ramo lleno de contrastes delicados. Un gesto pequeño que puede decir mucho.',
    background: 'bg-[#e8c3c8]',
    position: 'object-center',
    dialogPosition: 'object-center',
  },
  {
    title: 'Sin pedir permiso',
    image: '/assets/hero.webp',
    alt: 'Ramo conceptual expresivo de flores fucsia, durazno y vino con follaje verde',
    mood: 'LIBRE & LLENO DE VIDA',
    caption: 'Un encuentro de texturas, formas y color.',
    description:
      'Formas inesperadas y colores que se encuentran. Una invitación a crear con intuición y dejar que cada flor encuentre su lugar.',
    background: 'bg-[#ecdacf]',
    position: 'object-[76%_50%]',
    dialogPosition: 'object-[75%_50%]',
  },
  {
    title: 'Aire de domingo',
    image: '/assets/aire.webp',
    alt: 'Ramo conceptual de flores blancas y lilas con follaje delicado, envuelto en papel marfil',
    mood: 'LIGERO & NATURAL',
    caption: 'Blancos, lilas y un respiro entre flores.',
    description:
      'Flores blancas, toques de lila y follaje delicado. Un ramo ligero que invita a bajar el ritmo y disfrutar de las cosas sencillas.',
    background: 'bg-[#ded6e8]',
    position: 'object-center',
    dialogPosition: 'object-center',
  },
] as const

const ribbonPhrases = [
  'Un poquito de color',
  'Un momento para ti',
  'Algo hecho con tus manos',
]

export function BouquetGallery({
  reduceMotion,
}: {
  reduceMotion: boolean | null
}) {
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [paused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const selected = bouquets[selectedIndex]
  const ribbonPaused = paused || reduceMotion !== false

  useGSAP(
    () => {
      if (reduceMotion !== false) return

      gsap.utils
        .toArray<HTMLElement>('.bouquet-reveal', root.current)
        .forEach((element) => {
          gsap.from(element, {
            y: 34,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          })
        })

      let active = true
      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh()
      })
      return () => {
        active = false
      }
    },
    { scope: root, dependencies: [reduceMotion], revertOnUpdate: true },
  )

  useEffect(() => {
    if (!isOpen || !dialog.current) return

    const modal = dialog.current
    const previousOverflow = document.body.style.overflow
    const previousGutter = document.documentElement.style.scrollbarGutter
    // Keep the page in place while the native dialog traps focus in the top layer.
    document.documentElement.style.scrollbarGutter = 'stable'
    document.body.style.overflow = 'hidden'
    modal.showModal()

    return () => {
      if (modal.open) modal.close()
      document.body.style.overflow = previousOverflow
      document.documentElement.style.scrollbarGutter = previousGutter
      opener.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  function showBouquet(index: number, button: HTMLButtonElement) {
    opener.current = button
    setSelectedIndex(index)
    setIsOpen(true)
  }

  function changeBouquet(direction: number) {
    setSelectedIndex(
      (index) => (index + direction + bouquets.length) % bouquets.length,
    )
  }

  return (
    <div ref={root}>
      <div className="relative min-h-19 overflow-hidden border-y border-wine/15 bg-yellow font-editorial text-[25px] tracking-[-.02em] tablet:text-[21px] mobile:min-h-16.25 mobile:text-[19px]">
        <div
          className="ribbon-track flex w-max"
          style={{ animationPlayState: ribbonPaused ? 'paused' : 'running' }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex min-w-screen shrink-0 items-center justify-around gap-[clamp(28px,4vw,72px)] py-5.5 pr-[clamp(28px,4vw,72px)] whitespace-nowrap mobile:gap-7 mobile:py-4.75 mobile:pr-7"
            >
              {ribbonPhrases.map((phrase) => (
                <span key={phrase} className="contents">
                  <span className="shrink-0">{phrase}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-[Georgia,serif] text-[26px] tablet:text-[22px]"
                  >
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section
        id="ramos"
        aria-labelledby="gallery-title"
        className="px-[5.5%] pt-28 pb-10 mobile:px-[6%] mobile:pt-17 mobile:pb-7.5"
      >
        <div className="bouquet-reveal mx-auto mb-15 max-w-212.5 text-center mobile:mb-9">
          <p className="text-[12px] leading-[1.7] font-medium tracking-[.13em]">
            01 / EL LENGUAJE DE LAS FLORES
          </p>
          <h2
            id="gallery-title"
            className="mt-5 font-editorial text-[clamp(39px,4vw,62px)] leading-[1.12] font-normal tracking-[-.04em] mobile:text-[clamp(33px,8.6vw,45px)]"
          >
            Ningún ramo igual.
            <br />
            <em>Todos tienen algo de ti.</em>
          </h2>
          <p className="mx-auto mt-5.5 max-w-122.5 text-[16px] leading-[1.7] text-muted mobile:mt-5 mobile:max-w-82.5 mobile:text-[15px]">
            Hay días de colores intensos y otros de flores suaves.
            <br className="mobile:hidden" /> ¿Con cuál te quedas hoy?
          </p>
        </div>

        <div className="grid grid-cols-4 items-start gap-5.5 gallery-tablet:grid-cols-2 gallery-tablet:gap-x-6.25 gallery-tablet:gap-y-8.75 mobile:grid-cols-1 mobile:gap-9">
          {bouquets.map((bouquet, index) => (
            <article
              key={bouquet.title}
              className={`bouquet-reveal ${index % 2 ? 'pt-10.5 mobile:pt-0' : ''}`}
            >
              <button
                type="button"
                onClick={(event) => showBouquet(index, event.currentTarget)}
                aria-label={`Ver en grande ${bouquet.title}`}
                aria-haspopup="dialog"
                aria-controls="bouquet-dialog"
                className={`group relative block aspect-3/4 w-full cursor-pointer overflow-hidden rounded-[3px] text-left mobile:aspect-[4/4.7] ${bouquet.background}`}
              >
                <Image
                  src={bouquet.image}
                  alt={bouquet.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 88vw, (max-width: 1100px) 43vw, 22vw"
                  className={`object-cover transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.055] group-focus-visible:scale-[1.055] ${bouquet.position}`}
                />
                <span className="absolute top-5 left-4.25 rounded-[30px] bg-cream px-2.75 py-2.25 text-[10px] tracking-[.09em] tablet:top-3 tablet:left-3 tablet:text-[9px] mobile:top-4.25 mobile:left-4.25 mobile:text-[10px]">
                  {bouquet.mood}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-4.5 bottom-4.5 grid size-10.75 place-items-center rounded-full bg-cream text-[23px] transition-transform duration-300 group-hover:rotate-45 group-focus-visible:rotate-45"
                >
                  ↗
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-16.25 bottom-6.25 left-5 translate-y-2 font-editorial text-[25px] text-white opacity-0 transition-[opacity,translate] duration-300 text-shadow-[0_1px_10px_#0009] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  {bouquet.title}.
                </span>
              </button>
              <div className="mt-5.5 flex items-center justify-between mobile:mt-4.25">
                <h3 className="font-editorial text-[clamp(21px,1.9vw,28px)] font-normal tracking-[-.03em] gallery-tablet:text-[28px]">
                  {bouquet.title}
                </h3>
                <span className="text-[12px] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-normal text-muted">
                {bouquet.caption}
              </p>
            </article>
          ))}
        </div>

        <div className="bouquet-reveal flex items-center justify-center gap-6.25 pt-23.75 pb-16.75 text-left mobile:gap-4 mobile:pt-13.75 mobile:pb-9.5">
          <span aria-hidden="true" className="text-[60px] mobile:text-[43px]">
            ✳
          </span>
          <p className="font-editorial text-[31px] leading-[1.2] tracking-tight mobile:text-[26px]">
            La inspiración empieza aquí.
            <br />
            <em>Lo bonito es hacerlo tuyo.</em>
          </p>
        </div>
      </section>

      <dialog
        ref={dialog}
        id="bouquet-dialog"
        aria-labelledby="bouquet-dialog-title"
        aria-describedby="bouquet-dialog-description"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            event.currentTarget.close()
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            const controls =
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                'button:not(:disabled)',
              )
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (
              event.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === event.currentTarget)
            ) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            changeBouquet(event.key === 'ArrowRight' ? 1 : -1)
          }
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[min(940px,94vw)] max-w-none overflow-auto rounded-md border-0 bg-cream p-0 text-wine backdrop:bg-[#200d17b8] backdrop:backdrop-blur-[7px] open:grid open:grid-cols-[55%_45%] mobile:open:grid-cols-1"
      >
        <button
          type="button"
          autoFocus
          onClick={() => dialog.current?.close()}
          aria-label="Cerrar imagen"
          className="absolute top-3.5 right-3.5 z-3 grid size-10.5 cursor-pointer place-items-center rounded-full bg-cream text-[30px] leading-none mobile:top-2.5 mobile:right-2.5"
        >
          ×
        </button>
        {isOpen && (
          <>
            <div className="relative h-[min(670px,83dvh)] min-w-0 bg-[#e9d9bb] mobile:h-[46dvh]">
              <Image
                src={selected.image}
                alt={selected.alt}
                fill
                unoptimized
                loading="eager"
                sizes="(max-width: 700px) 94vw, 517px"
                className={`object-cover ${selected.dialogPosition}`}
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center px-8 pt-17.5 pb-8 mobile:p-6.25">
              <p className="text-[12px] leading-[1.7] font-medium tracking-[.13em]">
                EL LENGUAJE DE LAS FLORES
              </p>
              <h2
                id="bouquet-dialog-title"
                className="my-5.75 font-editorial text-[47px] leading-[1.06] font-normal tracking-[-.04em] mobile:my-3 mobile:text-[37px]"
              >
                {selected.title}
              </h2>
              <p
                id="bouquet-dialog-description"
                className="text-[16px] leading-[1.7] mobile:text-[14px]"
              >
                {selected.description}
              </p>
              <p className="mt-6 text-[12px] leading-[1.7] text-muted mobile:mt-2.5">
                Imagen conceptual creada con IA.
              </p>
              <div className="mt-11.25 flex items-center justify-between mobile:mt-4.25">
                <button
                  type="button"
                  onClick={() => changeBouquet(-1)}
                  aria-label="Ver ramo anterior"
                  className="size-11 cursor-pointer rounded-full border border-wine/15 text-[23px] hover:bg-yellow"
                >
                  ←
                </button>
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-[12px] tracking-[.15em]"
                >
                  <span className="sr-only">{selected.title}, ramo </span>
                  {String(selectedIndex + 1).padStart(2, '0')} / 04
                </span>
                <button
                  type="button"
                  onClick={() => changeBouquet(1)}
                  aria-label="Ver siguiente ramo"
                  className="size-11 cursor-pointer rounded-full border border-wine/15 text-[23px] hover:bg-yellow"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  )
}
