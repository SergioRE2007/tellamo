import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'

type Answer = 'si' | 'no' | 'parte'

type Product = {
  name: string
  detail?: string
  highlight?: boolean
}

const PRODUCTS: Product[] = [
  { name: 'TeLlamo', highlight: true },
  { name: 'Botones que hablan', detail: 'BIGmack, GoTalk' },
  { name: 'Botón Flic + IFTTT', detail: 'Botón y automatización' },
  { name: 'Apps de comunicación en tablet', detail: 'TalkTablet, Lingraphica' },
]

const ROWS: { label: string; note?: string; answers: [Answer, Answer, Answer, Answer] }[] = [
  { label: 'Dice la frase en voz alta', answers: ['si', 'si', 'no', 'si'] },
  { label: 'Avisa a la familia a distancia', answers: ['si', 'no', 'si', 'no'] },
  { label: 'La persona sabe que la han entendido', answers: ['si', 'no', 'no', 'no'] },
  { label: 'Funciona sin pantalla', answers: ['si', 'si', 'si', 'no'] },
  { label: 'Fácil de configurar para la familia', answers: ['si', 'si', 'no', 'parte'] },
  { label: 'Sirve para emergencias graves', note: 'Para eso está la teleasistencia', answers: ['no', 'no', 'no', 'no'] },
]

const WORD: Record<Answer, string> = { si: 'Sí', no: 'No', parte: 'En parte' }

/** Monochrome marks so meaning never depends on colour; the word beside them carries it. */
function Mark({ value }: { value: Answer }) {
  const common = { width: 20, height: 20, viewBox: '0 0 20 20', 'aria-hidden': true as const, className: 'shrink-0' }
  if (value === 'si') {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="9" className="fill-ink" />
        <path d="M6 10.4l2.6 2.6L14 7.6" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-paper" />
      </svg>
    )
  }
  if (value === 'parte') {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="8.25" fill="none" strokeWidth="1.5" className="stroke-ink" />
        <path d="M10 1.75a8.25 8.25 0 0 0 0 16.5z" className="fill-ink" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="10" cy="10" r="8.25" fill="none" strokeWidth="1.5" className="stroke-muted" />
      <path d="M7.3 7.3l5.4 5.4M12.7 7.3l-5.4 5.4" fill="none" strokeWidth="1.5" strokeLinecap="round" className="stroke-muted" />
    </svg>
  )
}

export default function Comparison() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <section id="comparativa" aria-labelledby="comparativa-title" className="bg-paper py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Comparativa</p>
          <h2 id="comparativa-title" className="mt-4 text-4xl md:text-6xl">
            Lo que ya existe y lo que <em className="italic">faltaba</em>.
          </h2>
          <p className="mt-6 text-xl text-ink-2 md:text-2xl">
            Cada opción resuelve una parte. TeLlamo junta la voz, el aviso y la respuesta en un aparato sin pantalla.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 md:mt-24">
          {overflows && (
            <p className="mb-3 text-sm text-muted" aria-hidden="true">
              Desliza la tabla para ver todas las opciones →
            </p>
          )}
          <div
            ref={scrollRef}
            role="region"
            aria-label={overflows ? 'Tabla comparativa (se puede desplazar en horizontal)' : 'Tabla comparativa'}
            tabIndex={overflows ? 0 : undefined}
            className="overflow-x-auto overscroll-x-contain"
          >
            <table className="w-full min-w-[43rem] border-separate border-spacing-0 text-left">
              <caption className="sr-only">
                Qué hace TeLlamo frente a otras opciones que ya existen para comunicarse en casa.
              </caption>
              <thead>
                <tr>
                  <td className="sticky left-0 z-10 w-36 border-r border-line bg-paper md:static md:w-[30%] md:border-r-0" />
                  {PRODUCTS.map((p) => (
                    <th
                      key={p.name}
                      scope="col"
                      className={`px-4 pt-6 pb-5 align-bottom font-normal ${
                        p.highlight ? 'border-t-2 border-ink' : ''
                      }`}
                    >
                      <span
                        className={`block leading-tight text-ink ${
                          p.highlight ? 'font-display text-2xl tracking-tight' : 'font-sans text-base font-semibold'
                        }`}
                      >
                        {p.name}
                      </span>
                      {p.detail && <span className="mt-1 block text-sm text-muted">{p.detail}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-t border-r border-line bg-paper py-5 pr-4 align-middle text-[15px] leading-snug font-medium text-ink md:static md:border-r-0 md:pr-6 md:text-base"
                    >
                      {row.label}
                      {row.note && <span className="mt-1 block text-sm font-normal text-muted">{row.note}</span>}
                    </th>
                    {row.answers.map((a, j) => (
                      <td key={PRODUCTS[j].name} className="border-t border-line px-4 py-5 align-middle">
                        <span className="flex items-center gap-2.5 whitespace-nowrap">
                          <Mark value={a} />
                          <span className={a === 'no' ? 'text-ink-2' : 'font-medium text-ink'}>{WORD[a]}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-xl border-t border-line pt-6 text-[15px] text-ink-2">
            TeLlamo no sustituye a la teleasistencia: la complementa para lo cotidiano.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
