import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Sparkles, Terminal, Cpu, Zap } from 'lucide-react'

export default function Marquee() {
  const trackRef = useRef(null)
  const currentSpeed = useRef(1)
  const targetSpeed = useRef(1)

  useEffect(() => {
    let animId
    let pos = 0
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      // Scale speed with scroll velocity
      targetSpeed.current = Math.min(6, 1 + delta * 0.12)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const animate = () => {
      // Lerp current speed back to baseline 1
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.08
      targetSpeed.current += (1 - targetSpeed.current) * 0.04

      pos -= 1.4 * currentSpeed.current
      if (trackRef.current) {
        const halfWidth = trackRef.current.scrollWidth / 2
        if (pos <= -halfWidth) {
          pos = 0
        }
        trackRef.current.style.transform = `translateX(${pos}px)`
      }
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animId)
    }
  }, [])

  const phrases = [
    { text: "LET'S MAKE IT MAKE SENSE", icon: <Sparkles size={20} className="text-amber-300" /> },
    { text: "GOOD LOOKS INCLUDED", icon: <Zap size={20} className="text-white" /> },
    { text: "ALLERGIC TO GENERIC", icon: <Terminal size={20} className="text-pink-200" /> },
    { text: "AUTONOMOUS BY DESIGN", icon: <Cpu size={20} className="text-violet-200" /> },
    { text: "REASONABLY OBSESSED WITH DETAILS", icon: <Sparkles size={20} className="text-amber-300" /> },
  ]

  return (
    <div className="marquee-strip-outer" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        {/* Render repeated sets for smooth infinite scroll */}
        {[...phrases, ...phrases, ...phrases, ...phrases].map((item, idx) => (
          <div key={idx} className="marquee-text-item">
            <span>{item.text}</span>
            <span className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/15">
              {item.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
