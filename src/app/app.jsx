import { lazy, Suspense, useEffect } from 'react'
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
  return <div className="app-shell min-h-screen w-full">
    <Preloader />
    <Suspense fallback={null}><AmbientLamps key={location.pathname} route={location.pathname} /></Suspense>
    <SiteHeader />
    <main><AppRoutes /></main>
    <SiteFooter />
  </div>
}
