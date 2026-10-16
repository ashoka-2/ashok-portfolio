import { ArrowLeft, ArrowUpRight, GitBranch } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'
import TechLamp from '../../components/tech/TechLamp.jsx'
import Button from '../../components/buttons/Button.jsx'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <div className="info-page section-wrap"><span className="section-kicker">PROJECT NOT FOUND</span><h1>That one’s<br /><em>still a sketch.</em></h1><Button to="/projects" kind="secondary">Back to projects</Button></div>
  const stack = (project.stack || []).map((label) => techStack.find((item) => item.label.toLowerCase() === label.toLowerCase() || item.short.toLowerCase() === label.toLowerCase())).filter(Boolean)
  return <article className="project-detail section-wrap">
    <Link className="back-link" to="/projects"><ArrowLeft size={15} /> All projects</Link>
    <span className="section-kicker">{project.index} / {project.category?.join(' · ')}</span>
    <div className="detail-heading"><h1>{project.title}<span className="title-period">.</span></h1><p>{project.oneLiner}</p></div>
    <div className="detail-cover"><img data-parallax src={project.desktopImage || project.images?.[0]?.url} alt={`${project.title} interface`} /><span>{project.year} · {project.status}</span></div>
    <div className="detail-layout"><div><span className="section-kicker">THE IDEA</span><p className="detail-overview">{project.overview}</p><div className="detail-actions">{project.links?.github && <a href={project.links.github} target="_blank" rel="noreferrer"><GitBranch size={16} /> Source code <ArrowUpRight size={13} /></a>}{project.links?.live && <a href={project.links.live} target="_blank" rel="noreferrer">Visit the project <ArrowUpRight size={13} /></a>}</div></div><aside><span className="section-kicker">MY ROLE</span><p>{project.role}</p><span className="section-kicker">BUILT WITH</span><div className="detail-tech">{stack.map((tech) => <TechLamp key={tech.id} tech={tech} />)}{!stack.length && (project.stack || []).map((name) => <span className="plain-tech" key={name}>{name}</span>)}</div><span className="section-kicker">A FEW PIECES</span><ul>{(project.features || []).slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}</ul></aside></div>
    {project.images?.[1] && <div className="detail-mobile-shot"><img src={project.images[1].url} alt={project.images[1].title || `${project.title} mobile view`} /><p>{project.images[1].caption}</p></div>}
  </article>
}
