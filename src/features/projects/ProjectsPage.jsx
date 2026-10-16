import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import ProjectCard from './ProjectCard.jsx'
import { projects } from '../../utils/projects.js'

export default function ProjectsPage() {
  const categories = ['All', ...new Set(projects.flatMap((project) => project.category || []).map((category) => category.split(' / ')[0]))]
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? projects : projects.filter((project) => project.category?.some((category) => category.startsWith(filter)))
  return <div className="listing-page section-wrap">
    <span className="section-kicker">A FEW THINGS I’VE PUT INTO THE WORLD</span>
    <div className="listing-title"><h1>Selected<br /><em>work & play.</em></h1><p>Products, experiments and systems—built with care, a little curiosity, and the right tools for the job.</p></div>
    <div className="filter-row" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}<span>{shown.length.toString().padStart(2, '0')} PROJECTS <ArrowUpRight size={13} /></span></div>
    <div className="project-grid all-projects">{shown.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
  </div>
}
