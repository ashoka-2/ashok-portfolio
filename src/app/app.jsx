import { useEffect, useRef } from 'react'
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
import RouteCurtain from '../components/layout/RouteCurtain.jsx'
import CursorFollower from '../components/motion/CursorFollower.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function App() {
  const location = useLocation()
  const lenisRef = useRef(null)
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  // Initialize Lenis smooth scrolling connected to GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.1,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Scroll restoration on navigation
  useEffect(() => {
    let frame = 0
    let attempts = 0
    let cancelled = false
    const scrollAfterRouteMounts = () => {
      if (cancelled) return
      const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : ''
      const target = id ? document.getElementById(id) : null

      // Routes are lazy-loaded. Wait briefly for the destination DOM before
      // trying a hash link, otherwise cross-page section links silently miss.
      if (id && !target && attempts++ < 45) {
        frame = requestAnimationFrame(scrollAfterRouteMounts)
        return
      }

      if (target) {
        if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -24, duration: 0.9 })
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (!id) {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }

      frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(scrollAfterRouteMounts) })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [location.pathname, location.hash, location.key])

  // Theme application
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('ak-theme', theme)
    } catch {
      // Storage fallback
    }
  }, [theme, dispatch])

  return (
    <div className="app-shell min-h-screen w-full relative">
      {/* Film Grain SVG Overlay */}
      <svg className="grain-overlay" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Interactive Cursor Follower */}
      <CursorFollower />

      {/* 4-Column Split Curtain Route Transition */}
      <RouteCurtain />

      {/* Preloader on first visit */}
      <Preloader />

      {/* Top Navbar */}
      <SiteHeader />

      {/* Main Pages */}
      <main id="main-content">
        <AppRoutes />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
