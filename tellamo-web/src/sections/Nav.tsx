import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '#problema', label: 'El problema' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#aparato', label: 'El aparato' },
  { href: '#app', label: 'La app' },
  { href: '#comparativa', label: 'Comparativa' },
  { href: '#viabilidad', label: 'Viabilidad' },
  { href: '#equipo', label: 'Equipo' },
] as const

const EASE = [0.22, 1, 0.36, 1] as const

/** Tiny drawing of the box: clay body, amber LED strip, three buttons. Decorative. */
function DeviceMark() {
  return (
    <svg viewBox="0 0 28 20" className="h-5 w-7 shrink-0" aria-hidden="true">
      <rect x="0.75" y="0.75" width="26.5" height="18.5" rx="5" className="fill-clay stroke-clay-dark" strokeWidth="1.5" />
      <rect x="7" y="4" width="14" height="2" rx="1" className="fill-amber" />
      <circle cx="8.5" cy="12.5" r="2" className="fill-ink" />
      <circle cx="14" cy="12.5" r="2" className="fill-ink" />
      <circle cx="19.5" cy="12.5" r="2" className="fill-ink" />
    </svg>
  )
}

/** Which section is in the middle band of the viewport, for a quiet "you are here" cue. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id
          setActive((prev) => (e.isIntersecting ? id : prev === id ? null : prev))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = LINKS.map((l) => l.href.slice(1))

export default function Nav() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => setScrolled(window.scrollY > 8), [])
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }, [])

  // While the panel is open: Escape closes it (focus back to the button),
  // a click outside closes it, and growing past the breakpoint closes it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close(true)
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) close(false)
    }
    const mq = window.matchMedia('(min-width: 80rem)')
    const onMq = () => mq.matches && close(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    mq.addEventListener('change', onMq)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      mq.removeEventListener('change', onMq)
    }
  }, [open, close])

  const solid = scrolled || open

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ease-(--ease-soft) ${
        solid ? 'border-line bg-paper' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a
          href="#demo"
          className="-mx-2 flex min-h-11 items-center gap-2.5 rounded-full px-2 text-ink"
          aria-label="TeLlamo, volver al inicio"
        >
          <DeviceMark />
          <span className="font-display text-[1.375rem] leading-none font-medium tracking-[-0.02em]">TeLlamo</span>
        </a>

        <nav aria-label="Principal" className="flex items-center gap-2">
          <ul className="hidden items-center xl:flex">
            {LINKS.map((l) => {
              const current = active === l.href.slice(1)
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={current ? 'location' : undefined}
                    className={`relative flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors duration-200 hover:text-ink ${
                      current ? 'text-ink' : 'text-ink-2'
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-2 h-px bg-ink transition-opacity duration-300 ${
                        current ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href="#demo"
            className="ml-2 hidden min-h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-2 md:inline-flex"
          >
            Probar la demo
          </a>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[0.9375rem] font-medium text-ink xl:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span>Menú</span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="panel"
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-line bg-paper xl:hidden"
              >
                <div className="container-page pt-2 pb-8">
                  <ul className="divide-y divide-line">
                    {LINKS.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          onClick={() => close(false)}
                          aria-current={active === l.href.slice(1) ? 'location' : undefined}
                          className="flex min-h-14 items-center font-display text-2xl text-ink aria-[current=location]:italic"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#demo"
                    onClick={() => close(false)}
                    className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-medium text-paper md:hidden"
                  >
                    Probar la demo
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  )
}
