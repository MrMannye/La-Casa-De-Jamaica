'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const steps = [
  {
    number: '01',
    kicker: 'OBSERVA & ELIGE',
    title: ['Todo empieza', 'con una flor.'],
    description:
      'Acércate a los colores, descubre las texturas y encuentra las flores que te inspiran. Esa primera elección marca el tono de tu ramo.',
    footnote: 'Color · Textura · Intuición',
    image: '/assets/hero.webp',
    alt: 'Detalle conceptual de flores durazno, fucsia y vino',
    position: 'object-[75%_50%]',
  },
  {
    number: '02',
    kicker: 'PRUEBA & COMBINA',
    title: ['Dale forma', 'a tu idea.'],
    description:
      'Junta los tallos, juega con las alturas y encuentra el equilibrio. Mueve una flor, añade otra: crear también es darte permiso de probar.',
    footnote: 'Composición · Ritmo · Equilibrio',
    image: '/assets/taller.webp',
    alt: 'Imagen conceptual de unas manos acomodando los tallos de un ramo',
    position: 'object-[50%_55%]',
  },
  {
    number: '03',
    kicker: 'ENVUELVE & DISFRUTA',
    title: ['El último detalle', 'lo hace tuyo.'],
    description:
      'Acomoda, ata y envuelve. Mira el resultado de cerca: cada elección está ahí, en un ramo que lleva un poquito de ti.',
    footnote: 'Detalles · Papel · Tu toque',
    image: '/assets/rosa.webp',
    alt: 'Ramo conceptual de flores rosas y cereza terminado y envuelto en papel claro',
    position: 'object-center',
  },
] as const

export function WorkshopExperience({
  reduceMotion,
}: {
  reduceMotion: boolean | null
}) {
  const root = useRef<HTMLElement>(null)
  const timeline = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(-1)

  useGSAP(
    () => {
      if (reduceMotion !== false) return

      gsap.utils
        .toArray<HTMLElement>('.workshop-reveal', root.current)
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
    const track = timeline.current
    const line = rail.current
    const progress = fill.current
    if (!track || !line || !progress) return

    const scenes = Array.from(
      track.querySelectorAll<HTMLElement>('[data-workshop-step]'),
    )
    const firstMarker =
      scenes[0]?.querySelector<HTMLElement>('[data-milestone]')
    if (!firstMarker) return

    let frame = 0
    let disposed = false
    let previousStep = -1

    function updateProgress() {
      frame = 0
      if (!track || !line || !progress || !firstMarker) return

      // Layout offsets stay stable while GSAP moves the cards into view.
      const center = firstMarker.offsetTop + firstMarker.offsetHeight / 2
      const start = scenes[0].offsetTop
      const length = scenes[scenes.length - 1].offsetTop - start
      line.style.top = `${center}px`
      line.style.height = `${length}px`

      const distance =
        window.innerHeight * 0.58 - (track.getBoundingClientRect().top + center)
      const fraction = Math.max(0, Math.min(1, distance / Math.max(1, length)))
      progress.style.transform = `scaleY(${fraction})`

      let reached = -1
      scenes.forEach((scene, index) => {
        if (distance >= scene.offsetTop - start) reached = index
      })
      if (reached !== previousStep) {
        previousStep = reached
        setCurrentStep(reached)
      }
    }

    function scheduleProgress() {
      if (!disposed && !frame) frame = requestAnimationFrame(updateProgress)
    }

    const observer = new ResizeObserver(scheduleProgress)
    observer.observe(track)
    window.addEventListener('scroll', scheduleProgress, { passive: true })
    window.addEventListener('resize', scheduleProgress)
    document.fonts.ready.then(scheduleProgress)
    updateProgress()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleProgress)
      window.removeEventListener('resize', scheduleProgress)
    }
  }, [])

  return (
    <section
      ref={root}
      id="taller"
      aria-labelledby="workshop-title"
      className="mt-8.75 overflow-clip bg-wine px-[7%] pt-25 pb-9.5 text-cream tablet:px-[6%] tablet:pt-20 tablet:pb-8.75 mobile:mt-5 mobile:pt-16.25 mobile:pb-7.5"
    >
      <div className="workshop-reveal mx-auto mb-17 max-w-212.5 text-center mobile:mb-8.75">
        <p className="text-[12px] leading-[1.7] font-medium tracking-[.13em] text-yellow">
          02 / ASÍ ES EL TALLER
        </p>
        <h2
          id="workshop-title"
          className="my-5.5 font-editorial text-[clamp(43px,4.7vw,72px)] leading-[1.09] font-normal tracking-[-.035em] mobile:my-4.75 mobile:text-[clamp(36px,9vw,54px)]"
        >
          Menos prisa.
          <br />
          <em>Más manos entre flores.</em>
        </h2>
        <p className="text-[16px] leading-[1.75] text-[#e0cbd2] mobile:text-[15px]">
          Un color te llama. Una forma te sorprende.
          <br className="mobile:hidden" /> Y, tallo a tallo, empieza a aparecer
          algo tuyo.
        </p>
      </div>

      <div
        ref={timeline}
        className="relative mx-auto max-w-312.5 pl-19 mobile:pl-10.5"
      >
        <div
          ref={rail}
          aria-hidden="true"
          className="pointer-events-none absolute top-14.5 left-5.75 w-0.5 bg-[#f8f4e930] mobile:left-3.5 mobile:w-px"
        >
          <div
            ref={fill}
            className="h-full w-full origin-top transform-[scaleY(0)] bg-yellow"
          />
        </div>

        <ol className="relative m-0 grid list-none gap-8.75 p-0 mobile:gap-6.5">
          {steps.map((step, index) => (
            <li
              key={step.number}
              data-workshop-step={step.number}
              data-reached={index <= currentStep}
              data-current={index === currentStep}
              aria-current={index === currentStep ? 'step' : undefined}
              className="workshop-reveal group relative grid grid-cols-2 items-stretch rounded-[5px] border border-[#f8f4e923] bg-[#ffffff06] transition-[border-color,background] duration-250 data-[current=true]:border-[#f3db7970] data-[current=true]:bg-[#ffffff0b] mobile:grid-cols-1"
            >
              <span
                data-milestone
                aria-hidden="true"
                className="absolute top-8.5 -left-19 z-2 grid size-12 place-items-center rounded-full border border-[#f3db7960] bg-wine text-[13px] tracking-[.06em] text-yellow transition-[background,color,box-shadow] duration-250 group-data-[current=true]:shadow-[0_0_0_6px_#f3db7920] group-data-[reached=true]:border-yellow group-data-[reached=true]:bg-yellow group-data-[reached=true]:text-wine after:absolute after:top-1/2 after:left-full after:h-px after:w-7 after:bg-[#f3db7940] after:content-[''] mobile:top-6 mobile:-left-10.5 mobile:size-7 mobile:text-[10px] mobile:group-data-[current=true]:shadow-[0_0_0_4px_#f3db7920] mobile:after:w-3.5"
              >
                {step.number}
              </span>

              <div
                className={`relative min-h-88.75 overflow-hidden bg-[#754553] workshop-tablet:min-h-87.5 mobile:aspect-4/3 mobile:min-h-0 mobile:rounded-t-sm mobile:rounded-b-none ${index % 2 ? 'col-start-2 row-start-1 rounded-r-sm mobile:col-auto mobile:row-auto' : 'rounded-l-sm'}`}
              >
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 82vw, (min-width: 1600px) 586px, 43vw"
                  className={`object-cover ${step.position}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 left-5.5 rounded-[30px] bg-cream px-3.75 py-2.5 text-[12px] tracking-widest text-wine mobile:bottom-3.75 mobile:left-4 mobile:text-[11px]"
                >
                  {step.number} / 03
                </span>
              </div>

              <div
                className={`self-center px-[clamp(28px,4vw,65px)] py-10 workshop-tablet:p-7 mobile:px-4.75 mobile:pt-6 mobile:pb-7 ${index % 2 ? 'col-start-1 row-start-1 mobile:col-auto mobile:row-auto' : ''}`}
              >
                <p className="text-[11px] leading-[1.7] tracking-[.12em] text-yellow mobile:text-[10px] mobile:tracking-[.08em]">
                  {step.kicker}
                </p>
                <h3 className="my-5 font-editorial text-[clamp(34px,3.4vw,50px)] leading-[1.07] font-normal tracking-[-.03em] workshop-tablet:text-[35px] mobile:my-4.5 mobile:text-[32px]">
                  {step.title[0]}
                  <br />
                  {step.title[1]}
                </h3>
                <p className="max-w-105 text-[16px] leading-[1.75] text-[#e5d2d9] workshop-tablet:text-[15px] mobile:text-[15px]">
                  {step.description}
                </p>
                <span className="mt-5.5 block text-[12px] tracking-wider text-[#d3b4c0] mobile:mt-4.75 mobile:tracking-normal">
                  {step.footnote}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="workshop-reveal mx-auto mt-13 mb-7 flex max-w-275 items-center justify-center gap-17.5 border-t border-cream/20 pt-14.5 mobile:mt-9.5 mobile:gap-4.5 mobile:pt-9">
        <span
          aria-hidden="true"
          className="text-[40px] text-yellow mobile:text-[24px]"
        >
          ✳
        </span>
        <p className="text-center font-editorial text-[clamp(30px,3.2vw,46px)] leading-[1.18] tracking-tight mobile:text-[29px]">
          Las flores ponen el color.
          <br />
          <em>Tú pones la historia.</em>
        </p>
        <span
          aria-hidden="true"
          className="text-[40px] text-yellow mobile:text-[24px]"
        >
          ✳
        </span>
      </div>

      <p className="mx-auto max-w-155 text-center text-[12px] leading-[1.7] text-[#d6bbc4]">
        Recorrido ilustrativo. La dinámica y los materiales se confirmarán en
        cada taller.
      </p>
    </section>
  )
}
