import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { siteConfig } from '../../utils/site.js'
import Button from '../buttons/Button.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function SiteHeader() {
  const header = useRef(null)
  const mobileNav = useRef(null)
  const [open, setOpen] = useState(false)
  const { contextSafe } = useGSAP(() => {
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entrance.fromTo('.nav-wrap', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 })
        .fromTo('.nav-wrap .wordmark, .nav-wrap .desktop-nav a, .nav-wrap > .theme-toggle, .nav-wrap .nav-contact, .nav-wrap .menu-toggle',
          { y: -8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.055, ease: 'power2.out' }, '-=0.28')
    })
    gsap.set(mobileNav.current, { autoAlpha: 0, y: -10, pointerEvents: 'none' })
    return () => motion.revert()
  }, { scope: header })
  const animateMenu = contextSafe((show) => {
    const panel = mobileNav.current
    if (!panel) return
    const entries = [...panel.children]
    gsap.killTweensOf([panel, ...entries])
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(panel, { autoAlpha: show ? 1 : 0, y: 0, scaleY: 1, pointerEvents: show ? 'auto' : 'none', visibility: show ? 'visible' : 'hidden' })
      gsap.set(entries, { clearProps: 'all' })
      return
    }
    if (show) {
      gsap.set(panel, { visibility: 'visible', pointerEvents: 'auto' })
      gsap.fromTo(panel, { autoAlpha: 0, y: -12, scaleY: 0.97 }, { autoAlpha: 1, y: 0, scaleY: 1, duration: 0.32, ease: 'power3.out' })
      gsap.fromTo(entries, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.28, delay: 0.07, stagger: 0.045, ease: 'power2.out' })
      return
    }
    gsap.to(entries, { autoAlpha: 0, y: -5, duration: 0.14, stagger: { each: 0.02, from: 'end' }, ease: 'power1.in' })
    gsap.to(panel, { autoAlpha: 0, y: -9, scaleY: 0.98, duration: 0.23, delay: 0.06, ease: 'power2.in', onComplete: () => gsap.set(panel, { visibility: 'hidden', pointerEvents: 'none' }) })
  })
  const close = () => { setOpen(false); animateMenu(false) }
  const toggleMenu = () => { const next = !open; setOpen(next); animateMenu(next) }
  return <header className="site-header" ref={header} onKeyDown={(event) => { if (event.key === 'Escape' && open) close() }}>
    <div className="nav-wrap">
      <Link className="wordmark" to="/" onClick={close}><span className="wordmark-mark">A<span>.</span></span><span>ASHOK<br /><small>DEVELOPER & DESIGNER</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {siteConfig.navLinks.map((item) => <NavLink key={item.href} to={item.href} end={item.href === '/'}>{item.label}</NavLink>)}
      </nav>
      <ThemeToggle />
      <Button kind="link" to="/contact" className="nav-contact">Let’s talk</Button>
      <button className="menu-toggle" type="button" onClick={toggleMenu} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    </div>
    <nav className="mobile-nav" ref={mobileNav} aria-label="Mobile navigation" aria-hidden={!open}>
      {siteConfig.navLinks.map((item) => <NavLink key={item.href} to={item.href} end={item.href === '/'} onClick={close}><span>{item.index}</span>{item.label}<ArrowUpRight size={17} /></NavLink>)}
      <ThemeToggle className="mobile-theme-toggle" />
      <a className="mobile-mail" href={`mailto:${siteConfig.socials[1].href.replace('mailto:', '')}`} onClick={close}>Start a conversation ↗</a>
    </nav>
  </header>
}
