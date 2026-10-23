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

import CrossedMarquee from '../../components/motion/CrossedMarquee.jsx'

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
    const raw = event.nativeEvent || event
    heroInteractionRef.current?.hover?.(raw)
    if (raw.isTrusted) {
      const furEl = heroRef.current?.querySelector('.ref-hero-fur canvas') || heroRef.current?.querySelector('.ref-hero-fur')
      if (furEl) {
        furEl.dispatchEvent(new PointerEvent('pointermove', {
          clientX: raw.clientX,
          clientY: raw.clientY,
          bubbles: true,
          cancelable: true,
          pointerType: raw.pointerType || 'mouse',
        }))
      }
    }
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
      className="ref-hero relative isolate h-[100svh] min-h-[700px] overflow-clip max-[820px]:min-h-[800px] max-[520px]:h-[max(100svh,800px)] max-[520px]:min-h-[800px] min-[521px]:max-[820px]:h-[max(100svh,820px)] min-[521px]:max-[820px]:min-h-[820px] min-[821px]:max-[999px]:h-[max(100svh,850px)] min-[821px]:max-[999px]:min-h-[850px]"
      id="top"
      onPointerDownCapture={handleHeroPointerDown}
      onPointerMoveCapture={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
    >
      <div className="ref-hero-glow absolute z-0 left-1/2 top-[42%] w-[min(58vw,720px)] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--hero-glow),var(--hero-glow-soft)_42%,transparent_72%)] blur-[20px]" aria-hidden="true" />
      <h1 className="ref-sr">{hero.title}</h1>
      <HeroFur />
      <Suspense fallback={<div className="ref-model-loading absolute inset-0 grid place-items-center text-text-tertiary font-mono text-xs leading-[1.4] tracking-[0.1em] uppercase">Loading interactive portrait…</div>}><HeroModelCanvas interactionRef={heroInteractionRef} /></Suspense>
      {/* Film grain noise overlay over hero canvas and background */}
      <div className="ref-hero-grain pointer-events-none absolute inset-0 z-[4] bg-[url('/images/grain-noise.png')] bg-repeat [background-size:140px_140px] opacity-[0.16] mix-blend-overlay [data-theme=light]:opacity-[0.09] [data-theme=light]:mix-blend-multiply" aria-hidden="true" />
      {hero.stickers.map((sticker, index) => {
        const stickerStyles = [
          'left-[7%] top-[30%] max-[820px]:left-[4%] max-[820px]:top-[20%] -rotate-8 bg-[color-mix(in_srgb,var(--text-primary)_95%,transparent)] text-base-bg',
          'right-[8%] top-[24%] max-[820px]:right-[4%] max-[820px]:top-[15%] rotate-6 bg-accent text-white',
          'right-[14%] top-[60%] -rotate-4 bg-accent-amber text-base-bg max-[820px]:hidden',
        ][index] || ''
        return (
          <span
            className={`ref-sticker absolute z-[5] px-3.5 py-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.32)] text-[13px] font-medium whitespace-nowrap ${stickerStyles}`}
            key={sticker}
          >
            {sticker}
          </span>
        )
      })}
      <div className="ref-hero-ui absolute inset-0 z-[5] grid grid-rows-[1fr_auto] px-6 pointer-events-none max-[520px]:px-4">
        <div className="ref-hero-bottom mx-auto flex w-[min(100%,1120px)] flex-wrap items-end justify-between gap-6 pb-[72px] max-[999px]:flex-col max-[999px]:items-center max-[999px]:justify-end max-[999px]:gap-[14px] max-[999px]:pb-[82px] max-[999px]:text-center min-[821px]:max-[999px]:gap-[15px]">
          <div className="ref-hero-copy max-w-[620px] max-[820px]:max-w-[min(100%,38ch)] min-[821px]:max-[999px]:max-w-[42ch]">
            <span className="ref-open-chip mb-[18px] inline-flex min-h-9 items-center gap-[9px] rounded-full border border-border-default bg-[color-mix(in_srgb,var(--base-bg)_65%,transparent)] px-[14px] text-[13px] text-text-primary backdrop-blur-[10px] max-[820px]:mb-3"><i className="size-2 rounded-full bg-[#6fe3a2] shadow-[0_0_10px_rgba(111,227,162,0.4)]" />{hero.openLabel}</span>
            <h2 className="m-0 max-w-[13ch] font-[var(--font-bold)] text-[clamp(35px,4.4vw,60px)] leading-[0.98] tracking-[-0.045em] font-extrabold text-text-primary max-[999px]:max-w-none max-[820px]:text-[clamp(30px,7vw,44px)] min-[821px]:max-[999px]:text-[clamp(38px,5.2vw,52px)] max-[520px]:max-w-[12ch]">{hero.title.split('real')[0]}<em className="font-display font-normal text-accent-pink">real</em>{hero.title.split('real')[1]}</h2>
            <p className="mt-[14px] mb-0 max-w-[35ch] text-[clamp(15px,1.4vw,17px)] leading-[1.5] text-text-secondary max-[820px]:mx-auto max-[820px]:max-w-[34ch] min-[821px]:max-[999px]:mx-auto">{hero.description}</p>
          </div>
          <div className="ref-hero-actions grid justify-items-end gap-[14px] max-[999px]:justify-items-center max-[999px]:gap-[10px]">
            <div className="ref-meta flex flex-wrap justify-end gap-2 max-[999px]:justify-center">{hero.meta.map((item) => <span className="inline-flex min-h-[34px] items-center rounded-full border border-border-default bg-[color-mix(in_srgb,var(--base-bg)_64%,transparent)] px-[13px] font-display text-[13px] font-normal text-text-primary backdrop-blur-lg max-[520px]:min-h-[31px] max-[520px]:px-[10px] max-[520px]:text-xs" key={item}>{item}</span>)}</div>
            <div className="ref-cta-row flex flex-wrap justify-end gap-2 max-[999px]:justify-center max-[520px]:gap-2"><Button href="#work" kind="primary" className="symbiote-trigger">{hero.primaryAction} <ArrowDown size={16} /></Button><Button href="#contact" kind="secondary">{hero.secondaryAction} <ArrowUpRight size={16} /></Button></div>
          </div>
        </div>
      </div>
      <span className="ref-hero-hint pointer-events-none absolute z-[6] bottom-[22px] left-1/2 -translate-x-1/2 font-mono text-[11px] leading-[1.3] tracking-[0.1em] text-text-tertiary uppercase max-[520px]:hidden">{hero.hint}</span>
    </header>

    <CrossedMarquee />
    <AboutBento />

    <section className="section-wrap w-full relative z-[2] pt-[88px] pb-[96px] bg-base-bg max-[820px]:py-[68px]" id="work">
      <div className="mx-auto w-full max-w-[1360px] px-page-gutter">
        <div className="section-heading mb-12 items-end" data-scroll-reveal>
          <div>
            <span className="text-accent-pink font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">{selectedWork.kicker}</span>
            <h2 className="text-[clamp(1.85rem,4vw,3.8rem)] leading-[1.05] tracking-[-0.025em] font-[var(--font-bold)] font-extrabold text-text-primary">
              {selectedWork.heading[0]} <em className="text-accent-pink font-display font-normal not-italic">{selectedWork.heading[1]}</em>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg mt-2 max-w-xl">{selectedWork.description}</p>
          </div>
          <span className="font-mono text-xs uppercase text-accent-pink tracking-widest hidden md:inline-block">{String(projects.length).padStart(2, '0')} {selectedWork.countLabel}</span>
        </div>
        <SelectedWorks projects={projects} />
      </div>
    </section>

    <ProcessSection />
    <CapabilitiesSection />
    <ReferenceFAQ />
    <ReferencePhysics><PhysicsField items={techStack} /></ReferencePhysics>
  </div>
}
