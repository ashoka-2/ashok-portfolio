import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { techStack } from '../../utils/tech.js'
import TechMark from '../tech/TechMark.jsx'

export default function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('portfolio-loaded'))
  const [percent, setPercent] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (!visible || !ref.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const done = () => {
      sessionStorage.setItem('portfolio-loaded', 'yes')
      setVisible(false)
      window.dispatchEvent(new Event('portfolio:ready'))
    }
    if (reduce) { done(); return }

    const counterObj = { val: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: done })
      
      tl.to(counterObj, {
        val: 100,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => setPercent(Math.floor(counterObj.val)),
      })
      .fromTo('.loader-orbit', { rotation: -90, scale: 0.8, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0)
      .fromTo('.loader-tech', { y: 16, opacity: 0, scale: 0.7 }, { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'back.out(1.5)' }, 0.15)
      .to('.loader-progress i', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to('.loader-counter-text', { y: -16, opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.05')
      .to(ref.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '-=0.08')
    }, ref)

    return () => ctx.revert()
  }, [visible])

  if (!visible) return null

  return (
    <div ref={ref} className="preloader" aria-label="Loading portfolio" role="status">
      <div className="loader-orbit">
        <span className="loader-monogram">A<span>.</span></span>
        <i className="orbit-dot" />
        <i className="orbit-dot second" />
      </div>
      <div className="loader-counter-wrap">
        <span className="loader-counter-text">{String(percent).padStart(2, '0')}<span>%</span></span>
      </div>
      <div className="loader-tech-row">
        {techStack.slice(0, 6).map((tech) => (
          <span className="loader-tech" key={tech.id} title={tech.label}>
            <TechMark tech={tech} />
            <span className="sr-only">{tech.label}</span>
          </span>
        ))}
      </div>
      <div className="loader-caption">
        <span>ASHOK KUMAR</span>
        <b>CREATIVE TECHNOLOGIST · AI SYSTEMS</b>
      </div>
      <div className="loader-progress">
        <i />
      </div>
    </div>
  )
}
