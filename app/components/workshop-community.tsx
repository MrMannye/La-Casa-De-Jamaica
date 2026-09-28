export function WorkshopCommunity() {
  return <>
    <section id="quien-imparte" aria-labelledby="teacher-title" className="grid grid-cols-2 items-center gap-[8%] bg-wine px-[7%] py-[85px] text-cream max-[900px]:grid-cols-1 max-[900px]:gap-[35px] mobile:px-[6%] mobile:py-[55px]">
      <div>
        <p className="text-xs leading-[1.7] tracking-[.13em] text-yellow">CONOCE A QUIEN COMPARTE EL OFICIO</p>
        <h2 id="teacher-title" className="my-5 font-editorial text-[clamp(36px,4vw,59px)] leading-[1.12] tracking-[-.035em] mobile:text-[39px]">Las flores inspiran.<br /><em>Las personas también.</em></h2>
        <p className="max-w-[420px] text-base leading-[1.7] text-[#e5d2d9] mobile:text-[15px]">Acércate al trabajo de GoodFlowersMX y conoce el diseño floral desde su mirada.</p>
      </div>
      <article className="grid max-w-[650px] grid-cols-[95px_1fr] items-center gap-6 rounded-[5px] border border-[#f8f4e942] bg-[#ffffff07] p-[33px] tablet:gap-5 tablet:p-[25px] mobile:grid-cols-[70px_1fr] mobile:gap-[17px] mobile:p-[22px]">
        <div aria-hidden="true" className="relative grid h-[110px] w-[95px] place-items-center rounded-t-[50px] rounded-b-[5px] bg-yellow font-editorial text-[47px] tracking-[-.07em] text-wine mobile:h-[90px] mobile:w-[70px] mobile:text-[37px]">Cc<span className="absolute right-[9px] bottom-[9px] font-sans text-[19px] leading-none">✳</span></div>
        <div className="min-w-0"><p className="text-[10px] tracking-[.13em] text-yellow">GOODFLOWERSMX</p><h3 className="my-2.5 font-editorial text-[34px] leading-[1.1] mobile:text-[29px]">Clau Carrillo</h3><p className="text-sm text-[#e5d2d9]">Diseño floral y talleres.</p><a href="https://www.instagram.com/goodflowersmx/" target="_blank" rel="noopener noreferrer" className="mt-[18px] inline-block border-b border-[#f8f4e965] pb-[5px] text-[13px] leading-[1.7] mobile:text-xs">Conoce su trabajo en Instagram ↗</a></div>
        <p className="col-span-full border-t border-[#f8f4e933] pt-5 text-xs leading-[1.7] text-[#d6bbc4]">Confirma con La Casita quién imparte el taller en la fecha que elijas.</p>
      </article>
    </section>
    <section aria-labelledby="location-title" className="flex items-center justify-between gap-10 px-[7%] py-[65px] mobile:block mobile:px-[6%] mobile:py-[45px]">
      <div><p className="text-xs tracking-[.13em]">NOS VEMOS ENTRE FLORES</p><h2 id="location-title" className="my-[15px] font-editorial text-[38px] tracking-[-.03em] mobile:text-[32px]">En el corazón de Jamaica.</h2><p className="text-[15px] leading-[1.7] text-muted mobile:text-sm">Mercado de Jamaica · Carril 3, local 799 · CDMX</p></div>
      <div className="flex flex-col gap-2.5 mobile:mt-7"><p className="mb-[5px] text-xs text-muted">Informes solo por WhatsApp</p><a href="https://wa.me/525516424315" target="_blank" rel="noopener noreferrer" className="text-[19px] hover:underline">55 1642 4315 ↗</a><a href="https://wa.me/525560919763" target="_blank" rel="noopener noreferrer" className="text-[19px] hover:underline">55 6091 9763 ↗</a></div>
    </section>
  </>;
}
