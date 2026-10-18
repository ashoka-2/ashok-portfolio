import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Sparkles, Terminal, Code } from 'lucide-react'
import WordReveal from '../../components/motion/WordReveal.jsx'
import { profile } from '../../utils/profile.js'

export default function AboutCollage() {
  const collageRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Scrubbed parallax on collage image cards
    const items = gsap.utils.toArray('.collage-card', collageRef.current)
    items.forEach((card, i) => {
      const speed = (i % 2 === 0 ? 30 : -40) * (1 + (i % 3) * 0.2)
      gsap.to(card, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    })
  }, { scope: collageRef })

  const traits = [
    { text: 'Allergic to generic UIs', icon: <Terminal size={14} className="text-[var(--accent-pink)]" /> },
    { text: 'LangChain & Shaders Whisperer', icon: <Sparkles size={14} className="text-[var(--secondary-mesh-2)]" /> },
    { text: 'Spends 2 hours fixing 1px margins', icon: <Code size={14} className="text-[var(--accent-amber)]" /> },
  ]

  const stats = [
    { label: 'EDUCATION', value: 'BCA (2023 - 2026)', sub: 'SNGCAS Kannur, Kerala' },
    { label: 'PROJECTS', value: '8 Completed', sub: 'From AI to Cloud Sandboxes' },
    { label: 'CRAFT', value: '100% Hand-Crafted', sub: 'Zero Template Shortcuts' },
    { label: 'LOCATION', value: 'Kerala, India', sub: 'Available Worldwide (IST)' },
  ]

  return (
    <section className="about-section section-wrap" id="about" ref={collageRef}>
      {/* Kicker & Statement */}
      <div className="max-w-4xl mb-12">
        <span className="section-kicker">01 — A BIT ABOUT ME</span>
        <h2 className="text-fluid-h2 mb-6">
          I bridge the gap between <em>curious logic</em> and <em>unapologetic aesthetics.</em>
        </h2>
        <WordReveal
          text="I am Ashok Kumar, a software developer, AI engineer, and creative technologist from Kerala, India. I don't just write functional code — I choreograph digital experiences where performance, clean architecture, and memorable visual craft meet."
        />
      </div>

      {/* 3 Trait Chips */}
      <div className="flex flex-wrap gap-3 mb-16">
        {traits.map((trait, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-1)] border border-[var(--border-default)] font-mono text-xs text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-pink)] transition-colors"
          >
            {trait.icon}
            <span>{trait.text}</span>
          </span>
        ))}
      </div>

      {/* Offset Media Collage (5-6 images) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16 items-center">
        {/* Image 1: Studio Portrait */}
        <div className="collage-card col-span-2 row-span-2 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-square bg-[#13121F] relative group">
          <img
            src="/generated/me-studio-headshot.jpg"
            alt="Ashok Kumar studio portrait with violet and pink rim light"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90">
            STUDIO · KERALA
          </div>
        </div>

        {/* Image 2: Creative Tech Workspace */}
        <div className="collage-card col-span-2 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-[4/3] bg-[#13121F] relative group">
          <img
            src="/generated/me-workspace.jpg"
            alt="Ashok Kumar in high-tech creative developer studio"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90">
            WORKBENCH
          </div>
        </div>

        {/* Image 3: 3D Fluid Glass Orb */}
        <div className="collage-card col-span-2 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-square bg-[#13121F] relative group">
          <img
            src="/generated/hero-gradient-orb.jpg"
            alt="Abstract chromatic fluid 3D glass orb"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90">
            CHROMATIC GLSL
          </div>
        </div>

        {/* Image 4: Vector Body Illustration */}
        <div className="collage-card col-span-1 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-[3/4] bg-[#1B1A2C] relative group">
          <img
            src="/me/portrait_vector_body.jpg"
            alt="Ashok Kumar vector illustration"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/90">
            VECTOR
          </div>
        </div>

        {/* Image 5: Vector Head Emblem */}
        <div className="collage-card col-span-1 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-square bg-[#13121F] relative group">
          <img
            src="/me/portrait_vector_head.jpg"
            alt="Ashok Kumar vector head portrait"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Truthful Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[var(--border-subtle)] font-mono">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs uppercase text-[var(--text-tertiary)] tracking-widest mb-1">
              {stat.label}
            </span>
            <span className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-display">
              {stat.value}
            </span>
            <span className="text-xs text-[var(--text-secondary)] mt-0.5">
              {stat.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
