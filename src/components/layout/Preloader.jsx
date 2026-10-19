import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('portfolio-loaded'))
  const [percent, setPercent] = useState(0)
  const [status, setStatus] = useState('CALIBRATING SHADERS…')
  const rootRef = useRef(null)
  const columnsRef = useRef(null)

  useEffect(() => {
    if (!visible || !rootRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finish = () => {
      sessionStorage.setItem('portfolio-loaded', 'true')
      setVisible(false)
      window.dispatchEvent(new Event('portfolio:ready'))
    }

    if (prefersReducedMotion) {
      finish()
      return
    }

    const columns = columnsRef.current?.children ? Array.from(columnsRef.current.children) : []
    const counter = { val: 0 }
    const messages = ['CALIBRATING SHADERS…', 'BREWING CAFFEINE & PIXELS…', 'GOOD LOOKS INCLUDED…']
    let messageIndex = 0
    const messageTimer = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length
      setStatus(messages[messageIndex])
    }, 680)
    let cancelled = false
    let exitTimeline
    let completionTween

    const preloadAssets = [
      '/images/portraits/portrait-hero-editorial.webp',
      '/images/portraits/portrait-about-creative.webp',
      '/images/theme/chromatic-glass-study.webp',
    ]
    const assetsReady = Promise.all(preloadAssets.map((src) => new Promise((resolve) => {
      const image = new Image()
      image.onload = resolve
      image.onerror = resolve
      image.src = src
    })))
    let maxWaitTimer
    const maxWait = new Promise((resolve) => { maxWaitTimer = window.setTimeout(resolve, 1800) })
    const ctx = gsap.context(() => {
      // Stagger name letters
      gsap.fromTo(
        '.loader-char',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'back.out(2)', delay: 0.12 }
      )
    }, rootRef)

    const progressTween = gsap.to(counter, {
      val: 88,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (cancelled) return
        setPercent(Math.floor(counter.val))
        gsap.set('.loader-bar-fill', { scaleX: counter.val / 100 })
      },
    })

    Promise.race([assetsReady, maxWait]).then(() => {
      if (cancelled) return
      progressTween.kill()
      completionTween = gsap.to(counter, {
        val: 100,
        duration: 0.38,
        ease: 'power2.out',
        onUpdate: () => {
          setPercent(Math.floor(counter.val))
          gsap.set('.loader-bar-fill', { scaleX: counter.val / 100 })
        },
        onComplete: () => {
          exitTimeline = gsap.timeline({ onComplete: finish })
          exitTimeline.to('.loader-mascot', { rotation: 360, duration: 0.45, ease: 'power1.inOut' }, 0)
            .to(['.loader-center', '.loader-bar-wrap', '.loader-meta'], { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 0.12)
          if (columns.length) {
            exitTimeline.to(columns, { scaleY: 0, duration: 0.8, stagger: 0.065, ease: 'expo.inOut', transformOrigin: 'top center' }, 0.25)
          } else {
            exitTimeline.to(rootRef.current, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 0.25)
          }
        },
      })
    })

    return () => {
      cancelled = true
      window.clearInterval(messageTimer)
      window.clearTimeout(maxWaitTimer)
      progressTween.kill()
      completionTween?.kill()
      exitTimeline?.kill()
      ctx.revert()
    }
  }, [visible])

  if (!visible) return null

  const nameLetters = 'ASHOK KUMAR'.split('')

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] pointer-events-auto flex flex-col justify-between p-8 sm:p-14 overflow-hidden select-none"
      style={{ background: 'var(--base-bg)' }}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Five-part split curtain backdrop */}
      <div ref={columnsRef} className="absolute inset-0 flex w-full h-full z-0 pointer-events-none">
        <div className="loader-curtain-panel flex-1 h-full border-r border-white/5" />
        <div className="loader-curtain-panel flex-1 h-full border-r border-white/5" />
        <div className="loader-curtain-panel flex-1 h-full border-r border-white/5" />
        <div className="loader-curtain-panel flex-1 h-full border-r border-white/5" />
        <div className="loader-curtain-panel flex-1 h-full" />
      </div>

      {/* Top bar info */}
      <div className="relative z-10 flex items-center justify-between text-white/50 font-mono text-xs uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-pink animate-ping" />
          <span>INITIALIZING WORKSPACE</span>
        </div>
          <span>KERALA, IN · {new Date().getFullYear()}</span>
      </div>

      {/* Center display: huge counter + letter stacking */}
      <div className="loader-center relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {/* Animated mascot / glitch pixel emblem */}
        <div className="loader-mascot w-12 h-12 mb-6 rounded-2xl border border-accent-pink/40 bg-surface-1 flex items-center justify-center shadow-[0_0_25px_rgba(123,97,255,0.35)]">
          <span className="font-mono text-lg font-bold text-accent-pink">AK</span>
        </div>

        {/* Huge Counter 0-100 */}
        <div className="font-display font-black text-white text-[ clamp(4.5rem,15vw,11rem) ] tracking-tighter leading-none mb-3">
          {String(percent).padStart(3, '0')}<span className="text-accent-pink text-[0.45em]">%</span>
        </div>

        {/* Name characters stacking */}
        <div className="flex items-center gap-1 sm:gap-2 font-display text-base sm:text-xl font-bold tracking-[0.25em] text-white/90">
          {nameLetters.map((char, i) => (
            <span key={i} className="loader-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar: Hot pink progress line + meta */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col gap-3">
        <div className="loader-bar-wrap w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="loader-bar-fill w-full h-full bg-gradient-to-r from-[var(--accent-pink)] via-[var(--secondary-mesh-2)] to-[var(--accent-amber)] origin-left scale-x-0"
          />
        </div>
        <div className="loader-meta flex justify-between text-xs font-mono text-white/40 uppercase tracking-widest">
          <span>CREATIVE TECHNOLOGIST</span>
          <span>{status}</span>
        </div>
      </div>
    </div>
  )
}
