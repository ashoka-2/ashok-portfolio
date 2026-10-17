import { lazy, Suspense, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowDown, ArrowUpRight, Code2, GitBranch, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import PhysicsField from '../physics/PhysicsField.jsx'
import ProjectStack from '../projects/ProjectStack.jsx'
import Marquee from '../../components/motion/Marquee.jsx'
import WordReveal from '../../components/motion/WordReveal.jsx'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'

const HeroFluidCanvas = lazy(() => import('../../components/motion/HeroFluidCanvas.jsx'))

export default function HomePage() {
  const hero = useRef(null)
  const featured = projects
  const toolboxTech = techStack

  useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const portrait = hero.current.querySelector('.portrait-image')
      const note = hero.current.querySelector('.portrait-note')
      const codeChip = hero.current.querySelector('.chip-code')
      const sparkChip = hero.current.querySelector('.chip-spark')
      gsap.to(portrait, { y: -17, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(note, { y: -10, rotation: 2, duration: 4.1, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(codeChip, { y: 11, duration: 3.2, delay: 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(sparkChip, { y: -12, duration: 3.8, delay: 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    })
    return () => motion.revert()
  }, { scope: hero })

  return <>
    <section className="hero page-gutter" id="top" ref={hero}>
      <div className="hero-scene" aria-hidden="true">
        <Suspense fallback={<div className="hero-fluid hero-fluid-static" />}>
          <HeroFluidCanvas />
        </Suspense>
      </div>

      <div className="hero-copy">
        <p className="hero-intro" data-reveal>
          <span className="live-status-dot" /> Software developer <span>·</span> AI enthusiast <span>·</span> Kerala, India
        </p>
        <h1 data-reveal>I make digital<br />things <em>feel</em> different<span className="title-period">.</span></h1>
        <p className="hero-description" data-reveal>{profile.oneLiner} I build expressive interfaces and useful products where thoughtful engineering meets playful interaction.</p>
        <div className="hero-actions" data-reveal>
          <Button to="/projects">Explore my work</Button>
          <Button to="/about" kind="secondary">A little about me</Button>
        </div>
        <div className="hero-social" data-reveal>
          <span>ELSEWHERE</span>
          <a href={profile.contact.github} target="_blank" rel="noreferrer"><GitBranch size={16} /> GitHub</a>
          <a href={`mailto:${profile.contact.email}`}><span className="mail-icon">@</span> Email</a>
        </div>
      </div>

      <div className="hero-visual" data-reveal>
        <div className="portrait-orbit orbit-one" />
        <div className="portrait-orbit orbit-two" />
        <div className="portrait-glow" />
        <div className="portrait-stage">
          <img className="portrait-image" src="/images/ashok-character.png" alt="Illustrated portrait of Ashok Kumar reaching forward" />
        </div>
        <div className="portrait-note">
          <span className="note-star">✳</span>
          <span>IDEAS INTO<br /><b>REAL THINGS</b></span>
        </div>
        <div className="portrait-index">
          <span>KERALA, INDIA</span>
          <span>IST · 2026</span>
        </div>
        <div className="floating-chip chip-code">
          <Code2 size={14} />
          <span>BUILD<br /><b>WITH INTENT</b></span>
        </div>
        <div className="floating-chip chip-spark">
          <Sparkles size={16} />
        </div>
      </div>

      <a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
    </section>

    <section className="intro-strip page-gutter" data-scroll-reveal>
      <p>Curious by default.<br /><span>Builder by choice.</span></p>
      <div>
        <span className="strip-index">01 / THE PRACTICE</span>
        <p>I work across software, AI and creative technology—turning complex ideas into intuitive, human experiences.</p>
      </div>
      <span className="strip-stamp">AK<br /><small>EST. 2023</small></span>
    </section>

    <Marquee />

    <section className="work-section section-wrap" id="work">
      <div className="section-heading" data-scroll-reveal>
        <div>
          <span className="section-kicker">02 — SELECTED PROJECTS</span>
          <h2>Things I’ve <em>made.</em></h2>
        </div>
        <Button to="/projects" kind="tertiary">All projects</Button>
      </div>
      <ProjectStack projects={featured} />
    </section>

    <section className="physics-section section-wrap" id="playground">
      <div className="section-heading physics-heading" data-scroll-reveal>
        <div>
          <span className="section-kicker">03 — THE TOOLBOX</span>
          <h2>Things I <em>play with.</em></h2>
          <p>Give the skills a nudge. They’re a little less static here.</p>
        </div>
        <span className="physics-hint">DRAG · BOUNCE · EXPLORE</span>
      </div>
      <PhysicsField items={toolboxTech} />
      <p className="physics-note">Each emblem opens a little more about the tool and where it fits in my work.</p>
    </section>

    <section className="about-preview page-gutter" id="about">
      <div className="about-art" data-scroll-reveal>
        <div className="about-art-ring"><span>THINK</span><i>✳</i><span>MAKE</span><i>✳</i><span>LEARN</span><i>✳</i></div>
        <span className="about-art-center">AK</span>
      </div>
      <div className="about-copy" data-scroll-reveal>
        <span className="section-kicker">04 — A LITTLE CONTEXT</span>
        <h2>Curiosity is<br />part of the <em>process.</em></h2>
        <WordReveal text={profile.statement} />
        <div className="about-facts">
          <span><b>BASED IN</b>Kerala, India</span>
          <span><b>STUDYING</b>Bachelor of Computer Applications</span>
        </div>
        <Button to="/about" kind="tertiary">More about me</Button>
      </div>
    </section>

    <section className="contact-band section-wrap" id="contact" data-scroll-reveal>
      <div>
        <span className="section-kicker">05 — HAVE A GOOD ONE?</span>
        <h2>Let’s make<br /><em>something matter.</em></h2>
        <p>Have a curious problem, a thoughtful product or a fun experiment in mind? I’d love to hear about it.</p>
      </div>
      <div className="contact-band-action">
        <span className="contact-star">✳</span>
        <Button href={`mailto:${profile.contact.email}`}>Say hello</Button>
        <a href={profile.contact.github} target="_blank" rel="noreferrer">Or find me on GitHub ↗</a>
      </div>
    </section>
    
    <div className="home-bottom-mark">
      <span>AK — 2026</span>
      <Link to="/projects">SEE WHAT’S NEXT <ArrowUpRight size={12} /></Link>
    </div>
  </>
}
