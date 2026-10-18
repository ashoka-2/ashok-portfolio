import { useRef } from 'react'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Button from '../../components/buttons/Button.jsx'
import Marquee from '../../components/motion/Marquee.jsx'
import AboutCollage from './AboutCollage.jsx'
import SelectedWorks from '../projects/SelectedWorks.jsx'
import ServicesSection from './ServicesSection.jsx'
import JourneySection from './JourneySection.jsx'
import TestimonialsSection from './TestimonialsSection.jsx'
import FAQSection from './FAQSection.jsx'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { portfolioAssets } from '../../lib/assets.js'

export default function HomePage() {
  const heroRef = useRef(null)

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .fromTo('.hero-copy-in', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 })
      .fromTo('.hero-name', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' }, '-=0.45')
      .fromTo('.hero-portrait-frame', { clipPath: 'inset(8% 0 8% 0)', opacity: 0.5 }, { clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: 1.1, ease: 'power3.inOut' }, '-=0.6')
      .fromTo('.hero-bottomline', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
  }, { scope: heroRef })

  return (
    <div className="home-page-container">
      <section ref={heroRef} id="top" className="hero-section page-container portfolio-hero">
        <div className="hero-topline">
          <div className="hero-kicker"><span className="hero-status-dot" /> AVAILABLE FOR SELECT PROJECTS</div>
          <div className="hero-location">{profile.location.toUpperCase()} <span>·</span> UTC+5:30</div>
        </div>
        <div className="hero-main-grid">
          <div className="hero-editorial">
            <p className="hero-overline hero-copy-in">SOFTWARE DEVELOPER · AI ENGINEER</p>
            <h1 className="hero-name" aria-label={profile.name}>{profile.name}<span className="hero-name-period">.</span></h1>
            <p className="hero-description hero-copy-in">{profile.oneLiner} <span>{profile.statement}</span></p>
            <div className="hero-actions hero-copy-in">
              <Button to="#work"><span>Explore selected work</span><ArrowDown size={15} /></Button>
              <Button href={`mailto:${profile.contact.email}`} kind="secondary"><span>Start a conversation</span><ArrowUpRight size={15} /></Button>
            </div>
            <div className="hero-proof hero-copy-in"><span>01 / BUILT WITH INTENT</span><span>{String(projects.length).padStart(2, '0')} SELECTED PROJECTS</span></div>
          </div>
          <div className="hero-visual">
            <figure className="hero-portrait-frame">
              <img src={portfolioAssets.portraits.hero} alt={`Portrait of ${profile.name}`} className="hero-portrait-img" />
              <figcaption><span>ASHOK KUMAR</span><span>KERALA, INDIA ↗</span></figcaption>
            </figure>
          </div>
        </div>
        <a href="#about" className="hero-scroll-link">SCROLL TO EXPLORE <ArrowDown size={13} /></a>
      </section>

      <Marquee />

      <div className="page-container"><AboutCollage /></div>

      <section className="section-wrap page-container" id="work">
        <div className="section-heading mb-12" data-scroll-reveal>
          <div>
            <span className="section-kicker">02 — SELECTED PROJECTS</span>
            <h2 className="text-fluid-h2">Ideas, <em>in motion.</em></h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg mt-2 max-w-xl">A collection of systems and experiences built with curiosity, craft, and a bias toward making.</p>
          </div>
          <span className="font-mono text-xs uppercase text-[var(--accent-pink)] tracking-widest hidden md:inline-block">{String(projects.length).padStart(2, '0')} CASE STUDIES</span>
        </div>
        <SelectedWorks projects={projects} />
      </section>

      <div className="page-container"><ServicesSection /></div>
      <div className="page-container"><JourneySection /></div>
      <div className="page-container"><TestimonialsSection /></div>
      <div className="page-container"><FAQSection /></div>
    </div>
  )
}
