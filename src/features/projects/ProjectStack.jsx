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
    <section className="project-story-shell relative" ref={shell} aria-label="Featured projects, scroll to browse">
      <div className="project-story-sticky sticky top-[12vh] max-[760px]:top-[10vh] h-[76vh] h-[76svh] max-[760px]:h-[78vh] max-[760px]:h-[78svh] max-h-[760px] min-h-[480px] max-[760px]:min-h-[520px]">
        <div className="project-story-card relative w-[min(100%,1120px)] h-full mx-auto overflow-hidden border border-border-default rounded-[28px] max-[760px]:rounded-[22px] bg-surface-1 shadow-[var(--shadow-card)] isolate">
          <div className="project-story-count absolute z-20 top-[22px] right-6 max-[760px]:top-3.5 max-[760px]:right-[15px] max-[760px]:p-[8px_10px] max-[760px]:border max-[760px]:border-white/15 max-[760px]:rounded-full max-[760px]:bg-[#121212]/70 max-[760px]:text-white max-[760px]:backdrop-blur-md text-text-tertiary font-mono text-[11px] font-medium leading-none tracking-[0.08em]" ref={countRef}>{`01 / ${String(projects.length).padStart(2, '0')}`}</div>
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
                data-project-title={project.title}
                className="project-story-panel absolute inset-0 grid grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] max-[760px]:grid-cols-1 max-[760px]:grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] overflow-hidden text-text-primary no-underline bg-surface-1 [clip-path:circle(0%_at_72%_50%)] first-of-type:[clip-path:circle(150%_at_50%_50%)] aria-[hidden=true]:pointer-events-none [&>*]:relative [&>*]:z-[1] after:content-[''] after:absolute after:z-[2] after:inset-0 after:pointer-events-none after:bg-text-primary after:[filter:url(#noiseFilter)] after:opacity-[0.075] after:mix-blend-soft-light"
                data-story-panel
                aria-label={`View ${project.title} case study`}
                aria-hidden={index !== 0}
                tabIndex={index === 0 ? 0 : -1}
                style={{ zIndex: index + 1 }}
              >
                <div className="project-story-media relative min-w-0 min-h-0 overflow-hidden bg-base-bg">
                  <img className="project-story-image block w-full h-full object-cover" src={image} alt={`${project.title} project preview`} loading="lazy" />
                  <span className="project-story-image-meta absolute left-[18px] bottom-[18px] max-[760px]:left-3 max-[760px]:bottom-3 flex items-center gap-2 p-[9px_12px] border border-white/15 rounded-full bg-[#121212]/70 text-white/90 backdrop-blur-md font-mono text-[9px] font-medium leading-none tracking-[0.06em] uppercase">{category || 'SELECTED WORK'} <i className="not-italic text-[#8aabf8]">·</i> {project.year}</span>
                </div>
                <div className="project-story-copy flex flex-col justify-between min-w-0 p-[clamp(28px,4.2vw,58px)] max-[760px]:p-[21px_22px_20px]">
                  <div className="project-story-eyebrow flex items-center gap-2.5 text-text-tertiary font-mono text-[10px] font-medium leading-[1.4] tracking-[0.09em]"><span className="grid place-items-center w-[34px] h-[34px] border border-accent-border rounded-full text-accent-soft">{project.index || String(index + 1).padStart(2, '0')}</span><span>CASE STUDY</span></div>
                  <div>
                    <h3 className="my-6 max-[760px]:my-3.5 mb-3.5 max-[760px]:mb-2 max-w-[10ch] text-text-primary font-bold font-bold text-[clamp(34px,5vw,62px)] max-[760px]:text-[clamp(30px,9vw,42px)] leading-[0.96] tracking-[-0.055em]">{project.title}</h3>
                    <p className="m-0 max-w-[36ch] text-text-secondary text-[clamp(14px,1.25vw,17px)] max-[760px]:text-[13px] leading-[1.6] max-[760px]:leading-[1.45]">{project.oneLiner}</p>
                  </div>
                  <div className="project-story-bottom flex flex-col gap-[22px] max-[760px]:gap-3">
                    <div className="project-story-tags flex flex-wrap gap-[7px]">
                      {tech.map((item) => <span key={item.id} className="p-[7px_10px] border border-border-subtle rounded-full text-text-tertiary font-mono text-[9px] font-medium leading-none">{item.short || item.label}</span>)}
                    </div>
                    <span className="project-story-link flex items-center justify-between pt-4 max-[760px]:pt-[11px] border-t border-border-subtle text-text-primary text-[13px] font-medium">Explore project <i className="grid place-items-center w-9 h-9 rounded-full bg-accent text-white not-italic"><ArrowUpRight size={17} /></i></span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div ref={track} className="project-story-track h-px pointer-events-none" style={{ height: `${Math.max(0, projects.length - 1) * 82}svh` }} aria-hidden="true" />
    </section>
  )
}
