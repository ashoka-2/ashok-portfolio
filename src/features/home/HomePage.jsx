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

export default function HomePage() {
  const heroRef = useRef(null)

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .fromTo('.hero-kicker, .hero-location', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 })
      .fromTo('.hero-char', { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.035, ease: 'power4.out' }, '-=0.25')
      .fromTo('.hero-copy-in', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 }, '-=0.5')
      .fromTo('.hero-portrait-frame', { clipPath: 'inset(12% 0 12% 0)', scale: 0.96 }, { clipPath: 'inset(0% 0 0% 0)', scale: 1, duration: 1.1, ease: 'power3.inOut' }, '-=0.8')
      .fromTo('.hero-bottomline', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
  }, { scope: heroRef })

  const [firstName, ...remainingName] = profile.name.toUpperCase().split(' ')
  const lastName = remainingName.join(' ')

  return (
    <div className="home-page-container">
      <section ref={heroRef} id="top" className="hero-section page-container portfolio-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

        <div className="hero-topline">
          <div className="hero-kicker"><span className="hero-status-dot" /> OPEN TO SELECT OPPORTUNITIES</div>
          <div className="hero-location">{profile.location.toUpperCase()} <span>·</span> UTC+5:30</div>
        </div>

        <div className="hero-main-grid">
          <div className="hero-editorial">
            <p className="hero-overline hero-copy-in">INDEPENDENT DEVELOPER & CREATIVE TECHNOLOGIST</p>
            <div className="hero-name-wrap">
              <h1 className="hero-name" aria-label={profile.name}>
                <span className="hero-name-line">{firstName.split('').map((char, index) => <span className="hero-char" key={`first-${index}`}>{char}</span>)}</span>
                <span className="hero-name-line hero-name-second">{lastName.split('').map((char, index) => <span className="hero-char" key={`last-${index}`}>{char}</span>)}<i className="hero-name-period">.</i></span>
              </h1>
            </div>
            <div className="hero-description hero-copy-in">
              <span className="hero-description-mark"><Sparkles size={17} /></span>
              <p>{profile.oneLiner} <span>{profile.statement}</span></p>
            </div>
            <div className="hero-actions hero-copy-in">
              <Button to="#work"><span>Explore selected work</span><ArrowDown size={15} /></Button>
              <Button href={`mailto:${profile.contact.email}`} kind="secondary"><span>Start a conversation</span><ArrowUpRight size={15} /></Button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-caption hero-copy-in"><span>01 / THE MAKER</span><span>BUILDING WITH INTENT</span></div>
            <div className="hero-portrait-frame">
              <img src="/generated/me-studio-headshot.jpg" alt={`Portrait of ${profile.name}`} className="hero-portrait-img" />
              <div className="hero-image-shade" />
              <div className="hero-image-index">AK<span>—</span>26</div>
              <div className="hero-image-card">
                <span className="hero-image-card-mark">✳</span>
                <div><strong>Curiosity, engineered.</strong><small>KERALA, INDIA · {profile.timezone}</small></div>
                <ArrowUpRight size={17} />
              </div>
            </div>
            <div className="hero-visual-foot hero-copy-in"><span>SOFTWARE</span><span>AI SYSTEMS</span><span>INTERACTIVE DESIGN</span></div>
          </div>
        </div>

        <div className="hero-bottomline">
          <a href="#work" className="hero-scroll-link"><span className="hero-scroll-line" /> SCROLL TO EXPLORE</a>
          <span className="hero-bottom-note">A PORTFOLIO OF IDEAS MADE REAL <span>↘</span></span>
          <span className="hero-bottom-count">{String(projects.length).padStart(2, '0')} SELECTED PROJECTS</span>
        </div>
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
