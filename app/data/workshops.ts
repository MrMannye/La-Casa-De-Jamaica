// Dates, prices and contact details transcribed from the original October poster/prototype.
// This is a fixed October 2026 programme, not live availability or a booking system.
export const workshopCategories = ['Todos', 'Ramos', 'Navidad', 'Técnica', 'Emprendimiento'] as const;
export type WorkshopFilter = typeof workshopCategories[number];
export type WorkshopCategory = Exclude<WorkshopFilter, 'Todos'>;

export type Workshop = {
  id: string;
  day: number;
  name: string;
  price: number;
  categories: WorkshopCategory[];
  image: string;
};

export const programme = { year: 2026, month: 9, label: 'Octubre', shortLabel: 'OCT' } as const;
export const workshops: Workshop[] = [
  { id: 'oct-01', day: 1, name: 'Corona de Adviento', price: 2000, categories: ['Navidad'], image: 'adviento' },
  { id: 'oct-02', day: 2, name: 'Ramo en Espiral Emily en Paris', price: 1500, categories: ['Ramos'], image: 'emily' },
  { id: 'oct-05', day: 5, name: 'Taller de Empapelado', price: 1500, categories: ['Técnica'], image: 'empapelado' },
  { id: 'oct-08', day: 8, name: 'Corona Navideña', price: 2500, categories: ['Navidad'], image: 'corona' },
  { id: 'oct-09', day: 9, name: 'Ramo en Espiral Cascanueces', price: 1500, categories: ['Ramos', 'Navidad'], image: 'cascanueces' },
  { id: 'oct-10', day: 10, name: 'Ramo de Novia en Cascada', price: 3500, categories: ['Ramos'], image: 'novia' },
  { id: 'oct-15', day: 15, name: 'Taller Arreglo Extra Grande Navideño', price: 3500, categories: ['Navidad'], image: 'arreglo' },
  { id: 'oct-16', day: 16, name: 'Ramo en Espiral Cenicienta', price: 1500, categories: ['Ramos'], image: 'cenicienta' },
  { id: 'oct-17', day: 17, name: 'Taller Emprendedor Floral', price: 2900, categories: ['Emprendimiento'], image: 'emprendedor' },
  { id: 'oct-22', day: 22, name: 'Taller Emprendedor Floral', price: 2900, categories: ['Emprendimiento'], image: 'emprendedor' },
  { id: 'oct-23', day: 23, name: 'Ramo en Espiral Navideño', price: 1500, categories: ['Ramos', 'Navidad'], image: 'navideno' },
  { id: 'oct-24', day: 24, name: 'Ramo Buchón 100 Rosas', price: 5000, categories: ['Ramos'], image: 'buchon' },
  { id: 'oct-29', day: 29, name: 'Canasta Navideña', price: 1500, categories: ['Navidad'], image: 'canasta' },
  { id: 'oct-30', day: 30, name: 'Ramo en Espiral Bridgerton', price: 1500, categories: ['Ramos'], image: 'bridgerton' },
];

export function workshopImage(workshop: Workshop) {
  return `/assets/talleres/${workshop.image}.webp`;
}

export function workshopPrice(price: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);
}

export function workshopDate(workshop: Workshop) {
  return new Date(Date.UTC(programme.year, programme.month, workshop.day));
}

export function workshopWeekday(workshop: Workshop) {
  const day = new Intl.DateTimeFormat('es-MX', { weekday: 'long', timeZone: 'UTC' }).format(workshopDate(workshop));
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function workshopFullDate(workshop: Workshop) {
  return `${workshopWeekday(workshop)} ${workshop.day} de octubre de ${programme.year}`;
}

export function filterWorkshops(filter: WorkshopFilter) {
  return workshops.filter(workshop => filter === 'Todos' || workshop.categories.includes(filter));
}

export function calendarWeeks(year = programme.year, month = programme.month): (number | null)[][] {
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day > 0 && day <= days ? day : null;
  });
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}

export function whatsappLink(workshop: Workshop, alternate = false) {
  const message = `Hola, me interesa el taller ${workshop.name} del ${workshop.day} de octubre de ${programme.year} (${workshopPrice(workshop.price)} MXN) en La Casita de Jamaica. ¿Me pueden confirmar horario, cupo y materiales?`;
  return `https://wa.me/${alternate ? '525560919763' : '525516424315'}?text=${encodeURIComponent(message)}`;
}
