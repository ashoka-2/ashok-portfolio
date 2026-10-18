import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('portfolio-loaded'))
  const [percent, setPercent] = useState(0)
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

    const counter = { val: 0 }
    const columns = columnsRef.current?.children ? Array.from(columnsRef.current.children) : []
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })

      // Counter animation 0 to 100
      tl.to(counter, {
        val: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => setPercent(Math.floor(counter.val)),
      })

      // Stagger name letters
      tl.fromTo(
        '.loader-char',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'back.out(2)' },
        0.15
      )

      // Progress bar fill
      tl.to('.loader-bar-fill', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)

      // Animate glyph/mascot mark
      tl.to('.loader-mascot', { rotation: 360, duration: 1.4, ease: 'power1.inOut' }, 0)

      // Fade out counter and text
      tl.to(
        ['.loader-center', '.loader-bar-wrap', '.loader-meta'],
        { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' },
        '+=0.1'
      )

      // 4-column curtain splitting upwards
      if (columns.length > 0) {
        tl.to(columns, {
          scaleY: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'expo.inOut',
          transformOrigin: 'top center',
        }, '-=0.1')
      } else {
        tl.to(rootRef.current, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [visible])

  if (!visible) return null

  const nameLetters = 'ASHOK KUMAR'.split('')

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] pointer-events-auto flex flex-col justify-between p-8 sm:p-14 overflow-hidden select-none"
      style={{ background: '#0B0B12' }}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* 4-column split curtain backdrop */}
      <div ref={columnsRef} className="absolute inset-0 flex w-full h-full z-0 pointer-events-none">
        <div className="flex-1 h-full bg-[#0B0B12] border-r border-white/5" />
        <div className="flex-1 h-full bg-[#13121F] border-r border-white/5" />
        <div className="flex-1 h-full bg-[#1B1A2C] border-r border-white/5" />
        <div className="flex-1 h-full bg-[#0B0B12]" />
      </div>

      {/* Top bar info */}
      <div className="relative z-10 flex items-center justify-between text-white/50 font-mono text-xs uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)] animate-ping" />
          <span>INITIALIZING WORKSPACE</span>
        </div>
        <span>KERALA, IN · 2026</span>
      </div>

      {/* Center display: huge counter + letter stacking */}
      <div className="loader-center relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {/* Animated mascot / glitch pixel emblem */}
        <div className="loader-mascot w-12 h-12 mb-6 rounded-2xl border border-[var(--accent-pink)]/40 bg-[#2B1B6B]/40 flex items-center justify-center shadow-[0_0_25px_rgba(255,72,164,0.35)]">
          <span className="font-mono text-lg font-bold text-[var(--accent-pink)]">AK</span>
        </div>

        {/* Huge Counter 0-100 */}
        <div className="font-display font-black text-white text-[ clamp(4.5rem,15vw,11rem) ] tracking-tighter leading-none mb-3">
          {String(percent).padStart(2, '0')}<span className="text-[var(--accent-pink)] text-[0.45em]">%</span>
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
          <span>LOADING EXPERIENCE</span>
        </div>
      </div>
    </div>
  )
}
