import { useEffect, useRef, useState } from 'react'
import { X, Copy, Check, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import GithubIcon from '../icons/GithubIcon.jsx'
import { profile } from '../../utils/profile.js'
import { portfolioAssets } from '../../lib/assets.js'

export default function ContactOverlay({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email)
    } catch {
      const field = document.createElement('textarea')
      field.value = profile.contact.email
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2400)
  }

  return (
    <div
      className={`contact-overlay-backdrop ${isOpen ? 'is-open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-heading"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div ref={modalRef} className="contact-modal">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="contact-heading-copy">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-pink)] font-semibold">
              06 — INITIATE CONTACT
            </span>
            <h2 id="contact-heading" className="font-display text-3xl sm:text-4xl font-bold mt-1 text-[var(--text-primary)]">
              Want to start a new project?
            </h2>
          </div>
          <img className="contact-avatar" src={portfolioAssets.portraits.avatar} alt="Portrait of Ashok Kumar" />
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-pink)] hover:border-[var(--accent-pink)] transition-colors"
            aria-label="Close contact overlay"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-8 leading-relaxed">
          Whether you need a high-performance web app, an autonomous AI workflow, or an Awwwards-caliber interactive experience — my inbox is open.
        </p>

        {/* Quick Email Action Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-default)] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-pink)]/15 text-[var(--accent-pink)] flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div className="text-left overflow-hidden">
              <div className="font-mono text-[10px] uppercase text-[var(--text-tertiary)]">Direct Email</div>
              <div className="font-mono text-sm sm:text-base font-semibold text-[var(--text-primary)] truncate">
                {profile.contact.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyEmail}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-1)] text-xs font-mono font-medium hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <a
              href={`mailto:${profile.contact.email}?subject=Project%20Inquiry%20%E2%80%94%20Ashok%20Kumar`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-amber)] text-[var(--base-bg)] text-xs font-mono font-semibold shadow-md hover:brightness-110 transition-transform active:scale-95"
            >
              <span>Mail</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-[var(--text-secondary)]">
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <GithubIcon size={15} />
              <span>github.com/ashoka-2</span>
            </span>
            <ArrowUpRight size={14} />
          </a>

          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)]">
            <MapPin size={15} className="text-[var(--accent-pink)]" />
            <span>Kerala, India (IST / UTC+5:30)</span>
          </div>
        </div>

        {/* Two26 style closing remark */}
        <div className="mt-8 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)] font-mono">
          <span>RESPONSE TIME: &lt; 24 HOURS</span>
          <span>NO COLD CALLS, JUST RESULTS</span>
        </div>
      </div>
    </div>
  )
}
