import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Mail, Menu, X } from 'lucide-react'
import GithubIcon from '../icons/GithubIcon.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ThemeToggle from './ThemeToggle.jsx'
import NavbarFurName from './NavbarFurName.jsx'
import { profile } from '../../utils/profile.js'
import { gmailComposeUrl } from '../../utils/site.js'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const headerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Scroll detection for hide/show navbar and glass styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 60) {
        setScrolled(true)
        if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 180) {
          setHidden(true)
        } else if (currentScrollY < lastScrollY.current - 12) {
          setHidden(false)
        }
      } else {
        setScrolled(false)
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu upon route navigation
  useEffect(() => {
    setMenuOpen(false)
    setHidden(false)
    setScrolled(window.scrollY > 60)
    lastScrollY.current = window.scrollY
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const menuLinks = [
    { num: '01', label: 'ABOUT', href: '/about' },
    { num: '02', label: 'WORK', href: '/projects' },
    { num: '03', label: 'PROCESS', href: '/#process' },
    { num: '04', label: 'SERVICES', href: '/#capabilities' },
    { num: '05', label: 'PLAY', href: '/#play' },
    { num: '06', label: 'CONTACT', href: '/contact' },
  ]

  return (
    <>
      <header
        ref={headerRef}
        className={`site-navbar fixed inset-x-0 top-0 z-[900] h-[76px] bg-transparent px-4 pt-3 max-[760px]:px-[10px] ${scrolled ? 'nav-scrolled' : ''} ${hidden && !menuOpen ? 'nav-hidden' : ''}`}
      >
        <div className="nav-inner mx-auto flex h-full w-full min-h-[58px] max-w-[1120px] items-center justify-between gap-3 rounded-full border border-border-default bg-[color-mix(in_srgb,var(--surface-1)_76%,transparent)] px-2 py-[6px] backdrop-blur-[18px] backdrop-saturate-[1.25] max-[760px]:mr-auto max-[760px]:ml-0 max-[760px]:w-[calc(100%-74px)] max-[760px]:gap-[6px]">
          {/* Logo Mark Left */}
          <Link to="/" className="navbar-brand-link flex items-center gap-2 group" aria-label="Ashok Kumar Home">
            <span className="w-9 h-9 rounded-full bg-text-primary border border-border-default flex items-center justify-center font-display text-xl text-base-bg group-hover:rotate-[360deg] transition-all shadow-[var(--highlight-top)]">
              A
            </span>
            <div className="hidden sm:flex flex-col">
              <NavbarFurName />
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 min-[1000px]:flex max-[999px]:!hidden" aria-label="Portfolio sections">
            <Link className="rounded-full border border-transparent px-3 py-2.5 text-[13px] font-semibold text-text-secondary transition-[background,color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border-default hover:bg-surface-2 hover:text-text-primary focus-visible:-translate-y-px focus-visible:border-border-default focus-visible:bg-surface-2 focus-visible:text-text-primary" to="/about">About</Link>
            <Link className="rounded-full border border-transparent px-3 py-2.5 text-[13px] font-semibold text-text-secondary transition-[background,color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border-default hover:bg-surface-2 hover:text-text-primary focus-visible:-translate-y-px focus-visible:border-border-default focus-visible:bg-surface-2 focus-visible:text-text-primary" to="/#work">Work</Link>
            <Link className="rounded-full border border-transparent px-3 py-2.5 text-[13px] font-semibold text-text-secondary transition-[background,color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border-default hover:bg-surface-2 hover:text-text-primary focus-visible:-translate-y-px focus-visible:border-border-default focus-visible:bg-surface-2 focus-visible:text-text-primary" to="/#process">Process</Link>
            <Link className="rounded-full border border-transparent px-3 py-2.5 text-[13px] font-semibold text-text-secondary transition-[background,color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border-default hover:bg-surface-2 hover:text-text-primary focus-visible:-translate-y-px focus-visible:border-border-default focus-visible:bg-surface-2 focus-visible:text-text-primary" to="/#capabilities">Services</Link>
            <Link className="rounded-full border border-transparent px-3 py-2.5 text-[13px] font-semibold text-text-secondary transition-[background,color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border-default hover:bg-surface-2 hover:text-text-primary focus-visible:-translate-y-px focus-visible:border-border-default focus-visible:bg-surface-2 focus-visible:text-text-primary" to="/#play">Play</Link>
          </nav>

          {/* Right Actions: Let's Talk Pill + Menu Pill + Pull Cord */}
          <div className="flex items-center gap-3">
            <Link to="/contact" className="nav-pill relative inline-flex min-h-[42px] cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-border-default bg-[color-mix(in_srgb,var(--surface-1)_86%,transparent)] px-4 font-mono text-[0.78rem] tracking-[0.04em] text-text-primary uppercase shadow-[var(--highlight-top)] transition-[transform,background,border-color,box-shadow,color] duration-[250ms] max-[760px]:min-h-[38px] max-[760px]:px-[11px] max-[760px]:text-[10px]" aria-label="Go to contact page">
              <span className="relative z-[1]">LET'S TALK</span>
              <span className="relative z-[1] size-1.5 rounded-full bg-accent-pink" />
            </Link>

            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-pill relative inline-flex min-h-[42px] cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-border-default bg-[color-mix(in_srgb,var(--surface-1)_86%,transparent)] px-4 font-mono text-[0.78rem] tracking-[0.04em] text-text-primary uppercase shadow-[var(--highlight-top)] transition-[transform,background,border-color,box-shadow,color] duration-[250ms] max-[760px]:min-h-[38px] max-[760px]:px-[11px] max-[760px]:text-[10px]"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="relative z-[1]">{menuOpen ? 'CLOSE' : 'MENU'}</span>
              {menuOpen ? <X className="relative z-[1]" size={14} /> : <Menu className="relative z-[1]" size={14} />}
            </button>

          </div>
        </div>
      </header>

      <ThemeToggle className="theme-cord-navbar" isHidden={hidden && !menuOpen} />

      {/* Full-Screen Circular Clip-Path Overlay Menu */}
      <div
        className={`menu-overlay fixed inset-0 z-[950] w-screen h-screen h-[100dvh] flex flex-col justify-between overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--border-default)_transparent] bg-base-bg bg-[radial-gradient(80%_60%_at_80%_100%,color-mix(in_srgb,var(--secondary-mesh-1)_60%,transparent),transparent_70%)] p-[clamp(1rem,4vh,3rem)_clamp(1.5rem,6vw,6rem)] gap-[clamp(12px,2vh,24px)] max-[600px]:p-[82px_22px_20px] max-[600px]:justify-start max-[600px]:gap-[clamp(18px,4vh,34px)] max-h-[720px]:p-[clamp(68px,10vh,80px)_clamp(1.5rem,6vw,6rem)_16px] max-h-[720px]:gap-2.5 max-[600px]:max-h-[720px]:pt-[68px] max-[600px]:max-h-[720px]:pb-3.5 [&>*]:shrink-0 ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        data-lenis-prevent
      >
        {/* Top bar inside menu */}
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            INDEX NAVIGATION
          </span>
          <button
            ref={closeButtonRef}
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center text-text-secondary hover:text-accent-pink hover:border-accent-pink transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Links */}
        <nav className="menu-links my-auto flex flex-col justify-center py-[clamp(8px,1.3vh,18px)] max-[600px]:w-full max-[600px]:my-auto max-[600px]:py-2 max-h-[720px]:py-0.5 min-h-0" aria-label="Overlay main navigation">
          {menuLinks.map((link) => {
            const linkClasses = "menu-link-item group flex items-baseline gap-[clamp(1rem,2.5vw,2.5rem)] max-[600px]:gap-3.5 font-display font-extrabold text-[clamp(1.8rem,7vh,5rem)] max-[600px]:text-[clamp(1.7rem,7.8vw,2.55rem)] max-h-[720px]:text-[clamp(1.5rem,5.1vh,2.65rem)] max-[600px]:max-h-[720px]:text-[clamp(1.45rem,4.8vh,2.15rem)] leading-[0.96] max-[600px]:leading-[0.98] uppercase text-text-primary min-w-0 [overflow-wrap:anywhere] transition-[color,transform,opacity] duration-300 ease-out hover:text-accent-pink hover:translate-x-4"
            if (link.action) {
              return (
                <button
                  key={link.num}
                  onClick={link.action}
                  className={`${linkClasses} text-left bg-transparent border-none p-0 cursor-pointer`}
                >
                  <span className="menu-link-index font-mono text-[clamp(0.9rem,1.5vw,1.3rem)] max-[600px]:min-w-[2.25rem] max-[600px]:text-[0.85rem] text-accent-amber font-medium">{link.num}</span>
                  <span>{link.label}</span>
                </button>
              )
            }
            return (
              <Link
                key={link.num}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={linkClasses}
              >
                <span className="menu-link-index font-mono text-[clamp(0.9rem,1.5vw,1.3rem)] max-[600px]:min-w-[2.25rem] max-[600px]:text-[0.85rem] text-accent-amber font-medium">{link.num}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Socials & Microcopy */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 max-h-[720px]:pt-3 border-t border-border-subtle font-mono text-xs max-[600px]:text-[10px] text-text-secondary">
          <div className="flex items-center gap-6 max-[600px]:flex-wrap max-[600px]:gap-[10px_18px]">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-accent-pink transition-colors"
            >
              <GithubIcon size={15} />
              <span>GITHUB</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href={gmailComposeUrl(profile.contact.email)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-accent-pink transition-colors"
            >
              <Mail size={15} />
              <span className="menu-email [overflow-wrap:anywhere]">{profile.contact.email}</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          <div className="text-text-tertiary">
            KERALA, INDIA · 2026
          </div>
        </div>
      </div>

    </>
  )
}
