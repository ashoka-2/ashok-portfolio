import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function CursorFollower() {
  const root = useRef(null)

  useGSAP((_, contextSafe) => {
    // Only activate for devices with a fine pointer (mouse/trackpad), regardless of reduced-motion
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const container = root.current
    if (!container) return

    const leadWrap = container.querySelector('.cursor-lead-wrap')
    const midWrap = container.querySelector('.cursor-mid-wrap')
    const trailWrap = container.querySelector('.cursor-trail-wrap')
    const labelWrap = container.querySelector('.cursor-label-wrap')
    const trailBlob = container.querySelector('.cursor-trail-blob')
    const labelText = container.querySelector('.cursor-label-text')

    if (!leadWrap || !midWrap || !trailWrap || !labelWrap) return

    // Center translation wrappers at (0, 0)
    gsap.set([leadWrap, midWrap, trailWrap, labelWrap], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    gsap.set(container, { autoAlpha: 0 })
    gsap.set(labelText, { autoAlpha: 0, scale: 0.8 })

    // Translation quickTos - these ONLY mutate x and y on wrappers (never scale/rotation)
    const leadX = gsap.quickTo(leadWrap, 'x', { duration: 0.03, ease: 'power3.out' })
    const leadY = gsap.quickTo(leadWrap, 'y', { duration: 0.03, ease: 'power3.out' })
    const midX = gsap.quickTo(midWrap, 'x', { duration: 0.12, ease: 'power2.out' })
    const midY = gsap.quickTo(midWrap, 'y', { duration: 0.12, ease: 'power2.out' })
    const trailX = gsap.quickTo(trailWrap, 'x', { duration: 0.22, ease: 'power2.out' })
    const trailY = gsap.quickTo(trailWrap, 'y', { duration: 0.22, ease: 'power2.out' })
    const labelX = gsap.quickTo(labelWrap, 'x', { duration: 0.22, ease: 'power2.out' })
    const labelY = gsap.quickTo(labelWrap, 'y', { duration: 0.22, ease: 'power2.out' })

    let active = null
    let lastX = window.innerWidth / 2
    let lastY = window.innerHeight / 2
    let relaxTween = null
    let isVisible = false

    const move = contextSafe((event) => {
      const { clientX, clientY } = event

      leadX(clientX)
      leadY(clientY)
      midX(clientX)
      midY(clientY)
      trailX(clientX)
      trailY(clientY)
      labelX(clientX)
      labelY(clientY)

      if (!isVisible) {
        isVisible = true
        gsap.to(container, { autoAlpha: 1, duration: 0.15, overwrite: 'auto' })
      }

      const dx = clientX - lastX
      const dy = clientY - lastY
      const speed = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      lastX = clientX
      lastY = clientY

      // Organic fluid stretch on the trailing blob along direction of motion
      if (!active && speed > 2 && trailBlob) {
        const stretch = Math.min(1 + speed * 0.012, 1.45)
        const squash = Math.max(1 - speed * 0.006, 0.75)
        gsap.to(trailBlob, {
          scaleX: stretch,
          scaleY: squash,
          rotation: angle,
          duration: 0.1,
          ease: 'power1.out',
          overwrite: 'auto',
        })
        if (relaxTween) relaxTween.kill()
        relaxTween = gsap.to(trailBlob, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.22,
          delay: 0.04,
          ease: 'power2.out',
        })
      }
    })

    const enter = contextSafe((event) => {
      const target = event.target.closest?.('a, button, [data-cursor], .project-card, .tech-project-card')
      if (!target || target === active) return
      active = target
      container.classList.add('is-active')
      labelText.textContent = target.dataset.cursor || (target.matches('.project-card, .tech-project-card, [data-story-panel]') ? 'VIEW' : 'OPEN')

      if (trailBlob) {
        gsap.to(trailBlob, {
          scale: 2.2,
          scaleX: 2.2,
          scaleY: 2.2,
          rotation: 0,
          duration: 0.28,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      gsap.to(labelText, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    })

    const leave = contextSafe((event) => {
      const target = event.target.closest?.('a, button, [data-cursor], .project-card, .tech-project-card')
      const next = event.relatedTarget?.closest?.('a, button, [data-cursor], .project-card, .tech-project-card')
      if (!target || target !== active || next === active) return
      active = null
      container.classList.remove('is-active')

      if (trailBlob) {
        gsap.to(trailBlob, {
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      gsap.to(labelText, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.14,
        ease: 'power1.in',
      })
    })

    const onDocLeave = contextSafe(() => {
      isVisible = false
      gsap.to(container, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' })
    })

    const onDocEnter = contextSafe(() => {
      isVisible = true
      gsap.to(container, { autoAlpha: 1, duration: 0.15, overwrite: 'auto' })
    })

    document.documentElement.classList.add('custom-pointer')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', enter, { passive: true })
    document.addEventListener('pointerout', leave, { passive: true })
    document.documentElement.addEventListener('pointerleave', onDocLeave)
    document.documentElement.addEventListener('pointerenter', onDocEnter)

    return () => {
      document.documentElement.classList.remove('custom-pointer')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', enter)
      document.removeEventListener('pointerout', leave)
      document.documentElement.removeEventListener('pointerleave', onDocLeave)
      document.documentElement.removeEventListener('pointerenter', onDocEnter)
    }
  }, { scope: root })

  return (
    <>
      {/* Hidden SVG Gooey Filter definition */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="cursor-goo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Cursor Follower Component */}
      <div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[99999] max-[768px]:hidden"
        ref={root}
        aria-hidden="true"
      >
        {/* Gooey Liquid Metaball Layer (filtered through #cursor-goo) */}
        <div
          className="cursor-goo-layer absolute top-0 left-0 pointer-events-none"
          style={{ filter: 'url(#cursor-goo)' }}
        >
          {/* Lagging Viscous Fluid Body Wrapper */}
          <div className="cursor-trail-wrap absolute top-0 left-0 pointer-events-none">
            <span className="cursor-trail-blob block w-9 h-9 rounded-full bg-accent-pink shadow-[0_0_18px_rgba(255,45,120,0.7)]" />
          </div>

          {/* Intermediate Bridge Droplet Wrapper */}
          <div className="cursor-mid-wrap absolute top-0 left-0 pointer-events-none">
            <span className="block w-5 h-5 rounded-full bg-accent-pink/90" />
          </div>

          {/* Rapid Front Lead Droplet Wrapper */}
          <div className="cursor-lead-wrap absolute top-0 left-0 pointer-events-none">
            <span className="block w-4 h-4 rounded-full bg-accent-pink shadow-[0_0_10px_rgba(255,45,120,0.9)]" />
          </div>
        </div>

        {/* Sharp High-Precision Center Pointer Nucleus (Unfiltered for pixel accuracy) */}
        <div className="cursor-lead-wrap absolute top-0 left-0 pointer-events-none">
          <span className="block w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
        </div>

        {/* Crisp Text Label Overlay (Unfiltered so typography stays 100% sharp) */}
        <div className="cursor-label-wrap absolute top-0 left-0 pointer-events-none">
          <span className="cursor-label-text block font-mono text-[9px] font-bold tracking-[0.08em] text-white uppercase select-none">
            VIEW
          </span>
        </div>
      </div>
    </>
  )
}
