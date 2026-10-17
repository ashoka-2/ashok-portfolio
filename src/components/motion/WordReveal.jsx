import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

export default function WordReveal({ text }) {
  const root = useRef(null)
  const words = String(text).trim().split(/\s+/)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = root.current.querySelectorAll('.word-reveal-word')
    gsap.set(targets, { opacity: 0.2 })
    gsap.to(targets, {
      opacity: 1, stagger: 0.09, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 42%', scrub: 0.65 },
    })
    ScrollTrigger.refresh()
  }, { scope: root })
  return <p className="word-reveal" ref={root}><span className="sr-only">{text}</span>{words.map((word, index) => <span className="word-reveal-word" aria-hidden="true" key={`${word}-${index}`}>{word}</span>)}</p>
}
