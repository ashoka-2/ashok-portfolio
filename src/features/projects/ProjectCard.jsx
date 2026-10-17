import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { techStack } from '../../utils/tech.js'

export default function ProjectCard({ project, index = 0, stacked = false }) {
  const cardRef = useRef(null)
  const previewRef = useRef(null)
  const arrowBtnRef = useRef(null)
  const trailState = useRef({ x: 0, y: 0, distance: 0, index: 0 })

  const { contextSafe } = useGSAP({ scope: cardRef })

  const projectImages = (project.images || [])
    .map((item) => (typeof item === 'string' ? item : item.url))
    .filter(Boolean)
  const image = project.desktopImage || projectImages[0]
  const tech = (project.stack || [])
    .slice(0, 4)
    .map((label) =>
      techStack.find(
        (item) =>
          item.label.toLowerCase() === label.toLowerCase() ||
          item.short.toLowerCase() === label.toLowerCase()
      )
    )
    .filter(Boolean)
    .slice(0, 4)

  const trailImages = [...new Set([...projectImages, image].filter(Boolean))]

  // Shery-style interactive thumbnail trail & smooth tilt
  const handlePointerMove = contextSafe((event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cardEl = cardRef.current
    const previewEl = previewRef.current
    if (!cardEl) return

    const cardRect = cardEl.getBoundingClientRect()
    const normX = (event.clientX - cardRect.left) / cardRect.width
    const normY = (event.clientY - cardRect.top) / cardRect.height

    // 3D subtle card tilt
    const tiltX = (normY - 0.5) * -7
    const tiltY = (normX - 0.5) * 7
    gsap.to(cardEl, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1200,
    })

    // Magnetic pull on arrow button when near
    if (arrowBtnRef.current) {
      const btnRect = arrowBtnRef.current.getBoundingClientRect()
      const distToBtn = Math.hypot(
        event.clientX - (btnRect.left + btnRect.width / 2),
        event.clientY - (btnRect.top + btnRect.height / 2)
      )
      if (distToBtn < 90) {
        const pullX = (event.clientX - (btnRect.left + btnRect.width / 2)) * 0.35
        const pullY = (event.clientY - (btnRect.top + btnRect.height / 2)) * 0.35
        gsap.to(arrowBtnRef.current, { x: pullX, y: pullY, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(arrowBtnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
      }
    }

    // Image preview trail when cursor is inside preview area
    if (previewEl) {
      const pRect = previewEl.getBoundingClientRect()
      if (
        event.clientX >= pRect.left &&
        event.clientX <= pRect.right &&
        event.clientY >= pRect.top &&
        event.clientY <= pRect.bottom
      ) {
        const px = event.clientX - pRect.left
        const py = event.clientY - pRect.top
        const state = trailState.current
        state.distance += Math.hypot(px - state.x, py - state.y)
        state.x = px
        state.y = py

        if (state.distance >= 64) {
          state.distance = 0
          const imageUrl = trailImages[state.index++ % Math.max(1, trailImages.length)] || image
          const thumb = document.createElement('span')
          thumb.className = 'project-trail-item'
          thumb.style.left = `${px}px`
          thumb.style.top = `${py}px`
          thumb.style.backgroundImage = `url("${imageUrl}")`
          previewEl.querySelector('.project-trail')?.appendChild(thumb)

          gsap
            .timeline({ onComplete: () => thumb.remove() })
            .fromTo(
              thumb,
              { xPercent: -50, yPercent: -55, scale: 0.65, rotation: gsap.utils.random(-10, 10), opacity: 0 },
              { xPercent: -50, yPercent: -55, scale: 1, rotation: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
            )
            .to(thumb, { y: '-=20', scale: 0.88, opacity: 0, duration: 0.45, delay: 0.35, ease: 'power2.in' })
        }
      }
    }
  })

  const handlePointerLeave = contextSafe(() => {
    trailState.current.distance = 0
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
    if (arrowBtnRef.current) {
      gsap.to(arrowBtnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
    }
  })

  return (
    <Link
      ref={cardRef}
      className={`project-card project-card-modern${stacked ? ' project-card-stacked' : ''}`}
      style={{ '--stack-index': index }}
      to={`/projects/${project.slug}`}
      data-scroll-reveal={!stacked || undefined}
      data-stack-card={stacked ? '' : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background ambient glow */}
      <span className="project-card-glow" aria-hidden="true" />

      {/* Top Header Row */}
      <div className="project-card-topbar">
        <div className="project-card-pills">
          <span className="project-badge-index">{project.index || String(index + 1).padStart(2, '0')}</span>
          {project.category?.[0] && (
            <span className="project-badge-cat">{project.category[0]}</span>
          )}
          {project.status && (
            <span className="project-badge-status">
              <span className="status-ping" />
              {project.status.toLowerCase().includes('live') ? 'LIVE' : 'ACTIVE'}
            </span>
          )}
        </div>
        <div className="project-card-topright">
          <span className="project-year-pill">{project.year}</span>
          <span className="project-open-pill" ref={arrowBtnRef} aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>

      {/* Card Content & Showcase Grid */}
      <div className="project-card-body">
        {/* Left Information Pane */}
        <div className="project-card-info">
          <div className="project-card-heading">
            <h3 className="project-title-text">{project.title}</h3>
            <p className="project-desc-text">{project.oneLiner}</p>
          </div>

          <div className="project-card-bottom">
            <div className="project-tech-pills">
              {tech.map((item) => (
                <span key={item.id} className="tech-pill-chip">
                  <span className="tech-pill-dot" />
                  {item.short || item.label}
                </span>
              ))}
            </div>
            <span className="project-explore-link">
              Case study & architecture <span className="explore-arr">→</span>
            </span>
          </div>
        </div>

        {/* Right / Showcase Visual Preview */}
        <div className="project-preview-wrap">
          <div className="project-preview-frame" ref={previewRef}>
            <div className="frame-header-bar">
              <span className="frame-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="frame-title-bar">{project.slug}.dev</span>
            </div>
            <div className="frame-image-box">
              <img
                src={image || '/images/projects/parsu-desktop.svg'}
                alt={`${project.title} interface preview`}
                loading="lazy"
              />
              <span className="project-trail" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
