import { GraduationCap, Code2, Rocket, Award } from 'lucide-react'
import { profile } from '../../utils/profile.js'

export default function JourneySection() {
  const milestones = [
    {
      year: '2026',
      title: 'Parsu AI & codeSpace Cloud Sandboxes',
      category: 'Autonomous Agents & Distributed Systems',
      description: 'Engineered Parsu AI uniting 4 frontier models with live Tavily internet search grounding and 1-click social broadcasting. Architected codeSpace containerized sandboxes on Kubernetes with duplex terminal streaming.',
      icon: <Rocket size={20} className="text-[var(--accent-pink)]" />,
      badge: 'ACTIVE & LIVE',
    },
    {
      year: '2025',
      title: 'Snap2Bill, ScapeGoat & BattleArena',
      category: 'Computer Vision & AI Benchmarking',
      description: 'Built Snap2Bill AI camera POS with instant retail product recognition and GST invoicing. Developed ScapeGoat e-commerce platform and BattleArena multi-model competitive evaluation arena.',
      icon: <Code2 size={20} className="text-[var(--secondary-mesh-2)]" />,
      badge: 'SHIPPED',
    },
    {
      year: '2024',
      title: 'chatMe & Moodify',
      category: 'Real-Time WebSockets & Web Audio API',
      description: 'Crafted chatMe low-latency messaging engine with presence telemetry. Built Moodify generative audio-reactive visualizer mapping sound spectrums to live HTML5 canvas art.',
      icon: <Award size={20} className="text-[var(--accent-amber)]" />,
      badge: 'SHIPPED',
    },
    {
      year: '2023 — 2026',
      title: 'Bachelor of Computer Applications (BCA)',
      category: 'Higher Education · Kannur, Kerala',
      description: `${profile.education.degree} at ${profile.education.institution}, ${profile.education.campus}. Rigorous grounding in data structures, algorithms, database architectures, and distributed computation.`,
      icon: <GraduationCap size={20} className="text-[#10B981]" />,
      badge: 'CURRENT DEGREE',
    },
  ]

  return (
    <section className="journey-section section-wrap" id="journey">
      {/* Heading */}
      <div className="section-heading mb-14" data-scroll-reveal>
        <div>
          <span className="section-kicker">04 — VERIFIED TIMELINE</span>
          <h2 className="text-fluid-h2">
            The <em>journey</em> so far.
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mt-2 max-w-xl">
            A track record of building, shipping, breaking, and improving software with relentless curiosity.
          </p>
        </div>
        <span className="font-mono text-xs uppercase text-[var(--accent-amber)] tracking-widest hidden md:inline-block">
          EDUCATION & MILESTONES
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-[var(--border-default)] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {milestones.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot with pulsing ring */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-[var(--surface-1)] border-2 border-[var(--accent-pink)] flex items-center justify-center group-hover:scale-125 transition-transform shadow-[0_0_12px_rgba(255,72,164,0.4)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)]" />
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-[var(--shadow-card)] hover:border-[var(--accent-pink)]/50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-mono text-sm font-bold text-[var(--accent-amber)]">
                  {item.year}
                </span>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {item.badge}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                {item.category}
              </p>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
