'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => {
  const p = clamp(value)
  return p * p * (3 - 2 * p)
}

type Props = {
  children: ReactNode
  reduceMotion: boolean | null
  onInsideChange: (inside: boolean) => void
}

export function CasitaEntrance({
  children,
  reduceMotion,
  onInsideChange,
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const facade = useRef<HTMLElement>(null)
  const image = useRef<HTMLDivElement>(null)
  const portal = useRef<HTMLDivElement>(null)
  const previousView = useRef<{
    inside: boolean
    progress: number
    beyond: number
  } | null>(null)

  useLayoutEffect(() => {
    const element = root.current
    const frame = stage.current
    const front = facade.current
    const picture = image.current
    const inside = portal.current
    if (!element || !frame || !front || !picture || !inside) return
    const animated =
      reduceMotion === false &&
      CSS.supports('clip-path', 'path("M 0 0 L 1 1 Z")')
    element.dataset.animated = String(animated)
    let disposed = false
    let animationFrame = 0
    let refreshFrame = 0
    let settleFrame = 0
    let progress = 0
    let target = 0
    let lastTime = 0
    let isInside: boolean | undefined
    let top = 0
    let distance = 1
    let width = 0
    let height = 0
    let imageTop = 0
    let imageHeight = 0
    let imageWidth = 0

    function updateInside(value: boolean) {
      if (isInside === value) return
      isInside = value
      inside!.inert = animated && !value
      inside!.setAttribute('aria-hidden', String(animated && !value))
      onInsideChange(value)
    }

    function draw(value: number) {
      if (!animated) {
        updateInside(inside!.getBoundingClientRect().top <= height * 0.3)
        return
      }
      const eased = smooth(value)
      const zoom = Math.pow(
        Math.max(22, (width / (imageWidth * 0.128)) * 1.1),
        eased,
      )
      const centerX = width / 2
      const originY = imageTop + imageHeight * 0.59
      const travel = (height / 2 - originY) * eased
      const convertY = (ratio: number) =>
        originY + (imageTop + imageHeight * ratio - originY) * zoom + travel
      const half = imageWidth * 0.064 * zoom
      const left = centerX - half
      const right = centerX + half
      const arch = convertY(0.376)
      const shoulder = convertY(0.486)
      const bottom = convertY(0.826)
      const control = (shoulder - arch) * 0.55
      const path = `path("M ${left} ${bottom} L ${left} ${shoulder} C ${left} ${shoulder - control} ${centerX - half * 0.55} ${arch} ${centerX} ${arch} C ${centerX + half * 0.55} ${arch} ${right} ${shoulder - control} ${right} ${shoulder} L ${right} ${bottom} Z")`
      const properties: Record<string, string> = {
        '--entry-clip': value >= 0.995 ? 'none' : path,
        '--entry-zoom': String(zoom),
        '--entry-travel': `${travel}px`,
        '--entry-type-opacity': String(1 - clamp(value * 4)),
        '--entry-type-y': `${-value * 90}px`,
        '--entry-ui-opacity': String(1 - clamp(value * 5)),
        '--entry-inside-scale': String(1.12 - 0.12 * eased),
        '--entry-content-y': `${24 * (1 - smooth((value - 0.3) / 0.7))}px`,
        '--entry-details': String(smooth((value - 0.65) / 0.35)),
        '--entry-progress': String(value),
      }
      for (const [name, setting] of Object.entries(properties))
        element!.style.setProperty(name, setting)
      const entered = value >= 0.995
      front!.style.visibility = entered ? 'hidden' : 'visible'
      front!.style.pointerEvents = value < 0.16 ? 'auto' : 'none'
      updateInside(entered)
      front!.inert = entered
      front!.setAttribute('aria-hidden', String(entered))
      if (entered && front!.contains(document.activeElement))
        inside!
          .querySelector<HTMLElement>('#hero-title')
          ?.focus({ preventScroll: true })
    }

    function tick(time: number) {
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16
      lastTime = time
      progress += (target - progress) * (1 - Math.exp(-elapsed / 100))
      if (Math.abs(target - progress) < 0.0001) progress = target
      draw(progress)
      animationFrame = progress !== target ? requestAnimationFrame(tick) : 0
      if (!animationFrame) lastTime = 0
    }

    function onScroll() {
      target = clamp((window.scrollY - top) / distance)
      if (!animated) draw(target)
      else if (!animationFrame) animationFrame = requestAnimationFrame(tick)
    }

    function measure() {
      top = element!.getBoundingClientRect().top + window.scrollY
      width = frame!.clientWidth
      height = front!.clientHeight
      imageTop = picture!.offsetTop
      imageWidth = picture!.clientWidth
      imageHeight = picture!.clientHeight
      // Leave a brief resting view of the hero before the sticky scene scrolls away.
      distance = Math.max(1, (element!.offsetHeight - height) * 0.9)
      target = clamp((window.scrollY - top) / distance)
      progress = target
      draw(progress)
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    function enter(focus: boolean) {
      const destination = animated
        ? top + distance
        : inside!.getBoundingClientRect().top + window.scrollY
      // Native anchors point to the top of a sticky hero, not its revealed position.
      window.scrollTo({ top: destination, behavior: 'instant' })
      target = progress = animated ? 1 : 0
      draw(progress)
      if (focus)
        inside!
          .querySelector<HTMLElement>('#hero-title')
          ?.focus({ preventScroll: true })
    }

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href]')
          : null
      if (
        !anchor ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      )
        return
      const url = new URL(anchor.href, location.href)
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !['#inicio', '#main'].includes(url.hash)
      )
        return
      event.preventDefault()
      history.pushState(null, '', url.hash)
      enter(true)
    }

    function onHashChange() {
      if (['#inicio', '#main'].includes(location.hash)) enter(true)
      else if (location.hash)
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView()
    }

    const previous = previousView.current
    measure()
    // Restore the visual position after the other GSAP sections finish reverting
    // their layout on a motion-preference change.
    settleFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (previous?.beyond !== undefined && previous.beyond >= 0) {
        window.scrollTo({
          top: top + element.offsetHeight + previous.beyond,
          behavior: 'instant',
        })
      } else if (previous && (previous.inside || previous.progress > 0.1)) {
        enter(false)
      } else if (!previous && location.hash) {
        onHashChange()
      }
    })
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(picture)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('click', onClick, true)
    document.fonts.ready.then(() => {
      if (!disposed) measure()
    })
    return () => {
      previousView.current = {
        inside: isInside === true,
        progress,
        beyond: window.scrollY - top - element.offsetHeight,
      }
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
      cancelAnimationFrame(refreshFrame)
      cancelAnimationFrame(settleFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onClick, true)
      delete element.dataset.animated
      element.removeAttribute('style')
      front.removeAttribute('style')
      front.removeAttribute('aria-hidden')
      inside.removeAttribute('aria-hidden')
      front.inert = false
      inside.inert = false
    }
  }, [reduceMotion, onInsideChange])

  return (
    <div
      ref={root}
      id="bienvenida"
      data-casita-entrance
      className="relative bg-cream"
    >
      <div ref={stage} data-entry-stage>
        <section
          ref={facade}
          data-entry-front
          aria-labelledby="entrance-title"
          className="relative isolate min-h-svh overflow-hidden bg-[#f8ecda]"
        >
          <div ref={image} data-entry-image>
            <Image
              src="/assets/casita-entrada.webp"
              alt="Fachada conceptual de una casita crema con una puerta arqueada color vino y flores alrededor"
              width={1536}
              height={1024}
              priority
              unoptimized
              sizes="(max-width: 700px) 125vw, 105svh"
              className="h-full w-full origin-[50%_59%] object-contain mix-blend-multiply"
            />
          </div>
          <div
            data-entry-heading
            className="pointer-events-none absolute inset-x-[5%] top-[9%] z-2 text-center mobile:inset-x-[4%] mobile:top-[13%] compact-mobile:top-[12%] landscape-short:top-[12%]"
          >
            <p className="mb-5 text-xs tracking-[.2em] mobile:mb-4.5 mobile:tracking-[.09em] landscape-short:mb-2.25">
              MERCADO JAMAICA · CIUDAD DE MÉXICO
            </p>
            <h1
              id="entrance-title"
              className="m-0 font-editorial text-[clamp(64px,8.6vw,145px)] leading-[.98] font-normal tracking-[-.055em] mobile:text-[clamp(61px,14vw,95px)] mobile:leading-[1.02] landscape-short:text-[52px]"
            >
              La Casita{' '}
              <em className="font-normal mobile:block">de Jamaica.</em>
            </h1>
          </div>
          <div
            data-entry-bottom
            className="absolute inset-x-[5%] bottom-[7%] z-3 flex items-end justify-between gap-6 mobile:inset-x-[7%] mobile:bottom-[9%] mobile:justify-center"
          >
            <p className="text-base leading-[1.55] mobile:hidden landscape-short:hidden">
              Las flores están dentro.
              <br />
              <span className="text-sm">Pasa, esta también es tu casita.</span>
            </p>
            <p className="min-w-38.75 text-right text-base mobile:min-w-32.5 mobile:text-left mobile:text-sm landscape-short:ml-auto">
              Desliza para entrar
              <span
                className="mt-3 block h-0.5 w-full overflow-hidden bg-wine/15"
                aria-hidden="true"
              >
                <i
                  data-entry-progress
                  className="block h-full origin-left bg-wine"
                />
              </span>
            </p>
          </div>
        </section>
        <div ref={portal} data-entry-portal>
          {children}
        </div>
      </div>
    </div>
  )
}
