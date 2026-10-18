import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { techStack } from '../../utils/tech.js'

export default function ProjectStack({ projects }) {
  const shell = useRef(null)
  const track = useRef(null)
  const countRef = useRef(null)
  const panelsRef = useRef([])

  useGSAP(() => {
    const panels = panelsRef.current.filter(Boolean)
    const scrollTrack = track.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shell.current?.classList.add('is-static')
      panels.forEach((panel) => { panel.setAttribute('aria-hidden', 'false'); panel.tabIndex = 0 })
      return () => shell.current?.classList.remove('is-static')
    }
    if (panels.length < 2 || !scrollTrack) return

    gsap.set(panels, { autoAlpha: 0, clipPath: 'circle(0% at 72% 50%)' })
    gsap.set(panels[0], { autoAlpha: 1, clipPath: 'circle(150% at 50% 50%)' })
    gsap.set(panels.slice(1).map((panel) => panel.querySelector('.project-story-image')), { scale: 1.12 })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTrack,
        start: 'top 82%',
        end: 'bottom 82%',
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)))
          if (countRef.current) countRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`
          panels.forEach((panel, panelIndex) => {
            panel.setAttribute('aria-hidden', panelIndex === index ? 'false' : 'true')
            panel.tabIndex = panelIndex === index ? 0 : -1
          })
        },
      },
    })

    panels.slice(1).forEach((panel, offset) => {
      const index = offset + 1
      const image = panel.querySelector('.project-story-image')
      const copy = panel.querySelector('.project-story-copy')
      timeline.to(panel, { autoAlpha: 1, clipPath: 'circle(150% at 50% 50%)', duration: 0.82, ease: 'none' }, offset)
      if (image) timeline.to(image, { scale: 1, duration: 0.9, ease: 'none' }, offset)
      if (copy) timeline.fromTo(copy, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, offset + 0.35)
      timeline.set(panel, { zIndex: index + 1 }, offset)
    })

    return () => timeline.scrollTrigger?.kill()
  }, { scope: shell, dependencies: [projects], revertOnUpdate: true })

  return (
    <section className="project-story-shell" ref={shell} aria-label="Featured projects, scroll to browse">
      <div className="project-story-sticky">
        <div className="project-story-card">
          <div className="project-story-count" ref={countRef}>{`01 / ${String(projects.length).padStart(2, '0')}`}</div>
          {projects.map((project, index) => {
            const image = project.desktopImage || project.images?.[0]?.url || project.images?.[0] || '/images/projects/parsu-desktop.svg'
            const category = Array.isArray(project.category) ? project.category[0] : project.category
            const tech = (project.stack || []).map((label) => techStack.find((item) =>
              item.label.toLowerCase() === label.toLowerCase() || item.short.toLowerCase() === label.toLowerCase()
            )).filter(Boolean).slice(0, 4)
            return (
              <Link
                key={project.slug}
                ref={(node) => { panelsRef.current[index] = node }}
                to={`/projects/${project.slug}`}
                className="project-story-panel"
                data-story-panel
                aria-label={`View ${project.title} case study`}
                aria-hidden={index !== 0}
                tabIndex={index === 0 ? 0 : -1}
                style={{ zIndex: index + 1 }}
              >
                <div className="project-story-media">
                  <img className="project-story-image" src={image} alt={`${project.title} project preview`} loading="lazy" />
                  <span className="project-story-image-meta">{category || 'SELECTED WORK'} <i>·</i> {project.year}</span>
                </div>
                <div className="project-story-copy">
                  <div className="project-story-eyebrow"><span>{project.index || String(index + 1).padStart(2, '0')}</span><span>CASE STUDY</span></div>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.oneLiner}</p>
                  </div>
                  <div className="project-story-bottom">
                    <div className="project-story-tags">
                      {tech.map((item) => <span key={item.id}>{item.short || item.label}</span>)}
                    </div>
                    <span className="project-story-link">Explore project <i><ArrowUpRight size={17} /></i></span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div ref={track} className="project-story-track" style={{ height: `${Math.max(0, projects.length - 1) * 82}svh` }} aria-hidden="true" />
    </section>
  )
}
