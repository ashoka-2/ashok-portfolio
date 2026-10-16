import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const revealSelectors = [
  '.intro-strip', '.section-heading', '.about-preview > *', '.contact-band',
  '.physics-field', '.physics-note', '.project-card:not(.project-card-stacked)',
  '.listing-title', '.filter-row', '.detail-heading', '.detail-cover',
  '.detail-layout > *', '.detail-mobile-shot', '.tech-detail-top',
  '.tech-detail-panel', '.tech-related', '.info-title', '.info-columns > *',
  '.about-tech', '.contact-email', '.not-found .button',
].join(',')

export default function PageMotion({ children }) {
  const root = useRef(null)
  const location = useLocation()

  useGSAP((_, contextSafe) => {
    const startMotion = contextSafe(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.fromTo(root.current, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: 0.55, clearProps: 'transform,visibility,opacity',
      })

      const openingText = root.current.querySelectorAll('[data-reveal]')
      if (openingText.length) {
        intro.fromTo(openingText, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.09,
          ease: 'power3.out', clearProps: 'transform,visibility,opacity',
        }, '-=0.32')
      }

      const revealItems = gsap.utils.toArray(revealSelectors, root.current)
      if (revealItems.length) {
        ScrollTrigger.batch(revealItems, {
          start: 'top 88%', once: true, batchMax: 5, interval: 0.12,
          onEnter: (batch) => gsap.fromTo(batch,
            { autoAlpha: 0, y: 32, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.78, stagger: 0.1,
              ease: 'power3.out', clearProps: 'transform,visibility,opacity' }),
        })
      }

      // Gentle depth on long-form project art, tied directly to scroll position.
      root.current.querySelectorAll('[data-parallax]').forEach((element) => {
        gsap.to(element, {
          yPercent: 7, ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        })
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    if (sessionStorage.getItem('portfolio-loaded')) startMotion()
    else window.addEventListener('portfolio:ready', startMotion, { once: true })
    return () => window.removeEventListener('portfolio:ready', startMotion)
  }, { scope: root, dependencies: [location.pathname], revertOnUpdate: true })

  return <div className="motion-page" ref={root}>{children}</div>
}
