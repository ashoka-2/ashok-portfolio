import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ExternalLink, CheckCircle2 } from 'lucide-react'
import GithubIcon from '../../components/icons/GithubIcon.jsx'
import { projects } from '../../utils/projects.js'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js'
import Button from '../../components/buttons/Button.jsx'

gsap.registerPlugin(ScrollTrigger)

function ProjectGallery({ project }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const lightboxRef = useRef(null)
  const lightboxImageRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const lastTriggerRef = useRef(null)

  const images = useMemo(() => {
    const candidates = [
      ...(project.images || []),
      project.desktopImage ? { url: project.desktopImage, title: `${project.title} desktop view`, aspect: 'desktop' } : null,
      project.mobileImage ? { url: project.mobileImage, title: `${project.title} mobile view`, aspect: 'mobile' } : null,
    ].filter(Boolean)
    const unique = new Map()
    candidates.forEach((item) => {
      const image = typeof item === 'string' ? { url: item } : item
      if (image.url && !unique.has(image.url)) unique.set(image.url, image)
    })
    return [...unique.values()]
  }, [project])

  useGSAP(() => {
    const frame = frameRef.current
    const stage = stageRef.current
    const image = imageRef.current
    if (!frame || !stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([frame, image], { clearProps: 'all' })
      return
    }

    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: stage,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.45)}`,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    reveal.fromTo(frame,
      { scale: 0.28, borderRadius: 30, filter: 'brightness(.72) saturate(.72)', boxShadow: '0 18px 60px rgba(0,0,0,.22)' },
      { scale: 1, borderRadius: 0, filter: 'brightness(1) saturate(1)', boxShadow: '0 0 0 rgba(0,0,0,0)', ease: 'none', duration: 1 },
      0,
    )
    if (image) reveal.fromTo(image, { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0)
    reveal.to('.project-visual-overlay', { autoAlpha: 0, y: -26, ease: 'none', duration: 0.7 }, 0.12)
    reveal.to('.project-visual-scroll-cue', { autoAlpha: 0, y: -18, ease: 'none', duration: 0.3 }, 0)
  }, { scope: sectionRef, dependencies: [project.slug], revertOnUpdate: true })

  useGSAP(() => {
    if (activeIndex === null || !lightboxRef.current || !lightboxImageRef.current) return
    gsap.fromTo(lightboxRef.current,
      { autoAlpha: 0, backdropFilter: 'blur(0px)' },
      { autoAlpha: 1, backdropFilter: 'blur(18px)', duration: 0.32, ease: 'power2.out' },
    )
    gsap.fromTo(lightboxImageRef.current,
      { autoAlpha: 0, y: 28, scale: 0.94, clipPath: 'inset(4% 4% 4% 4% round 14px)' },
      { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 8px)', duration: 0.56, ease: 'power3.out', delay: 0.04 },
    )
  }, { scope: lightboxRef, dependencies: [activeIndex], revertOnUpdate: true })

  useGSAP(() => {
    if (activeIndex === null || !lightboxImageRef.current) return
    gsap.to(lightboxImageRef.current, {
      scale: zoomed ? 1.55 : 1,
      duration: 0.52,
      ease: zoomed ? 'power3.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, { scope: lightboxRef, dependencies: [zoomed], revertOnUpdate: true })

  const { contextSafe } = useGSAP({ scope: lightboxRef })
  const closeLightbox = contextSafe(() => {
    const modal = lightboxRef.current
    if (!modal) {
      setActiveIndex(null)
      return
    }
    gsap.to(modal, { autoAlpha: 0, scale: 0.985, duration: 0.22, ease: 'power2.in', onComplete: () => setActiveIndex(null) })
  })

  useEffect(() => {
    if (activeIndex === null) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      requestAnimationFrame(() => lastTriggerRef.current?.focus?.())
    }
  }, [activeIndex !== null, images.length])

  if (!images.length) return null

  const openImage = (index, trigger) => {
    lastTriggerRef.current = trigger
    setZoomed(false)
    setActiveIndex(index)
  }
  const activeImage = activeIndex === null ? null : images[activeIndex]

  return (
    <>
      <section className="project-visual-story" ref={sectionRef} aria-label={`${project.title} featured image`}>
      <div className="project-visual-stage" ref={stageRef}>
        <button
          type="button"
          className="project-visual-frame grain-media"
          ref={frameRef}
          onClick={(event) => openImage(0, event.currentTarget)}
          aria-label={`Open ${images[0].title || project.title} image`}
        >
          <img ref={imageRef} src={images[0].url} alt={images[0].title || `${project.title} project preview`} fetchPriority="high" />
          <span className="project-visual-overlay">
            <span className="project-visual-project">{project.index} / {project.title}</span>
            <span className="project-visual-caption">{images[0].title || 'A closer look at the interface'}</span>
          </span>
        </button>
        <div className="project-visual-scroll-cue" aria-hidden="true"><span>SCROLL TO REVEAL</span><i /></div>
      </div>
      </section>

      {images.length > 1 && (
        <div className="project-gallery-more">
          <div className="project-gallery-heading">
            <span className="section-kicker">MORE SCREENS</span>
            <span className="project-gallery-count">{String(images.length - 1).padStart(2, '0')} VIEWS</span>
          </div>
          <div className="project-gallery-grid">
            {images.slice(1).map((image, offset) => {
              const index = offset + 1
              const isPortrait = image.aspect === 'mobile'
              return (
                <button
                  type="button"
                  className={`project-gallery-tile grain-card${isPortrait ? ' is-portrait' : ''}`}
                  key={image.url}
                  onClick={(event) => openImage(index, event.currentTarget)}
                  aria-label={`Open ${image.title || `${project.title} image ${index + 1}`}`}
                >
                  <span className="project-gallery-image-wrap">
                    <img src={image.url} alt={image.title || `${project.title} project view`} loading="lazy" />
                  </span>
                  <span className="project-gallery-caption">
                    <strong>{image.title || `View ${String(index + 1).padStart(2, '0')}`}</strong>
                    {image.caption && <small>{image.caption}</small>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeImage && (
        <div className="project-lightbox" ref={lightboxRef} role="dialog" aria-modal="true" aria-label={`${project.title} image viewer`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox() }}>
          <button type="button" className="project-lightbox-close" onClick={closeLightbox} aria-label="Close image viewer">×</button>
          <button type="button" className="project-lightbox-arrow is-prev" onClick={() => { setActiveIndex((activeIndex - 1 + images.length) % images.length); setZoomed(false) }} aria-label="Previous image">←</button>
          <div className={`project-lightbox-stage${zoomed ? ' is-zoomed' : ''}`}>
            <img
              key={activeImage.url}
              ref={lightboxImageRef}
              src={activeImage.url}
              alt={activeImage.title || `${project.title} project view`}
              onClick={() => setZoomed((value) => !value)}
              className={activeImage.aspect === 'mobile' ? 'is-portrait' : ''}
            />
          </div>
          <button type="button" className="project-lightbox-arrow is-next" onClick={() => { setActiveIndex((activeIndex + 1) % images.length); setZoomed(false) }} aria-label="Next image">→</button>
          <div className="project-lightbox-footer">
            <div><strong>{activeImage.title || project.title}</strong>{activeImage.caption && <span>{activeImage.caption}</span>}</div>
            <button type="button" onClick={() => setZoomed((value) => !value)}>{zoomed ? 'FIT TO SCREEN' : 'ZOOM IMAGE'}</button>
          </div>
          {images.length > 1 && <div className="project-lightbox-thumbs" aria-label="Choose an image">
            {images.map((image, index) => <button type="button" key={image.url} className={index === activeIndex ? 'is-active' : ''} onClick={() => { setActiveIndex(index); setZoomed(false) }} aria-label={`Show image ${index + 1}`}><img src={image.url} alt="" /></button>)}
          </div>}
        </div>
      )}
    </>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const pageRef = useRef(null)

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[currentIndex]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  // Split-char title reveal and staggered entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      '.project-title-char',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.03, ease: 'power4.out', delay: 0.25 }
    )

    gsap.fromTo(
      '.project-meta-item',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.45 }
    )
  }, { scope: pageRef, dependencies: [slug] })

  if (!project) {
    return (
      <div className="page-container py-32 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-accent-pink mb-2 block">
          404 — CASE STUDY NOT FOUND
        </span>
        <h1 className="text-fluid-h1 font-display font-bold text-text-primary mb-6">
          Project in the lab.
        </h1>
        <Button to="/projects" kind="secondary">
          <ArrowLeft size={16} />
          <span>Back to all projects</span>
        </Button>
      </div>
    )
  }

  const titleChars = project.title.split('')

  return (
    <article className="page-container py-28 relative project-case-study" ref={pageRef} data-page-content>
      {/* Back button */}
      <div className="mb-10">
        <Link
          to="/#work"
          data-project-back={project.slug}
          className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent-pink transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO SELECTED WORKS</span>
        </Link>
      </div>

      {/* Header index & Category */}
      <div className="flex items-center gap-3 font-mono text-xs text-text-tertiary uppercase tracking-wider mb-2">
        <span className="text-accent-pink font-bold">{project.index}</span>
        <span>/</span>
        <span>{Array.isArray(project.category) ? project.category.join(' · ') : project.category}</span>
        <span>/</span>
        <span>{project.year}</span>
      </div>

      {/* Split-char Title */}
      <div className="overflow-hidden mb-6">
        <h1 className="text-fluid-h1 font-display font-extrabold text-text-primary tracking-tight">
          {titleChars.map((char, i) => (
            <span key={i} className="project-title-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>

      {/* One-liner Tagline */}
      <p className="text-fluid-body text-text-secondary max-w-3xl mb-12 leading-relaxed">
        {project.oneLiner}
      </p>

      {/* Meta Row: Role, Stack, Links */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10 border-y border-border-subtle font-mono text-xs mb-16">
        <div className="project-meta-item">
          <span className="text-text-tertiary uppercase tracking-widest block mb-2">MY ROLE</span>
          <span className="font-display text-base font-bold text-text-primary block">
            {project.role}
          </span>
        </div>

        <div className="project-meta-item">
          <span className="text-text-tertiary uppercase tracking-widest block mb-2">STATUS</span>
          <span className="font-display text-base font-bold text-text-primary block">
            {project.status}
          </span>
        </div>

        <div className="project-meta-item md:col-span-2">
          <span className="text-text-tertiary uppercase tracking-widest block mb-2">TECH STACK</span>
          <div className="flex flex-wrap gap-2">
            {(project.stack || []).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-surface-2 border border-border-subtle text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="project-meta-item flex flex-col md:items-end justify-center gap-3">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border-default text-text-primary hover:border-accent-pink hover:text-accent-pink transition-colors"
            >
              <GithubIcon size={14} />
              <span>SOURCE CODE</span>
              <ArrowUpRight size={13} />
            </a>
          )}
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-pink)] to-[var(--secondary-mesh-2)] text-base-bg font-semibold hover:brightness-110 transition-all shadow-md"
            >
              <span>LIVE SITE</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Overview & Key Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-5">
          <span className="section-kicker">01 — THE ARCHITECTURE</span>
          <h2 className="text-fluid-h2 mb-4 font-display font-bold">
            Built with intent.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {project.overview}
          </p>
        </div>

        <div className="lg:col-span-7">
          <span className="section-kicker">02 — VERIFIED CAPABILITIES</span>
          <div className="space-y-4">
            {(project.features || []).map((feat, i) => (
              <div
                key={i}
                className="grain-card flex items-start gap-3.5 p-4 rounded-2xl bg-surface-1 border border-border-default shadow-sm"
              >
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-text-primary leading-normal">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screenshots follow the project information and expand as the visitor scrolls. */}
      <ProjectGallery project={project} />

      {/* Next case study */}
      <div className="pt-16 border-t border-border-subtle">
        <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest block mb-4">
          UP NEXT
        </span>
        <Link
          to={`/projects/${nextProject.slug}`}
          data-project-title={nextProject.title}
          className="grain-card group block p-8 sm:p-14 rounded-3xl bg-surface-1 border border-border-default shadow-[var(--shadow-card)] hover:border-accent-pink transition-all relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-accent-amber font-bold block mb-1">
                {nextProject.index} / {Array.isArray(nextProject.category) ? nextProject.category[0] : nextProject.category}
              </span>
              <h2 className="next-title font-display text-3xl sm:text-5xl font-extrabold text-text-primary group-hover:text-accent-pink transition-colors">
                {nextProject.title}
              </h2>
              <p className="text-sm text-text-secondary mt-2 max-w-xl">
                {nextProject.oneLiner}
              </p>
            </div>

            <div className="w-14 h-14 rounded-full border border-border-default flex items-center justify-center text-text-primary group-hover:bg-accent-pink group-hover:border-transparent group-hover:text-base-bg transition-all shadow-md shrink-0">
              <ArrowUpRight size={26} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </article>
  )
}
