import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { profile } from '../../utils/profile.js'
import { footerContent } from '../../utils/pageContent.js'
import { gmailComposeUrl } from '../../utils/site.js'
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

  return <footer className="ref-contact relative overflow-hidden py-24 pb-8 bg-[linear-gradient(180deg,var(--base-bg),color-mix(in_srgb,var(--secondary-mesh-1)_42%,var(--base-bg))_70%,color-mix(in_srgb,var(--accent)_20%,var(--base-bg)))] max-[820px]:pt-[74px]" id="contact" ref={root}>
    <div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]" id="contactIn">
      <span className="ref-eyebrow font-mono text-xs uppercase tracking-[0.05em] text-text-tertiary block mb-3">{footerContent.eyebrow}</span>
      <h2 className="m-0 max-w-[14ch] font-[var(--font-bold)] text-[clamp(38px,5.2vw,68px)] leading-[0.98] tracking-[-0.045em] font-extrabold">{footerContent.heading[0]} <em className="font-display font-normal text-accent-pink">{footerContent.heading[1]}</em><br />{footerContent.heading[2]}</h2>
      <a className="ref-contact-email my-5 mb-6 inline-flex items-center gap-2.5 font-[var(--font-bold)] text-[clamp(22px,3.6vw,46px)] leading-[1.05] tracking-[-0.04em] font-extrabold [overflow-wrap:anywhere] transition-colors duration-200 hover:text-accent-pink" href={gmailComposeUrl(profile.contact.email)} target="_blank" rel="noreferrer"><Mail size={19} />{profile.contact.email}</a>
      <div className="ref-contact-actions flex flex-wrap gap-3">
        <Button kind="primary" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy email'}</Button>
        <Button kind="secondary" href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></Button>
        <Button kind="secondary" href="https://parsuai.vercel.app" target="_blank" rel="noreferrer">Parsu AI <ArrowUpRight size={15} /></Button>
      </div>
      <div className="ref-name-goo relative w-screen mt-14 ml-[calc(50%-50vw)]" ref={name} aria-label="Ashok Kumar" role="img" onPointerEnter={() => gooHover(true)} onPointerLeave={() => gooHover(false)}>
        <svg className="ref-goo-filter" aria-hidden="true"><defs><filter id="ref-goo-name"><feGaussianBlur id="refGooBlur" in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs></svg>
        <div className="ref-big-name flex w-full justify-center overflow-visible py-[0.12em] pb-[0.02em] font-[var(--font-bold)] text-[clamp(40px,11vw,210px)] leading-[0.9] tracking-[-0.065em] font-extrabold whitespace-nowrap text-text-primary touch-pan-y" style={{ filter: 'url(#ref-goo-name)' }}>
          <span className="ref-name-desktop inline-flex justify-center whitespace-nowrap max-[520px]:hidden" aria-hidden="true">{[...'ASHOK KUMAR'].map((letter, index) => letter === ' ' ? <span className="ref-name-space inline-block w-[0.34em]" key={`space-${index}`} /> : <span className="ref-name-char inline-block will-change-transform" key={`${letter}-${index}`}>{letter}</span>)}</span>
          <span className="ref-name-mobile hidden max-[520px]:inline-flex max-[520px]:text-[clamp(64px,19vw,86px)] justify-center whitespace-nowrap" aria-hidden="true">{[...'ASHOK'].map((letter, index) => <span className="ref-name-char inline-block will-change-transform" key={`${letter}-${index}`}>{letter}</span>)}</span>
        </div>
      </div>
      <div className="ref-foot-meta mt-7 flex flex-wrap justify-between gap-4 border-t border-border-subtle pt-5 text-[13px] text-text-tertiary max-[520px]:text-[11px]"><span>{footerContent.note}</span><span>{footerContent.location} · {footerContent.year} {profile.name}</span></div>
    </div>
  </footer>
}
