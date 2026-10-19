import { useState } from 'react'
import { Code2, Bot, Sparkles, Server, ArrowRight } from 'lucide-react'
import { techStack } from '../../utils/tech.js'

export default function ServicesSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const services = [
    {
      index: '01',
      title: 'Full-Stack Web Engineering',
      tagline: 'Fast, type-safe, resilient applications from database to DOM.',
      description: 'Architecting robust web systems with React 19, Vite, Next.js, Django, Node.js, and relational/document databases. Obsessed with clean state patterns, sub-100ms API latency, and offline-first durability.',
      skills: ['React 19', 'Next.js', 'TypeScript', 'Node.js', 'Django / Python', 'PostgreSQL / MongoDB', 'REST & WebSockets'],
      icon: <Code2 size={24} className="text-accent-pink" />,
    },
    {
      index: '02',
      title: 'Autonomous AI & Agents',
      tagline: 'Multi-model orchestration, tool calling & live web grounding.',
      description: 'Building autonomous agent loops with LangChain, Gemini API, Claude 3.5 Sonnet, and Tavily internet grounding. Specializing in BYOK encryption, voice agents, and multi-platform automation.',
      skills: ['LangChain', 'Gemini & Claude APIs', 'Tavily Search Grounding', 'Computer Vision POS', 'Tool Calling', 'AES-256 BYOK'],
      icon: <Bot size={24} className="text-secondary-mesh-2" />,
    },
    {
      index: '03',
      title: 'Creative Frontend & Motion',
      tagline: 'Awwwards-level craft with GSAP, Three.js & custom GLSL shaders.',
      description: 'Translating boutique agency aesthetics into buttery 60fps web experiences. Fluid shader caustics, Lenis smooth scrolling, masked typography, and Flutter-style shared element hero transitions.',
      skills: ['GSAP (ScrollTrigger, Flip)', 'Three.js / GLSL Shaders', 'Lenis Scroll', 'Framer Motion', 'Micro-interactions'],
      icon: <Sparkles size={24} className="text-accent-amber" />,
    },
    {
      index: '04',
      title: 'Cloud Sandboxes & Systems',
      tagline: 'Container orchestration, isolated runtimes & duplex streaming.',
      description: 'Designing elastic developer sandboxes using Docker, Kubernetes, Skaffold, and low-latency duplex WebSocket terminal streams. Production AWS EKS configurations and ephemeral pod teardowns.',
      skills: ['Kubernetes & Skaffold', 'Docker Runtimes', 'AWS EKS', 'WebSocket Terminal Shells', 'Microservices Architecture'],
      icon: <Server size={24} className="text-[#10B981]" />,
    },
  ]

  return (
    <section className="services-section section-wrap" id="services">
      {/* Section Header */}
      <div className="section-heading mb-14" data-scroll-reveal>
        <div>
          <span className="section-kicker">03 — CAPABILITIES</span>
          <h2 className="text-fluid-h2">
            What I <em>actually</em> do.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-2 max-w-xl">
            No vague buzzwords. Just high-grade code, generative intelligence, and obsessively refined interfaces.
          </p>
        </div>
        <span className="font-mono text-xs uppercase text-accent-pink tracking-widest hidden md:inline-block">
          FOUR CORE DISCIPLINES
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((item, idx) => (
          <div
            key={item.index}
            className="service-card grain-card group cursor-pointer"
            onPointerEnter={() => setHoveredIdx(idx)}
            onPointerLeave={() => setHoveredIdx(null)}
          >
            {/* Top row: Number index and icon */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-2xl font-bold text-text-tertiary group-hover:text-accent-pink transition-colors">
                {item.index}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border-default flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
            </div>

            {/* Service Title & Tagline */}
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary group-hover:text-accent-pink transition-colors mb-2">
              {item.title}
            </h3>
            <p className="font-mono text-xs text-accent-amber uppercase tracking-wider mb-4">
              {item.tagline}
            </p>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
              {item.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-2 border border-border-subtle text-text-secondary group-hover:border-accent-pink/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Horizontal Strip */}
      <div className="mt-16 pt-8 border-t border-border-subtle flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          VERIFIED TECH STACK
        </span>
        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech) => (
            <span
              key={tech.id}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-border-default text-xs font-mono text-text-primary hover:border-accent-pink hover:text-accent-pink transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tech.accent || 'var(--accent-pink)' }} />
              <span>{tech.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
