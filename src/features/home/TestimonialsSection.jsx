import { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

// Array left empty as instructed: Do not invent testimonials or clients.
// When Ashok fills this array with verified recommendations, the slider automatically renders!
export const testimonialsData = [
  // Example schema when user provides real reviews:
  // {
  //   quote: "...",
  //   author: "Name",
  //   role: "Role",
  //   avatar: "/images/...",
  // }
]

export default function TestimonialsSection({ items = testimonialsData }) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // Gracefully hide until real data is provided
  if (!items || items.length === 0) {
    return null
  }

  const prev = () => setCurrentIdx((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  const next = () => setCurrentIdx((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  const current = items[currentIdx]

  return (
    <section className="testimonials-section section-wrap" id="testimonials">
      <div className="section-heading mb-12" data-scroll-reveal>
        <div>
          <span className="section-kicker">05 — KIND WORDS</span>
          <h2 className="text-fluid-h2">
            What collaborators <em>say.</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grain-card p-8 sm:p-12 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-[var(--shadow-card)] relative">
        <Quote size={40} className="text-[var(--accent-pink)]/30 mb-6" />
        <p className="font-display text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-[var(--text-primary)] mb-8">
          "{current.quote}"
        </p>
        <div className="flex items-center gap-4">
          {current.avatar && (
            <img src={current.avatar} alt={current.author} className="w-12 h-12 rounded-full object-cover" />
          )}
          <div>
            <div className="font-display font-bold text-base text-[var(--text-primary)]">{current.author}</div>
            <div className="font-mono text-xs text-[var(--text-tertiary)]">{current.role}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
