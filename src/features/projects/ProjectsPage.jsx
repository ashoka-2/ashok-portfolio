import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { projects } from '../../utils/projects.js'
import Button from '../../components/buttons/Button.jsx'
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
    <div className="mx-auto w-full max-w-[1360px] px-page-gutter py-28 relative projects-index-page" data-page-content>
      {/* Back button */}
      <div className="mb-10">
        <Button
          to="/"
          kind="secondary"
          className="!min-h-[38px] !h-[38px] !px-4 !text-xs font-mono !gap-2"
        >
          <ArrowLeft size={14} />
          <span>BACK TO HOME</span>
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-accent-pink font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">02 / PROJECT ARCHIVE · {String(projects.length).padStart(2, '0')} BUILDS</span>
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] font-bold font-display font-black text-text-primary mb-4">
          Things I've <em>shipped.</em>
        </h1>
        <p className="text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.6] text-text-secondary leading-relaxed">
          From autonomous multi-model agent workspaces and Kubernetes cloud sandboxes to real-time WebSockets and audio-reactive frequency canvases.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-border-subtle">
        {categories.slice(0, 6).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`ref-button !min-h-[36px] !h-[36px] !px-4 font-mono text-xs ${
              filter === cat
                ? 'ref-primary !text-white'
                : 'ref-secondary !text-text-secondary'
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
