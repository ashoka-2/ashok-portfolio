import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import TechLamp from '../tech/TechLamp.jsx'
import { techStack } from '../../utils/tech.js'

const ambientIds = ['react', 'javascript', 'tailwindcss', 'vite', 'redux', 'gsap', 'gemini', 'flutter', 'nextjs', 'github', 'docker', 'kubernetes', 'vercel', 'render', 'railway', 'netlify']
const anchors = '.hero, .work-section, .physics-section, .about-preview, .contact-band, .listing-page, .project-detail, .tech-detail, .info-page'

function randomForRoute(route) {
  let seed = [...route].reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 17)
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

export default function AmbientLamps({ route }) {
  const layer = useRef(null)
  const [lamps, setLamps] = useState([])

  useLayoutEffect(() => {
    const place = () => {
      const random = randomForRoute(route)
      const sections = [...document.querySelectorAll(anchors)]
      const viewportWidth = window.innerWidth
      const scrollY = window.scrollY
      const slots = []
      sections.forEach((section, sectionIndex) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top + scrollY
        if (section.classList.contains('hero')) {
          slots.push({ top: sectionTop + rect.height * 0.15, side: 'right' })
          slots.push({ top: sectionTop + rect.height * 0.82, side: 'left' })
        } else {
          slots.push({ top: sectionTop + rect.height * (0.28 + random() * 0.35), side: sectionIndex % 2 === 0 ? 'left' : 'right' })
        }
      })
      const chosen = slots.slice(0, Math.min(slots.length, 12)).map((slot, index) => ({
        ...slot,
        tech: techStack.find((item) => item.id === ambientIds[(Math.floor(random() * ambientIds.length) + index * 3) % ambientIds.length]),
        size: 112 + random() * 22,
        drift: random() * 8 + 7,
      })).map((item) => ({ ...item, left: item.side === 'left' ? -10 : viewportWidth - item.size + 10 })).filter((item) => item.tech)
      setLamps(chosen)
      if (layer.current) layer.current.style.height = `${document.documentElement.scrollHeight}px`
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(document.documentElement)
    window.addEventListener('resize', place)
    return () => { observer.disconnect(); window.removeEventListener('resize', place) }
  }, [route])

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    gsap.utils.toArray('[data-ambient-lamp]', layer.current).forEach((lamp, index) => {
      gsap.to(lamp, { y: index % 2 ? -20 : 20, rotation: index % 2 ? -3 : 3, duration: 3.2 + (index % 4) * 0.45, delay: index * 0.12, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    })
  }, { scope: layer, dependencies: [lamps], revertOnUpdate: true })

  return <div className="ambient-lamps" ref={layer} aria-hidden="true">
    {lamps.map(({ tech, top, left, size }, index) => <span className="ambient-lamp" data-ambient-lamp key={`${route}-${index}-${tech.id}`} style={{ '--ambient-size': `${size}px`, top: `${top}px`, left: `${left}px` }}><TechLamp tech={tech} compact decorative /></span>)}
  </div>
}
