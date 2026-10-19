import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Mail, Copy, Check, MapPin, Sparkles } from 'lucide-react'
import GithubIcon from '../../components/icons/GithubIcon.jsx'
import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import { profile } from '../../utils/profile.js'
import { gmailComposeUrl } from '../../utils/site.js'
import { techStack } from '../../utils/tech.js'
import { portfolioAssets } from '../../lib/assets.js'

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-page-gutter py-28 relative about-page" data-page-content>
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent-pink transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      <div className="max-w-4xl mb-14">
        <span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">01 — BIOGRAPHY & CRAFT</span>
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] font-bold font-display font-extrabold text-text-primary mb-6">
          Curiosity is the engine.<br />
          <em>Craft is the vehicle.</em>
        </h1>
        <p className="text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.6] text-text-secondary leading-relaxed">{profile.statement}</p>
        <div className="mt-5 flex flex-wrap gap-2">{profile.roleList.map((role) => <span className="grain-card inline-flex min-h-8 items-center rounded-full border border-border-subtle bg-surface-1 px-3 font-mono text-[11px] leading-[1.2] text-text-secondary" key={role}>{role}</span>)}</div>
      </div>

      {/* Two-column layout with photo & philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        <div className="lg:col-span-5">
          <div className="grain-card rounded-3xl overflow-hidden border border-border-default shadow-[var(--shadow-card)] aspect-[4/5] bg-surface-1 relative about-portrait-card">
            <img
              src={portfolioAssets.portraits.professional}
              alt="Professional portrait of Ashok Kumar"
              className="w-full h-full object-cover object-[center_28%]"
            />
            <div className="absolute bottom-4 left-4 right-4 z-[2] p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 font-mono text-xs text-white">
              <span>ASHOK KUMAR · KERALA, INDIA</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="grain-card p-8 rounded-3xl bg-surface-1 border border-border-default shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-pink block mb-2 font-semibold">
              MY PHILOSOPHY
            </span>
            <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
              {profile.philosophy}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Software shouldn't merely work; it should feel intentional, calibrated to human perception, and engineered to endure.
            </p>
          </div>

          <div className="grain-card p-8 rounded-3xl bg-surface-1 border border-border-default shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-amber block mb-2 font-semibold">
              ACADEMIC FOUNDATION
            </span>
            <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
              {profile.education.degree}
            </h3>
            <p className="text-sm font-mono text-text-secondary mb-2">
              {profile.education.institution} · {profile.education.campus}
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-2 text-xs font-mono text-text-tertiary">
              {profile.education.period}
            </span>
          </div>

          <div className="grain-card p-8 rounded-3xl bg-surface-1 border border-border-default shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary-mesh-2 block mb-3 font-semibold">
              AREAS OF ACTIVE EXPLORATION
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.focusAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-surface-2 border border-border-subtle text-xs font-mono text-text-secondary"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-[18px] border-t border-border-subtle pt-[26px] max-[520px]:items-start max-[520px]:flex-col">
        <p className="text-text-secondary">Curious about building something together?</p>
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
    <div className="mx-auto w-full max-w-[1360px] px-page-gutter py-28 relative contact-page" data-page-content>
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent-pink transition-colors py-2 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      <div className="max-w-3xl mb-10">
        <span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">INITIATE CONTACT</span>
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] font-bold font-display font-black text-text-primary mb-6">
          Let's talk about<br />
          <em>what's next.</em>
        </h1>
        <p className="text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.6] text-text-secondary leading-relaxed">
          Whether you have a specific project inquiry, need autonomous AI integration, or want to collaborate on high-end creative web engineering — my inbox is open.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] items-stretch gap-[clamp(24px,4vw,64px)] max-[900px]:grid-cols-1 max-[520px]:gap-5">
      <div className="grain-card contact-details-card flex w-full max-w-none flex-col justify-center gap-[26px] p-8 sm:p-12 rounded-3xl bg-surface-1 border border-border-default shadow-[var(--shadow-card)] max-[520px]:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle max-[520px]:items-start max-[520px]:flex-col">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary block mb-1">
              DIRECT EMAIL
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-text-primary max-w-full [overflow-wrap:anywhere] max-[520px]:text-[clamp(15px,4.2vw,19px)]">
              {profile.contact.email}
            </div>
          </div>
          <Button kind="tertiary" onClick={copyEmail} className="text-xs font-mono">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] font-mono text-xs leading-[1.5] text-text-secondary"><MapPin className="text-accent-pink" size={15} /><span>{profile.location}</span><span className="size-1 rounded-full bg-accent-amber" /><span>Open to thoughtful collaborations</span></div>

        <div className="space-y-4">
          <Button
            href={gmailComposeUrl(profile.contact.email, { subject: 'Project Inquiry — Ashok Kumar' })}
            target="_blank" rel="noreferrer"
            kind="primary" className="w-full py-4 rounded-2xl font-display text-base"
          >
            <span>COMPOSE EMAIL IN GMAIL</span>
            <ArrowUpRight size={18} />
          </Button>
        </div>
      </div>
      <aside className="flex min-w-0 flex-col gap-[14px]">
        <div className="grain-card contact-portrait-card relative min-h-[500px] flex-1 overflow-hidden rounded-[28px] border border-border-default bg-surface-1 shadow-[var(--shadow-card)] max-[900px]:min-h-[clamp(400px,72vw,560px)] max-[520px]:min-h-[430px] max-[520px]:rounded-[22px]">
          <img className="absolute inset-0 size-full object-cover object-[center_28%]" src={portfolioAssets.portraits.professional} alt="Professional portrait of Ashok Kumar" loading="lazy" />
          <div className="absolute z-[1] right-6 bottom-6 left-6 text-white max-[520px]:right-[18px] max-[520px]:bottom-[18px] max-[520px]:left-[18px]"><span className="text-white/70 font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">ASHOK KUMAR · KERALA, INDIA</span><h2 className="my-[10px] mb-[18px] max-w-[15ch] font-display text-[clamp(24px,2.5vw,36px)] leading-[1.02] tracking-[-0.035em] font-semibold">Good work starts with a good conversation.</h2><Link className="inline-flex items-center gap-2 font-mono text-xs leading-[1.4] text-white" to="/about">A little more about me <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="grain-card flex items-start gap-3 rounded-[18px] border border-border-subtle bg-surface-1 px-[19px] py-[17px] text-[13px] leading-[1.5] text-text-secondary"><Sparkles className="flex-none text-accent-pink" size={17} /><span>Tell me what you are working on, what feels stuck, or what you would like to explore.</span></div>
      </aside>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-page-gutter py-36 text-center" data-page-content>
      <span className="font-mono text-xs uppercase tracking-widest text-accent-pink mb-3 block">
        ERROR 404 · PAGE UNMAPPED
      </span>
      <h1 className="text-[clamp(3.2rem,13vw,13.5rem)] leading-[0.86] tracking-[-0.045em] font-extrabold uppercase font-display font-black text-text-primary mb-4 leading-none">
        VOID.
      </h1>
      <p className="text-[clamp(0.95rem,1.1vw,1.125rem)] leading-[1.6] text-text-secondary max-w-md mx-auto mb-10">
        You've wandered outside the grid. No worries, the rest of the site is very much alive.
      </p>
      <Button to="/" kind="primary">
        <ArrowLeft size={16} />
        <span>Return to Safety</span>
      </Button>
    </div>
  )
}
