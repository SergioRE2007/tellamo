import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import HowItWorks from './sections/HowItWorks'
import Device from './sections/Device'
import FamilyApp from './sections/FamilyApp'
import Comparison from './sections/Comparison'
import Specs from './sections/Specs'
import Team from './sections/Team'

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only-focusable z-50 rounded-full bg-ink px-4 py-2 text-paper">
        Saltar al contenido
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Device />
        <FamilyApp />
        <Comparison />
        <Specs />
      </main>
      <Team />
    </>
  )
}
