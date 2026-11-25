import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { PHRASES, Picto } from '../components/Pictos'
import Reveal from '../components/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

type StepIndex = 0 | 1 | 2

const STEPS: { title: string; body: string; detail: string }[] = [
  {
    title: 'Pulsa',
    body: 'Antonio pulsa el botón con la foto del sol. La caja dice «Tengo calor» en voz alta, con la voz grabada de su hija.',
    detail: 'Seis botones grandes, cada uno con su foto. Nada que leer ni escribir.',
  },
  {
    title: 'Avisa',
    body: 'A Marta le llega una notificación al móvil con la frase y la hora: «Papá: tengo calor · 11:15». La luz de la caja se pone ámbar.',
    detail: 'Si Antonio mantiene pulsado el botón, el aviso es urgente y llega a todos los contactos.',
  },
  {
    title: 'Responde',
    body: 'Marta pulsa «Voy» o «Te llamo». La caja se ilumina en verde y dice «Ya viene alguien».',
    detail: 'Si nadie responde en 5 minutos, la caja avisa a un segundo contacto.',
  },
]

const CAPTIONS: { text: string; dot: string }[] = [
  { text: 'La caja dice: «Tengo calor»', dot: 'bg-card ring-1 ring-inset ring-clay-dark' },
  { text: 'Luz ámbar · enviado', dot: 'bg-amber' },
  { text: 'Luz verde · te han entendido', dot: 'bg-green' },
]

export default function HowItWorks() {
  const [active, setActive] = useState<StepIndex>(0)

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="bg-paper py-24 md:py-36"
    >
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Cómo funciona</p>
          <h2 id="como-funciona-title" className="mt-4 text-4xl text-ink md:text-6xl">
            Pulsa un botón. Alguien contesta.
          </h2>
          <p className="mt-6 text-xl text-ink-2 md:text-2xl">
            Tres pasos. Lo vemos con Antonio, de 78 años, y su hija Marta, que está en el trabajo.
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Desktop: the illustration stays put while the steps scroll past. */}
          <div className="sticky top-16 hidden h-[calc(100dvh-4rem)] items-center justify-center lg:flex">
            <Scene step={active} className="w-full max-w-[29rem]" />
          </div>

          <ol className="space-y-16 md:space-y-20 lg:space-y-0">
            {STEPS.map((s, i) => (
              <Step
                key={s.title}
                index={i as StepIndex}
                active={active === i}
                onActive={setActive}
                {...s}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Step({
  index,
  title,
  body,
  detail,
  active,
  onActive,
}: {
  index: StepIndex
  title: string
  body: string
  detail: string
  active: boolean
  onActive: (i: StepIndex) => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <li
      ref={ref}
      className="lg:flex lg:min-h-[78dvh] lg:flex-col lg:justify-center"
      aria-current={active ? 'step' : undefined}
    >
      <Reveal className="max-w-md">
        <h3 className="text-2xl text-ink md:text-3xl">
          <span className="eyebrow block tabular-nums">Paso 0{index + 1}</span>
          <span className="mt-3 block">{title}</span>
        </h3>
        <p className="mt-4 text-ink-2">{body}</p>
        <p className="mt-6 border-t border-line pt-4 text-base text-ink-2">{detail}</p>
      </Reveal>
    </li>
  )
}

/** Compact illustration: the box on the left, Marta's phone on the right. */
function Scene({ step, className = '' }: { step: StepIndex; className?: string }) {
  const reduce = useReducedMotion()
  const t = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
  const fade = {
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 },
    transition: t,
  } as const

  const led =
    step === 0
      ? 'bg-clay-dark'
      : step === 1
        ? 'bg-amber'
        : 'bg-green'

  const bubble =
    step === 0
      ? { key: 'calor', label: 'Con la voz de Marta', text: 'Tengo calor' }
      : step === 2
        ? { key: 'viene', label: 'La caja dice', text: 'Ya viene alguien' }
        : null

  const caption = CAPTIONS[step]

  return (
    <figure className={`@container ${className}`}>
      <div aria-hidden="true" className="relative aspect-[5/4] w-full select-none">
        {/* Speech bubble */}
        <div className="absolute left-[3%] top-[2%] w-[56%]">
          <AnimatePresence mode="wait" initial={false}>
            {bubble && (
              <motion.div key={bubble.key} {...fade}>
                <p className="text-[clamp(12px,2.6cqw,13px)] font-medium text-ink-2">
                  {bubble.label}
                </p>
                <p className="mt-1 inline-block rounded-2xl rounded-bl-md border border-line bg-card px-[0.8em] py-[0.35em] font-display text-[clamp(15px,4.6cqw,22px)] italic leading-snug text-ink">
                  «{bubble.text}»
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The box */}
        <div className="absolute bottom-[4%] left-0 w-[61%]">
          <div className="rounded-[clamp(1rem,6cqw,1.75rem)] border border-clay-dark bg-clay p-[5%] shadow-[inset_0_1px_0_var(--color-card),0_20px_30px_-22px_rgb(28_26_23/0.45)]">
            <div
              className={`mx-auto mb-[7%] h-[clamp(5px,1.5cqw,8px)] w-[64%] rounded-full transition-[background-color,box-shadow] duration-700 ${led}`}
            />
            <div className="grid grid-cols-3 gap-[clamp(5px,2cqw,10px)]">
              {PHRASES.map((p) => {
                const isCalor = p.id === 'calor'
                const pressed = isCalor && step === 0
                return (
                  <motion.div
                    key={p.id}
                    animate={pressed ? { y: 2, scale: 0.93 } : { y: 0, scale: 1 }}
                    transition={t}
                    className={`grid aspect-square place-items-center rounded-[clamp(8px,2.8cqw,14px)] border bg-card ${
                      isCalor
                        ? 'border-ink-2 text-ink'
                        : 'border-line text-ink-2/70'
                    } ${pressed ? 'shadow-[inset_0_2px_4px_rgb(28_26_23/0.18)]' : 'shadow-[0_2px_0_var(--color-clay-dark)]'}`}
                  >
                    <Picto id={p.id} className="w-[52%]" />
                  </motion.div>
                )
              })}
            </div>
          </div>
          {/* Weighted, non-slip base */}
          <div className="mx-[7%] h-[clamp(6px,2cqw,10px)] rounded-b-xl bg-clay-dark" />
        </div>

        {/* Marta's phone */}
        <div className="absolute right-0 top-[6%] aspect-[9/16] w-[34%] rounded-[clamp(14px,5cqw,26px)] bg-night p-[4%]">
          <div className="flex h-full flex-col rounded-[clamp(11px,4cqw,21px)] bg-paper p-[8%] text-[clamp(12px,2.5cqw,13px)] leading-tight">
            <p className="text-center font-semibold text-ink-2">11:15</p>

            <div className="relative mt-[12%] flex-1">
              <AnimatePresence mode="wait" initial={false}>
                {step === 0 ? (
                  <motion.p
                    key="empty"
                    {...fade}
                    className="pt-[40%] text-center text-ink-2"
                  >
                    Sin avisos
                  </motion.p>
                ) : (
                  <motion.div key="notif" {...fade} className="flex h-full flex-col">
                    <div className="rounded-[0.8em] border border-line bg-card p-[0.7em]">
                      <p className="text-ink-2">TeLlamo · ahora</p>
                      <p className="mt-[0.3em] font-semibold text-ink">Papá: tengo calor</p>
                      <p className="text-ink-2">11:15</p>
                    </div>
                    <div className="mt-auto space-y-[0.5em]">
                      <p
                        className={`flex items-center justify-center gap-[0.3em] rounded-full py-[0.6em] font-semibold transition-colors duration-500 ${
                          step === 2 ? 'bg-green-ink text-card' : 'bg-ink text-paper'
                        }`}
                      >
                        {step === 2 && <Check className="size-[1.1em]" strokeWidth={3} />}
                        Voy
                      </p>
                      <p
                        className={`rounded-full border py-[0.55em] text-center font-semibold transition-colors duration-500 ${
                          step === 2 ? 'border-line text-ink-2' : 'border-ink-2 text-ink'
                        }`}
                      >
                        Te llamo
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-6 flex items-center gap-2.5 text-sm text-ink-2">
        <span className={`size-2.5 shrink-0 rounded-full transition-colors duration-500 ${caption.dot}`} />
        {caption.text}
      </figcaption>
    </figure>
  )
}
