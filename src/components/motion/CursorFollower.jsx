import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function CursorFollower() {
  const root = useRef(null)
  useGSAP((_, contextSafe) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const ring = root.current.querySelector('.cursor-ring')
    const dot = root.current.querySelector('.cursor-dot')
    const label = root.current.querySelector('.cursor-label')
    const quick = (element, property, duration) => gsap.quickTo(element, property, { duration, ease: 'power3.out' })
    const ringX = quick(ring, 'x', 0.18)
    const ringY = quick(ring, 'y', 0.18)
    const dotX = quick(dot, 'x', 0.07)
    const dotY = quick(dot, 'y', 0.07)
    let active = null

    const move = contextSafe((event) => {
      ringX(event.clientX - window.innerWidth / 2)
      ringY(event.clientY - window.innerHeight / 2)
      dotX(event.clientX - window.innerWidth / 2)
      dotY(event.clientY - window.innerHeight / 2)
      gsap.to([ring, dot], { autoAlpha: 1, duration: 0.18, overwrite: true })
    })
    const enter = contextSafe((event) => {
      const target = event.target.closest?.('a, button, [data-cursor]')
      if (!target || target === active) return
      active = target
      root.current.classList.add('is-active')
      label.textContent = target.dataset.cursor || (target.matches('.project-card') ? 'VIEW' : 'OPEN')
      gsap.to(ring, { scale: 1.55, duration: 0.24, ease: 'power3.out' })
      gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
    })
    const leave = contextSafe((event) => {
      const target = event.target.closest?.('a, button, [data-cursor]')
      const next = event.relatedTarget?.closest?.('a, button, [data-cursor]')
      if (!target || target !== active || next === active) return
      active = null
      root.current.classList.remove('is-active')
      gsap.to(ring, { scale: 1, duration: 0.22, ease: 'power2.out' })
      gsap.to(label, { autoAlpha: 0, scale: 0.8, duration: 0.14, ease: 'power1.in' })
    })
    const exit = contextSafe(() => gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2, overwrite: true }))
    document.documentElement.classList.add('custom-pointer')
    gsap.set([ring, dot], { autoAlpha: 0 })
    gsap.set(label, { autoAlpha: 0, scale: 0.8 })
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerover', enter)
    document.addEventListener('pointerout', leave)
    document.documentElement.addEventListener('pointerleave', exit)
    return () => {
      document.documentElement.classList.remove('custom-pointer')
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', enter)
      document.removeEventListener('pointerout', leave)
      document.documentElement.removeEventListener('pointerleave', exit)
    }
  }, { scope: root })

  return (
    <div
      className="custom-cursor fixed top-0 left-0 pointer-events-none z-[99999] max-[768px]:hidden"
      ref={root}
      aria-hidden="true"
    >
      <span className="cursor-ring absolute top-0 left-0 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-[1.5px] border-accent-pink pointer-events-none transition-[width,height,background-color,border-color] duration-[250ms] ease-out">
        <b className="cursor-label font-mono text-[9px] font-bold tracking-[0.06em] text-white uppercase opacity-0">VIEW</b>
      </span>
      <i className="cursor-dot absolute top-0 left-0 w-1.5 h-1.5 bg-accent-amber rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}
