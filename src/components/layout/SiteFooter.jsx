import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { profile } from '../../utils/profile.js'
import { footerContent } from '../../utils/pageContent.js'
import Button from '../buttons/Button.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function SiteFooter() {
  const [copied, setCopied] = useState(false)
  const root = useRef(null)
  const name = useRef(null)
  const gooHover = (active) => {
    if (!name.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const letters = [...name.current.querySelectorAll('.ref-name-char')].filter((letter) => getComputedStyle(letter).display !== 'none')
    const blur = name.current.querySelector('#refGooBlur')
    gsap.killTweensOf(letters)
    if (blur) gsap.killTweensOf(blur)
    if (!active) {
      gsap.to(letters, { x: 0, y: 0, scaleX: 1, duration: 0.42, ease: 'elastic.out(1,.55)', stagger: { each: 0.012, from: 'center' }, overwrite: true })
      if (blur) gsap.to(blur, { attr: { stdDeviation: 5 }, duration: 0.42, ease: 'power2.out', overwrite: true })
      return
    }
    const groups = [name.current.querySelector('.ref-name-desktop'), name.current.querySelector('.ref-name-mobile')]
      .filter((group) => group && getComputedStyle(group).display !== 'none')
    groups.forEach((group) => {
      const chars = [...group.querySelectorAll('.ref-name-char')]
      const middle = (chars.length - 1) / 2
      const pull = Math.max(3, Math.min(10, parseFloat(getComputedStyle(group).fontSize) * 0.045))
      gsap.to(chars, {
        x: (index) => (middle - index) * pull,
        y: (index) => index % 2 ? -4 : 3,
        scaleX: 1.08,
        duration: 0.22,
        ease: 'power2.in',
        stagger: { each: 0.012, from: 'center' },
        overwrite: true,
      })
    })
    if (blur) gsap.to(blur, { attr: { stdDeviation: 11 }, duration: 0.22, ease: 'power2.inOut', overwrite: true })
  }
  useGSAP(() => {
    const letters = name.current?.querySelectorAll('.ref-name-char')
    if (!letters?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(letters, { yPercent: 125, scale: 0.65, rotation: () => gsap.utils.random(-16, 16) }, { yPercent: 0, scale: 1, rotation: 0, duration: 1.15, ease: 'back.out(1.35)', stagger: { each: 0.055, from: 'center' }, scrollTrigger: { trigger: name.current, start: 'top 88%', once: true } })
  }, { scope: root })

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.contact.email) } catch {
      const field = document.createElement('textarea')
      field.value = profile.contact.email; field.style.position = 'fixed'; field.style.opacity = '0'
      document.body.appendChild(field); field.select(); document.execCommand('copy'); field.remove()
    }
    setCopied(true); window.setTimeout(() => setCopied(false), 1800)
  }

  return <footer className="ref-contact" id="contact" ref={root}>
    <div className="ref-wrap" id="contactIn">
      <span className="ref-eyebrow">{footerContent.eyebrow}</span>
      <h2>{footerContent.heading[0]} <em>{footerContent.heading[1]}</em><br />{footerContent.heading[2]}</h2>
      <a className="ref-contact-email" href={`mailto:${profile.contact.email}`}><Mail size={19} />{profile.contact.email}</a>
      <div className="ref-contact-actions">
        <Button kind="primary" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy email'}</Button>
        <Button kind="secondary" href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></Button>
        <Button kind="secondary" href="https://parsuai.vercel.app" target="_blank" rel="noreferrer">Parsu AI <ArrowUpRight size={15} /></Button>
      </div>
      <div className="ref-name-goo" ref={name} aria-label="Ashok Kumar" role="img" onPointerEnter={() => gooHover(true)} onPointerLeave={() => gooHover(false)}>
        <svg className="ref-goo-filter" aria-hidden="true"><defs><filter id="ref-goo-name"><feGaussianBlur id="refGooBlur" in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs></svg>
        <div className="ref-big-name" style={{ filter: 'url(#ref-goo-name)' }}>
          <span className="ref-name-desktop" aria-hidden="true">{[...'ASHOK KUMAR'].map((letter, index) => letter === ' ' ? <span className="ref-name-space" key={`space-${index}`} /> : <span className="ref-name-char" key={`${letter}-${index}`}>{letter}</span>)}</span>
          <span className="ref-name-mobile" aria-hidden="true">{[...'ASHOK'].map((letter, index) => <span className="ref-name-char" key={`${letter}-${index}`}>{letter}</span>)}</span>
        </div>
      </div>
      <div className="ref-foot-meta"><span>{footerContent.note}</span><span>{footerContent.location} · {footerContent.year} {profile.name}</span></div>
    </div>
  </footer>
}
