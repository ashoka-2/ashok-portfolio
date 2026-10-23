import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// All candidate card selectors across all pages (Home, Projects, Tech, About, Contact, etc.)
const cardSelectors = [
  '.grain-card:not(.project-card-stacked)',
  '.project-card:not(.project-card-stacked)',
  '.project-card-modern:not(.project-card-stacked)',
  '.ref-cap-card',
  '.ref-panel',
  '.ref-roadmap',
  '.ref-qa',
  '.ref-step',
  '.tech-hero-card',
  '.tech-practice-card',
  '.tech-project-card',
  '.tech-tool-card',
  '.about-portrait-card',
  '.contact-portrait-card',
  '.contact-details-card',
  '.project-gallery-tile',
  '.physics-field',
  '[data-card]',
].join(',')

// Text headings & UI elements (animated subtly with fade up)
const textRevealSelectors = [
  '.intro-strip',
  '.ref-section-heading',
  '.section-heading',
  '.listing-title',
  '.filter-row',
  '.detail-heading',
  '.info-title',
  '.about-tech',
].join(',')

/**
 * Calculates entrance vectors based on a card's physical layout placement in the viewport:
 * - Left side of layout: slides in from the left (x: -80px)
 * - Right side of layout: slides in from the right (x: +80px)
 * - Center / middle or full-width: slides in from bottom (y: +70px)
 */
function getCardDirection(el) {
  const rect = el.getBoundingClientRect()
  const winWidth = window.innerWidth

  // Full-width card or narrow mobile layout -> slide in from bottom
  if (rect.width >= winWidth * 0.72 || winWidth < 680) {
    return { x: 0, y: 70, dir: 'center' }
  }

  const cardCenterX = rect.left + rect.width / 2
  const winCenterX = winWidth / 2
  const threshold = Math.max(45, winWidth * 0.08)

  if (cardCenterX < winCenterX - threshold) {
    // Left-side card -> slide in from left
    return { x: -80, y: 0, dir: 'left' }
  } else if (cardCenterX > winCenterX + threshold) {
    // Right-side card -> slide in from right
    return { x: 80, y: 0, dir: 'right' }
  } else {
    // Middle / center card -> slide in from bottom
    return { x: 0, y: 70, dir: 'center' }
  }
}

export default function PageMotion({ children }) {
  const root = useRef(null)
  const location = useLocation()

  useGSAP((_, contextSafe) => {
    const startMotion = contextSafe(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Two animation frames to guarantee lazy-loaded route DOM has committed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!root.current) return

          // 1. Text & Headings reveal
          const textElements = gsap.utils.toArray(textRevealSelectors, root.current)
          if (textElements.length) {
            ScrollTrigger.batch(textElements, {
              start: 'top 92%',
              once: true,
              batchMax: 4,
              interval: 0.1,
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { autoAlpha: 0, y: 28 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    stagger: 0.08,
                    ease: 'power3.out',
                    clearProps: 'transform,visibility,opacity',
                  }
                ),
            })
          }

          // 2. Directional Card Entrance Animations with Butter-Smooth Blur
          const allCardElements = Array.from(root.current.querySelectorAll(cardSelectors))

          // Filter out nested cards so only top-level cards animate their shells
          const topLevelCards = allCardElements.filter((card) => {
            if (card.closest('.project-story-shell')) return false
            let parent = card.parentElement
            while (parent && parent !== root.current) {
              if (allCardElements.includes(parent)) return false
              parent = parent.parentElement
            }
            return true
          })

          if (topLevelCards.length) {
            const viewportHeight = window.innerHeight
            const initialCards = []
            const scrollCards = []

            topLevelCards.forEach((card) => {
              const rect = card.getBoundingClientRect()
              if (rect.top < viewportHeight * 0.85) {
                initialCards.push(card)
              } else {
                scrollCards.push(card)
              }
            })

            // Animate initial cards currently visible with a smooth stagger
            initialCards.forEach((card, idx) => {
              const { x, y } = getCardDirection(card)
              gsap.fromTo(
                card,
                {
                  autoAlpha: 0,
                  x,
                  y,
                  filter: 'blur(16px)',
                  scale: 0.965,
                  willChange: 'transform, opacity, filter',
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  filter: 'blur(0px)',
                  scale: 1,
                  duration: 1.15,
                  delay: 0.08 + idx * 0.07,
                  ease: 'power3.out',
                  clearProps: 'transform,visibility,opacity,filter,willChange',
                }
              )
            })

            // Animate below-the-fold cards on scroll in coordinated batches
            if (scrollCards.length) {
              scrollCards.forEach((card) => {
                const { x, y } = getCardDirection(card)
                gsap.set(card, {
                  autoAlpha: 0,
                  x,
                  y,
                  filter: 'blur(16px)',
                  scale: 0.965,
                  willChange: 'transform, opacity, filter',
                })
              })

              ScrollTrigger.batch(scrollCards, {
                start: 'top 88%',
                once: true,
                batchMax: 4,
                interval: 0.08,
                onEnter: (batch) => {
                  batch.forEach((card, idx) => {
                    gsap.to(card, {
                      autoAlpha: 1,
                      x: 0,
                      y: 0,
                      filter: 'blur(0px)',
                      scale: 1,
                      duration: 1.2,
                      delay: idx * 0.08,
                      ease: 'power3.out',
                      clearProps: 'transform,visibility,opacity,filter,willChange',
                    })
                  })
                },
              })
            }
          }

          // 3. Gentle depth parallax on project art
          root.current.querySelectorAll('[data-parallax]').forEach((element) => {
            gsap.to(element, {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            })
          })

          ScrollTrigger.refresh()
        })
      })
    })

    if (sessionStorage.getItem('portfolio-loaded')) startMotion()
    else window.addEventListener('portfolio:ready', startMotion, { once: true })
    return () => window.removeEventListener('portfolio:ready', startMotion)
  }, { scope: root, dependencies: [location.pathname], revertOnUpdate: true })

  return <div className="motion-page" ref={root}>{children}</div>
}
