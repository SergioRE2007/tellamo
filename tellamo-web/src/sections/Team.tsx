import { ArrowUp, ArrowUpRight, FileText } from 'lucide-react'
import Reveal from '../components/Reveal'

const REPO_URL = 'https://github.com/SergioRE2007/tellamo'

function Dot() {
  return (
    <span aria-hidden="true" className="px-2 text-paper/40">
      ·
    </span>
  )
}

export default function Team() {
  return (
    <footer id="equipo" aria-labelledby="equipo-titulo" className="scroll-mt-20 bg-night text-paper">
      <div className="container-page py-24 md:py-36">
        <Reveal>
          <h2
            id="equipo-titulo"
            className="max-w-4xl text-4xl leading-[1.08] font-light md:text-6xl"
          >
            Que pedir un vaso de agua no dependa de que haya{' '}
            <em className="italic">alguien</em> delante.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-12 border-t border-paper/15 pt-10 md:mt-28 md:grid-cols-12 md:gap-8">
          <Reveal delay={0.1} className="md:col-span-5">
            <p className="eyebrow text-paper/70">Equipo</p>
            <p className="mt-4 font-display text-3xl leading-tight md:text-4xl">Sergio, Ana y Dani</p>
            <p className="mt-2 text-paper/75">
              2.º DAM
              <Dot />
              CPIFP Alan Turing
            </p>
          </Reveal>

          <Reveal delay={0.2} className="md:col-span-6 md:col-start-7">
            <p className="eyebrow text-paper/70">Contexto</p>
            <p className="mt-4 text-xl leading-snug md:text-2xl">
              Hackathon de accesibilidad
            </p>
            <p className="mt-2 max-w-md text-paper/75">
              <time dateTime="2026-12-03">3 de diciembre de 2026</time>, Día Internacional de las
              Personas con Discapacidad.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 md:mt-20">
          <a
            href={`${import.meta.env.BASE_URL}ficha-tellamo.pdf`}
            className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-paper/15 px-5 transition-colors hover:border-paper/40 focus-visible:outline-paper"
          >
            <span>
              <span className="block font-medium">Ficha del proyecto</span>
              <span className="block text-sm text-paper/70">PDF · una cara de A4</span>
            </span>
            <FileText aria-hidden="true" className="size-5 shrink-0 text-paper/70 group-hover:text-paper" />
          </a>
          <a
            href={REPO_URL}
            className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-paper/15 px-5 transition-colors hover:border-paper/40 focus-visible:outline-paper"
          >
            <span>
              <span className="block font-medium">Código de la web</span>
              <span className="block text-sm text-paper/70">En GitHub, abierto</span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 shrink-0 text-paper/70 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper motion-reduce:transition-none"
            />
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 md:mt-20">
          <p className="font-display text-lg text-paper/85">TeLlamo</p>
          <a
            href="#main"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-paper/85 underline-offset-4 transition-colors hover:text-paper hover:underline focus-visible:outline-paper"
          >
            Volver arriba
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
