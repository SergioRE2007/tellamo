import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Reveal from '../components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

/** Ordered from most to least expensive; the tone ramp (dark → light) follows the same order. */
const PARTS: { name: string; cost: number; tone: string }[] = [
  { name: 'ESP32', cost: 6, tone: 'bg-ink' },
  { name: '6 botones arcade', cost: 6, tone: 'bg-ink/80' },
  { name: 'DFPlayer Mini, microSD y altavoz', cost: 5, tone: 'bg-ink/60' },
  { name: 'Carcasa de PLA impresa en 3D', cost: 3, tone: 'bg-ink/45' },
  { name: 'Fuente USB', cost: 3, tone: 'bg-ink/30' },
  { name: 'LEDs WS2812', cost: 2, tone: 'bg-ink/20' },
]

const TOTAL = PARTS.reduce((sum, p) => sum + p.cost, 0)

const STACK: { title: string; price?: string; priceNote?: string; rows: { term: string; detail: string }[] }[] = [
  {
    title: 'La caja',
    price: `${TOTAL} €`,
    priceNote: 'en piezas',
    rows: [
      { term: 'Control', detail: 'ESP32: lee los botones y envía el aviso' },
      { term: 'Sonido', detail: 'DFPlayer Mini: reproduce la voz grabada desde una microSD' },
      { term: 'Luz', detail: 'Tira WS2812: ámbar, verde o rojo' },
    ],
  },
  {
    title: 'La app',
    price: '0 €',
    priceNote: 'plan gratuito',
    rows: [
      { term: 'Plataforma', detail: 'Android, escrita en Kotlin' },
      { term: 'Avisos', detail: 'Firebase Cloud Messaging' },
      { term: 'Datos', detail: 'Firestore, en el plan gratuito' },
    ],
  },
]

function CostBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()

  return (
    <div ref={ref} aria-hidden="true">
      <motion.div
        className="flex h-14 overflow-hidden rounded-2xl bg-line md:h-16"
        initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: inView || reduce ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.1, ease: EASE }}
      >
        {PARTS.map((part, i) => (
          <div
            key={part.name}
            className="h-full shrink-0 overflow-hidden"
            style={{ width: `${(part.cost / TOTAL) * 100}%` }}
          >
            {/* Inner fill keeps a hairline gap between segments without breaking the 100% sum. */}
            <div className={`h-full ${part.tone} ${i < PARTS.length - 1 ? 'mr-[3px]' : ''}`} />
          </div>
        ))}
      </motion.div>
      <div className="mt-3 flex justify-between text-sm tabular-nums text-muted">
        <span>0 €</span>
        <span>{TOTAL} €</span>
      </div>
    </div>
  )
}

export default function Specs() {
  return (
    <section id="viabilidad" aria-labelledby="viabilidad-title" className="bg-paper-2 py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Viabilidad</p>
          <h2 id="viabilidad-title" className="mt-4 text-4xl md:text-6xl">
            Una caja de unos 25&nbsp;€, hecha por <em className="italic">nosotros</em>.
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-ink-2 md:text-2xl">
            Piezas de electrónica comunes para la caja. La app funciona en un plan gratuito.
          </p>
        </Reveal>

        {/* 1 — Cost breakdown */}
        <Reveal className="mt-16 md:mt-24">
          <h3 className="eyebrow">Lo que cuesta la caja</h3>
          <div className="mt-6">
            <CostBar />
          </div>

          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((part) => (
              <li
                key={part.name}
                className="flex items-baseline gap-3 border-t border-line py-4"
              >
                <span
                  aria-hidden="true"
                  className={`size-3 shrink-0 translate-y-px self-center rounded-[3px] ${part.tone}`}
                />
                <span className="flex-1 text-ink">{part.name}</span>
                <span className="tabular-nums text-ink-2">{part.cost} €</span>
              </li>
            ))}
            <li className="flex items-baseline gap-3 border-t border-ink py-4 sm:col-span-2 lg:col-span-3">
              <span className="flex-1 font-semibold text-ink">Total aproximado</span>
              <span className="font-display text-2xl tabular-nums text-ink">{TOTAL} €</span>
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted">Precios orientativos de cada pieza.</p>
        </Reveal>

        {/* 2 — The two halves of the system */}
        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-16">
          {STACK.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.08} className="border-t-2 border-ink pt-6">
              <div className="flex items-end justify-between gap-4">
                <h3 className="text-2xl md:text-3xl">{col.title}</h3>
                {col.price && (
                  <p className="text-right">
                    <span className="block text-sm text-muted">{col.priceNote}</span>
                    <span className="font-display text-2xl tabular-nums text-ink md:text-3xl">{col.price}</span>
                  </p>
                )}
              </div>
              <dl className="mt-8">
                {col.rows.map((row) => (
                  <div
                    key={row.term}
                    className="grid gap-1 border-t border-line py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
                  >
                    <dt className="text-sm text-muted sm:pt-0.5">{row.term}</dt>
                    <dd className="text-ink">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>

        {/* 3 — Who builds what */}
        <Reveal className="mt-20 max-w-3xl md:mt-28">
          <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
            La app, el backend y la configuración los hacemos nosotros, en 2.º DAM. La caja solo
            necesita un programa sencillo: al pulsar, dice la frase, envía el aviso y espera la
            respuesta para ponerse en verde.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
