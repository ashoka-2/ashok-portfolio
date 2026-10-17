import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getLenis } from '../layout/SmoothScroll.jsx'

const items = [
  'CREATIVE TECHNOLOGIST',
  'AUTONOMOUS AGENTS',
  'FULL STACK SYSTEMS',
  'MICRO-INTERACTIONS',
  'GENERATIVE AI',
  'COMPUTER VISION',
]

export default function Marquee() {
  const root = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = root.current?.querySelector('.marquee-track')
    if (!track) return

    // Base continuous marquee scroll loop
    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      repeat: -1,
      ease: 'none',
    })

    let currentScale = { val: 1 }
    const applyVelocity = (vel) => {
      // Scale speed smoothly based on scroll speed (up to 4.5x)
      const absVel = Math.abs(vel)
      const targetScale = Math.min(1 + absVel * 0.18, 5)
      
      gsap.to(currentScale, {
        val: targetScale,
        duration: 0.22,
        ease: 'power1.out',
        overwrite: 'auto',
        onUpdate: () => {
          loop.timeScale(currentScale.val)
        },
        onComplete: () => {
          gsap.to(currentScale, {
            val: 1,
            duration: 1.0,
            ease: 'power2.out',
            onUpdate: () => {
              loop.timeScale(currentScale.val)
            }
          })
        }
      })
    }

    const lenis = getLenis()
    if (lenis) {
      lenis.on('scroll', (e) => {
        applyVelocity(e.velocity || 0)
      })
    } else {
      let lastY = window.scrollY
      let lastTime = performance.now()
      const onScroll = () => {
        const now = performance.now()
        const dt = Math.max(now - lastTime, 16)
        const dy = window.scrollY - lastY
        const vel = (dy / dt) * 10
        lastY = window.scrollY
        lastTime = now
        applyVelocity(vel)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
  }, { scope: root })

  const renderGroup = (key) => (
    <div className="marquee-group" key={key}>
      {items.map((item, idx) => (
        <span className="marquee-item" key={`${item}-${idx}`}>
          <span className="marquee-text">{item}</span>
          <span className="marquee-separator" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="infinite-marquee" ref={root} aria-hidden="true">
      <div className="marquee-track">
        {renderGroup('grp-1')}
        {renderGroup('grp-2')}
      </div>
    </div>
  )
}

