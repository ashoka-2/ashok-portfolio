import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js'

let lenisInstance = null
export const getLenis = () => lenisInstance

export default function SmoothScroll() {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.13, wheelMultiplier: 1.18, touchMultiplier: 1.05 })
    lenisInstance = lenis
    let menuOpen = false
    let transitionActive = false
    const syncLock = () => menuOpen || transitionActive ? lenis.stop() : lenis.start()
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time) => lenis.raf(time * 1000)
    const onMenu = (event) => { menuOpen = Boolean(event.detail?.open); syncLock() }
    const onTransition = () => { transitionActive = true; syncLock() }
    const onReady = () => { transitionActive = false; syncLock() }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    window.addEventListener('portfolio:menu-lock', onMenu)
    window.addEventListener('portfolio:route-transition-start', onTransition)
    window.addEventListener('portfolio:route-transition-end', onReady)
    return () => {
      window.removeEventListener('portfolio:menu-lock', onMenu)
      window.removeEventListener('portfolio:route-transition-start', onTransition)
      window.removeEventListener('portfolio:route-transition-end', onReady)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  })
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })
    document.fonts?.ready?.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])
  return null
}
