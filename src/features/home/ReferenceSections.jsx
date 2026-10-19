import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'
import { aboutContent, processContent, capabilitiesContent, faqContent, physicsContent } from '../../utils/pageContent.js'
import Button from '../../components/buttons/Button.jsx'
import { gmailComposeUrl } from '../../utils/site.js'

function SectionTitle({ number, label, title, aside, className = '' }) {
  return <div className={`ref-section-heading flex flex-wrap items-end justify-between gap-4 mb-10 max-[820px]:items-start ${className}`}><div><span className="ref-eyebrow">{number} / {label}</span><h2 className="m-0 font-[var(--font-bold)] text-[clamp(36px,5.2vw,68px)] leading-[0.98] tracking-[-0.045em] font-extrabold">{title}</h2></div>{aside && <span className="ref-aside">{aside}</span>}</div>
}

export function AboutBento() {
  const root = useRef(null)
  const intro = useRef(null)
  const [activeGroup, setActiveGroup] = useState('Frontend')
  const count = useMemo(() => ({ projects: projects.length, tools: techStack.length }), [])
  const { skillGroups, openTo, labels } = aboutContent
  const bentoCard = 'relative flex min-h-[220px] flex-col gap-[14px] overflow-hidden rounded-[var(--ref-card-radius)] border border-border-subtle bg-surface-1 p-6 max-[759px]:min-h-[200px] max-[759px]:p-[18px] max-[520px]:p-5'
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const words = intro.current?.querySelectorAll('[data-about-word]')
    const gooBlurs = intro.current?.querySelectorAll('[data-about-blur]')
    const gooThresholds = intro.current?.querySelectorAll('[data-about-alpha]')
    if (!words?.length) return
    gsap.set(words, { autoAlpha: 0, filter: 'blur(5px)', y: 5 })
    if (gooBlurs?.length) gsap.set(gooBlurs, { attr: { stdDeviation: 3.2 } })
    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: intro.current,
        start: 'top 100px',
        end: () => `+=${Math.round(window.innerHeight * 1.25)}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
    reveal.to(words, {
      autoAlpha: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: { each: 0.045, from: 'start' },
      ease: 'none',
    }, 0)
    if (gooBlurs?.length) reveal.to(gooBlurs, {
      attr: { stdDeviation: 0.01 },
      stagger: { each: 0.045, from: 'start' },
      ease: 'none',
    }, 0)
    if (gooThresholds?.length) reveal.to(gooThresholds, {
      attr: { slope: 1, intercept: 0 },
      stagger: { each: 0.045, from: 'start' },
      ease: 'none',
    }, 0)
  }, { scope: root })
  const revealWords = (text, key) => text.split(/(\s+)/).map((part, index) =>
    /^\s+$/.test(part) ? part : (() => {
      const filterId = `about-goo-${key}-${index}`
      return <span className="ref-about-goo-word" key={`${key}-${index}`} style={{ filter: `url(#${filterId})` }}>
        <svg className="ref-inline-filter" aria-hidden="true" focusable="false"><defs><filter id={filterId} x="-35%" y="-45%" width="170%" height="190%"><feGaussianBlur data-about-blur in="SourceGraphic" stdDeviation="3.2" result="blur"/><feComponentTransfer in="blur" result="goo"><feFuncA data-about-alpha type="linear" slope="10" intercept="-3.5"/></feComponentTransfer><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs></svg>
        <span className="ref-about-word" data-about-word>{part}</span>
      </span>
    })(),
  )
  return <section className="ref-section ref-about" id="about" ref={root}>
    <div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]">
      <div className="ref-about-intro" ref={intro}>
        <SectionTitle className="!mb-[clamp(26px,5vh,54px)]" number={aboutContent.section.number} label={aboutContent.section.label} title={<>{aboutContent.section.heading[0]} <em>{aboutContent.section.heading[1]}</em></>} />
        <p className="ref-manifesto">{revealWords(aboutContent.manifesto[0], 'plain-0')}<mark>{revealWords(aboutContent.manifesto[1], 'mark-1')}</mark>{revealWords(aboutContent.manifesto[2], 'plain-2')}<mark>{revealWords(aboutContent.manifesto[3], 'mark-3')}</mark>{revealWords(aboutContent.manifesto[4], 'plain-4')}<mark>{revealWords(aboutContent.manifesto[5], 'mark-5')}</mark>{revealWords(aboutContent.manifesto[6], 'plain-6')}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-[68px] max-[820px]:mt-[42px] min-[760px]:grid-cols-6 min-[1000px]:grid-cols-12">
        <article className={`${bentoCard} min-h-[220px] col-span-1 min-[760px]:col-span-2 min-[1000px]:col-span-5`}><span className="font-mono text-xs leading-[1.45] tracking-[0.05em] uppercase text-text-tertiary">{labels.workStyle}</span><div className="grid gap-0.5 mt-auto font-[var(--font-bold)] text-[clamp(27px,3vw,36px)] leading-[1.04] tracking-[-0.04em] font-extrabold max-[759px]:text-[clamp(20px,5.5vw,28px)]">{aboutContent.workStyles.map((word) => <span className="text-text-tertiary hover:translate-x-[7px] hover:text-accent-pink transition-[color,transform] duration-250 ease-[cubic-bezier(0.2,0,0,1)]" key={word}>{word}</span>)}</div></article>
        <article className={`${bentoCard} max-[759px]:min-h-[240px] col-span-1 min-[760px]:col-span-4 min-[1000px]:col-span-7`}><span className="font-mono text-xs leading-[1.45] tracking-[0.05em] uppercase text-text-tertiary">{labels.stack}</span><div className="flex w-max max-w-full gap-1 overflow-x-auto rounded-full border border-border-subtle bg-base-bg p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label={labels.skillTabs}>{Object.keys(skillGroups).map((group) => <button className="min-h-[34px] rounded-full border-0 bg-transparent px-[13px] text-[13px] whitespace-nowrap text-text-tertiary aria-selected:bg-accent aria-selected:text-white" key={group} type="button" role="tab" aria-selected={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>)}</div><div className="flex flex-wrap content-start gap-2 min-h-[92px]" role="tabpanel" aria-live="polite">{skillGroups[activeGroup].map((skill) => <span className="inline-flex min-h-[36px] items-center gap-2 px-3.5 rounded-full border border-border-subtle bg-[color-mix(in_srgb,var(--surface-1)_85%,transparent)] text-text-secondary text-[13px] leading-[1.25] transition-[background,border-color,color] duration-250" key={skill}>{skill}</span>)}</div></article>
        <article className={`${bentoCard} max-[759px]:min-h-[160px] col-span-1 min-[760px]:col-span-2 min-[1000px]:col-span-4`}><span className="font-mono text-xs leading-[1.45] tracking-[0.05em] uppercase text-text-tertiary">{labels.numbers}</span><div className="grid grid-cols-3 gap-2 mt-auto"><div><b className="block font-[var(--font-bold)] text-[clamp(36px,4vw,52px)] leading-none tracking-[-0.05em] font-extrabold tabular-nums">{count.projects}</b><span className="text-[13px] text-text-tertiary">{labels.projects}</span></div><div><b className="block font-[var(--font-bold)] text-[clamp(36px,4vw,52px)] leading-none tracking-[-0.05em] font-extrabold tabular-nums">{count.tools}</b><span className="text-[13px] text-text-tertiary">{labels.tools}</span></div><div><b className="block font-[var(--font-bold)] text-[clamp(36px,4vw,52px)] leading-none tracking-[-0.05em] font-extrabold tabular-nums">{Object.keys(skillGroups).length}</b><span className="text-[13px] text-text-tertiary">{labels.skillAreas}</span></div></div></article>
        <article className={`${bentoCard} col-span-1 min-[760px]:col-span-2 min-[1000px]:col-span-4`}><span className="font-mono text-xs leading-[1.45] tracking-[0.05em] uppercase text-text-tertiary">{labels.education}</span><h3 className="mt-auto font-[var(--font-bold)] text-[21px] font-bold">{labels.degree}</h3><p className="m-0 max-w-[45ch] text-sm leading-[1.45] text-text-secondary">{profile.education.institution}, {profile.education.campus}</p></article>
        <article className={`${bentoCard} col-span-1 min-[760px]:col-span-2 min-[1000px]:col-span-4`}><span className="font-mono text-xs leading-[1.45] tracking-[0.05em] uppercase text-text-tertiary">{labels.openTo}</span><div className="flex flex-wrap content-start gap-2">{openTo.map((item) => <span className="inline-flex min-h-[36px] items-center gap-2 px-3.5 rounded-full border border-border-subtle bg-[color-mix(in_srgb,var(--surface-1)_85%,transparent)] text-text-secondary text-[13px] leading-[1.25] transition-[background,border-color,color] duration-250" key={item}>{item}</span>)}</div></article>
      </div>
    </div>
  </section>
}

export function ProcessSection() {
  const root = useRef(null)
  const heading = useRef(null)
  const track = useRef(null)
  const progress = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(heading.current,
      { y: 34, autoAlpha: 0, filter: 'blur(12px)' },
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 78%',
          end: 'top 48%',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      },
    )
    const distance = () => Math.max(0, (track.current?.scrollWidth || 0) - window.innerWidth + 80)
    gsap.to(track.current, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
      },
    })
  }, { scope: root })
  return <section className="ref-section ref-process z-[1] py-[88px] min-[900px]:flex min-[900px]:min-h-[100svh] min-[900px]:flex-col min-[900px]:justify-center" id="process" ref={root}>
    <div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]"><div ref={heading}><SectionTitle className="!mb-8" number={processContent.section.number} label={processContent.section.label} title={<>{processContent.section.heading[0]} <em>{processContent.section.heading[1]}</em></>} aside={processContent.section.aside} /></div></div>
    <div className="ref-process-viewport relative z-[1] overflow-visible [scrollbar-width:none]"><div className="flex w-max gap-4 px-4 min-[900px]:gap-5 min-[900px]:px-[max(40px,calc((100vw-1040px)/2))] max-[520px]:gap-3 max-[520px]:px-[14px]" ref={track}>{processContent.steps.map(([title, description], index) => <article className="ref-step relative flex h-80 w-[min(80vw,380px)] flex-none flex-col justify-between overflow-hidden rounded-[var(--ref-card-radius)] border border-border-subtle bg-surface-1 p-7 max-[520px]:h-[300px] max-[520px]:w-[min(84vw,360px)] max-[520px]:p-[22px]" key={title}><span className="ref-step-number relative z-[1] font-[var(--font-bold)] text-[clamp(72px,8vw,104px)] leading-[0.8] tracking-[-0.06em] font-extrabold text-transparent transition-colors duration-400">{String(index + 1).padStart(2, '0')}</span><div className="relative z-[1]"><h3 className="m-0 font-[var(--font-bold)] text-[32px] leading-none tracking-[-0.04em] font-extrabold">{title}</h3><p className="mt-2 mb-0 text-text-tertiary">{description}</p></div></article>)}</div></div>
    <div className="mx-4 mt-7 h-0.5 overflow-hidden rounded-sm bg-border-subtle min-[900px]:mx-[max(40px,calc((100vw-1040px)/2))]"><i className="block size-full origin-left scale-x-0 bg-accent-pink" ref={progress} /></div>
  </section>
}

function estimateSteps(pick) {
  const { roadmapSteps } = capabilitiesContent.estimator
  const steps = [...roadmapSteps.opening]
  steps.push(roadmapSteps.projectType[pick.type])
  steps.push(roadmapSteps.motion[pick.motion])
  steps.push(roadmapSteps.closing)
  return steps
}

export function CapabilitiesSection() {
  const [pick, setPick] = useState({ type: 'site', motion: 'gsap', time: 'flex' })
  const { options: estimatorOptions } = capabilitiesContent.estimator
  const labels = Object.fromEntries(Object.entries(estimatorOptions).map(([key, options]) => [key, options.find((option) => option[1] === pick[key])[0]]))
  const sendBody = `Hi Ashok,\n\nProject type: ${labels.type}\nMotion level: ${labels.motion}\nTimeline: ${labels.time}\n\nA bit about the project:\n`
  return <section className="ref-section" id="capabilities">
    <div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]"><SectionTitle number={capabilitiesContent.section.number} label={capabilitiesContent.section.label} title={<>{capabilitiesContent.section.heading[0]} <em>{capabilitiesContent.section.heading[1]}</em></>} />
      <div className="grid grid-cols-1 gap-4 min-[760px]:grid-cols-2 min-[1000px]:grid-cols-4">{capabilitiesContent.cards.map(([title, description, tags], index) => <article className="ref-cap-card relative flex min-h-[250px] flex-col gap-3 overflow-hidden rounded-[var(--ref-card-radius)] border border-border-subtle bg-surface-1 p-6 hover:-translate-y-[5px]" key={title}><span className="relative z-[1] font-mono text-xs leading-[1.4] text-accent-pink">0{index + 1}</span><h3 className="relative z-[1] m-0 font-[var(--font-bold)] text-[22px] leading-[1.05] tracking-[-0.03em] font-extrabold">{title}</h3><p className="relative z-[1] m-0 flex-1 text-sm leading-[1.5] text-text-tertiary">{description}</p><div className="relative z-[1] flex flex-wrap gap-1.5">{tags.map((tag) => <span className="inline-flex min-h-6 items-center rounded-full border border-border-subtle bg-base-bg px-[10px] text-xs text-text-tertiary" key={tag}>{tag}</span>)}</div></article>)}</div>
      <div className="ref-estimator mt-10 grid gap-6 min-[900px]:grid-cols-[1.2fr_1fr] min-[900px]:items-stretch">
        <div className="ref-panel relative rounded-[var(--ref-card-radius)] border border-border-subtle bg-surface-1 p-6 min-[760px]:p-[34px]">
          <h3 className="m-0 font-[var(--font-bold)] text-[22px] font-bold tracking-[-0.03em]">{capabilitiesContent.estimator.heading}</h3>
          <p className="ref-muted mt-1.5 mb-0 text-sm text-text-tertiary">{capabilitiesContent.estimator.description}</p>
          {Object.entries(estimatorOptions).map(([group, options]) => (
            <div className="ref-option-group mt-5 grid gap-2.5" key={group}>
              <span className="ref-mono ref-muted font-mono text-xs uppercase tracking-[0.05em] text-text-tertiary">{capabilitiesContent.estimator.groups[group]}</span>
              <div className="flex flex-wrap gap-2">{options.map(([label, value]) => (
                <button
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors ${
                    pick[group] === value
                      ? 'border-transparent bg-accent text-white font-medium'
                      : 'border-border-subtle bg-[color-mix(in_srgb,var(--surface-1)_85%,transparent)] text-text-secondary hover:border-border-default'
                  }`}
                  key={value}
                  type="button"
                  aria-pressed={pick[group] === value}
                  onClick={() => setPick((old) => ({ ...old, [group]: value }))}
                >
                  {label}
                </button>
              ))}</div>
            </div>
          ))}
        </div>
        <div className="ref-panel ref-roadmap relative flex flex-col gap-4 overflow-hidden rounded-[var(--ref-card-radius)] border border-border-subtle p-6 min-[760px]:p-[34px] bg-[linear-gradient(155deg,color-mix(in_srgb,var(--secondary-mesh-1)_57%,var(--surface-1)),var(--surface-1))]">
          <span className="ref-mono ref-muted font-mono text-xs uppercase tracking-[0.05em] text-text-tertiary">{capabilitiesContent.estimator.roadmapLabel}</span>
          <ol className="m-0 grid gap-2.5 p-0 list-none [counter-reset:roadmap]">{estimateSteps(pick).map((step) => (
            <li className="flex items-start gap-3 text-sm leading-[1.5] text-text-secondary [counter-increment:roadmap] before:pt-0.5 before:font-mono before:text-xs before:text-accent-pink before:content-[counter(roadmap,decimal-leading-zero)]" key={step}>{step}</li>
          ))}</ol>
          <p className="ref-sum m-0 font-display text-[22px] italic leading-[1.25] text-accent-pink">{labels.type}, {labels.motion.toLowerCase()}, {labels.time.toLowerCase()}.</p>
          <Button href={gmailComposeUrl(profile.contact.email, { subject: 'Project brief', body: sendBody })} target="_blank" rel="noreferrer" kind="primary">{capabilitiesContent.estimator.sendLabel} <ArrowUpRight size={16} /></Button>
        </div>
      </div>
    </div>
  </section>
}

export function ReferenceFAQ() {
  const [open, setOpen] = useState(0)
  return <section className="ref-section" id="faq"><div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]"><SectionTitle number={faqContent.section.number} label={faqContent.section.label} title={<>{faqContent.section.heading[0]} <em>{faqContent.section.heading[1]}</em></>} />
    <div className="ref-faq grid max-w-[820px] gap-0.5">
      {faqContent.items.map(([question, answer], index) => (
        <article
          className="ref-qa grain-card bg-surface-1 first:rounded-t-[var(--ref-card-radius)] first:rounded-b-[var(--ref-small-radius)] last:rounded-t-[var(--ref-small-radius)] last:rounded-b-[var(--ref-card-radius)] overflow-hidden"
          data-open={open === index}
          key={question}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between p-6 max-[520px]:p-4 text-left font-[var(--font-bold)] text-[clamp(17px,1.8vw,20px)] font-bold tracking-[-0.02em] text-text-primary transition-colors hover:text-accent-pink"
            aria-expanded={open === index}
            onClick={() => setOpen((current) => current === index ? null : index)}
          >
            <span>{question}</span>
            <span className={`font-mono text-lg transition-transform duration-300 ${open === index ? 'rotate-45 text-accent-pink' : 'text-text-tertiary'}`}>+</span>
          </button>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              open === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-6 max-[520px]:px-4 max-[520px]:pb-4 m-0 text-sm leading-[1.6] text-text-secondary">
                {answer}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div></section>
}

export function ReferencePhysics({ children }) {
  const [gravity, setGravity] = useState(true)
  const toggleGravity = () => {
    const next = !gravity
    setGravity(next)
    window.dispatchEvent(new CustomEvent('reference-physics-gravity', { detail: { enabled: next } }))
  }
  return <section className="ref-section ref-physics" id="play"><div className="relative z-[1] mx-auto w-[min(calc(100%-32px),1120px)] max-[520px]:w-[calc(100%-28px)]"><div className="ref-physics-heading flex flex-wrap items-end justify-between gap-4 mb-8 max-[820px]:items-start"><SectionTitle className="!m-0 flex-1" number={physicsContent.section.number} label={physicsContent.section.label} title={<>{physicsContent.section.heading[0]} <em>{physicsContent.section.heading[1]}</em></>} /><div className="ref-physics-controls flex flex-wrap items-center gap-2"><Button kind="secondary" className="ref-shake" onClick={() => window.dispatchEvent(new Event('reference-physics-shake'))}>{physicsContent.action} <Sparkles size={15} /></Button><Button kind="secondary" className="ref-gravity" aria-pressed={!gravity} onClick={toggleGravity}>{gravity ? 'Disable gravity' : 'Enable gravity'} <span aria-hidden="true">{gravity ? '↓' : '↔'}</span></Button></div></div>{children}</div></section>
}
