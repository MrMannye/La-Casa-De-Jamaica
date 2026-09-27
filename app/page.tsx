'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './page.css';

gsap.registerPlugin(useGSAP);

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useGSAP(() => {
    if (reduceMotion) return;
    gsap.from('.hero-art img', { scale: 1.06, duration: 1.6, ease: 'power2.out' });
    gsap.from('.hero-title span', { y: 34, opacity: 0, duration: .9, stagger: .12, delay: .1, ease: 'power3.out' });
    gsap.from('.hero-item', { y: 16, opacity: 0, duration: .7, stagger: .1, delay: .35, ease: 'power2.out' });
    gsap.from('.hero-seal', { scale: .88, rotation: -8, opacity: 0, duration: .9, delay: .45, ease: 'power2.out' });
  }, { scope: root, dependencies: [reduceMotion], revertOnUpdate: true });

  return <main ref={root} className={reduceMotion ? 'reduce-motion' : ''}>
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="La Casita de Jamaica"><span className="brand-mark" aria-hidden="true">✳</span><span>la casita<span>de Jamaica</span></span></a>
      <nav aria-label="Navegación principal"><a href="#hero" className="active">El comienzo</a><a href="#talleres">Talleres del mes <span aria-hidden="true">↗</span></a></nav>
      <p className="header-note">FLORES, MANOS<br />Y UN POCO DE MAGIA.</p>
    </header>
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true"><Image src="/assets/hero.webp" alt="" fill priority sizes="(max-width: 800px) 100vw, 78vw" /><div className="hero-fade" /></div>
      <div className="hero-content"><p className="eyebrow hero-item"><span aria-hidden="true">✳</span> MERCADO JAMAICA · CIUDAD DE MÉXICO</p><h1 id="hero-title" className="hero-title"><span>Un ratito</span><span><em>entre flores.</em></span></h1><p className="hero-copy hero-item">Deja que el mundo espere.<br />Aquí las manos crean y las flores hablan.</p><a className="hero-cta hero-item" href="#talleres">Encuentra tu inspiración <span aria-hidden="true">↗</span></a></div>
      <div className="hero-seal" aria-hidden="true"><span>UN RAMO.</span><strong>Mil maneras<br />de sentir.</strong><span>LA CASITA DE JAMAICA</span></div>
      <div className="hero-footer"><span>UN ESPACIO PARA CREAR, A TU RITMO.</span><a href="#talleres">Hay mucho por florecer <b aria-hidden="true">↓</b></a></div>
    </section>
    <section id="talleres" className="next-section"><p>Próximamente: talleres del mes.</p></section>
  </main>;
}
