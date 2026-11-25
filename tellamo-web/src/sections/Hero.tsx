import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Check, Phone, RotateCcw, TriangleAlert, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react'
import { PHRASES, Picto, type PictoId } from '../components/Pictos'

/* ------------------------------------------------------------------ */
/* Flow state machine                                                  */
/* ------------------------------------------------------------------ */

type Phase = 'idle' | 'sent' | 'offline' | 'notified' | 'coming' | 'calling'

type State = {
  phase: Phase
  phrase: PictoId | null
  urgent: boolean
  /** Single-action alternative to the long press: the next press is urgent. */
  urgentNext: boolean
  time: string
  sound: boolean
  offline: boolean
  touched: boolean
  /** Bumped on every send so the delivery timer restarts. */
  seq: number
}

type Action =
  | { type: 'press'; id: PictoId; urgent: boolean; time: string }
  | { type: 'deliver' }
  | { type: 'reply'; with: 'voy' | 'llamo' }
  | { type: 'toggleSound' }
  | { type: 'toggleOffline' }
  | { type: 'toggleUrgent' }
  | { type: 'reset' }

const initial: State = {
  phase: 'idle',
  phrase: null,
  urgent: false,
  urgentNext: false,
  time: '',
  sound: true,
  offline: false,
  touched: false,
  seq: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'press':
      return {
        ...state,
        phase: state.offline ? 'offline' : 'sent',
        phrase: action.id,
        urgent: action.urgent || state.urgentNext,
        urgentNext: false,
        time: action.time,
        touched: true,
        seq: state.seq + 1,
      }
    case 'deliver':
      return state.phase === 'sent' ? { ...state, phase: 'notified' } : state
    case 'reply':
      return state.phase === 'notified'
        ? { ...state, phase: action.with === 'voy' ? 'coming' : 'calling' }
        : state
    case 'toggleSound':
      return { ...state, sound: !state.sound, touched: true }
    case 'toggleUrgent':
      return { ...state, urgentNext: !state.urgentNext, touched: true }
    case 'toggleOffline': {
      const offline = !state.offline
      // Connection lost before the notice left: it stays on the box.
      if (offline && state.phase === 'sent') {
        return { ...state, offline, phase: 'offline', touched: true }
      }
      // Connection back while a message was waiting: the box sends it.
      if (!offline && state.phase === 'offline') {
        return { ...state, offline, phase: 'sent', touched: true, seq: state.seq + 1 }
      }
      return { ...state, offline, touched: true }
    }
    case 'reset':
      return { ...initial, sound: state.sound, offline: state.offline, touched: true, seq: state.seq + 1 }
  }
}

const DELIVERY_MS = 900
const HOLD_MS = 600
const EASE = [0.22, 1, 0.36, 1] as const

/** Either reply turns the box green and it says the same thing. */
const SAID_REPLY = 'Ya viene alguien'

const CAN_SPEAK = typeof window !== 'undefined' && 'speechSynthesis' in window

function nowHHMM() {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

const normLang = (l: string) => l.replace('_', '-').toLowerCase()

type Led = { tone: 'off' | 'amber' | 'green' | 'red'; light: string; label: string }

function ledFor(phase: Phase): Led {
  switch (phase) {
    case 'idle':
      return { tone: 'off', light: 'Luz apagada', label: 'En espera' }
    case 'sent':
    case 'notified':
      return { tone: 'amber', light: 'Luz ámbar', label: 'Enviado' }
    case 'coming':
    case 'calling':
      return { tone: 'green', light: 'Luz verde', label: 'Te han entendido' }
    case 'offline':
      return { tone: 'red', light: 'Luz roja', label: 'Sin conexión' }
  }
}

const LED_BAR: Record<Led['tone'], string> = {
  off: 'bg-clay-dark',
  amber: 'bg-amber',
  green: 'bg-green',
  red: 'bg-red',
}
const LED_TEXT: Record<Led['tone'], string> = {
  off: 'text-ink-2',
  amber: 'text-amber-ink',
  green: 'text-green-ink',
  red: 'text-red-ink',
}

/* ------------------------------------------------------------------ */
/* Device button                                                       */
/* ------------------------------------------------------------------ */

function DeviceButton({
  id,
  label,
  active,
  onPress,
  onSpeak,
}: {
  id: PictoId
  label: string
  active: boolean
  onPress: (id: PictoId, urgent: boolean, opts?: { speak: boolean }) => void
  onSpeak: (id: PictoId) => void
}) {
  const [down, setDown] = useState(false)
  const timer = useRef<number | null>(null)
  const longFired = useRef(false)

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    setDown(false)
  }, [])

  const start = useCallback(() => {
    longFired.current = false
    setDown(true)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      timer.current = null
      longFired.current = true
      // Visual part only: speech waits for the release, which grants user activation.
      onPress(id, true, { speak: false })
    }, HOLD_MS)
  }, [id, onPress])

  /** Release after a long press: say the phrase now. */
  const release = useCallback(() => {
    clear()
    if (longFired.current) onSpeak(id)
  }, [clear, onSpeak, id])

  useEffect(() => clear, [clear])

  return (
    <button
      type="button"
      aria-label={label}
      aria-describedby="demo-hold-hint"
      onPointerDown={(e) => {
        if (e.button === 0) start()
      }}
      onPointerUp={release}
      onPointerLeave={clear}
      onPointerCancel={clear}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.repeat) e.preventDefault()
        if (e.key === ' ' && !e.repeat) start()
      }}
      onKeyUp={(e) => {
        if (e.key === ' ') release()
      }}
      onBlur={clear}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        if (longFired.current) {
          longFired.current = false
          return
        }
        onPress(id, false)
      }}
      className="group flex min-h-11 touch-manipulation flex-col items-center gap-2 rounded-2xl select-none sm:gap-3"
    >
      <span
        data-down={down || undefined}
        className={[
          'flex aspect-square w-full items-center justify-center rounded-2xl border bg-card text-ink',
          'transition-[transform,box-shadow] duration-100 ease-out',
          'shadow-[0_5px_0_var(--color-clay-dark),inset_0_1px_0_#fff]',
          'group-active:translate-y-1 group-active:shadow-[0_1px_0_var(--color-clay-dark),inset_0_3px_6px_rgb(28_26_23/0.18)]',
          'data-[down]:translate-y-1 data-[down]:shadow-[0_1px_0_var(--color-clay-dark),inset_0_3px_6px_rgb(28_26_23/0.18)]',
          active ? 'border-ink' : 'border-clay-dark',
        ].join(' ')}
      >
        <Picto id={id} className="size-9 sm:size-12" />
      </span>
      <span className="text-center text-[0.8125rem] leading-tight font-medium text-ink sm:text-[0.9375rem]">
        {label}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const reduce = useReducedMotion()
  const [state, dispatch] = useReducer(reducer, initial)
  const { phase, urgent, urgentNext, time, sound, offline, touched, seq } = state
  const phrase = PHRASES.find((p) => p.id === state.phrase) ?? null
  const led = ledFor(phase)

  const [speechFailed, setSpeechFailed] = useState(false)
  const speechOk = CAN_SPEAK && !speechFailed
  const voiceOn = sound && speechOk

  const soundRef = useRef(sound)
  soundRef.current = sound

  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  useEffect(() => {
    if (!CAN_SPEAK) return
    const synth = window.speechSynthesis
    const load = () => {
      voicesRef.current = synth.getVoices()
    }
    load()
    synth.addEventListener('voiceschanged', load)
    return () => synth.removeEventListener('voiceschanged', load)
  }, [])

  /** Speech only ever runs from a user gesture, and only with sound on. */
  const speak = useCallback((text: string) => {
    if (!soundRef.current || !CAN_SPEAK) return
    const synth = window.speechSynthesis
    if (synth.speaking || synth.pending) synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-ES'
    u.rate = 0.95
    const vs = voicesRef.current.length ? voicesRef.current : synth.getVoices()
    const voice = vs.find((v) => normLang(v.lang) === 'es-es') ?? vs.find((v) => normLang(v.lang).startsWith('es'))
    if (voice) u.voice = voice
    u.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'synthesis-unavailable') setSpeechFailed(true)
    }
    synth.speak(u)
  }, [])

  const hush = useCallback(() => {
    if (CAN_SPEAK) window.speechSynthesis.cancel()
  }, [])

  useEffect(() => hush, [hush])

  // Step 2: the notification reaches the phone a moment after the press.
  useEffect(() => {
    if (phase !== 'sent') return
    const t = window.setTimeout(() => dispatch({ type: 'deliver' }), DELIVERY_MS)
    return () => window.clearTimeout(t)
  }, [phase, seq])

  const speakPhrase = useCallback(
    (id: PictoId) => {
      const p = PHRASES.find((x) => x.id === id)
      if (p) speak(p.spoken)
    },
    [speak],
  )

  const press = useCallback(
    (id: PictoId, isUrgent: boolean, opts?: { speak: boolean }) => {
      if (opts?.speak !== false) speakPhrase(id)
      dispatch({ type: 'press', id, urgent: isUrgent, time: nowHHMM() })
    },
    [speakPhrase],
  )

  // Focus management: replying unmounts the focused button, so focus moves to the result.
  const pendingFocus = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const reply = (kind: 'voy' | 'llamo') => {
    speak(SAID_REPLY)
    pendingFocus.current = true
    dispatch({ type: 'reply', with: kind })
  }

  const reset = () => {
    hush()
    dispatch({ type: 'reset' })
    // The reset button disappears in the idle state: send focus back to the box.
    gridRef.current?.querySelector('button')?.focus()
  }

  const message = phrase ? `Papá: ${lowerFirst(phrase.label)}` : ''

  const said = phase === 'coming' || phase === 'calling' ? SAID_REPLY : phrase && phase !== 'idle' ? phrase.spoken : null

  // Words for the live region: every state change, described without colour alone.
  // With the voice on, the box already speaks the phrase, so the narration leaves it out.
  const says = (text: string) => (voiceOn ? '' : `El aparato dice «${text}». `)
  let narration = ''
  if (phase === 'idle' && touched) narration = 'Demostración en espera. Todo tranquilo.'
  if (phrase) {
    if (phase === 'sent')
      narration = `${urgent ? 'Pulsación larga, aviso urgente. ' : ''}${says(phrase.spoken)}Luz ámbar: enviado.`
    if (phase === 'offline')
      narration = `${says(phrase.spoken)}Luz roja: sin conexión. El aviso todavía no ha salido.`
    if (phase === 'notified')
      narration = `${urgent ? 'Aviso urgente a todos los contactos. ' : ''}Llega al móvil de Marta: ${message}, ${time}. Puedes responder «Voy» o «Te llamo».`
    if (phase === 'coming') narration = `Marta responde «Voy». Luz verde: te han entendido. ${says(SAID_REPLY)}`
    if (phase === 'calling')
      narration = `Marta responde «Te llamo». Luz verde: te han entendido. ${says(SAID_REPLY)}Llamando a Antonio.`
  }

  const phoneView = phase === 'notified' ? 'notif' : phase === 'coming' || phase === 'calling' ? 'done' : 'idle'
  const swap = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0 } } }
    : {
        initial: { opacity: 0, y: -28 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }

  const green = phase === 'coming' || phase === 'calling'
  const ledAnimate = reduce
    ? { opacity: 1, scaleY: 1 }
    : phase === 'offline'
      ? { opacity: [1, 0.45, 1], scaleY: 1 }
      : green
        ? { opacity: 1, scaleY: [1, 1.6, 1] }
        : { opacity: 1, scaleY: 1 }
  const ledTransition = reduce
    ? { duration: 0 }
    : phase === 'offline'
      ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' as const }
      : green
        ? { duration: 0.6, ease: EASE }
        : { duration: 0.3 }

  const quiet =
    'inline-flex min-h-11 items-center gap-1.5 text-sm underline underline-offset-4 transition-colors duration-200'
  const quietOff = 'text-ink-2 decoration-line hover:text-ink hover:decoration-ink-2'

  return (
    <section id="demo" aria-labelledby="hero-title" className="bg-paper pt-14 pb-24 md:pt-20 md:pb-36">
      <div className="container-page">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <h1 id="hero-title" className="text-5xl text-ink md:text-6xl lg:col-span-7">
            Seis botones para decir lo que <em className="font-normal italic">importa</em>.
          </h1>
          <p className="max-w-2xl text-xl text-ink-2 md:text-2xl md:leading-snug lg:col-span-5 lg:text-xl">
            TeLlamo ayuda a personas mayores con afasia tras un ictus a avisar a su familia de lo cotidiano. No
            tiene pantalla y la familia contesta con un toque.
          </p>
        </div>

        {/* ---------------- Interactive demo ---------------- */}
        <div role="group" aria-labelledby="demo-title" className="mt-12 md:mt-14">
          <h2 id="demo-title" className="sr-only">
            Pruébalo: tú eres Antonio y también Marta
          </h2>
          <p aria-hidden="true" className="eyebrow">
            Pruébalo: tú eres Antonio y también Marta
          </p>

          <div className="mt-6 grid items-end gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
            {/* ---------- Device ---------- */}
            <div className="mx-auto w-full max-w-136 lg:mx-0">
              <div className="flex min-h-12 items-end justify-between gap-4">
                <p className="text-[0.9375rem] font-medium text-ink max-sm:sr-only">El aparato de Antonio</p>
                <AnimatePresence mode="wait" initial={false}>
                  {!touched ? (
                    <motion.p
                      key="hint"
                      aria-hidden="true"
                      className="ml-auto text-[0.9375rem] text-ink-2"
                      exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.25 } }}
                    >
                      Pulsa un botón · mantén para urgente
                    </motion.p>
                  ) : said ? (
                    /* What the box says, as a bubble coming out of the side speaker */
                    <motion.p
                      key={`said-${said}-${seq}`}
                      className="relative ml-auto mr-1 rounded-2xl border border-line bg-card px-4 py-1.5 font-display text-lg text-ink italic sm:mr-2"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.4, ease: EASE } }}
                      exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.15 } }}
                    >
                      <span className="sr-only">El aparato dice: </span>«{said}»
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 right-3 size-3 rotate-45 border-r border-b border-line bg-card"
                      />
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="mt-4 pb-5" style={{ perspective: '1200px' }}>
                <div
                  className="flex overflow-hidden rounded-[1.75rem] border border-clay-dark bg-clay sm:rounded-(--radius-device)"
                  style={{
                    transform: 'rotateX(14deg)',
                    transformOrigin: '50% 100%',
                    boxShadow:
                      '0 14px 0 var(--color-clay-dark), 0 44px 40px -30px rgb(28 26 23 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.6)',
                  }}
                >
                  <div className="min-w-0 flex-1 p-3.5 sm:p-7">
                    {/* LED strip */}
                    <div className="rounded-full bg-clay-dark/60 p-1 shadow-[inset_0_1px_2px_rgb(28_26_23/0.2)]">
                      <motion.div
                        aria-hidden="true"
                        className={`h-2 rounded-full transition-colors duration-700 ease-(--ease-soft) motion-reduce:transition-none sm:h-2.5 ${LED_BAR[led.tone]}`}
                        animate={ledAnimate}
                        transition={ledTransition}
                      />
                    </div>

                    <div
                      ref={gridRef}
                      className="mt-5 grid grid-cols-3 gap-x-2.5 gap-y-5 sm:mt-7 sm:gap-x-5 sm:gap-y-7"
                    >
                      {PHRASES.map((p) => (
                        <DeviceButton
                          key={p.id}
                          id={p.id}
                          label={p.label}
                          active={phase !== 'idle' && state.phrase === p.id}
                          onPress={press}
                          onSpeak={speakPhrase}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Speaker grille on the side */}
                  <div
                    aria-hidden="true"
                    className="flex w-6 shrink-0 items-center justify-center border-l border-clay-dark bg-clay-dark/35 sm:w-10"
                  >
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {Array.from({ length: 12 }, (_, i) => (
                        <span key={i} className="size-1 rounded-full bg-ink/45 sm:size-1.5" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* LED state in words */}
              <p className={`mt-5 flex items-center gap-2.5 text-[0.9375rem] font-medium ${LED_TEXT[led.tone]}`}>
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-full transition-colors duration-700 ease-(--ease-soft) motion-reduce:transition-none ${LED_BAR[led.tone]}`}
                />
                <span>
                  {led.light} · {led.label}
                </span>
              </p>
              <p id="demo-hold-hint" className="sr-only">
                Mantén pulsado un botón (o la barra espaciadora) para un aviso urgente a todos los contactos, o
                activa «Aviso urgente».
              </p>

              {/* ---------- Quiet controls ---------- */}
              <div className="mt-3 flex flex-wrap items-center gap-x-6">
                {speechOk ? (
                  <button
                    type="button"
                    aria-pressed={sound}
                    onClick={() => {
                      if (sound) hush()
                      dispatch({ type: 'toggleSound' })
                    }}
                    className={`${quiet} ${quietOff}`}
                  >
                    {sound ? (
                      <Volume2 aria-hidden="true" className="size-4" />
                    ) : (
                      <VolumeX aria-hidden="true" className="size-4" />
                    )}
                    Sonido
                    <span className="sr-only">: lee la frase en voz alta</span>
                    <span aria-hidden="true" className="text-muted">
                      {sound ? 'sí' : 'no'}
                    </span>
                  </button>
                ) : (
                  <p className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted">
                    <VolumeX aria-hidden="true" className="size-4" />
                    Sonido no disponible en este navegador
                  </p>
                )}
                <button
                  type="button"
                  aria-pressed={urgentNext}
                  onClick={() => dispatch({ type: 'toggleUrgent' })}
                  className={`${quiet} ${urgentNext ? 'font-medium text-red-ink decoration-red-ink' : quietOff}`}
                >
                  <TriangleAlert aria-hidden="true" className="size-4" />
                  Aviso urgente
                </button>
                <button
                  type="button"
                  aria-pressed={offline}
                  onClick={() => dispatch({ type: 'toggleOffline' })}
                  className={`${quiet} ${offline ? 'font-medium text-ink decoration-ink' : quietOff}`}
                >
                  {offline ? (
                    <WifiOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Wifi aria-hidden="true" className="size-4" />
                  )}
                  Simular sin conexión
                </button>
                {phase !== 'idle' && (
                  <button type="button" onClick={reset} className={`${quiet} ${quietOff}`}>
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Reiniciar
                  </button>
                )}
              </div>

              {/* Small screens: the phone sits below the box, out of view. Point to it. */}
              {phoneView === 'notif' && (
                <a
                  href="#movil-marta"
                  className="mt-4 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 text-[0.9375rem] font-medium text-ink lg:hidden"
                >
                  A Marta le ha llegado el aviso
                  <ArrowDown aria-hidden="true" className="size-4 shrink-0" />
                </a>
              )}
            </div>

            {/* ---------- Phone ---------- */}
            <div id="movil-marta" className="mx-auto w-full max-w-72 scroll-mt-24 lg:mx-0">
              <p className="text-[0.9375rem] font-medium text-ink">El móvil de Marta</p>
              <div className="mt-5 rounded-[2.5rem] bg-night p-2.5 shadow-[0_40px_40px_-30px_rgb(28_26_23/0.45)]">
                <div className="flex min-h-112 flex-col rounded-[2rem] bg-paper">
                  <div aria-hidden="true" className="flex items-center justify-center pt-2.5">
                    <span className="h-1.5 w-14 rounded-full bg-night/85" />
                  </div>
                  <div className="flex items-baseline justify-between px-5 pt-4">
                    <p className="font-display text-xl text-ink">TeLlamo</p>
                    <p className="text-sm text-muted">Antonio</p>
                  </div>

                  <div className="relative flex flex-1 flex-col px-3.5 pt-5 pb-4">
                    <AnimatePresence mode="wait" initial={false}>
                      {phoneView === 'idle' && (
                        <motion.div
                          key="idle"
                          className="flex flex-1 flex-col justify-center px-2 pb-8"
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.3 } }}
                          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.15 } }}
                        >
                          <p className="font-display text-3xl leading-tight text-ink">Todo tranquilo</p>
                          <p className="mt-3 text-[0.9375rem] text-ink-2">
                            {phase === 'sent'
                              ? 'Llegando un aviso…'
                              : phase === 'offline'
                                ? 'Sin avisos. El aparato de Antonio no tiene conexión.'
                                : 'Hoy no hay avisos. Cuando Antonio pulse un botón, lo verás aquí.'}
                          </p>
                        </motion.div>
                      )}

                      {phoneView === 'notif' && (
                        <motion.div
                          key={`notif-${seq}`}
                          {...swap}
                          className={`rounded-3xl border bg-card p-4 ${urgent ? 'border-2 border-red-ink' : 'border-line'}`}
                        >
                          {urgent && (
                            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold tracking-wide text-red-ink uppercase">
                              <TriangleAlert aria-hidden="true" className="size-4" strokeWidth={2.25} />
                              Urgente
                            </p>
                          )}
                          <p className="font-display text-2xl leading-tight text-ink">{message}</p>
                          <p className="mt-1.5 text-sm text-muted">
                            {time}
                            {urgent ? ' · Avisados todos los contactos' : ' · Ahora'}
                          </p>
                          <div className="mt-5 grid gap-2.5">
                            <button
                              type="button"
                              onClick={() => reply('voy')}
                              className="min-h-14 rounded-full bg-ink text-lg font-semibold text-paper transition-transform duration-100 active:scale-[0.98]"
                            >
                              Voy
                            </button>
                            <button
                              type="button"
                              onClick={() => reply('llamo')}
                              className="min-h-14 rounded-full border-2 border-ink text-lg font-semibold text-ink transition-transform duration-100 active:scale-[0.98]"
                            >
                              Te llamo
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {phoneView === 'done' && (
                        <motion.div
                          key="done"
                          className="flex flex-1 flex-col justify-center px-2 pb-8"
                          initial={reduce ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: EASE } }}
                          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.15 } }}
                        >
                          <span
                            aria-hidden="true"
                            className="flex size-12 items-center justify-center rounded-full bg-green text-card"
                          >
                            {phase === 'calling' ? (
                              <Phone className="size-5" strokeWidth={2.5} />
                            ) : (
                              <Check className="size-6" strokeWidth={2.5} />
                            )}
                          </span>
                          <p
                            tabIndex={-1}
                            ref={(el) => {
                              if (el && pendingFocus.current) {
                                pendingFocus.current = false
                                el.focus({ preventScroll: true })
                              }
                            }}
                            className="mt-5 font-display text-3xl leading-tight text-ink"
                          >
                            {phase === 'calling' ? 'Llamando a Antonio…' : 'Antonio sabe que vas'}
                          </p>
                          <p className="mt-3 text-[0.9375rem] text-ink-2">
                            {message} · {time}
                            <br />
                            Su aparato está en verde.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p aria-live="polite" role="status" className="sr-only">
            {narration}
          </p>
        </div>
      </div>
    </section>
  )
}
