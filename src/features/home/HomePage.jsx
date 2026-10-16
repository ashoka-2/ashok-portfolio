import { ArrowDown, ArrowUpRight, Code2, GitBranch, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import TechLamp from '../../components/tech/TechLamp.jsx'
import PhysicsField from '../physics/PhysicsField.jsx'
import ProjectCard from '../projects/ProjectCard.jsx'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'

export default function HomePage() {
  const featured = projects.slice(0, 3)
  const heroTech = ['react', 'python', 'gsap', 'figma'].map((id) => techStack.find((item) => item.id === id)).filter(Boolean)
  return <>
    <section className="hero page-gutter" id="top">
      <div className="hero-copy">
        <div className="eyebrow" data-reveal><span className="eyebrow-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-rule" /></div>
        <p className="hero-intro" data-reveal>Software developer <span>·</span> AI enthusiast <span>·</span> Kerala, India</p>
        <h1 data-reveal>I make digital<br />things <em>feel</em> different<span className="title-period">.</span></h1>
        <p className="hero-description" data-reveal>{profile.oneLiner} I build expressive interfaces and useful products where thoughtful engineering meets playful interaction.</p>
        <div className="hero-actions" data-reveal><Button to="/projects">Explore my work <ArrowUpRight size={16} /></Button><Button to="/about" kind="secondary">A little about me <ArrowUpRight size={15} /></Button></div>
        <div className="hero-social" data-reveal><span>ELSEWHERE</span><a href={profile.contact.github} target="_blank" rel="noreferrer"><GitBranch size={16} /> GitHub</a><a href={`mailto:${profile.contact.email}`}><span className="mail-icon">@</span> Email</a></div>
      </div>
      <div className="hero-visual" data-reveal>
        <div className="portrait-orbit orbit-one" /><div className="portrait-orbit orbit-two" />
        <div className="portrait-glow" />
        <div className="portrait-stage"><img className="portrait-image" src="/images/ashok-character.png" alt="Illustrated portrait of Ashok Kumar reaching forward" /></div>
        <div className="portrait-note"><span className="note-star">✳</span><span>IDEAS INTO<br /><b>REAL THINGS</b></span></div>
        <div className="portrait-index"><span>PROFILE — 01</span><span>2026</span></div>
        <div className="floating-chip chip-code"><Code2 size={14} /><span>BUILD<br /><b>WITH INTENT</b></span></div>
        <div className="floating-chip chip-spark"><Sparkles size={16} /></div>
        <div className="hero-tech-row"><span>IN THE MIX</span>{heroTech.map((tech) => <TechLamp key={tech.id} tech={tech} compact />)}</div>
      </div>
      <a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
    </section>

    <section className="intro-strip page-gutter" data-scroll-reveal><p>Curious by default.<br /><span>Builder by choice.</span></p><div><span className="strip-index">01 / THE PRACTICE</span><p>I work across software, AI and creative technology—turning complex ideas into intuitive, human experiences.</p></div><span className="strip-stamp">AK<br /><small>EST. 2023</small></span></section>

    <section className="work-section section-wrap" id="work">
      <div className="section-heading" data-scroll-reveal><div><span className="section-kicker">02 — SELECTED PROJECTS</span><h2>Things I’ve <em>made.</em></h2></div><Button to="/projects" kind="tertiary">All projects <ArrowUpRight size={15} /></Button></div>
      <div className="project-grid">{featured.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
    </section>

    <section className="physics-section section-wrap" id="playground">
      <div className="section-heading physics-heading" data-scroll-reveal><div><span className="section-kicker">03 — THE TOOLBOX</span><h2>Things I <em>play with.</em></h2><p>Give the skills a nudge. They’re a little less static here.</p></div><span className="physics-hint">DRAG · BOUNCE · EXPLORE</span></div>
      <PhysicsField items={techStack.slice(0, 24)} />
      <p className="physics-note">Each emblem opens a little more about the tool and where it fits in my work.</p>
    </section>

    <section className="about-preview page-gutter" id="about">
      <div className="about-art" data-scroll-reveal><div className="about-art-ring"><span>THINK</span><i>✳</i><span>MAKE</span><i>✳</i><span>LEARN</span><i>✳</i></div><span className="about-art-center">AK</span></div>
      <div className="about-copy" data-scroll-reveal><span className="section-kicker">04 — A LITTLE CONTEXT</span><h2>Curiosity is<br />part of the <em>process.</em></h2><p>{profile.statement}</p><div className="about-facts"><span><b>BASED IN</b>Kerala, India</span><span><b>STUDYING</b>Bachelor of Computer Applications</span></div><Button to="/about" kind="tertiary">More about me <ArrowUpRight size={15} /></Button></div>
    </section>

    <section className="contact-band section-wrap" id="contact" data-scroll-reveal><div><span className="section-kicker">05 — HAVE A GOOD ONE?</span><h2>Let’s make<br /><em>something matter.</em></h2><p>Have a curious problem, a thoughtful product or a fun experiment in mind? I’d love to hear about it.</p></div><div className="contact-band-action"><span className="contact-star">✳</span><Button href={`mailto:${profile.contact.email}`}>Say hello <ArrowUpRight size={16} /></Button><a href={profile.contact.github} target="_blank" rel="noreferrer">Or find me on GitHub ↗</a></div></section>
    <div className="home-bottom-mark"><span>AK — 2026</span><Link to="/projects">SEE WHAT’S NEXT <ArrowUpRight size={12} /></Link></div>
  </>
}
