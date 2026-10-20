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
      <section className="project-visual-story relative my-[clamp(4rem,9vw,9rem)] mx-[min(-4.5vw,-18px)] mb-24 max-[760px]:my-16 max-[760px]:-mx-[18px]" ref={sectionRef} aria-label={`${project.title} featured image`}>
      <div className="project-visual-stage relative grid w-full h-[100svh] place-items-center overflow-hidden isolate bg-[radial-gradient(ellipse_at_50%_52%,color-mix(in_srgb,var(--accent)_14%,var(--base-bg)),transparent_54%)] bg-base-bg before:content-[''] before:absolute before:z-0 before:left-1/2 before:top-1/2 before:w-[min(76vw,900px)] before:aspect-square before:rounded-full before:border before:border-[color-mix(in_srgb,var(--text-primary)_9%,transparent)] before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-[18deg] before:pointer-events-none after:content-[''] after:absolute after:z-0 after:left-1/2 after:top-1/2 after:w-[min(59vw,690px)] after:aspect-square after:rounded-full after:border after:border-[color-mix(in_srgb,var(--accent)_18%,transparent)] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-[24deg] after:pointer-events-none" ref={stageRef}>
        <button
          type="button"
          className="project-visual-frame grain-media relative z-[1] block w-screen h-[100svh] p-0 overflow-hidden border border-border-default bg-surface-1 cursor-zoom-in origin-center isolate will-change-[transform,filter,border-radius] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          ref={frameRef}
          onClick={(event) => openImage(0, event.currentTarget)}
          aria-label={`Open ${images[0].title || project.title} image`}
        >
          <img ref={imageRef} className="block w-full h-full object-contain bg-surface-1 will-change-transform" src={images[0].url} alt={images[0].title || `${project.title} project preview`} fetchPriority="high" />
          <span className="project-visual-overlay absolute z-[5] inset-[clamp(20px,4vw,58px)] max-[760px]:inset-[18px] flex flex-col justify-between text-white text-left pointer-events-none [text-shadow:0_2px_24px_rgba(0,0,0,0.62)]">
            <span className="project-visual-project self-start px-[13px] py-[10px] border border-white/25 rounded-full bg-[#0a0a0c]/30 backdrop-blur-md font-mono text-[9px] leading-[1.2] tracking-[0.14em] uppercase">{project.index} / {project.title}</span>
            <span className="project-visual-caption self-end max-w-[24ch] max-[760px]:max-w-[18ch] font-display font-medium text-[clamp(21px,3vw,42px)] max-[760px]:text-[clamp(22px,7vw,32px)] leading-[1.04] tracking-[-0.025em] text-right">{images[0].title || 'A closer look at the interface'}</span>
          </span>
        </button>
        <div className="project-visual-scroll-cue absolute z-[3] right-[clamp(18px,4vw,56px)] bottom-[clamp(18px,4vh,42px)] max-[760px]:right-[18px] max-[760px]:bottom-[18px] flex items-center gap-3 text-text-tertiary font-mono text-[9px] max-[760px]:text-[8px] leading-[1.2] tracking-[0.13em]" aria-hidden="true"><span>SCROLL TO REVEAL</span><i className="relative block w-12 h-px overflow-hidden bg-border-default after:content-[''] after:absolute after:inset-0 after:bg-accent-pink after:-translate-x-full after:animate-[project-cue-line_1.8s_ease-in-out_infinite]" /></div>
      </div>
      </section>

      {images.length > 1 && (
        <div className="mx-auto max-w-[1380px] px-[max(4.5vw,18px)] pt-[clamp(24px,5vw,64px)]">
          <div className="flex items-center justify-between gap-4 mb-[22px]">
            <span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">MORE SCREENS</span>
            <span className="font-mono text-[10px] font-medium leading-[1.3] tracking-[0.12em] text-text-tertiary">{String(images.length - 1).padStart(2, '0')} VIEWS</span>
          </div>
          <div className="grid grid-cols-2 items-start gap-[clamp(14px,2vw,28px)] max-[760px]:grid-cols-1">
            {images.slice(1).map((image, offset) => {
              const index = offset + 1
              const isPortrait = image.aspect === 'mobile'
              return (
                <button
                  type="button"
                  className="project-gallery-tile grain-card group relative flex min-w-0 cursor-zoom-in flex-col gap-0 overflow-hidden rounded-3xl border border-border-default bg-surface-1 p-0 text-left text-text-primary"
                  key={image.url}
                  onClick={(event) => openImage(index, event.currentTarget)}
                  aria-label={`Open ${image.title || `${project.title} image ${index + 1}`}`}
                >
                  <span className={`group grid min-h-[210px] max-h-[60svh] w-full place-items-center overflow-hidden bg-surface-2 max-[760px]:min-h-[170px] max-[760px]:max-h-[52svh]${isPortrait ? ' min-h-[300px] max-[760px]:min-h-[260px]' : ''}`}>
                    <img className={`block h-auto max-h-[60svh] w-full max-w-full object-contain transition-transform duration-[650ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.025] max-[760px]:max-h-[52svh]${isPortrait ? ' !h-[min(60svh,700px)] !w-auto max-[760px]:!h-[min(52svh,580px)]' : ''}`} src={image.url} alt={image.title || `${project.title} project view`} loading="lazy" />
                  </span>
                  <span className="flex flex-col gap-1.5 border-t border-border-subtle px-[19px] pt-[17px] pb-5">
                    <strong className="font-display text-sm leading-[1.35] font-semibold">{image.title || `View ${String(index + 1).padStart(2, '0')}`}</strong>
                    {image.caption && <small className="font-mono text-[11px] leading-[1.5] text-text-tertiary">{image.caption}</small>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeImage && (
        <div className="project-lightbox fixed inset-0 z-[100100] flex flex-col items-center justify-center p-[clamp(54px,8vh,82px)_74px_104px] max-[760px]:p-[74px_16px_112px] bg-[#08090c]/95 backdrop-blur-[18px] overscroll-contain" ref={lightboxRef} role="dialog" aria-modal="true" aria-label={`${project.title} image viewer`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox() }}>
          <button type="button" className="project-lightbox-close absolute z-[2] top-[22px] right-6 grid place-items-center w-[46px] h-[46px] border border-white/20 rounded-full text-white bg-white/[0.08] backdrop-blur-md text-2xl leading-none transition-[background,transform] duration-200 hover:bg-accent hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4" onClick={closeLightbox} aria-label="Close image viewer">×</button>
          <button type="button" className="project-lightbox-arrow is-prev absolute z-[2] top-1/2 -translate-y-1/2 left-5 max-[760px]:top-auto max-[760px]:bottom-[22px] max-[760px]:left-4 grid place-items-center w-[46px] h-[46px] max-[760px]:w-[38px] max-[760px]:h-[38px] border border-white/20 rounded-full text-white bg-white/[0.08] backdrop-blur-md text-2xl leading-none transition-[background,transform] duration-200 hover:bg-accent hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4" onClick={() => { setActiveIndex((activeIndex - 1 + images.length) % images.length); setZoomed(false) }} aria-label="Previous image">←</button>
          <div className={`project-lightbox-stage grid place-items-center w-full h-full min-h-0 overflow-auto${zoomed ? ' is-zoomed' : ''}`}>
            <img
              key={activeImage.url}
              ref={lightboxImageRef}
              src={activeImage.url}
              alt={activeImage.title || `${project.title} project view`}
              onClick={() => setZoomed((value) => !value)}
              className={`block max-w-[min(92vw,1500px)] max-[760px]:max-w-[calc(100vw-32px)] max-h-[calc(100svh-200px)] max-[760px]:max-h-[calc(100svh-210px)] w-auto h-auto object-contain rounded-lg shadow-[0_24px_100px_rgba(0,0,0,0.45)] ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${activeImage.aspect === 'mobile' ? 'max-w-[min(92vw,700px)]' : ''}`}
            />
          </div>
          <button type="button" className="project-lightbox-arrow is-next absolute z-[2] top-1/2 -translate-y-1/2 right-5 max-[760px]:top-auto max-[760px]:bottom-[22px] max-[760px]:right-4 grid place-items-center w-[46px] h-[46px] max-[760px]:w-[38px] max-[760px]:h-[38px] border border-white/20 rounded-full text-white bg-white/[0.08] backdrop-blur-md text-2xl leading-none transition-[background,transform] duration-200 hover:bg-accent hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4" onClick={() => { setActiveIndex((activeIndex + 1) % images.length); setZoomed(false) }} aria-label="Next image">→</button>
          <div className="project-lightbox-footer absolute left-[clamp(20px,4vw,60px)] right-[clamp(20px,4vw,60px)] bottom-[23px] max-[760px]:left-16 max-[760px]:right-16 max-[760px]:bottom-[27px] flex items-end justify-between max-[760px]:justify-center max-[760px]:text-center gap-5 text-white">
            <div className="flex flex-col gap-[5px] min-w-0"><strong className="font-display text-sm leading-[1.4] font-semibold">{activeImage.title || project.title}</strong>{activeImage.caption && <span className="max-w-[70ch] text-white/65 font-mono text-[10px] leading-[1.45] max-[760px]:hidden">{activeImage.caption}</span>}</div>
            <button type="button" className="shrink-0 px-[13px] py-[10px] border border-white/25 rounded-full text-white bg-transparent font-mono text-[9px] leading-none tracking-[0.1em] font-medium max-[760px]:hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4" onClick={() => setZoomed((value) => !value)}>{zoomed ? 'FIT TO SCREEN' : 'ZOOM IMAGE'}</button>
          </div>
          {images.length > 1 && <div className="project-lightbox-thumbs absolute top-[22px] max-[760px]:top-[18px] left-1/2 -translate-x-1/2 flex gap-[7px] max-w-[min(60vw,600px)] max-[760px]:max-w-[68vw] p-[5px] overflow-auto" aria-label="Choose an image">
            {images.map((image, index) => <button type="button" key={image.url} className={`shrink-0 w-[50px] h-[38px] p-0 overflow-hidden border border-white/20 rounded-[7px] bg-[#222] transition-opacity ${index === activeIndex ? 'border-accent opacity-100 shadow-[0_0_0_1px_var(--accent)]' : 'opacity-60'} focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4`} onClick={() => { setActiveIndex(index); setZoomed(false) }} aria-label={`Show image ${index + 1}`}><img className="w-full h-full object-cover" src={image.url} alt="" /></button>)}
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
      <div className="mx-auto w-full max-w-[1360px] px-page-gutter py-32 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-accent-pink mb-2 block">
          404 — CASE STUDY NOT FOUND
        </span>
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] font-bold font-display font-bold text-text-primary mb-6">
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
    <article className="mx-auto w-full max-w-[1360px] px-page-gutter py-28 relative project-case-study" ref={pageRef} data-page-content>
      {/* Back button */}
      <div className="mb-10">
        <Button
          to="/#work"
          kind="secondary"
          data-project-back={project.slug}
          className="!min-h-[38px] !h-[38px] !px-4 !text-xs font-mono !gap-2"
        >
          <ArrowLeft size={14} />
          <span>BACK TO SELECTED WORKS</span>
        </Button>
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
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] font-bold font-display font-extrabold text-text-primary tracking-tight">
          {titleChars.map((char, i) => (
            <span key={i} className="project-title-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>

      {/* One-liner Tagline */}
      <p className="text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.6] text-text-secondary max-w-3xl mb-12 leading-relaxed">
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
            <Button
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              kind="secondary"
              className="!min-h-[38px] !h-[38px] !px-4 !text-xs font-mono !gap-2"
            >
              <GithubIcon size={14} />
              <span>SOURCE CODE</span>
              <ArrowUpRight size={13} />
            </Button>
          )}
          {project.links?.live && (
            <Button
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              kind="primary"
              className="!min-h-[38px] !h-[38px] !px-4 !text-xs font-mono !gap-2"
            >
              <span>LIVE SITE</span>
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* Overview & Key Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-5">
          <span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">01 — THE ARCHITECTURE</span>
          <h2 className="text-[clamp(1.85rem,4vw,3.8rem)] leading-[1.05] tracking-[-0.025em] font-bold mb-4 font-display font-bold">
            Built with intent.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {project.overview}
          </p>
        </div>

        <div className="lg:col-span-7">
          <span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">02 — VERIFIED CAPABILITIES</span>
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
