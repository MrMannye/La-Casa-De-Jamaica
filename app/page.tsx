'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BouquetGallery } from './components/bouquet-gallery';
import { WorkshopExperience } from './components/workshop-experience';
import { MonthlyWorkshops } from './components/monthly-workshops';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReduceMotion(preference.matches);
    syncPreference();
    preference.addEventListener('change', syncPreference);
    return () => {
      preference.removeEventListener('change', syncPreference);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion === true);
    return () => document.documentElement.classList.remove('reduce-motion');
  }, [reduceMotion]);

  useGSAP(() => {
    // Read the system preference before starting any entrance animation.
    if (reduceMotion !== false) return;

    gsap.from('.hero-art img', { scale: 1.06, duration: 1.65, ease: 'power2.out' });
    gsap.from('.hero-line', { y: 35, opacity: 0, duration: 1, stagger: 0.13, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero-item', { y: 15, opacity: 0, duration: 0.75, stagger: 0.12, delay: 0.35, ease: 'power2.out' });
    gsap.from('.hero-seal', { rotation: -10, scale: 0.9, opacity: 0, duration: 1.1, delay: 0.5, ease: 'power2.out' });

    const media = gsap.matchMedia();
    media.add('(min-width: 701px)', () => {
      gsap.to('.hero-art img', {
        y: 40,
        ease: 'none',
        scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: 1 },
      });
    });

    return () => media.revert();
  }, { scope: root, dependencies: [reduceMotion], revertOnUpdate: true });

  return (
    <div ref={root}>
      <SiteHeader />

      <main id="main">
        <section id="inicio" aria-labelledby="hero-title" className="relative flex h-svh min-h-0 items-center overflow-hidden mobile:block landscape-short:h-auto landscape-short:min-h-svh">
          <div className="hero-art absolute inset-y-0 right-0 h-full w-[78%] overflow-hidden wide:w-[74%] tablet:opacity-90 mobile:top-auto mobile:bottom-[53px] mobile:h-[48%] mobile:w-full mobile:opacity-100 compact-mobile:h-[43%]">
            <Image
              src="/assets/hero.webp"
              alt="Ramo conceptual de flores rosas, naranjas y vino iluminado por luz natural"
              fill
              priority
              unoptimized
              sizes="(max-width: 700px) 100vw, (min-width: 1600px) 74vw, 78vw"
              className="origin-[70%_50%] object-cover object-[67%_50%] mobile:object-[72%_50%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8f4e9_0%,#f8f4e9dd_9%,#f8f4e940_26%,transparent_45%)] tablet:bg-[linear-gradient(90deg,#f8f4e9,#f8f4e9b0_20%,transparent_65%)] mobile:bg-[linear-gradient(180deg,#f8f4e9,#f8f4e9a0_22%,transparent_53%)]" />
          </div>

          <div className="pointer-events-none relative z-1 w-[66%] pt-[155px] pb-[105px] pl-[6.2%] tablet:w-[77%] mobile:w-full mobile:px-[6%] mobile:pt-[145px] mobile:pb-0 compact-desktop:pt-[132px] compact-desktop:pb-[75px] compact-mobile:pt-[132px] landscape-short:pt-[135px] landscape-short:pb-[90px]">
            <p className="hero-item flex items-center gap-2.5 text-[12px] leading-[1.7] font-medium tracking-[.13em] mobile:text-[10px] mobile:tracking-[.095em]">
              <span aria-hidden="true" className="text-[20px]">✳</span>
              MERCADO JAMAICA · CIUDAD DE MÉXICO
            </p>
            <h1 id="hero-title" className="mt-[27px] mb-7 font-editorial text-[clamp(75px,7.6vw,119px)] leading-[1.01] font-normal tracking-[-.057em] wide:text-[133px] tablet:text-[clamp(68px,9vw,95px)] mobile:my-[18px] mobile:text-[clamp(51px,12.8vw,82px)] mobile:leading-[1.02] compact-desktop:my-[18px] compact-desktop:text-[clamp(60px,11vh,83px)] compact-mobile:my-3.5 compact-mobile:text-[clamp(44px,11.5vw,65px)] landscape-short:text-[54px]">
              <span className="hero-line block">Un ratito</span>
              <span className="hero-line block"><em className="font-normal tracking-[-.055em]">entre flores.</em></span>
            </h1>
            <p className="hero-item max-w-80 text-[16px] leading-[1.7] mobile:text-[14px] mobile:leading-[1.55] compact-desktop:text-[14px] compact-mobile:text-[13px] compact-mobile:leading-[1.4]">
              Deja que el mundo espere.<br />Aquí las manos crean y las flores hablan.
            </p>
            <a href="#ramos" className="hero-item pointer-events-auto mt-[29px] inline-flex items-center gap-8 rounded-[50px] bg-wine px-6 py-[18px] text-[14px] text-cream transition-[background,translate] duration-250 hover:-translate-y-[3px] hover:bg-[#773449] mobile:mt-5 mobile:px-[21px] mobile:py-[15px] mobile:text-[13px] compact-desktop:mt-[18px] compact-desktop:px-[22px] compact-desktop:py-3.5 compact-mobile:mt-3.5 compact-mobile:px-[18px] compact-mobile:py-[13px] compact-mobile:text-[12px]">
              Encuentra tu inspiración <span aria-hidden="true" className="text-[21px] leading-none">↗</span>
            </a>
          </div>

          <div aria-hidden="true" className="hero-seal absolute right-[5.4%] bottom-[16%] z-2 flex size-[148px] flex-col items-center justify-center gap-[9px] rounded-full bg-yellow [transform:rotate(12deg)] tablet:size-[120px] mobile:right-[7%] mobile:bottom-[17%] mobile:size-[100px] compact-mobile:bottom-[14%] compact-mobile:size-[84px] landscape-short:hidden">
            <span className="text-[9px] tracking-[.14em] tablet:text-[8px] mobile:text-[7px] compact-mobile:text-[6px]">UN RAMO.</span>
            <b className="text-center font-editorial text-[25px] leading-[1.02] font-normal tablet:text-[22px] mobile:text-[19px] compact-mobile:text-[16px]">Mil maneras<br />de sentir.</b>
            <span className="text-[9px] tracking-[.14em] tablet:text-[8px] mobile:text-[7px] compact-mobile:text-[6px]">LA CASITA DE JAMAICA</span>
          </div>
        </section>

        <BouquetGallery reduceMotion={reduceMotion} />
        <WorkshopExperience reduceMotion={reduceMotion} />

        <MonthlyWorkshops />
      </main>
      <SiteFooter />
    </div>
  );
}
