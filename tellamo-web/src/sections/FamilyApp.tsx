import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '../components/Reveal'
import { AjustesScreen, AvisoScreen, HistorialScreen, type Reply } from '../components/FamilyApp/Screens'

type TabId = 'aviso' | 'historial' | 'ajustes'

const TABS: { id: TabId; label: string; title: string; body: string }[] = [
  {
    id: 'aviso',
    label: 'Aviso',
    title: 'Llega al momento.',
    body: 'La frase, la hora y dos botones grandes. Nada más que leer antes de contestar.',
  },
  {
    id: 'historial',
    label: 'Historial',
    title: 'El día, de un vistazo.',
    body: 'Qué ha pedido, a qué hora y quién ha contestado. Así la familia se turna sin llamarse para preguntar.',
  },
  {
    id: 'ajustes',
    label: 'Ajustes',
    title: 'A su medida.',
    body: 'Cambia la frase y la foto de cada botón desde el móvil. Y elige el orden: si Marta no responde en 5 minutos, avisa al segundo contacto.',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

export default function FamilyApp() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<TabId>('aviso')
  const [reply, setReply] = useState<Reply>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const index = TABS.findIndex((t) => t.id === active)
  const tab = TABS[index]

  function select(i: number) {
    const next = (i + TABS.length) % TABS.length
    setActive(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: TABS.length - 1,
    }
    if (e.key in keys) {
      e.preventDefault()
      select(keys[e.key])
    }
  }

  const fade = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0, pointerEvents: 'none' as const, transition: { duration: 0 } } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
        exit: { opacity: 0, pointerEvents: 'none' as const, transition: { duration: 0.25, ease: EASE } },
      }

  return (
    <section id="app" aria-labelledby="app-title" className="bg-night py-24 text-paper md:py-36">
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-10">
        {/* Header */}
        <Reveal className="md:col-span-6 md:row-start-1 md:self-end">
          <p className="eyebrow text-paper/75">La app</p>
          <h2 id="app-title" className="mt-4 text-4xl md:text-6xl">
            Una app sencilla para la <em className="italic">familia</em>.
          </h2>
          <p className="mt-6 max-w-[34ch] text-xl text-paper/75 md:text-2xl">
            Es una app propia para Android: no hace falta Telegram ni WhatsApp. El aviso llega al momento y se
            responde con un toque.
          </p>
        </Reveal>

        {/* Phone */}
        <Reveal
          delay={0.1}
          className="flex justify-center md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 md:row-span-2 md:row-start-1 md:self-center"
        >
          <figure className="w-full max-w-[20rem]">
            <figcaption className="sr-only">Maqueta de la app TeLlamo en un móvil Android</figcaption>
            <div className="rounded-[2.75rem] border border-paper/15 bg-ink-2 p-2.5">
              <div className="overflow-hidden rounded-[2.25rem] bg-paper text-ink">
                {/* Status bar */}
                <div aria-hidden="true" className="flex items-center justify-between px-6 pb-1 pt-3 text-xs font-medium tabular-nums">
                  <span>11:15</span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-3 rounded-[2px] bg-ink/70" />
                    <span className="h-2.5 w-5 rounded-[3px] border border-ink/70 p-px">
                      <span className="block h-full w-3/4 rounded-[1px] bg-ink/70" />
                    </span>
                  </span>
                </div>

                {/* App bar */}
                <p className="px-5 pt-2 font-display text-xl" aria-hidden="true">
                  TeLlamo
                </p>

                {/* Tabs */}
                <div
                  role="tablist"
                  aria-label="Pantallas de la app"
                  onKeyDown={onKeyDown}
                  className="mt-1 flex border-b border-line px-2"
                >
                  {TABS.map((t, i) => {
                    const selected = t.id === active
                    return (
                      <button
                        key={t.id}
                        ref={(el) => {
                          tabRefs.current[i] = el
                        }}
                        id={`app-tab-${t.id}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="app-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActive(t.id)}
                        className={`relative min-h-12 flex-1 text-[0.9375rem] transition-colors focus-visible:outline-offset-[-4px] ${
                          selected ? 'font-semibold text-ink' : 'font-normal text-ink-2 hover:text-ink'
                        }`}
                      >
                        {t.label}
                        {selected && (
                          <motion.span
                            aria-hidden="true"
                            layoutId="app-tab-indicator"
                            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                            className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-ink"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Screen */}
                <div
                  id="app-panel"
                  role="tabpanel"
                  aria-labelledby={`app-tab-${active}`}
                  tabIndex={active === 'aviso' ? undefined : 0}
                  className="relative h-[29rem] focus-visible:outline-offset-[-4px]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      {...fade}
                      className="absolute inset-0"
                    >
                      {active === 'aviso' && <AvisoScreen reply={reply} onReply={setReply} />}
                      {active === 'historial' && <HistorialScreen reply={reply} />}
                      {active === 'ajustes' && <AjustesScreen />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </figure>
        </Reveal>

        {/* Active tab text */}
        <div className="md:col-span-6 md:row-start-2 md:self-start">
          <div aria-live="polite" className="min-h-[11rem] border-t border-paper/15 pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
              >
                <p className="text-sm tabular-nums text-paper/75">
                  {String(index + 1).padStart(2, '0')} / 03 · {tab.label}
                </p>
                <h3 className="mt-3 text-2xl md:text-3xl">{tab.title}</h3>
                <p className="mt-3 max-w-[42ch] text-paper/75">{tab.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
