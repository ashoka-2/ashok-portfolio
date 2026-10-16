import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { techStack } from '../../utils/tech.js'

export default function ProjectCard({ project, index = 0, stacked = false }) {
  const preview = useRef(null)
  const trailState = useRef({ x: 0, y: 0, distance: 0, index: 0 })
  const { contextSafe } = useGSAP({ scope: preview })
  const projectImages = (project.images || []).map((item) => typeof item === 'string' ? item : item.url).filter(Boolean)
  const image = project.desktopImage || projectImages[0]
  const tech = (project.stack || []).slice(0, 4).map((label) => techStack.find((item) => item.label.toLowerCase() === label.toLowerCase() || item.short.toLowerCase() === label.toLowerCase())).filter(Boolean).slice(0, 3)
  const trailImages = [...new Set([...projectImages, image].filter(Boolean))]
  const handlePointerMove = contextSafe((event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = preview.current?.getBoundingClientRect()
    if (!bounds) return
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const state = trailState.current
    state.distance += Math.hypot(x - state.x, y - state.y)
    state.x = x
    state.y = y
    if (state.distance < 68) return
    state.distance = 0
    const imageUrl = trailImages[state.index++ % Math.max(1, trailImages.length)] || image
    const thumb = document.createElement('span')
    thumb.className = 'project-trail-item'
    thumb.style.left = `${x}px`
    thumb.style.top = `${y}px`
    thumb.style.backgroundImage = `url("${imageUrl}")`
    preview.current.querySelector('.project-trail')?.appendChild(thumb)
    gsap.timeline({ onComplete: () => thumb.remove() })
      .fromTo(thumb, { xPercent: -50, yPercent: -55, scale: .72, rotation: gsap.utils.random(-11, 11), opacity: 0 }, { xPercent: -50, yPercent: -55, scale: 1, rotation: 0, opacity: 1, duration: .38, ease: 'power3.out' })
      .to(thumb, { y: '-=16', scale: .9, opacity: 0, duration: .45, delay: .4, ease: 'power2.in' })
  })
  const clearPointer = () => { trailState.current.distance = 0 }
  return <Link className={`project-card project-card-${index % 3}${stacked ? ' project-card-stacked' : ''}`} style={{ '--stack-index': index }} to={`/projects/${project.slug}`} data-scroll-reveal={!stacked || undefined} data-stack-card={stacked ? '' : undefined}>
    <div className="project-preview" ref={preview} onPointerMove={handlePointerMove} onPointerLeave={clearPointer}><img src={image || '/images/projects/parsu-desktop.svg'} alt={`${project.title} project interface`} loading="lazy" /><span className="project-trail" aria-hidden="true" /><span className="project-index">{project.index || String(index + 1).padStart(2, '0')}</span><span className="project-open"><ArrowUpRight size={19} /></span></div>
    <span className="project-orb" aria-hidden="true"><i /><i /></span>
    <div className="project-meta"><div><h3>{project.title}</h3><p>{project.oneLiner}</p></div><span className="project-year">{project.year}</span></div>
    <div className="project-tags"><span>{project.category?.[0]}</span>{tech.map((item) => <span key={item.id}>{item.short}</span>)}</div>
  </Link>
}
