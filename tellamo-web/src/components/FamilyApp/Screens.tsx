import { PHRASES, Picto, type PictoId } from '../Pictos'

export type Reply = 'voy' | 'llamo' | null

const REPLY_LABEL: Record<'voy' | 'llamo', string> = { voy: 'Voy', llamo: 'Te llamo' }

/* ---------- Aviso ---------- */
export function AvisoScreen({ reply, onReply }: { reply: Reply; onReply: (r: 'voy' | 'llamo') => void }) {
  const answered = reply !== null
  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-4">
      <p className="text-sm text-ink-2">Ahora</p>

      <div className="mt-2 rounded-2xl border border-line bg-card p-4">
        <div className="flex items-center justify-between text-[0.8125rem] text-ink-2">
          <span className="font-medium">TeLlamo</span>
          <span className="tabular-nums">11:15</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-amber/25 text-ink">
            <Picto id="calor" className="size-7" />
          </span>
          <p className="font-display text-2xl leading-tight">
            Papá: <span className="whitespace-nowrap">tengo calor</span>
            <span className="sr-only"> · a las 11:15</span>
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <p aria-live="polite" className="mb-4 flex items-start gap-2 text-sm text-ink-2">
          <span
            aria-hidden="true"
            className={`mt-1.5 size-2.5 shrink-0 rounded-full ${answered ? 'bg-green' : 'bg-amber'}`}
          />
          {answered ? (
            <span>
              <strong className="font-semibold text-green-ink">Luz verde en casa.</strong> Has respondido «
              {REPLY_LABEL[reply]}»{reply === 'voy' ? ' y la caja dice «Ya viene alguien»' : ''}.
            </span>
          ) : (
            <span>
              <strong className="font-semibold text-amber-ink">Luz ámbar en casa.</strong> Aviso enviado,
              esperando respuesta.
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3">
          {(['voy', 'llamo'] as const).map((r) => {
            const primary = r === 'voy'
            return (
              <button
                key={r}
                type="button"
                aria-pressed={reply === r}
                onClick={() => onReply(r)}
                className={[
                  'min-h-14 w-full rounded-full text-lg font-semibold transition-colors duration-300',
                  primary
                    ? 'bg-ink text-paper hover:bg-ink-2'
                    : 'border-2 border-ink bg-transparent text-ink hover:bg-paper-2',
                ].join(' ')}
              >
                {REPLY_LABEL[r]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- Historial ---------- */
type Entry = { time: string; id: PictoId; phrase: string; who?: string; answer?: string; note?: string }

export function HistorialScreen({ reply }: { reply: Reply }) {
  const entries: Entry[] = [
    {
      time: '11:15',
      id: 'calor',
      phrase: 'Tengo calor',
      ...(reply ? { who: 'Marta', answer: REPLY_LABEL[reply] } : {}),
    },
    {
      time: '10:20',
      id: 'bano',
      phrase: 'Quiero ir al baño',
      who: 'Segundo contacto',
      answer: 'Voy',
      note: 'Marta no ha respondido en 5 minutos',
    },
    { time: '08:30', id: 'sed', phrase: 'Tengo sed', who: 'Marta', answer: 'Te llamo' },
  ]
  return (
    <div className="h-full px-5 pb-5 pt-4">
      <p className="flex items-baseline justify-between">
        <strong className="font-display text-2xl font-normal">Hoy</strong>
        <span className="text-sm text-ink-2">3 avisos</span>
      </p>
      <ol className="mt-3 divide-y divide-line border-y border-line">
        {entries.map((e) => (
          <li key={e.time} className="flex gap-3 py-3.5">
            <span className="w-11 shrink-0 pt-0.5 text-sm tabular-nums text-ink-2">{e.time}</span>
            <Picto id={e.id} className="mt-0.5 size-5 shrink-0 text-ink" />
            <div className="min-w-0">
              <p className="font-medium leading-snug">{e.phrase}</p>
              {e.who ? (
                <p className="text-sm text-ink-2">
                  <span className="font-medium text-green-ink">{e.who}: {e.answer}</span>
                  {e.note ? <span className="block">{e.note}</span> : null}
                </p>
              ) : (
                <p className="text-sm font-medium text-amber-ink">Esperando respuesta</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------- Ajustes ---------- */
export function AjustesScreen() {
  return (
    <div className="h-full px-5 pb-5 pt-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">Botones de la caja</p>
        <span className="text-sm text-ink-2">Toca un botón para editarlo</span>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {PHRASES.map((p) => (
          <li
            key={p.id}
            className="flex min-h-[5.25rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-1.5 py-2 text-center"
          >
            <Picto id={p.id} className="size-7 text-ink" />
            <span className="text-[0.8125rem] leading-tight">{p.label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-medium">Contactos, por orden</p>
      <ol className="mt-2 divide-y divide-line border-y border-line">
        {[
          { n: 1, name: 'Marta', hint: 'Recibe el aviso primero' },
          { n: 2, name: 'Segundo contacto', hint: 'Si Marta no responde en 5 minutos' },
        ].map((c) => (
          <li key={c.n} className="flex items-center gap-3 py-2.5">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-paper-2 text-sm font-semibold tabular-nums"
            >
              {c.n}
            </span>
            <span className="min-w-0">
              <span className="block font-medium leading-snug">{c.name}</span>
              <span className="block text-sm text-ink-2">{c.hint}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
