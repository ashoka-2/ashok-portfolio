import { lazy, Suspense, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SelectedWorks from '../projects/SelectedWorks.jsx'
import PhysicsField from '../physics/PhysicsField.jsx'
import HeroFur from './HeroFur.jsx'
import Button from '../../components/buttons/Button.jsx'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'
import { homePageContent } from '../../utils/pageContent.js'
import { AboutBento, CapabilitiesSection, ProcessSection, ReferenceFAQ, ReferencePhysics } from './ReferenceSections.jsx'

const HeroModelCanvas = lazy(() => import('./HeroModelCanvas.jsx'))

function Ribbon() {
  const { ribbonPhrases } = homePageContent
  return <div className="ref-ribbon" aria-hidden="true"><div className="ref-ribbon-track">{[...ribbonPhrases, ...ribbonPhrases, ...ribbonPhrases].map((phrase, index) => <span key={`${phrase}-${index}`}>{phrase}<i /></span>)}</div></div>
}

export default function HomePage() {
  const heroRef = useRef(null)
  const heroInteractionRef = useRef(null)
  const { hero, selectedWork } = homePageContent
  const getHeroControl = (event) => {
    const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement
    if (target?.closest?.('a, button, input, textarea, select')) return null
    const controls = heroRef.current?.querySelectorAll('.ref-fur-name, .hero-model-hit-area') || []
    return [...controls].find((node) => {
      const rect = node.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom
    }) || null
  }
  const handleHeroPointerDown = (event) => {
    const control = getHeroControl(event)
    if (!control?.classList.contains('hero-model-hit-area')) return
    event.preventDefault()
    heroInteractionRef.current?.begin(event.nativeEvent || event)
  }
  const handleHeroPointerMove = (event) => {
    const control = getHeroControl(event)
    if (!control?.classList.contains('hero-model-hit-area')) return
    heroInteractionRef.current?.hover?.(event.nativeEvent || event)
  }
  const handleHeroPointerLeave = () => {
    heroInteractionRef.current?.leave?.()
  }
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('.ref-hero-copy > *', { y: 25, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 })
      .fromTo('.ref-sticker', { scale: 0, rotation: -18 }, { scale: 1, rotation: (index) => [-8, 6, -4][index], duration: 0.8, stagger: 0.12, ease: 'elastic.out(1,.55)' }, '-=0.5')
  }, { scope: heroRef })

  return <div className="ref-home" ref={heroRef}>
    <header
      className="ref-hero"
      id="top"
      onPointerDownCapture={handleHeroPointerDown}
      onPointerMoveCapture={handleHeroPointerMove}
      onPointerLeaveCapture={handleHeroPointerLeave}
    >
      <div className="ref-hero-glow" aria-hidden="true" />
      <h1 className="ref-sr">{hero.title}</h1>
      <HeroFur />
      <Suspense fallback={<div className="ref-model-loading">Loading interactive portrait…</div>}><HeroModelCanvas interactionRef={heroInteractionRef} /></Suspense>
      {hero.stickers.map((sticker, index) => <span className={`ref-sticker ref-sticker-${['one', 'two', 'three'][index]}`} key={sticker}>{sticker}</span>)}
      <div className="ref-hero-ui">
        <div className="ref-hero-bottom">
          <div className="ref-hero-copy">
            <span className="ref-open-chip"><i />{hero.openLabel}</span>
            <h2>{hero.title.split('real')[0]}<em>real</em>{hero.title.split('real')[1]}</h2>
            <p>{hero.description}</p>
          </div>
          <div className="ref-hero-actions">
            <div className="ref-meta">{hero.meta.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="ref-cta-row"><Button href="#work" kind="primary">{hero.primaryAction} <ArrowDown size={16} /></Button><Button href="#contact" kind="secondary">{hero.secondaryAction} <ArrowUpRight size={16} /></Button></div>
          </div>
        </div>
      </div>
      <span className="ref-hero-hint">{hero.hint}</span>
    </header>

    <Ribbon />
    <AboutBento />

    <section className="section-wrap page-container ref-projects" id="work">
      <div className="section-heading mb-12" data-scroll-reveal>
        <div><span className="section-kicker">{selectedWork.kicker}</span><h2 className="text-fluid-h2">{selectedWork.heading[0]} <em>{selectedWork.heading[1]}</em></h2><p className="text-text-secondary text-base sm:text-lg mt-2 max-w-xl">{selectedWork.description}</p></div>
        <span className="font-mono text-xs uppercase text-accent-pink tracking-widest hidden md:inline-block">{String(projects.length).padStart(2, '0')} {selectedWork.countLabel}</span>
      </div>
      <SelectedWorks projects={projects} />
    </section>

    <ProcessSection />
    <CapabilitiesSection />
    <ReferenceFAQ />
    <ReferencePhysics><PhysicsField items={techStack} /></ReferencePhysics>
  </div>
}
