import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ProjectCard from './ProjectCard.jsx'

export default function ProjectStack({ projects }) {
  const shell = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  const [view, setView] = useState('stack')

  useGSAP(() => {
    const cards = gsap.utils.toArray('[data-stack-card]', track.current)
    if (view === 'reel') {
      const distance = () => Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: viewport.current, start: 'top 14%', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      })
      return
    }
    cards.slice(0, -1).forEach((card, index) => {
      gsap.to(card, {
        scale: 0.93,
        opacity: 0.42,
        ease: 'none',
        scrollTrigger: { trigger: cards[index + 1], start: 'top 88%', end: 'top 14%', scrub: true },
      })
    })
  }, { scope: shell, dependencies: [view, projects], revertOnUpdate: true })

  return <div className="project-stack-shell" ref={shell} data-scroll-reveal>
    <div className="project-view-switch" role="group" aria-label="Project display mode">
      <button type="button" aria-pressed={view === 'stack'} onClick={() => setView('stack')}>Stack</button>
      <button type="button" aria-pressed={view === 'reel'} onClick={() => setView('reel')}>Reel</button>
    </div>
    <div className={`project-reel-viewport${view === 'reel' ? ' is-reel' : ''}`} ref={viewport}>
      <div className={`project-stack project-stack--${view}`} ref={track}>
        {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} stacked />)}
      </div>
    </div>
  </div>
}
