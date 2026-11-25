import { ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Picto, type PictoId } from '../components/Pictos'

const MOMENTS: { time: string; id: PictoId; phrase: string }[] = [
  { time: '08:30', id: 'sed', phrase: 'Tengo sed' },
  { time: '11:15', id: 'calor', phrase: 'Tengo calor' },
  { time: '14:00', id: 'dolor', phrase: 'Me duele' },
  { time: '17:30', id: 'llamame', phrase: 'Llámame' },
]

export default function Problem() {
  return (
    <section id="problema" aria-labelledby="problema-title" className="bg-paper-2 py-24 md:py-36">
      <div className="container-page">
        <Reveal className="grid gap-10 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-11">
            <p className="eyebrow">El problema</p>
            <h2 id="problema-title" className="mt-4 text-4xl font-normal text-ink md:text-6xl">
              La teleasistencia es para emergencias.{' '}
              <span className="block pt-1 italic text-ink-2">¿Y el resto del día?</span>
            </h2>
          </div>
          <p className="max-w-[34rem] text-xl text-ink-2 md:col-span-7 md:col-start-6 md:text-2xl">
            Después de un ictus, muchas personas mayores viven con afasia: les cuesta hablar y
            escribir, y a menudo una mano ya no responde bien. Pasan el día solas en casa mientras
            su familia trabaja. Si tienen sed o algo les duele, no tienen cómo decirlo.
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <h3 className="eyebrow">Un día cualquiera</h3>

          <Reveal className="mt-8 grid gap-12 xl:mt-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-0">
            {/* Everyday moments: nobody hears them */}
            <div>
              <div className="relative">
                <Track />
                <ol className="relative grid gap-5 xl:grid-cols-4 xl:gap-4">
                {MOMENTS.map((m) => (
                  <li
                    key={m.time}
                    className="relative flex min-h-12 items-center gap-4 xl:flex-col xl:items-start xl:gap-0"
                  >
                    <time
                      dateTime={m.time}
                      className="w-12 shrink-0 text-sm tabular-nums text-muted xl:h-6 xl:w-auto xl:leading-6"
                    >
                      {m.time}
                    </time>
                    <span className="order-first flex h-12 items-center xl:order-none xl:h-10">
                      <span
                        aria-hidden="true"
                        className="relative z-10 block size-4 rounded-full border-2 border-ink-2 bg-paper-2"
                      />
                    </span>
                    <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-2.5 pl-3.5 pr-5 text-ink xl:mt-2 xl:gap-2 xl:pl-3 xl:pr-4">
                      <Picto id={m.id} className="size-5 shrink-0 text-ink-2" />
                      <span className="whitespace-nowrap">«{m.phrase}»</span>
                    </span>
                  </li>
                ))}
                </ol>
              </div>
              <p className="mt-8 max-w-sm text-ink-2 xl:mt-10">
                Para todo esto no hay botón.{' '}
                <span className="text-ink">Nadie se entera hasta que alguien vuelve a casa.</span>
              </p>
            </div>

            {/* The single moment that is covered */}
            <div className="border-t border-line pt-10 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
              <p className="text-sm text-muted xl:h-6 xl:leading-6">A cualquier hora</p>
              <div className="mt-2 flex items-center gap-4 xl:mt-0 xl:block">
                <span className="flex h-12 items-center xl:h-10">
                  <span aria-hidden="true" className="block size-4 rounded-full bg-ink" />
                </span>
                <p className="inline-flex flex-wrap items-center gap-x-2 rounded-full bg-night xl:whitespace-nowrap py-2.5 pl-4 pr-5 text-paper xl:mt-2">
                  <span>Emergencia</span>
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.25} />
                  <span className="sr-only">, la cubre la</span>
                  <span>teleasistencia</span>
                </p>
              </div>
              <p className="mt-8 max-w-[16rem] text-ink-2 xl:mt-10">
                Lo único que está cubierto.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Static hairline through the dot centres. Vertical below xl, horizontal from xl. */
function Track() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <span className="absolute bottom-6 left-[7px] top-6 w-0.5 bg-line xl:hidden" />
      <span className="absolute left-2 right-[calc(25%-20px)] top-[43px] hidden h-0.5 bg-line xl:block" />
    </div>
  )
}
