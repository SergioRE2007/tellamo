import type { SVGProps } from 'react'

/** The six phrases on the TeLlamo device. Shared by every section that shows the buttons. */
export type PictoId = 'sed' | 'calor' | 'frio' | 'dolor' | 'bano' | 'llamame'

export const PHRASES: { id: PictoId; label: string; spoken: string }[] = [
  { id: 'sed', label: 'Tengo sed', spoken: 'Tengo sed' },
  { id: 'calor', label: 'Tengo calor', spoken: 'Tengo calor' },
  { id: 'frio', label: 'Tengo frío', spoken: 'Tengo frío' },
  { id: 'dolor', label: 'Me duele', spoken: 'Me duele' },
  { id: 'bano', label: 'Quiero ir al baño', spoken: 'Quiero ir al baño' },
  { id: 'llamame', label: 'Llámame', spoken: 'Llámame' },
]

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

/** Thick-stroke pictograms in one consistent style. Decorative: label the button, not the icon. */
export function Picto({ id, ...props }: { id: PictoId } & SVGProps<SVGSVGElement>) {
  switch (id) {
    case 'sed':
      return (
        <svg {...base} {...props}>
          <path d="M14 10h20l-3 30a3 3 0 0 1-3 2.7h-8A3 3 0 0 1 17 40z" />
          <path d="M15.5 22c4 2 13 2 17 0" />
        </svg>
      )
    case 'calor':
      return (
        <svg {...base} {...props}>
          <circle cx="24" cy="24" r="8" />
          <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M11.3 36.7l3.5-3.5M33.2 14.8l3.5-3.5" />
        </svg>
      )
    case 'frio':
      return (
        <svg {...base} {...props}>
          <path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18" />
          <path d="M19 9l5 4 5-4M19 39l5-4 5 4" />
        </svg>
      )
    case 'dolor':
      return (
        <svg {...base} {...props}>
          <circle cx="24" cy="24" r="17" />
          <path d="M16 19l4 2M32 19l-4 2" />
          <path d="M17 33c4-4 10-4 14 0" />
        </svg>
      )
    case 'bano':
      return (
        <svg {...base} {...props}>
          <path d="M14 8h12v12H14z" />
          <path d="M10 24h28a0 0 0 0 1 0 0 14 14 0 0 1-14 14 14 14 0 0 1-14-14z" />
          <path d="M18 38l-2 4h16l-2-4" />
        </svg>
      )
    case 'llamame':
      return (
        <svg {...base} {...props}>
          <path d="M12 8h7l3 9-4.5 3a22 22 0 0 0 10.5 10.5l3-4.5 9 3v7a3 3 0 0 1-3 3A31 31 0 0 1 9 11a3 3 0 0 1 3-3z" />
        </svg>
      )
  }
}
