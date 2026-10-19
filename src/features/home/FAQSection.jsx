import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0) // Default first open

  const faqs = [
    {
      q: 'Are you available for freelance contracts or engineering roles?',
      a: "Yes! I am currently open to select freelance contracts, creative engineering collaborations, and high-impact software development roles. Whether it's an autonomous AI tool, a sleek SaaS dashboard, or an Awwwards-worthy web experience, my inbox is open.",
    },
    {
      q: 'What is your core technical stack?',
      a: 'On the frontend: React 19, Vite, Next.js, Tailwind CSS, GSAP (ScrollTrigger & Flip), Three.js, and custom GLSL shaders. On the backend: Python (Django & FastAPI), Node.js, Express, MongoDB, MySQL, and WebSockets. For AI: LangChain, Gemini API, Claude 3.5 Sonnet, and Tavily live search grounding.',
    },
    {
      q: 'Do you design the interfaces or only write code?',
      a: 'I specialize in creative development — the bridge between product design and engineering. While I build using robust full-stack architecture, I obsess over typography, spacing, continuous squircles, micro-animations, and fluid physics so the final product feels calm and expensive.',
    },
    {
      q: 'Where are you based and how do you handle remote collaboration?',
      a: 'I am based in Kerala, India (IST / UTC+5:30). I work asynchronously and synchronously with teams worldwide, utilizing Git/GitHub, pull requests, automated previews, and transparent daily communication.',
    },
    {
      q: 'What makes your approach different from typical template builds?',
      a: 'Allergic to generic. I do not assemble cookie-cutter UI kits or bloated boilerplates. Every line of CSS, GSAP timeline, and shader is calibrated specifically to the project for 60fps performance and genuine brand distinction.',
    },
    {
      q: 'How do we kick off a collaboration?',
      a: "Click 'Let's Talk' in the header or email choudharyashok1230@gmail.com. Share a quick overview of what you are building, your timeline, and any reference links. I usually reply within 24 hours.",
    },
  ]

  const toggle = (idx) => {
    setOpenIdx((current) => (current === idx ? null : idx))
  }

  return (
    <section className="faq-section section-wrap" id="faq">
      <div className="section-heading mb-12" data-scroll-reveal>
        <div>
          <span className="section-kicker">05 — CLARITY FIRST</span>
          <h2 className="text-fluid-h2">
            Things you might <em>ask.</em>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-2 max-w-xl">
            Straightforward answers about how I work, what I build, and how we can collaborate.
          </p>
        </div>
        <span className="font-mono text-xs uppercase text-accent-pink tracking-widest hidden md:inline-block">
          FAQS & WORK ETHIC
        </span>
      </div>

      <div className="max-w-4xl mx-auto divide-y divide-[var(--border-subtle)]">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div key={idx} className="faq-item grain-card">
              <button
                onClick={() => toggle(idx)}
                className="faq-trigger cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="font-display pr-6 text-left group-hover:text-accent-pink transition-colors">
                  {faq.q}
                </span>
                <span className="w-8 h-8 rounded-full border border-border-default flex items-center justify-center shrink-0 text-text-tertiary group-hover:text-accent-pink group-hover:border-accent-pink transition-colors">
                  {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="faq-content">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
