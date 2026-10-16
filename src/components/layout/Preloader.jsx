import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { techStack } from '../../utils/tech.js'
import TechMark from '../tech/TechMark.jsx'

export default function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('portfolio-loaded'))
  const ref = useRef(null)
  useEffect(() => {
    if (!visible || !ref.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const done = () => { sessionStorage.setItem('portfolio-loaded', 'yes'); setVisible(false) }
    if (reduce) { done(); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: done })
      tl.fromTo('.loader-orbit', { rotation: -90, scale: .8, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: .65, ease: 'power3.out' })
        .fromTo('.loader-tech', { y: 16, opacity: 0, scale: .7 }, { y: 0, opacity: 1, scale: 1, stagger: .07, duration: .42, ease: 'back.out(1.5)' }, '-=.25')
        .to('.loader-progress i', { scaleX: 1, duration: .55, ease: 'power2.inOut' }, '-=.15')
        .to(ref.current, { yPercent: -100, duration: .72, ease: 'expo.inOut', delay: .12 })
    }, ref)
    return () => ctx.revert()
  }, [visible])
  if (!visible) return null
  return <div ref={ref} className="preloader" aria-label="Loading portfolio" role="status">
    <div className="loader-orbit"><span className="loader-monogram">A<span>.</span></span><i className="orbit-dot" /><i className="orbit-dot second" /></div>
    <div className="loader-tech-row">{techStack.slice(0, 6).map((tech) => <span className="loader-tech" key={tech.id} title={tech.label}><TechMark tech={tech} /><span className="sr-only">{tech.label}</span></span>)}</div>
    <div className="loader-caption"><span>ASHOK KUMAR</span><b>CREATIVE TECHNOLOGIST</b></div>
    <div className="loader-progress"><i /></div>
  </div>
}
