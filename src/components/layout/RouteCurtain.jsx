import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { startProjectFlight } from '../../utils/projectFlight.js'

export default function RouteCurtain() {
  const root = useRef(null)
  const panels = useRef(null)
  const title = useRef(null)
  const pending = useRef(false)
  const transitionType = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { contextSafe } = useGSAP({ scope: root })

  const coverRoute = contextSafe((to, label, state) => {
    pending.current = true
    transitionType.current = 'curtain'
    if (title.current) title.current.textContent = label || 'ASHOK KUMAR'
    const pieces = panels.current?.children
    if (!pieces?.length) {
      pending.current = false
      navigate(to, state ? { state } : undefined)
      window.dispatchEvent(new Event('portfolio:route-transition-end'))
      return
    }

    gsap.set(pieces, { scaleY: 0, transformOrigin: 'bottom center' })
    const timeline = gsap.timeline({
      onComplete: () => navigate(to, state ? { state } : undefined),
    })

    timeline.to(pieces, {
      scaleY: 1,
      duration: 0.7,
      stagger: 0.06,
      ease: 'expo.inOut',
    })
    timeline.fromTo(title.current, 
      { autoAlpha: 0, y: 16 }, 
      { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 
      '-=0.35'
    )
  })

  useEffect(() => {
    const handleClick = contextSafe((event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest?.('a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      const next = `${destination.pathname}${destination.search}${destination.hash}`
      const current = `${location.pathname}${location.search}${location.hash}`
      if (next === current || (destination.pathname === location.pathname && destination.search === location.search)) return

      event.preventDefault()
      if (pending.current) return
      window.dispatchEvent(new Event('portfolio:route-transition-start'))

      const backSlug = anchor.dataset.projectBack
      const backState = backSlug ? { restoreProjectScroll: true, projectSlug: backSlug } : undefined

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate(next, backState ? { state: backState } : undefined)
        window.dispatchEvent(new Event('portfolio:route-transition-end'))
        return
      }

      // Back navigation with flight
      if (backSlug) {
        const source = document.querySelector('.detail-hero-slot') || document.querySelector('.detail-cover')
        if (startProjectFlight(backSlug, source)) {
          pending.current = true
          transitionType.current = 'flight'
          const pageContent = document.querySelector('[data-page-content], .motion-page, main')
          gsap.to(pageContent, {
            autoAlpha: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => navigate(next, { state: backState }),
          })
          return
        }
      }

      // Forward project click with flight
      const projectSlug = anchor.dataset.projectLink
      const projectTitle = anchor.querySelector('.card-title, .next-title, .project-meta h3, .project-next-content h2')?.textContent.trim()
      if (projectSlug && startProjectFlight(projectSlug, anchor)) {
        sessionStorage.setItem('portfolio-project-scroll', String(window.scrollY))
        pending.current = true
        transitionType.current = 'flight'
        const pageContent = document.querySelector('[data-page-content], .motion-page, main')
        gsap.to(pageContent, {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => navigate(next),
        })
        return
      }

      const label = projectTitle || anchor.textContent.trim().replace(/\s+/g, ' ')
      coverRoute(next, label, backState)
    })

    document.addEventListener('click', handleClick, true)
    const finish = () => {
      pending.current = false
      transitionType.current = null
    }
    window.addEventListener('portfolio:route-transition-end', finish)
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('portfolio:route-transition-end', finish)
    }
  }, [contextSafe, coverRoute, location.hash, location.pathname, location.search, navigate])

  useEffect(() => {
    if (!pending.current || transitionType.current !== 'curtain' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pieces = panels.current?.children
    if (!pieces?.length) {
      pending.current = false
      return
    }

    gsap.set(pieces, { transformOrigin: 'top center' })
    gsap.to(title.current, { autoAlpha: 0, y: -12, duration: 0.22, ease: 'power2.in' })
    gsap.to(pieces, {
      scaleY: 0,
      duration: 0.6,
      delay: 0.08,
      stagger: { each: 0.045, from: 'end' },
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(title.current, { autoAlpha: 0 })
        window.dispatchEvent(new Event('portfolio:route-transition-end'))
      },
    })
  }, [location.key])

  return (
    <div className="route-curtain" ref={root} aria-hidden="true">
      <div className="route-curtain-panels" ref={panels}>
        <i /><i /><i /><i />
      </div>
      <span className="route-curtain-title" ref={title}>ASHOK KUMAR</span>
    </div>
  )
}
