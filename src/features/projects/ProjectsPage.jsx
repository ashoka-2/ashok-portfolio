import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../../utils/projects.js'
import SelectedWorks from './SelectedWorks.jsx'

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All')

  // Extract primary categories
  const categories = [
    'All',
    ...Array.from(new Set(projects.flatMap((p) => (Array.isArray(p.category) ? p.category : [p.category])))),
  ]

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => {
        const cats = Array.isArray(p.category) ? p.category : [p.category]
        return cats.includes(filter)
      })

  return (
    <div className="page-container py-28 relative projects-index-page" data-page-content>
      {/* Back button */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="section-kicker">02 / PROJECT ARCHIVE · {String(projects.length).padStart(2, '0')} BUILDS</span>
        <h1 className="text-fluid-h1 font-display font-black text-[var(--text-primary)] mb-4">
          Things I've <em>shipped.</em>
        </h1>
        <p className="text-fluid-body text-[var(--text-secondary)] leading-relaxed">
          From autonomous multi-model agent workspaces and Kubernetes cloud sandboxes to real-time WebSockets and audio-reactive frequency canvases.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-[var(--border-subtle)]">
        {categories.slice(0, 6).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
              filter === cat
                ? 'bg-[var(--accent-pink)] text-[var(--base-bg)] font-bold shadow-md'
                : 'bg-[var(--surface-1)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-pink)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Works Component */}
      <SelectedWorks projects={filtered} initialView="grid" />
    </div>
  )
}
