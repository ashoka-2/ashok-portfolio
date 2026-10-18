import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile } from '../../utils/profile.js'
import { projects } from '../../utils/projects.js'
import { techStack } from '../../utils/tech.js'
import { aboutContent, processContent, capabilitiesContent, faqContent, physicsContent } from '../../utils/pageContent.js'

function SectionTitle({ number, label, title, aside }) {
  return <div className="ref-section-heading"><div><span className="ref-eyebrow">{number} / {label}</span><h2>{title}</h2></div>{aside && <span className="ref-aside">{aside}</span>}</div>
}

export function AboutBento() {
  const [activeGroup, setActiveGroup] = useState('Frontend')
  const count = useMemo(() => ({ projects: projects.length, tools: techStack.length }), [])
  const { skillGroups, openTo, labels } = aboutContent
  return <section className="ref-section ref-about" id="about">
    <div className="ref-wrap">
      <SectionTitle number={aboutContent.section.number} label={aboutContent.section.label} title={<>{aboutContent.section.heading[0]} <em>{aboutContent.section.heading[1]}</em></>} />
      <p className="ref-manifesto">{aboutContent.manifesto[0]}<mark>{aboutContent.manifesto[1]}</mark>{aboutContent.manifesto[2]}<mark>{aboutContent.manifesto[3]}</mark>{aboutContent.manifesto[4]}<mark>{aboutContent.manifesto[5]}</mark>{aboutContent.manifesto[6]}</p>
      <div className="ref-bento">
        <article className="ref-bcard ref-b1"><span className="ref-mono ref-muted">{labels.workStyle}</span><div className="ref-words">{aboutContent.workStyles.map((word) => <span key={word}>{word}</span>)}</div></article>
        <article className="ref-bcard ref-b2"><span className="ref-mono ref-muted">{labels.stack}</span><div className="ref-tabs" role="tablist" aria-label={labels.skillTabs}>{Object.keys(skillGroups).map((group) => <button key={group} type="button" role="tab" aria-selected={activeGroup === group} onClick={() => setActiveGroup(group)}>{group}</button>)}</div><div className="ref-chips" role="tabpanel" aria-live="polite">{skillGroups[activeGroup].map((skill) => <span className="ref-chip" key={skill}>{skill}</span>)}</div></article>
        <article className="ref-bcard ref-b3"><span className="ref-mono ref-muted">{labels.numbers}</span><div className="ref-numbers"><div><b>{count.projects}</b><span>{labels.projects}</span></div><div><b>{count.tools}</b><span>{labels.tools}</span></div><div><b>{Object.keys(skillGroups).length}</b><span>{labels.skillAreas}</span></div></div></article>
        <article className="ref-bcard ref-b4"><span className="ref-mono ref-muted">{labels.education}</span><h3>{labels.degree}</h3><p>{profile.education.institution}, {profile.education.campus}</p></article>
        <article className="ref-bcard ref-b5"><span className="ref-mono ref-muted">{labels.openTo}</span><div className="ref-chips">{openTo.map((item) => <span className="ref-chip" key={item}>{item}</span>)}</div></article>
      </div>
    </div>
  </section>
}

export function ProcessSection() {
  const root = useRef(null)
  const track = useRef(null)
  const viewport = useRef(null)
  const progress = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const media = gsap.matchMedia()
    media.add('(min-width: 900px)', () => {
      const distance = () => Math.max(0, (track.current?.scrollWidth || 0) - window.innerWidth + 80)
      gsap.to(track.current, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }) } })
    })
    return () => media.revert()
  }, { scope: root })
  const updateNativeProgress = () => {
    if (!viewport.current || !progress.current || window.innerWidth >= 900) return
    const { scrollLeft, scrollWidth, clientWidth } = viewport.current
    const amount = scrollLeft / Math.max(1, scrollWidth - clientWidth)
    progress.current.style.transform = `scaleX(${amount})`
  }
  return <section className="ref-section ref-process" id="process" ref={root}>
    <div className="ref-wrap"><SectionTitle number={processContent.section.number} label={processContent.section.label} title={<>{processContent.section.heading[0]} <em>{processContent.section.heading[1]}</em></>} aside={processContent.section.aside} /></div>
    <div className="ref-process-viewport" ref={viewport} onScroll={updateNativeProgress}><div className="ref-process-track" ref={track}>{processContent.steps.map(([title, description], index) => <article className="ref-step" key={title}><span className="ref-step-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></div>
    <div className="ref-progress"><i ref={progress} /></div>
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
  const sendBody = encodeURIComponent(`Hi Ashok,\n\nProject type: ${labels.type}\nMotion level: ${labels.motion}\nTimeline: ${labels.time}\n\nA bit about the project:\n`)
  return <section className="ref-section" id="capabilities">
    <div className="ref-wrap"><SectionTitle number={capabilitiesContent.section.number} label={capabilitiesContent.section.label} title={<>{capabilitiesContent.section.heading[0]} <em>{capabilitiesContent.section.heading[1]}</em></>} />
      <div className="ref-capabilities">{capabilitiesContent.cards.map(([title, description, tags], index) => <article className="ref-cap-card" key={title}><span className="ref-cap-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p><div className="ref-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
      <div className="ref-estimator">
        <div className="ref-panel"><h3>{capabilitiesContent.estimator.heading}</h3><p className="ref-muted">{capabilitiesContent.estimator.description}</p>
          {Object.entries(estimatorOptions).map(([group, options]) => <div className="ref-option-group" key={group}><span className="ref-mono ref-muted">{capabilitiesContent.estimator.groups[group]}</span><div className="ref-chips">{options.map(([label, value]) => <button className="ref-chip" key={value} type="button" aria-pressed={pick[group] === value} onClick={() => setPick((old) => ({ ...old, [group]: value }))}>{label}</button>)}</div></div>)}
        </div>
        <div className="ref-panel ref-roadmap"><span className="ref-mono ref-muted">{capabilitiesContent.estimator.roadmapLabel}</span><ol>{estimateSteps(pick).map((step) => <li key={step}>{step}</li>)}</ol><p className="ref-sum">{labels.type}, {labels.motion.toLowerCase()}, {labels.time.toLowerCase()}.</p><a className="ref-button ref-primary" href={`mailto:${profile.contact.email}?subject=Project%20brief&body=${sendBody}`}>{capabilitiesContent.estimator.sendLabel} <ArrowUpRight size={16} /></a></div>
      </div>
    </div>
  </section>
}

export function ReferenceFAQ() {
  const [open, setOpen] = useState(0)
  return <section className="ref-section" id="faq"><div className="ref-wrap"><SectionTitle number={faqContent.section.number} label={faqContent.section.label} title={<>{faqContent.section.heading[0]} <em>{faqContent.section.heading[1]}</em></>} />
    <div className="ref-faq">{faqContent.items.map(([question, answer], index) => <article className="ref-qa" data-open={open === index} key={question}><button type="button" aria-expanded={open === index} onClick={() => setOpen((current) => current === index ? null : index)}><span>{question}</span><i aria-hidden="true" /></button><div className="ref-answer"><div><p>{answer}</p></div></div></article>)}</div>
  </div></section>
}

export function ReferencePhysics({ children }) {
  return <section className="ref-section ref-physics" id="play"><div className="ref-wrap"><div className="ref-physics-heading"><SectionTitle number={physicsContent.section.number} label={physicsContent.section.label} title={<>{physicsContent.section.heading[0]} <em>{physicsContent.section.heading[1]}</em></>} /><button className="ref-button ref-secondary ref-shake" type="button" onClick={() => window.dispatchEvent(new Event('reference-physics-shake'))}>{physicsContent.action} <Sparkles size={15} /></button></div>{children}</div></section>
}
