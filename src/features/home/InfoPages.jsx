import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Mail, Copy, Check, MapPin, Sparkles } from 'lucide-react'
import GithubIcon from '../../components/icons/GithubIcon.jsx'
import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import { profile } from '../../utils/profile.js'
import { techStack } from '../../utils/tech.js'
import LocalTime from '../../components/motion/LocalTime.jsx'
import { portfolioAssets } from '../../lib/assets.js'

export function AboutPage() {
  return (
    <div className="page-container py-28 relative about-page" data-page-content>
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      <div className="max-w-4xl mb-14">
        <span className="section-kicker">01 — BIOGRAPHY & CRAFT</span>
        <h1 className="text-fluid-h1 font-display font-extrabold text-[var(--text-primary)] mb-6">
          Curiosity is the engine.<br />
          <em>Craft is the vehicle.</em>
        </h1>
        <p className="text-fluid-body text-[var(--text-secondary)] leading-relaxed">
          {profile.statement}
        </p>
      </div>

      {/* Two-column layout with photo & philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-[4/5] bg-[var(--surface-1)] relative">
            <img
              src={portfolioAssets.portraits.about}
              alt="Ashok Kumar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 font-mono text-xs text-white">
              <span>ASHOK KUMAR · KERALA, INDIA</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-pink)] block mb-2 font-semibold">
              MY PHILOSOPHY
            </span>
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3">
              {profile.philosophy}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Software shouldn't merely work; it should feel intentional, calibrated to human perception, and engineered to endure.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-amber)] block mb-2 font-semibold">
              ACADEMIC FOUNDATION
            </span>
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
              {profile.education.degree}
            </h3>
            <p className="text-sm font-mono text-[var(--text-secondary)] mb-2">
              {profile.education.institution} · {profile.education.campus}
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface-2)] text-xs font-mono text-[var(--text-tertiary)]">
              {profile.education.period}
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary-mesh-2)] block mb-3 font-semibold">
              AREAS OF ACTIVE EXPLORATION
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.focusAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContactPage() {
  const [copied, setCopied] = useState(false)

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
    <div className="page-container py-28 relative contact-page" data-page-content>
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      <div className="max-w-3xl mb-14">
        <span className="section-kicker">INITIATE CONTACT</span>
        <h1 className="text-fluid-h1 font-display font-black text-[var(--text-primary)] mb-6">
          Let's talk about<br />
          <em>what's next.</em>
        </h1>
        <p className="text-fluid-body text-[var(--text-secondary)] leading-relaxed">
          Whether you have a specific project inquiry, need autonomous AI integration, or want to collaborate on high-end creative web engineering — my inbox is open.
        </p>
      </div>

      <div className="max-w-2xl p-8 sm:p-12 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-[var(--shadow-card)] mb-12">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] block mb-1">
              DIRECT EMAIL
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              {profile.contact.email}
            </div>
          </div>
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] text-xs font-mono font-medium hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <a
            href={`mailto:${profile.contact.email}?subject=Project%20Inquiry%20%E2%80%94%20Ashok%20Kumar`}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[var(--accent-pink)] via-[var(--secondary-mesh-2)] to-[var(--accent-amber)] text-[var(--base-bg)] font-display font-bold text-base hover:brightness-110 transition-all shadow-lg"
          >
            <span>COMPOSE EMAIL IN DEFAULT CLIENT</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="page-container py-36 text-center" data-page-content>
      <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-pink)] mb-3 block">
        ERROR 404 · PAGE UNMAPPED
      </span>
      <h1 className="text-fluid-hero font-display font-black text-[var(--text-primary)] mb-4 leading-none">
        VOID.
      </h1>
      <p className="text-fluid-body text-[var(--text-secondary)] max-w-md mx-auto mb-10">
        You've wandered outside the grid. No worries, the rest of the site is very much alive.
      </p>
      <Button to="/" kind="primary">
        <ArrowLeft size={16} />
        <span>Return to Safety</span>
      </Button>
    </div>
  )
}
