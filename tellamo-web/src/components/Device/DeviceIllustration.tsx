import { PHRASES, Picto } from '../Pictos'
import { LEDS, type LedId, type PartId } from './parts'

/*
 * Two-view technical drawing (front + side profile) in a 720 × 520 viewBox.
 * Callout badges are HTML buttons placed on top using the coordinates in parts.ts,
 * so every leader line here must end where its badge sits.
 */

// Front view
const BODY = { x: 90, y: 120, w: 380, h: 276 }
const COLS = [114, 230, 346]
const ROWS = [184, 288]
const BTN = { w: 100, h: 84 }

// Side profile (lectern wedge): sloped top from front (566,300) up to back (676,132)
const SLOPE_ANGLE = -56.8
const SLOTS = [608, 620, 632, 644]

const DIM = 0.26
const fade = 'transition-opacity duration-300 ease-(--ease-soft)'

type Props = { active: PartId | null; led: LedId }

export default function DeviceIllustration({ active, led }: Props) {
  const o = (...ids: PartId[]) => ({ opacity: active === null || ids.includes(active) ? 1 : DIM })
  const is = (id: PartId) => active === id
  const ledState = LEDS.find((l) => l.id === led) ?? LEDS[0]

  return (
    <svg
      viewBox="0 0 720 520"
      className="block h-auto w-full"
      role="img"
      aria-label={`Dibujo de la caja TeLlamo de frente y de perfil: seis botones con pictograma en dos filas, una tira de luz arriba en ${ledState.colour.toLowerCase()}, altavoz en el lateral y base antideslizante. De perfil se ve inclinada como un atril.`}
    >
      {/* View captions */}
      <g className="fill-muted font-sans" fontSize="13" fontWeight="600" letterSpacing="1.2">
        <text x={BODY.x} y="104">FRENTE</text>
        <text x="560" y="104">PERFIL</text>
      </g>

      {/* ---------- FRONT VIEW ---------- */}
      <ellipse cx="280" cy="420" rx="214" ry="6" className="fill-ink" opacity="0.07" />

      {/* E: anti-slip base */}
      <rect
        x={BODY.x - 8}
        y={BODY.y + BODY.h - 4}
        width={BODY.w + 16}
        height="20"
        rx="6"
        className={`${fade} ${is('E') ? 'fill-ink-2' : 'fill-clay-dark'}`}
        style={o('E')}
      />

      {/* Body */}
      <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx="28" className="fill-clay" />
      <rect
        x={BODY.x + 1}
        y={BODY.y + 1}
        width={BODY.w - 2}
        height={BODY.h - 2}
        rx="27"
        fill="none"
        className="stroke-card"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* C: status light strip */}
      <g className={fade} style={o('C')}>
        <rect
          x="150"
          y="142"
          width="260"
          height="20"
          rx="10"
          className={`fill-clay-dark ${is('C') ? 'stroke-ink' : 'stroke-transparent'}`}
          strokeWidth="2.5"
        />
        <rect x="155" y="147" width="250" height="10" rx="5" className={`${ledState.fill} transition-[fill] duration-500 ease-(--ease-soft)`} />
      </g>

      {/* A: buttons, B: cards */}
      {PHRASES.map((phrase, i) => {
        const x = COLS[i % 3]
        const y = ROWS[Math.floor(i / 3)]
        return (
          <g key={phrase.id}>
            <g className={fade} style={o('A')}>
              <rect x={x} y={y + 5} width={BTN.w} height={BTN.h} rx="18" className="fill-clay-dark" />
              <rect
                x={x}
                y={y}
                width={BTN.w}
                height={BTN.h}
                rx="18"
                className={`fill-card ${is('A') ? 'stroke-ink' : 'stroke-clay-dark'}`}
                strokeWidth={is('A') ? 2.5 : 1}
              />
            </g>
            <g className={fade} style={o('A', 'B')}>
              <rect
                x={x + 10}
                y={y + 10}
                width={BTN.w - 20}
                height={BTN.h - 20}
                rx="10"
                className={`fill-card ${is('B') ? 'stroke-ink' : 'stroke-line'}`}
                strokeWidth={is('B') ? 2.5 : 1}
              />
              <Picto id={phrase.id} x={x + 31} y={y + 23} width="38" height="38" className="text-ink" />
            </g>
          </g>
        )
      })}

      {/* ---------- SIDE PROFILE ---------- */}
      <ellipse cx="621" cy="420" rx="70" ry="6" className="fill-ink" opacity="0.07" />

      {/* E: base, side */}
      <rect
        x="558"
        y={BODY.y + BODY.h - 4}
        width="126"
        height="20"
        rx="6"
        className={`${fade} ${is('E') ? 'fill-ink-2' : 'fill-clay-dark'}`}
        style={o('E')}
      />

      {/* Wedge body */}
      <path
        d="M566 386V310Q566 300 572 292L664 150Q676 132 676 150V386Q676 396 666 396H576Q566 396 566 386Z"
        style={{ fill: 'color-mix(in oklab, var(--color-clay) 70%, var(--color-clay-dark))' }}
      />
      {/* Sloped panel edge highlight */}
      <path d="M572 292L664 150" className="stroke-card" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* A: buttons seen from the side */}
      <g className={fade} style={o('A')}>
        {[
          [587, 257],
          [623, 202],
        ].map(([cx, cy]) => (
          <rect
            key={cx}
            x={cx - 17}
            y={cy - 5}
            width="34"
            height="10"
            rx="4"
            transform={`rotate(${SLOPE_ANGLE} ${cx} ${cy})`}
            className={`fill-card ${is('A') ? 'stroke-ink' : 'stroke-clay-dark'}`}
            strokeWidth={is('A') ? 2 : 1}
          />
        ))}
      </g>

      {/* C: light strip seen from the side */}
      <g className={fade} style={o('C')}>
        <rect
          x="646"
          y="152"
          width="16"
          height="6"
          rx="3"
          transform={`rotate(${SLOPE_ANGLE} 654 155)`}
          className={`${ledState.fill} transition-[fill] duration-500 ease-(--ease-soft)`}
        />
      </g>

      {/* D: speaker grille */}
      <g
        className={`${fade} ${is('D') ? 'stroke-ink' : 'stroke-ink-2'}`}
        style={{ opacity: is('D') ? 1 : active === null ? 0.5 : 0.16 }}
        strokeWidth="4"
        strokeLinecap="round"
      >
        {SLOTS.map((x) => (
          <line key={x} x1={x} x2={x} y1="272" y2="340" />
        ))}
      </g>

      {/* ---------- Leader lines (end where the HTML badges sit, see parts.ts) ---------- */}
      <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-ink">
        <g className={fade} style={o('A')}>
          <path d="M56 278H100M108 184H100V372H108" />
        </g>
        <g className={fade} style={o('B')}>
          <path d="M164 66V194" />
          <circle cx="164" cy="198" r="3.5" className="fill-ink" stroke="none" />
        </g>
        <g className={fade} style={o('C')}>
          <path d="M280 66V140" />
        </g>
        <g className={fade} style={o('D')}>
          <path d="M684 306H652" />
        </g>
        <g className={fade} style={o('E')}>
          <path d="M280 454V414" />
        </g>
      </g>
    </svg>
  )
}
