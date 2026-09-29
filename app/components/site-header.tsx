'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SiteHeader({ workshopsPage = false, entranceHidden = false }: { workshopsPage?: boolean; entranceHidden?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 24);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, []);

  return (
    <>
      <a href="#main" className="fixed -top-20 left-[15px] z-30 bg-wine p-3 text-white focus:top-2.5">Saltar al contenido</a>
      <header inert={entranceHidden} aria-hidden={entranceHidden} style={entranceHidden ? { visibility: 'hidden', opacity: 0, pointerEvents: 'none' } : undefined} data-scrolled={scrolled} className="site-header fixed inset-x-[4.6%] top-[46px] z-15 flex h-[86px] items-center justify-between rounded-[22px] border border-[#ffffff85] bg-cream/[.64] px-7 shadow-[0_8px_36px_#501c320b,inset_0_1px_0_#ffffffb0] backdrop-blur-[20px] backdrop-saturate-[140%] transition-[top,background,box-shadow] duration-300 data-[scrolled=true]:top-[18px] data-[scrolled=true]:bg-cream/[.82] data-[scrolled=true]:shadow-[0_10px_36px_#501c3214,inset_0_1px_0_#ffffffb0] tablet:px-[22px] mobile:inset-x-[4%] mobile:top-[42px] mobile:h-[74px] mobile:rounded-[19px] mobile:px-[17px] mobile:data-[scrolled=true]:top-3 compact-desktop:top-10 compact-desktop:h-[70px] compact-desktop:data-[scrolled=true]:top-3">
        <Link href={workshopsPage ? '/' : '/#inicio'} aria-label="La Casita de Jamaica, inicio" className="flex items-center gap-[13px] font-editorial text-[27px] leading-[.92] tracking-[-1.1px] mobile:gap-2 mobile:text-[21px]">
          <span aria-hidden="true" className="font-[Georgia,serif] text-[53px] leading-none mobile:text-[36px]">✳</span>
          <span>la casita<span className="block text-[25px] mobile:text-[20px]">de Jamaica</span></span>
        </Link>
        <nav aria-label="Navegación principal" className="flex gap-[25px] text-sm mobile:gap-3 mobile:text-xs">
          {workshopsPage ? <>
            <Link href="/#taller" className="nav-link mobile:hidden">La experiencia</Link>
            <Link href="/talleres#quien-imparte" className="nav-link mobile:hidden">Quién te guía</Link>
          </> : <>
            <a href="#inicio" className="nav-link mobile:hidden">El comienzo</a>
            <a href="#ramos" className="nav-link mobile:hidden">Los ramos</a>
            <a href="#taller" className="nav-link mobile:hidden">El taller</a>
          </>}
          <Link href="/talleres" aria-current={workshopsPage ? 'page' : undefined} className="rounded-[30px] bg-wine px-[18px] py-[13px] whitespace-nowrap text-cream mobile:px-3.5 mobile:py-[11px] mobile:text-[11px]">Talleres del mes <span aria-hidden="true">↗</span></Link>
        </nav>
        {!workshopsPage && <span className="text-right text-xs leading-[1.55] tracking-[.12em] max-[1151px]:hidden">FLORES, MANOS<br />Y UN POCO DE MAGIA.</span>}
      </header>
    </>
  );
}
