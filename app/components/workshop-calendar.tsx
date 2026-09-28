'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { calendarWeeks, filterWorkshops, workshopCategories, workshops, workshopFullDate, workshopImage, workshopPrice, workshopWeekday, type Workshop, type WorkshopFilter } from '../data/workshops';
import { WorkshopDetails, WorkshopPhoto } from './workshop-details';

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const weekShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const weeks = calendarWeeks();

function eventTone(workshop: Workshop) {
  if (workshop.categories.includes('Ramos')) return 'border-wine bg-[#eedde3] text-wine hover:bg-[#e8cbd5]';
  if (workshop.categories.includes('Navidad')) return 'border-[#506044] bg-[#e6ebdf] text-[#33462e] hover:bg-[#d8e2cc]';
  if (workshop.categories.includes('Técnica')) return 'border-[#946b23] bg-[#f4e9c9] text-[#665019] hover:bg-[#eddfb1]';
  return 'border-[#79618c] bg-[#e7e0ee] text-[#574068] hover:bg-[#dcd0e6]';
}

type Preview = { workshop: Workshop; left: number; top: number };

export function WorkshopCalendar({ initialWorkshopId }: { initialWorkshopId?: string }) {
  const [filter, setFilter] = useState<WorkshopFilter>('Todos');
  const [selected, setSelected] = useState<Workshop | null>(() => workshops.find(workshop => workshop.id === initialWorkshopId) ?? null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewSuppressed = useRef(false);
  const visible = filterWorkshops(filter);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const hidePreview = useCallback(() => {
    clearHideTimer();
    setPreview(null);
  }, [clearHideTimer]);

  const scheduleHide = () => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setPreview(null), 160);
  };

  const showPreview = (workshop: Workshop, target: HTMLElement) => {
    clearHideTimer();
    // The compact calendar uses a tap-to-open detail sheet, not hover cards.
    if (selected || previewSuppressed.current || window.innerWidth <= 700) return;
    const rect = target.getBoundingClientRect();
    const width = 304;
    const height = 410;
    const left = rect.right + width + 20 < innerWidth ? rect.right + 10 : rect.left - width - 10;
    setPreview({ workshop, left: Math.max(12, Math.min(innerWidth - width - 12, left)), top: Math.max(12, Math.min(rect.top, innerHeight - height - 12)) });
  };

  const openWorkshop = (workshop: Workshop, target: HTMLElement) => {
    hidePreview();
    lastTrigger.current = target;
    setSelected(workshop);
  };

  useEffect(() => {
    const onScroll = () => hidePreview();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        previewSuppressed.current = true;
        hidePreview();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('keydown', onEscape);
    return () => {
      clearHideTimer();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('keydown', onEscape);
    };
  }, [clearHideTimer, hidePreview]);

  useEffect(() => {
    const sheet = dialog.current;
    if (!sheet || !selected) return;
    sheet.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      sheet.close();
      document.body.style.overflow = previousOverflow;
      // Native dialog focus restoration can re-trigger a focus preview.
      previewSuppressed.current = true;
      lastTrigger.current?.focus({ preventScroll: true });
    };
  }, [selected]);

  return (
    <>
      <div role="group" aria-label="Filtrar talleres por tipo" className="mt-[35px] mb-6 flex flex-wrap gap-2.5 mobile:mt-[26px] mobile:mb-5 mobile:gap-2">
        {workshopCategories.map(category => <button key={category} type="button" aria-pressed={filter === category} onClick={() => { setFilter(category); hidePreview(); }} className="cursor-pointer rounded-full border border-wine/20 px-5 py-3 text-sm transition-colors hover:bg-wine/5 aria-pressed:border-wine aria-pressed:bg-wine aria-pressed:text-cream mobile:px-3.5 mobile:py-2.5 mobile:text-xs">{category}</button>)}
      </div>
      <div className="mb-[22px] flex justify-between gap-5 text-xs leading-[1.6] text-muted mobile:block">
        <p role="status" aria-live="polite" className="text-sm text-wine">{visible.length} {visible.length === 1 ? 'fecha' : 'fechas'} en octubre{filter !== 'Todos' ? ` · ${filter}` : ''}</p>
        <p className="mobile:mt-1.5">Precios en MXN · Horarios y cupos por confirmar</p>
      </div>
      <div className="mt-[30px] mb-[22px] flex items-center justify-between gap-6 mobile:mt-[25px] mobile:mb-[17px] mobile:block">
        <h3 className="font-editorial text-[37px] tracking-[-.035em] mobile:text-[32px]">Octubre <span className="text-muted">2026</span></h3>
        <p className="max-w-[370px] text-[13px] leading-[1.6] text-muted mobile:hidden">Pasa el cursor o enfoca un taller para ver más. Haz clic para abrir su ficha.</p>
        <p className="mt-2 hidden text-xs leading-[1.6] text-muted mobile:block">Toca un día marcado para ver el taller.</p>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-wine/20 bg-[#fffcf5]">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Talleres de octubre de 2026. Selecciona una actividad para consultar sus detalles.</caption>
          <thead><tr>{weekDays.map((day, index) => <th key={day} scope="col" className="border-b border-wine/20 bg-[#eee8dc] px-[5px] py-4 text-center text-xs font-normal tracking-[.08em] uppercase mobile:px-0.5 mobile:py-[13px] mobile:text-[10px]"><abbr title={day} className="no-underline">{weekShort[index]}</abbr></th>)}</tr></thead>
          <tbody>{weeks.map((week, row) => <tr key={row}>{week.map((day, col) => {
            const workshop = visible.find(item => item.day === day);
            return <td key={col} data-day={day ?? undefined} aria-label={day === null ? 'Fuera de octubre' : undefined} className={`relative h-[174px] border-r border-b border-wine/20 px-2 pt-3 pb-2.5 align-top last:border-r-0 mobile:h-[57px] mobile:p-0 mobile:text-center mobile:align-middle ${row === weeks.length - 1 ? 'border-b-0' : ''} ${day === null ? 'bg-[#f2eee5]' : ''}`}>
              {day !== null && <span className={`pointer-events-none relative z-1 mx-[5px] mt-px mb-3 block font-editorial text-[22px] leading-none mobile:m-0 mobile:text-[18px] mobile:leading-[1.2] ${workshop ? 'text-wine' : 'text-muted'}`}>{String(day).padStart(2, '0')}</span>}
              {workshop && <button type="button" data-workshop={workshop.id} aria-label={`${workshopFullDate(workshop)}: ${workshop.name}, ${workshopPrice(workshop.price)} MXN`} aria-haspopup="dialog" aria-expanded={selected?.id === workshop.id || preview?.workshop.id === workshop.id} onClick={event => openWorkshop(workshop, event.currentTarget)} onMouseEnter={event => { previewSuppressed.current = false; showPreview(workshop, event.currentTarget); }} onMouseLeave={scheduleHide} onFocus={event => showPreview(workshop, event.currentTarget)} onBlur={() => { previewSuppressed.current = false; scheduleHide(); }} className={`flex min-h-[104px] w-full cursor-pointer flex-col justify-between gap-3.5 rounded border-l-[3px] px-[9px] py-[11px] text-left transition-colors hover:shadow-md focus-visible:outline-offset-2 mobile:absolute mobile:inset-0 mobile:h-full mobile:min-h-0 mobile:items-center mobile:justify-end mobile:rounded-none mobile:border-0 mobile:p-0 ${eventTone(workshop)}`}>
                <span className="text-sm leading-[1.4] wrap-anywhere max-[1100px]:text-[13px] mobile:hidden">{workshop.name}</span>
                <span className="text-xs mobile:hidden">{workshopPrice(workshop.price)}<span className="text-[10px] opacity-70"> MXN</span></span>
                <span aria-hidden="true" className="mb-1.5 hidden size-1 rounded-full bg-current mobile:block" />
              </button>}
            </td>;
          })}</tr>)}</tbody>
        </table>
      </div>
      <div className="mt-[17px] flex justify-between gap-4 text-xs leading-[1.6] text-muted mobile:block mobile:text-[11px]"><span className="flex items-center gap-2"><span aria-hidden="true" className="size-[7px] rounded-full bg-wine" />Taller programado</span><span className="mobile:mt-1.5 mobile:block">Horario y disponibilidad por WhatsApp</span></div>
      <div className="mt-[33px] hidden mobile:block">
        <h3 className="mb-4 font-editorial text-[28px] tracking-[-.025em]">Las actividades del mes</h3>
        {visible.map(workshop => <button key={workshop.id} type="button" aria-haspopup="dialog" onClick={event => openWorkshop(workshop, event.currentTarget)} className="flex w-full cursor-pointer items-center gap-4 border-t border-wine/20 py-[17px] text-left hover:text-[#98384f]">
          <span className="min-w-[35px] text-center font-editorial text-[28px]">{String(workshop.day).padStart(2, '0')}<small className="mt-[3px] block font-sans text-[9px] tracking-[.08em]">OCT</small></span>
          <span className="flex-1 text-[15px] leading-[1.4]">{workshop.name}<small className="mt-1.5 block text-xs text-muted">{workshopWeekday(workshop)} · {workshopPrice(workshop.price)} MXN</small></span><span aria-hidden="true">↗</span>
        </button>)}
      </div>
      <p className="mx-auto mt-8 max-w-[750px] text-center text-xs leading-[1.8] text-muted">Fechas y precios del calendario de octubre de La Casita de Jamaica. Imágenes ilustrativas creadas con IA; confirma los materiales y la disponibilidad antes de reservar.</p>

      {preview && <aside role="region" aria-label="Vista rápida del taller" onMouseEnter={clearHideTimer} onMouseLeave={scheduleHide} onFocus={clearHideTimer} onBlur={scheduleHide} style={{ left: preview.left, top: preview.top }} className="fixed z-40 w-[304px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-wine/20 bg-cream shadow-[0_16px_55px_#270d2440] mobile:hidden">
        <div className="relative h-[174px]"><Image src={workshopImage(preview.workshop)} alt="" fill unoptimized sizes="304px" className="object-cover" /><span className="absolute bottom-2 left-2 rounded bg-cream/90 px-2 py-1 text-[10px]">Imagen ilustrativa</span><button type="button" onClick={() => { previewSuppressed.current = true; hidePreview(); }} aria-label="Cerrar vista rápida" className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-cream text-2xl">×</button></div>
        <div className="px-4 pt-3.5 pb-[15px]"><p className="text-[10px] tracking-[.08em]">{workshopWeekday(preview.workshop).toUpperCase()} {preview.workshop.day} DE OCTUBRE</p><h3 className="mt-[7px] mb-2 font-editorial text-[23px] leading-[1.1] tracking-[-.03em]">{preview.workshop.name}</h3><p className="text-[19px]">{workshopPrice(preview.workshop.price)} <span className="text-[11px] text-muted">MXN</span></p><p className="mt-[7px] text-[11px]">Mercado de Jamaica · Local 799</p><p className="mt-[3px] text-[11px] text-muted">Horario y cupo por confirmar.</p><button type="button" onClick={() => {
          const trigger = document.querySelector<HTMLElement>(`[data-workshop="${preview.workshop.id}"]`);
          if (trigger) openWorkshop(preview.workshop, trigger);
        }} className="mt-2.5 flex w-full cursor-pointer justify-between rounded-full bg-wine px-[13px] py-2.5 text-xs text-cream">Ver ficha del taller <span aria-hidden="true">↗</span></button></div>
      </aside>}

      <dialog ref={dialog} aria-labelledby="workshop-dialog-title" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setSelected(null); } }} className="workshop-dialog fixed inset-0 m-auto max-h-[calc(100dvh-24px)] w-[min(900px,94vw)] overflow-y-auto rounded-[10px] border-0 bg-cream p-0 text-wine shadow-2xl backdrop:bg-[#270d24]/65 open:grid open:grid-cols-2 mobile:open:block">
        {selected && <>
          <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Cerrar detalle del taller" className="absolute top-2.5 right-2.5 z-2 grid size-9 cursor-pointer place-items-center rounded-full bg-cream text-[27px] text-wine shadow-md">×</button>
          <div className="min-h-full mobile:h-[clamp(120px,22dvh,180px)] mobile:min-h-0 [&>div]:mobile:min-h-0"><WorkshopPhoto workshop={selected} priority /></div>
          <WorkshopDetails workshop={selected} modal headingId="workshop-dialog-title" />
        </>}
      </dialog>
    </>
  );
}
