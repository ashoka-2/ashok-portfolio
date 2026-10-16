import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import TechLamp from '../../components/tech/TechLamp.jsx'
import TechMark from '../../components/tech/TechMark.jsx'
import { techStack } from '../../utils/tech.js'
import { projects } from '../../utils/projects.js'

export default function TechPage() {
  const { slug } = useParams()
  const tech = techStack.find((item) => item.id === slug)
  if (!tech) return <div className="info-page section-wrap"><span className="section-kicker">TOOL NOT FOUND</span><h1>Still building<br /><em>the list.</em></h1><Link className="back-link" to="/">← Back home</Link></div>
  const related = techStack.filter((item) => item.category === tech.category && item.id !== tech.id).slice(0, 4)
  const usedIn = projects.filter((project) => project.stack?.some((label) => label.toLowerCase() === tech.label.toLowerCase() || label.toLowerCase() === tech.short.toLowerCase()))
  return <div className="tech-detail section-wrap">
    <Link className="back-link" to="/"><ArrowLeft size={15} /> Back to the portfolio</Link>
    <div className="tech-detail-top"><TechLamp tech={tech} /><div><span className="section-kicker">TOOLBOX / {tech.category.toUpperCase()}</span><h1>{tech.label}<span className="title-period">.</span></h1><p>{tech.purpose}</p><a href={tech.url} target="_blank" rel="noreferrer">Official docs and resources <ExternalLink size={15} /></a></div></div>
    <div className="tech-detail-panel"><span className="section-kicker">WHERE IT FITS IN MY WORK</span><h2>{tech.headline}</h2><p>{tech.practice}</p><p className="tech-detail-meta"><TechMark tech={tech} /> {tech.label} · {tech.category} <a href={tech.url} target="_blank" rel="noreferrer">Explore {tech.label} <ArrowUpRight size={13} /></a></p></div>
    {usedIn.length > 0 && <div className="tech-related"><span className="section-kicker">PROJECTS USING THIS TOOL</span><div>{usedIn.map((project) => <Link key={project.slug} to={`/projects/${project.slug}`}>{project.title} <ArrowUpRight size={13} /></Link>)}</div></div>}
    <div className="tech-related"><span className="section-kicker">ALSO IN THIS TOOLBOX</span><div className="emblem-grid">{related.map((item) => <TechLamp key={item.id} tech={item} />)}</div></div>
  </div>
}
