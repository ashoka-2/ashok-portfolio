import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Mail, Menu, X } from 'lucide-react'
import GithubIcon from '../icons/GithubIcon.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ThemeToggle from './ThemeToggle.jsx'
import { profile } from '../../utils/profile.js'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
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
  }, [location.pathname])

  const menuLinks = [
    { num: '01', label: 'ABOUT', href: '/#about' },
    { num: '02', label: 'WORK', href: '/#work' },
    { num: '03', label: 'PROCESS', href: '/#process' },
    { num: '04', label: 'SERVICES', href: '/#capabilities' },
    { num: '05', label: 'PLAY', href: '/#play' },
    { num: '06', label: 'CONTACT', href: '/#contact' },
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
            <span className="w-9 h-9 rounded-full bg-[var(--text-primary)] border border-[var(--border-default)] flex items-center justify-center font-display text-xl text-[var(--base-bg)] group-hover:rotate-[360deg] transition-all shadow-[var(--highlight-top)]">
              A
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

          <nav className="ref-top-links" aria-label="Portfolio sections">
            <a href="/#about">About</a>
            <a href="/#work">Work</a>
            <a href="/#process">Process</a>
            <a href="/#capabilities">Services</a>
            <a href="/#play">Play</a>
          </nav>

          {/* Right Actions: Let's Talk Pill + Menu Pill + Pull Cord */}
          <div className="flex items-center gap-3">
            <a href="/#contact" className="nav-pill cursor-pointer" aria-label="Go to contact section">
              <span>LET'S TALK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)]" />
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-pill cursor-pointer"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>

          </div>
        </div>
      </header>

      <ThemeToggle className="theme-cord-navbar" />

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

    </>
  )
}
