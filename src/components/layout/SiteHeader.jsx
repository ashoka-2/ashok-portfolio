import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Mail, Menu, X } from 'lucide-react'
import GithubIcon from '../icons/GithubIcon.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ThemeToggle from './ThemeToggle.jsx'
import ContactOverlay from './ContactOverlay.jsx'
import LocalTime from '../motion/LocalTime.jsx'
import { profile } from '../../utils/profile.js'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const headerRef = useRef(null)

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
    setContactOpen(false)
  }, [location.pathname])

  const menuLinks = [
    { num: '01', label: 'WORK', href: '/#work' },
    { num: '02', label: 'ABOUT', href: '/#about' },
    { num: '03', label: 'SERVICES', href: '/#services' },
    { num: '04', label: 'JOURNEY', href: '/#journey' },
    { num: '05', label: 'FAQ', href: '/#faq' },
    { num: '06', label: 'CONTACT', action: () => { setMenuOpen(false); setContactOpen(true) } },
  ]

  return (
    <>
      <header
        ref={headerRef}
        className={`site-navbar ${scrolled ? 'nav-scrolled' : ''} ${hidden && !menuOpen ? 'nav-hidden' : ''}`}
      >
        <div className="page-container nav-inner">
          {/* Logo Mark Left */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Ashok Kumar Home">
            <span className="w-9 h-9 rounded-xl bg-[var(--surface-1)] border border-[var(--border-default)] flex items-center justify-center font-display font-black text-sm text-[var(--text-primary)] group-hover:border-[var(--accent-pink)] group-hover:text-[var(--accent-pink)] transition-all shadow-[var(--highlight-top)]">
              AK
            </span>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-bold text-xs uppercase tracking-tight text-[var(--text-primary)]">
                ASHOK KUMAR
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">
                CREATIVE TECH
              </span>
            </div>
          </Link>

          {/* Center: Live Availability & Time */}
          <div className="hidden md:flex items-center">
            <div className="status-badge">
              <span className="status-dot" />
              <span>AVAILABLE FOR SELECT WORK · </span>
              <LocalTime />
              <span> IST</span>
            </div>
          </div>

          {/* Right Actions: Let's Talk Pill + Menu Pill + Pull Cord */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="nav-pill cursor-pointer"
              aria-label="Open contact dialog"
            >
              <span>LET'S TALK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)]" />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-pill cursor-pointer"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>

            {/* Pull-cord Theme Toggle */}
            <div className="ml-1 flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Circular Clip-Path Overlay Menu */}
      <div
        className={`menu-overlay ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {/* Top bar inside menu */}
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
            INDEX NAVIGATION
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-pink)] hover:border-[var(--accent-pink)] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Links */}
        <nav className="menu-links my-auto flex flex-col py-6" aria-label="Overlay main navigation">
          {menuLinks.map((link) => {
            if (link.action) {
              return (
                <button
                  key={link.num}
                  onClick={link.action}
                  className="menu-link-item text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="menu-link-index">{link.num}</span>
                  <span>{link.label}</span>
                </button>
              )
            }
            return (
              <a
                key={link.num}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link-item"
              >
                <span className="menu-link-index">{link.num}</span>
                <span>{link.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Bottom Socials & Microcopy */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-6">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--accent-pink)] transition-colors"
            >
              <GithubIcon size={15} />
              <span>GITHUB</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-1.5 hover:text-[var(--accent-pink)] transition-colors"
            >
              <Mail size={15} />
              <span>{profile.contact.email}</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          <div className="text-[var(--text-tertiary)]">
            KERALA, INDIA · 2026
          </div>
        </div>
      </div>

      {/* Full-Screen Contact Overlay */}
      <ContactOverlay isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
