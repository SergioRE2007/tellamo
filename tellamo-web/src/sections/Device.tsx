import { useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import Reveal from '../components/Reveal'
import DeviceIllustration from '../components/Device/DeviceIllustration'
import { LEDS, PARTS, type LedId, type PartId } from '../components/Device/parts'

export default function Device() {
  // `pinned` survives a tap (touch); `hover` follows the mouse or keyboard focus.
  const [pinned, setPinned] = useState<PartId | null>(null)
  const [hover, setHover] = useState<PartId | null>(null)
  const [led, setLed] = useState<LedId>('enviado')
  const radios = useRef<(HTMLButtonElement | null)[]>([])

  const active = hover ?? pinned
  const pinnedPart = PARTS.find((p) => p.id === pinned)
  const ledState = LEDS.find((l) => l.id === led) ?? LEDS[0]

  const partHandlers = (id: PartId) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === 'mouse') setHover(id)
    },
    onPointerLeave: () => setHover(null),
    // Only keyboard focus previews a part: a tap also focuses the button on touch browsers,
    // and that focus would keep the part highlighted after a second tap unpins it.
    onFocus: (e: FocusEvent<HTMLButtonElement>) => {
      if (e.currentTarget.matches(':focus-visible')) setHover(id)
    },
    onBlur: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
  })

  const onRadioKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % LEDS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + LEDS.length) % LEDS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = LEDS.length - 1
    else return
    e.preventDefault()
    setLed(LEDS[next].id)
    radios.current[next]?.focus()
  }

  return (
    <section id="aparato" aria-labelledby="aparato-titulo" className="bg-paper-2 py-24 md:py-36">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">El aparato</p>
          <h2 id="aparato-titulo" className="mt-4 text-4xl md:text-6xl">
            Hecho para pulsarse con una sola <em className="italic">mano</em>.
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-ink-2 md:text-2xl">
            Mide 20 × 12 cm y está inclinado como un atril. Los botones son grandes y se notan al
            pulsar.
          </p>
        </Reveal>

        <div className="mt-16 grid items-start gap-x-16 gap-y-12 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:sticky lg:top-24 lg:col-span-7">
            <div className="relative mx-auto max-w-2xl">
              <DeviceIllustration active={active} led={led} />
              {PARTS.map((part) => {
                const isOn = active === part.id
                return (
                  <button
                    key={part.id}
                    type="button"
                    aria-label={`${part.id}: ${part.title}`}
                    aria-pressed={pinned === part.id}
                    {...partHandlers(part.id)}
                    className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full focus-visible:rounded-full"
                    style={{ left: `${(part.x / 720) * 100}%`, top: `${(part.y / 520) * 100}%` }}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 place-items-center rounded-full border border-ink text-sm font-semibold transition-colors duration-300 ${
                        isOn ? 'bg-ink text-paper' : 'bg-paper-2 text-ink group-hover:bg-card'
                      }`}
                    >
                      {part.id}
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <ol className="border-t border-line">
              {PARTS.map((part) => {
                const isOn = active === part.id
                return (
                  <li key={part.id} className="border-b border-line">
                    <button
                      type="button"
                      aria-pressed={pinned === part.id}
                      {...partHandlers(part.id)}
                      className="flex w-full cursor-pointer items-start gap-4 py-5 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink text-sm font-semibold transition-colors duration-300 ${
                          isOn ? 'bg-ink text-paper' : 'text-ink'
                        }`}
                      >
                        {part.id}
                      </span>
                      <span className="block">
                        <span className="sr-only">{part.id}. </span>
                        <span className="block text-lg leading-snug font-medium text-ink">
                          {part.title}
                        </span>
                        <span className="mt-1 block text-base text-ink-2">{part.detail}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="sr-only" aria-live="polite">
              {pinnedPart ? `Resaltado en el dibujo: ${pinnedPart.title}.` : ''}
            </p>
            <div className="mt-12 md:mt-16">
              <h3 id="luz-titulo" className="text-2xl md:text-3xl">
                Qué dice la luz
              </h3>
              <p className="mt-3 max-w-sm text-ink-2">
                Tres colores, y nada más que aprender. Elige uno y mira la tira del dibujo.
              </p>

              <div
                role="radiogroup"
                aria-labelledby="luz-titulo"
                className="mt-6 inline-flex w-full flex-col gap-1 rounded-3xl border border-line bg-paper p-1 sm:w-auto sm:flex-row sm:rounded-full lg:flex-col lg:rounded-3xl"
              >
                {LEDS.map((option, i) => {
                  const checked = option.id === led
                  return (
                    <button
                      key={option.id}
                      ref={(el) => {
                        radios.current[i] = el
                      }}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      tabIndex={checked ? 0 : -1}
                      onClick={() => setLed(option.id)}
                      onKeyDown={(e) => onRadioKey(e, i)}
                      className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full px-5 py-2 text-base font-medium transition-colors duration-300 focus-visible:rounded-full ${
                        checked ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                      }`}
                    >
                      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${option.bg}`} />
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <p aria-live="polite" className="mt-6 min-h-28 max-w-md">
                <span
                  className={`block text-sm font-semibold tracking-[0.08em] uppercase ${ledState.text}`}
                >
                  {ledState.colour} · {ledState.label}
                </span>
                <span className="mt-2 block font-display text-xl leading-snug text-ink md:text-2xl">
                  {ledState.meaning}
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
