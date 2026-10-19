import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers, List } from 'lucide-react'
import gsap from 'gsap'
import ProjectStack from './ProjectStack.jsx'

export default function SelectedWorks({ projects, initialView = 'list' }) {
  const [activeProject, setActiveProject] = useState(null)
  const [viewMode, setViewMode] = useState(initialView) // 'list' or 'grid'
  const previewRef = useRef(null)
  const listRef = useRef(null)
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const previewPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    let animId
    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
    }

    window.addEventListener('pointermove', onMouseMove, { passive: true })

    const render = () => {
      // Smooth lerp following cursor
      previewPos.current.x += (mousePos.current.x - previewPos.current.x) * 0.12
      previewPos.current.y += (mousePos.current.y - previewPos.current.y) * 0.12

      if (previewRef.current) {
        previewRef.current.style.left = `${previewPos.current.x + 30}px`
        previewRef.current.style.top = `${previewPos.current.y - 40}px`
      }
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="selected-works-wrap relative" ref={listRef}>
      {/* View Switcher: Two26 List vs Stacked Cards */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
            DISPLAY ARCHIVE ({projects.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface-1)] border border-[var(--border-default)]">
          <button
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-[var(--accent-pink)] to-[var(--secondary-mesh-2)] text-[var(--base-bg)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <List size={13} />
            <span>LIST</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-[var(--accent-pink)] to-[var(--secondary-mesh-2)] text-[var(--base-bg)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers size={13} />
            <span>CARDS</span>
          </button>
        </div>
      </div>

      {/* Mode A: Two26-Style Hover List (Default) */}
      {viewMode === 'list' && (
        <div className="works-hover-list" onPointerLeave={() => setActiveProject(null)}>
          {projects.map((project, idx) => {
            const isHovered = activeProject?.slug === project.slug
            return (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                data-project-title={project.title}
                data-cursor="VIEW"
                className="works-hover-row group"
                onPointerEnter={() => setActiveProject(project)}
              >
                {/* Index */}
                <span className="row-index font-mono">
                  {project.index || `0${idx + 1}`}
                </span>

                {/* Title */}
                <div className="flex flex-col">
                  <span className="row-title">
                    {project.title}
                  </span>
                  <span className="md:hidden font-mono text-xs text-[var(--text-tertiary)] mt-1">
                    {Array.isArray(project.category) ? project.category[0] : project.category} · {project.year}
                  </span>
                </div>

                {/* Category Tags */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="row-category">
                    {Array.isArray(project.category) ? project.category.join(' / ') : project.category}
                  </span>
                  <span className="row-arrow transition-transform text-[var(--text-tertiary)] group-hover:text-[var(--accent-pink)] group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={22} />
                  </span>
                </div>

                {/* Year */}
                <span className="row-year font-mono">
                  {project.year}
                </span>

                {/* Hidden img for Flutter flight transition rect measurement */}
                <img
                  src={project.desktopImage || project.cover?.dark}
                  alt={project.title}
                  className="sr-only"
                  aria-hidden="true"
                />
              </Link>
            )
          })}
        </div>
      )}

      {/* Mode B: Stacked / Grid Cards View */}
      {viewMode === 'grid' && (
        <ProjectStack projects={projects} />
      )}

      {/* Floating Media Preview Window (Follows Cursor on Hover) */}
      <div
        ref={previewRef}
        className={`floating-work-preview ${activeProject ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        {activeProject && (
          <div className="w-full h-full relative overflow-hidden bg-[var(--surface-1)]">
            <img
              src={activeProject.desktopImage || activeProject.cover?.dark}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--base-bg)]/80 via-transparent to-transparent flex items-end p-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--accent-pink)] font-semibold">
                  {activeProject.index} · CLICK TO EXPLORE
                </span>
                <div className="font-display text-lg font-bold text-white">
                  {activeProject.title}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
