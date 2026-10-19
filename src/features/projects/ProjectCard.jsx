import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { techStack } from '../../utils/tech.js'

export default function ProjectCard({ project, index = 0, stacked = false }) {
  const images = (project.images || [])
    .map((item) => (typeof item === 'string' ? item : item.url))
    .filter(Boolean)
  const image = project.desktopImage || images[0] || '/images/projects/parsu-desktop.svg'
  const category = Array.isArray(project.category) ? project.category[0] : project.category
  const tech = (project.stack || [])
    .map((label) => techStack.find((item) =>
      item.label.toLowerCase() === label.toLowerCase() || item.short.toLowerCase() === label.toLowerCase()
    ))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <Link
      className={`project-card project-card-modern grain-card group relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-[28px] border border-border-default bg-surface-1 p-4 text-text-primary no-underline shadow-[var(--shadow-card)] transition-[transform,border-color,background] duration-[350ms] ease-[cubic-bezier(.2,0,0,1)] hover:-translate-y-1 hover:border-[var(--accent-border)] hover:shadow-[0_18px_48px_-24px_rgba(53,102,239,0.28)] max-[760px]:rounded-[22px] max-[640px]:gap-3 max-[640px]:p-3${!stacked ? ' will-change-[transform,opacity]' : ''}${stacked ? ' project-card-stacked' : ''}`}
      style={{ '--project-accent': 'var(--accent)' }}
      to={`/projects/${project.slug}`}
      data-project-title={project.title}
      data-scroll-reveal={!stacked || undefined}
      data-stack-card={stacked ? '' : undefined}
    >
      <div className="project-card-topbar relative z-[1] flex min-h-8 items-center justify-between gap-2">
        <div className="project-card-pills relative z-[1] flex flex-wrap items-center gap-2">
          <span className="project-badge-index inline-flex min-h-7 items-center rounded-full border border-border-subtle bg-base-bg px-[11px] font-mono text-[10px] font-medium leading-none tracking-[0.04em] text-accent-soft uppercase">{project.index || String(index + 1).padStart(2, '0')}</span>
          {category && <span className="project-badge-cat inline-flex min-h-7 items-center rounded-full border border-border-subtle bg-base-bg px-[11px] font-mono text-[10px] font-medium leading-none tracking-[0.04em] text-text-tertiary uppercase">{category}</span>}
        </div>
        <div className="project-card-topright relative z-[1] flex items-center gap-2">
          <span className="project-year-pill inline-flex min-h-7 items-center rounded-full border border-border-subtle bg-base-bg px-[11px] font-mono text-[10px] font-medium leading-none tracking-[0.04em] text-text-tertiary uppercase">{project.year}</span>
          <span className="project-open-pill grid size-[34px] shrink-0 place-items-center rounded-full border border-border-default text-text-secondary transition-[background,color,transform] duration-200 group-hover:rotate-45 group-hover:bg-accent group-hover:text-white" aria-hidden="true"><ArrowUpRight size={17} /></span>
        </div>
      </div>

      <div className="project-preview-frame relative z-[1] aspect-[1.62] w-full overflow-hidden rounded-[18px] border border-border-subtle bg-base-bg max-[640px]:aspect-[1.35] max-[640px]:rounded-[15px]">
        <img className="block size-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(.2,0,0,1)] group-hover:scale-[1.025]" src={image} alt={`${project.title} interface preview`} loading="lazy" />
        <span className="project-preview-label absolute top-3 right-3 rounded-full border border-white/20 bg-[#101010]/[0.66] px-[9px] py-1.5 font-mono text-[9px] font-medium leading-none text-white/85 backdrop-blur-[10px]">{project.slug}.dev</span>
      </div>

      <div className="project-card-info relative z-[1] flex min-h-[150px] flex-1 flex-col justify-between gap-5 px-[3px] pt-0.5 pb-1 max-[640px]:min-h-0 max-[640px]:gap-[17px]">
        <div className="project-card-heading">
          <h3 className="project-title-text m-0 mb-[7px] font-[var(--font-bold)] text-[clamp(22px,2.5vw,30px)] leading-[1.04] tracking-[-0.045em] font-bold">{project.title}</h3>
          <p className="project-desc-text m-0 line-clamp-2 overflow-hidden text-sm leading-[1.55] text-text-secondary">{project.oneLiner}</p>
        </div>
        <div className="project-card-bottom relative z-[1] flex items-center justify-between gap-[14px] max-[640px]:items-start max-[640px]:flex-col">
          <div className="project-tech-pills flex flex-wrap gap-1.5">
            {tech.map((item) => <span key={item.id} className="tech-pill-chip rounded-full border border-border-subtle px-[9px] py-1.5 font-mono text-[9px] font-medium leading-none text-text-tertiary">{item.short || item.label}</span>)}
          </div>
          <span className="project-explore-link inline-flex shrink-0 items-center gap-[7px] text-xs font-medium text-text-secondary max-[640px]:self-end">View case study <span className="explore-arr text-accent-soft transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span></span>
        </div>
      </div>
    </Link>
  )
}
