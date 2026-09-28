import { type BookingStatus, statusLabels } from '../../data/dashboard'

export const glassFrame =
  'rounded-[22px] border shadow-[0_10px_35px_#50304308,inset_0_1px_#ffffffb3] backdrop-blur-[22px]'
export const glass = `${glassFrame} border-[#ffffffbd] bg-[linear-gradient(135deg,#ffffffa6,#ffffff65)]`
export const panel = `${glass} min-w-0 p-[27px] max-[1250px]:p-[23px] max-[760px]:rounded-[18px] max-[760px]:px-[17px] max-[760px]:py-5`
export const eyebrow = 'text-[10px] font-medium tracking-[.13em]'
export const panelTitle =
  'mt-[7px] font-editorial text-[27px] leading-[1.2] tracking-[-.035em] max-[760px]:text-[25px]'
export const description =
  'mt-2.5 text-xs leading-[1.6] text-[#786974] max-[760px]:text-[11px]'
export const textButton =
  'cursor-pointer whitespace-nowrap bg-transparent py-[7px] text-xs text-wine hover:underline max-[760px]:text-[11px]'
export const primary =
  'flex cursor-pointer items-center justify-between gap-5 rounded-[11px] bg-wine px-[17px] py-[13px] text-xs text-cream hover:bg-[#70364e]'
export const field =
  'min-w-0 max-w-full rounded-[10px] border border-[#ffffffec] bg-white/60 px-[13px] py-3 text-[13px] text-wine focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#ae6537] max-[760px]:w-full max-[760px]:p-[11px] max-[760px]:text-xs'
export const fieldLabel = 'grid min-w-0 gap-2 text-[11px] text-[#786974]'
export const roundButton =
  'grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-[#501c3219] bg-white/50 text-[19px] hover:bg-wine hover:text-cream'

export function StatusBadge({ status }: { status: BookingStatus }) {
  const tone = {
    paid: 'bg-[#dceadd] text-[#3d6346]',
    pending: 'bg-[#f7e8b9] text-[#795515]',
    cancelled: 'bg-[#eadfe4] text-[#7a5867]',
  }
  return (
    <span
      className={`inline-block rounded-[20px] px-2.25 py-1.5 text-[10px] whitespace-nowrap ${tone[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

export function OccupancyProgress({
  seats,
  capacity,
  label,
}: {
  seats: number
  capacity: number
  label: string
}) {
  return (
    <progress
      value={seats}
      max={capacity}
      aria-label={label}
      className="my-2.5 h-1.25 w-full appearance-none overflow-hidden rounded-[5px] border-0 bg-[#501c3212] [&::-moz-progress-bar]:rounded-[5px] [&::-moz-progress-bar]:bg-[#8c4f68] [&::-webkit-progress-bar]:rounded-[5px] [&::-webkit-progress-bar]:bg-[#501c3212] [&::-webkit-progress-value]:rounded-[5px] [&::-webkit-progress-value]:bg-[#8c4f68]"
    />
  )
}
