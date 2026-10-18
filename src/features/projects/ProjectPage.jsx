import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'
import GithubIcon from '../../components/icons/GithubIcon.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../../utils/projects.js'
import { landProjectFlight, clearProjectFlight } from '../../utils/projectFlight.js'
import Button from '../../components/buttons/Button.jsx'

export default function ProjectPage() {
  const { slug } = useParams()
  const pageRef = useRef(null)
  const heroSlotRef = useRef(null)

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[currentIndex]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  // Flight landing integration
  useEffect(() => {
    if (!heroSlotRef.current || !slug) return

    const landed = landProjectFlight(slug, heroSlotRef.current)
    if (!landed) {
      // Direct navigation without ghost flight
      gsap.to(heroSlotRef.current, { autoAlpha: 1, duration: 0.4 })
    }

    return () => {
      clearProjectFlight()
    }
  }, [slug])

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
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-pink)] mb-2 block">
          404 — CASE STUDY NOT FOUND
        </span>
        <h1 className="text-fluid-h1 font-display font-bold text-[var(--text-primary)] mb-6">
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
    <article className="page-container py-28 relative" ref={pageRef} data-page-content>
      {/* Back button */}
      <div className="mb-10">
        <Link
          to="/#work"
          data-project-back={project.slug}
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO SELECTED WORKS</span>
        </Link>
      </div>

      {/* Header index & Category */}
      <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
        <span className="text-[var(--accent-pink)] font-bold">{project.index}</span>
        <span>/</span>
        <span>{Array.isArray(project.category) ? project.category.join(' · ') : project.category}</span>
        <span>/</span>
        <span>{project.year}</span>
      </div>

      {/* Split-char Title */}
      <div className="overflow-hidden mb-6">
        <h1 className="text-fluid-h1 font-display font-extrabold text-[var(--text-primary)] tracking-tight">
          {titleChars.map((char, i) => (
            <span key={i} className="project-title-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>

      {/* One-liner Tagline */}
      <p className="text-fluid-body text-[var(--text-secondary)] max-w-3xl mb-12 leading-relaxed">
        {project.oneLiner}
      </p>

      {/* Hero Slot receiving Flutter Flight Ghost */}
      <div className="relative w-full aspect-[16/9] max-h-[720px] rounded-3xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] mb-16 bg-[#13121F]">
        <img
          ref={heroSlotRef}
          data-hero-target={project.slug}
          src={project.desktopImage || project.cover?.dark}
          alt={`${project.title} Interface`}
          className="w-full h-full object-cover detail-hero-slot opacity-0"
        />
        <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md font-mono text-xs text-white/90 border border-white/10">
          {project.year} · {project.status}
        </div>
      </div>

      {/* Meta Row: Role, Stack, Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-y border-[var(--border-subtle)] font-mono text-xs mb-16">
        <div className="project-meta-item">
          <span className="text-[var(--text-tertiary)] uppercase tracking-widest block mb-2">MY ROLE</span>
          <span className="font-display text-base font-bold text-[var(--text-primary)] block">
            {project.role}
          </span>
        </div>

        <div className="project-meta-item md:col-span-2">
          <span className="text-[var(--text-tertiary)] uppercase tracking-widest block mb-2">TECH STACK</span>
          <div className="flex flex-wrap gap-2">
            {(project.stack || []).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-pink)] to-[var(--secondary-mesh-2)] text-white font-semibold hover:brightness-110 transition-all shadow-md"
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
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            {project.overview}
          </p>
        </div>

        <div className="lg:col-span-7">
          <span className="section-kicker">02 — VERIFIED CAPABILITIES</span>
          <div className="space-y-4">
            {(project.features || []).map((feat, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm"
              >
                <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-[var(--text-primary)] leading-normal">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Visuals / Gallery Mockups */}
      {project.images && project.images.length > 1 && (
        <div className="space-y-12 mb-24">
          <span className="section-kicker">03 — VISUAL BREAKDOWN</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] bg-[#13121F]"
              >
                <img src={img.url} alt={img.title || ''} className="w-full h-auto object-cover" />
                <div className="p-5 border-t border-[var(--border-subtle)]">
                  <h4 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                    {img.title}
                  </h4>
                  <p className="font-mono text-xs text-[var(--text-tertiary)]">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Next Project" Full-width banner with Hero Transition flight */}
      <div className="pt-16 border-t border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-widest block mb-4">
          UP NEXT
        </span>
        <Link
          to={`/projects/${nextProject.slug}`}
          data-project-link={nextProject.slug}
          className="group block p-8 sm:p-14 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-[var(--shadow-card)] hover:border-[var(--accent-pink)] transition-all relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-[var(--accent-amber)] font-bold block mb-1">
                {nextProject.index} / {Array.isArray(nextProject.category) ? nextProject.category[0] : nextProject.category}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-pink)] transition-colors">
                {nextProject.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                {nextProject.oneLiner}
              </p>
            </div>

            <div className="w-14 h-14 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--accent-pink)] group-hover:border-transparent group-hover:text-white transition-all shadow-md shrink-0">
              <ArrowUpRight size={26} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          {/* Hidden reference img for hero flight from next banner */}
          <img
            src={nextProject.desktopImage || nextProject.cover?.dark}
            alt=""
            className="sr-only"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
