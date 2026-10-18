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
        <p className="text-fluid-body text-[var(--text-secondary)] leading-relaxed">{profile.statement}</p>
        <div className="mt-5 flex flex-wrap gap-2">{profile.roleList.map((role) => <span className="grain-card about-role-chip" key={role}>{role}</span>)}</div>
      </div>

      {/* Two-column layout with photo & philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        <div className="lg:col-span-5">
          <div className="grain-card rounded-3xl overflow-hidden border border-[var(--border-default)] shadow-[var(--shadow-card)] aspect-[4/5] bg-[var(--surface-1)] relative about-portrait-card">
            <img
              src={portfolioAssets.portraits.professional}
              alt="Professional portrait of Ashok Kumar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 font-mono text-xs text-white">
              <span>ASHOK KUMAR · KERALA, INDIA</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="grain-card p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
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

          <div className="grain-card p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
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

          <div className="grain-card p-8 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-sm">
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
      <div className="about-page-cta">
        <p className="text-[var(--text-secondary)]">Curious about building something together?</p>
        <div className="flex flex-wrap gap-3"><Button to="/contact" kind="primary">Start a conversation <ArrowUpRight size={16} /></Button><Button to="/projects" kind="secondary">Explore selected work <ArrowUpRight size={16} /></Button></div>
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

      <div className="max-w-3xl mb-10">
        <span className="section-kicker">INITIATE CONTACT</span>
        <h1 className="text-fluid-h1 font-display font-black text-[var(--text-primary)] mb-6">
          Let's talk about<br />
          <em>what's next.</em>
        </h1>
        <p className="text-fluid-body text-[var(--text-secondary)] leading-relaxed">
          Whether you have a specific project inquiry, need autonomous AI integration, or want to collaborate on high-end creative web engineering — my inbox is open.
        </p>
      </div>

      <div className="contact-page-grid">
      <div className="grain-card contact-details-card p-8 sm:p-12 rounded-3xl bg-[var(--surface-1)] border border-[var(--border-default)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)] block mb-1">
              DIRECT EMAIL
            </span>
            <div className="contact-email-address font-mono text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              {profile.contact.email}
            </div>
          </div>
          <Button kind="tertiary" onClick={copyEmail} className="text-xs font-mono">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </Button>
        </div>
        <div className="contact-location-line"><MapPin size={15} /><span>{profile.location}</span><span className="contact-location-dot" /><span>Open to thoughtful collaborations</span></div>

        <div className="space-y-4">
          <Button
            href={`mailto:${profile.contact.email}?subject=Project%20Inquiry%20%E2%80%94%20Ashok%20Kumar`}
            kind="primary" className="w-full py-4 rounded-2xl font-display text-base"
          >
            <span>COMPOSE EMAIL IN DEFAULT CLIENT</span>
            <ArrowUpRight size={18} />
          </Button>
        </div>
      </div>
      <aside className="contact-portrait-column">
        <div className="grain-card contact-portrait-card">
          <img src={portfolioAssets.portraits.professional} alt="Professional portrait of Ashok Kumar" loading="lazy" />
          <div className="contact-portrait-caption"><span className="section-kicker">ASHOK KUMAR · KERALA, INDIA</span><h2>Good work starts with a good conversation.</h2><Link to="/about">A little more about me <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="grain-card contact-note"><Sparkles size={17} /><span>Tell me what you are working on, what feels stuck, or what you would like to explore.</span></div>
      </aside>
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
