import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

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
        // The home route does not own a stable project-image landing slot, so
        // send this direction through the curtain instead of leaving a ghost
        // image detached over the returned page.
        coverRoute(next, 'SELECTED WORKS', backState)
        return
      }

      // Keep transition typography focused on the destination title, never the
      // card's description, metadata, or full combined text content.
      const projectTitle = anchor.dataset.projectTitle
        || anchor.querySelector('.project-title-text, .card-title, .next-title, h1, h2, h3')?.textContent.trim()
        || anchor.getAttribute('aria-label')
      const label = projectTitle || 'ASHOK KUMAR'
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
    if (!pending.current) return

    // Flight transitions fade the old route before navigating. Clear their
    // lock as soon as the destination route commits, or all later links become
    // no-ops until a full reload.
    if (transitionType.current === 'flight') {
      // Recover the route content and shell before the destination paints.
      // The main element is included to clean up stale hidden state from older
      // transitions that accidentally selected it as the outgoing page.
      gsap.set(['#main-content', '.motion-page', '.motion-page [data-page-content]'], {
        autoAlpha: 1,
        clearProps: 'opacity,visibility',
      })
      pending.current = false
      transitionType.current = null
      window.dispatchEvent(new Event('portfolio:route-transition-end'))
      return
    }

    if (transitionType.current !== 'curtain' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
