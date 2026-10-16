import { lazy, Suspense, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AppRoutes from './app.routes.jsx'
import SiteHeader from '../components/layout/SiteHeader.jsx'
import SiteFooter from '../components/layout/SiteFooter.jsx'
import Preloader from '../components/layout/Preloader.jsx'

const AmbientLamps = lazy(() => import('../components/tech/AmbientLamps.jsx'))

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function App() {
  const root = useRef(null)
  const location = useLocation()
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.13, wheelMultiplier: 1.25, touchMultiplier: 1.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(ticker); lenis.destroy() }
  }, [])
  useGSAP(() => {
    gsap.fromTo('[data-reveal]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'all' })
    gsap.utils.toArray('[data-scroll-reveal]').forEach((el) => gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
    gsap.utils.toArray('[data-parallax]').forEach((el) => gsap.to(el, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.7 } }))
  }, { scope: root, dependencies: [location.pathname], revertOnUpdate: true })
  useEffect(() => {
    requestAnimationFrame(() => {
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      ScrollTrigger.refresh()
    })
  }, [location.pathname, location.hash])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('ak-theme', theme) } catch { /* theme still works for this session */ }
  }, [theme, dispatch])
  return <div ref={root} className="app-shell min-h-screen w-full">
    <Preloader />
    <Suspense fallback={null}><AmbientLamps key={location.pathname} route={location.pathname} /></Suspense>
    <SiteHeader />
    <main><AppRoutes /></main>
    <SiteFooter />
  </div>
}
