import { ArrowUp, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import GithubIcon from '../icons/GithubIcon.jsx'
import { profile } from '../../utils/profile.js'
import LocalTime from '../motion/LocalTime.jsx'

export default function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-section" id="contact">
      <div className="page-container flex flex-col justify-between min-h-[70vh]">
        {/* Top: Section Kicker */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-6 mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-pink)] font-semibold">
            06 — NEXT STEP
          </span>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-tertiary)]">
            <MapPin size={13} className="text-[var(--accent-amber)]" />
            <span>KERALA, INDIA · </span>
            <LocalTime />
            <span> IST</span>
          </div>
        </div>

        {/* Huge Magnetic CTA */}
        <div className="my-auto py-8">
          <p className="font-mono text-sm sm:text-base text-[var(--text-secondary)] uppercase tracking-widest mb-4">
            HAVE A VISION, PRODUCT OR EXPERIMENT?
          </p>
          <a
            href={`mailto:${profile.contact.email}?subject=Let%27s%20build%20something%20%E2%80%94%20Ashok%20Kumar`}
            className="big-cta-heading inline-block group cursor-pointer"
            data-cursor="HELLO"
          >
            LET'S BUILD<br />
            <em>SOMETHING.</em>
            <span className="inline-block ml-4 text-[var(--accent-pink)] transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-4">
              ↗
            </span>
          </a>
        </div>

        {/* Contact Links & Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
          {/* Direct Email */}
          <div>
            <span className="text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">Direct Mail</span>
            <a
              href={`mailto:${profile.contact.email}`}
              className="text-base sm:text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-pink)] transition-colors flex items-center gap-2"
            >
              <Mail size={16} />
              <span>{profile.contact.email}</span>
            </a>
          </div>

          {/* Social Links */}
          <div>
            <span className="text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">Connect Elsewhere</span>
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
                <span>EMAIL</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Back to top */}
          <div className="flex md:justify-end items-center">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-1)] border border-[var(--border-default)] text-xs font-mono font-medium hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-all group"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Two26 style witty closing sign-off & copyright note */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-[var(--text-tertiary)]">
          <div>
            "Okay, that's enough scrolling. Go build something or shoot me an email."
          </div>
          <div className="flex items-center gap-2">
            <span>© 2026 ASHOK KUMAR. HANDMADE DIGITALLY IN KERALA.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
