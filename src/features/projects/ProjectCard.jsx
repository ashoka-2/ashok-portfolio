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
      className={`project-card project-card-modern grain-card${stacked ? ' project-card-stacked' : ''}`}
      style={{ '--project-accent': 'var(--accent)' }}
      to={`/projects/${project.slug}`}
      data-project-title={project.title}
      data-scroll-reveal={!stacked || undefined}
      data-stack-card={stacked ? '' : undefined}
    >
      <div className="project-card-topbar">
        <div className="project-card-pills">
          <span className="project-badge-index">{project.index || String(index + 1).padStart(2, '0')}</span>
          {category && <span className="project-badge-cat">{category}</span>}
        </div>
        <div className="project-card-topright">
          <span className="project-year-pill">{project.year}</span>
          <span className="project-open-pill" aria-hidden="true"><ArrowUpRight size={17} /></span>
        </div>
      </div>

      <div className="project-preview-frame">
        <img src={image} alt={`${project.title} interface preview`} loading="lazy" />
        <span className="project-preview-label">{project.slug}.dev</span>
      </div>

      <div className="project-card-info">
        <div className="project-card-heading">
          <h3 className="project-title-text">{project.title}</h3>
          <p className="project-desc-text">{project.oneLiner}</p>
        </div>
        <div className="project-card-bottom">
          <div className="project-tech-pills">
            {tech.map((item) => <span key={item.id} className="tech-pill-chip">{item.short || item.label}</span>)}
          </div>
          <span className="project-explore-link">View case study <span className="explore-arr">↗</span></span>
        </div>
      </div>
    </Link>
  )
}
