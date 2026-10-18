import { ArrowLeft, ArrowUpRight, ExternalLink, Layers3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import TechLamp from '../../components/tech/TechLamp.jsx'
import { techStack } from '../../utils/tech.js'
import { projects } from '../../utils/projects.js'

function normalize(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function TechPage() {
  const { slug } = useParams()
  const tech = techStack.find((item) => item.id === slug)
  if (!tech) return <div className="tech-detail page-container"><span className="section-kicker">TOOL NOT FOUND</span><h1>Still building<br /><em>the list.</em></h1><Link className="back-link" to="/">← Back home</Link></div>

  const categoryTools = techStack.filter((item) => item.category === tech.category && item.id !== tech.id)
  const related = [...categoryTools, ...techStack.filter((item) => item.id !== tech.id && item.category !== tech.category)].slice(0, 4)
  const identifiers = [tech.id, tech.label, tech.short].map(normalize).filter(Boolean)
  const usedIn = projects.filter((project) => project.stack?.some((entry) => {
    const value = normalize(entry)
    return identifiers.some((id) => value === id || value.startsWith(id) || id.startsWith(value))
  }))
  const index = String(techStack.findIndex((item) => item.id === tech.id) + 1).padStart(2, '0')

  return <div className="tech-detail-page" style={{ '--tech-accent': tech.color }}>
    <div className="tech-detail-inner">
      <div className="tech-detail-topline">
        <Link className="tech-back-link" to="/"><ArrowLeft size={15} /> Back to the portfolio</Link>
        <span className="tech-index">TOOLKIT / {index} OF {String(techStack.length).padStart(2, '0')}</span>
      </div>

      <section className="tech-hero-card grain-card" aria-labelledby="tech-title">
        <div className="tech-hero-copy">
          <span className="tech-category"><i /> {tech.category.replace(/([A-Z])/g, ' $1')}</span>
          <h1 id="tech-title">{tech.label}<span>.</span></h1>
          <p className="tech-purpose">{tech.purpose}</p>
          <div className="tech-hero-actions">
            <Button href={tech.url} target="_blank" rel="noreferrer" kind="primary">Official docs <ExternalLink size={15} /></Button>
            <Button href="#how-i-use-it" kind="secondary">How I use it <ArrowUpRight size={15} /></Button>
          </div>
        </div>
        <div className="tech-hero-art" aria-hidden="true">
          <span className="tech-orbit tech-orbit-one" /><span className="tech-orbit tech-orbit-two" />
          <TechLamp tech={tech} decorative />
          <span className="tech-art-caption"><Layers3 size={13} /> {tech.category.toUpperCase()}</span>
        </div>
        <div className="tech-hero-footer"><span>ASHOK KUMAR · TOOLBOX NOTES</span><span>{tech.headline}</span></div>
      </section>

      <section className="tech-explanation-grid" aria-label={`${tech.label} explanation`}>
        <article className="tech-explanation-card grain-card">
          <span className="tech-card-kicker">01 / WHAT IT DOES</span>
          <h2>{tech.headline}</h2>
          <p>{tech.purpose}</p>
        </article>
        <article className="tech-explanation-card tech-practice-card grain-card" id="how-i-use-it">
          <span className="tech-card-kicker">02 / HOW I USE IT</span>
          <h2>In my workflow</h2>
          <p>{tech.practice}</p>
        </article>
      </section>

      {usedIn.length > 0 && <section className="tech-related-section">
        <div className="tech-section-heading"><div><span className="tech-card-kicker">03 / PROOF IN PRACTICE</span><h2>Projects using {tech.short}</h2></div><span>{String(usedIn.length).padStart(2, '0')} PROJECT{usedIn.length === 1 ? '' : 'S'}</span></div>
        <div className="tech-project-grid">{usedIn.map((project) => <Link className="tech-project-card grain-card" key={project.slug} to={`/projects/${project.slug}`}>
          <span className="tech-project-number">{project.index}</span><span className="tech-project-copy"><strong>{project.title}</strong><small>{project.oneLiner}</small></span><ArrowUpRight size={18} />
        </Link>)}</div>
      </section>}

      <section className="tech-related-section tech-related-tools">
        <div className="tech-section-heading"><div><span className="tech-card-kicker">0{usedIn.length ? 4 : 3} / KEEP EXPLORING</span><h2>More from the toolbox</h2></div><Link to="/#play">View the physics field <ArrowUpRight size={14} /></Link></div>
        <div className="tech-tool-grid">{related.map((item) => <Link className="tech-tool-card grain-card" key={item.id} to={`/tech/${item.id}`}>
          <TechLamp tech={item} compact decorative /><span>{item.label}</span><ArrowUpRight size={14} />
        </Link>)}</div>
      </section>
    </div>
  </div>
}
