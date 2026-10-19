import { ArrowLeft, ArrowUpRight, ExternalLink, Layers3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import TechLamp from '../../components/tech/TechLamp.jsx'
import { techStack } from '../../utils/tech.js'
import { projects } from '../../utils/projects.js'

function normalize(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function TechPage() {
  const { slug } = useParams()
  const tech = techStack.find((item) => item.id === slug)
  if (!tech) return <div className="tech-detail mx-auto w-full max-w-[1360px] px-page-gutter pt-32 pb-32"><span className="text-accent-soft font-mono font-medium text-[11px] leading-[1.5] tracking-[0.11em] uppercase">TOOL NOT FOUND</span><h1>Still building<br /><em>the list.</em></h1><Link className="back-link" to="/">← Back home</Link></div>

  const categoryTools = techStack.filter((item) => item.category === tech.category && item.id !== tech.id)
  const related = [...categoryTools, ...techStack.filter((item) => item.id !== tech.id && item.category !== tech.category)].slice(0, 4)
  const identifiers = [tech.id, tech.label, tech.short].map(normalize).filter(Boolean)
  const usedIn = projects.filter((project) => project.stack?.some((entry) => {
    const value = normalize(entry)
    return identifiers.some((id) => value === id || value.startsWith(id) || id.startsWith(value))
  }))
  const index = String(techStack.findIndex((item) => item.id === tech.id) + 1).padStart(2, '0')

  return <div className="tech-detail min-h-svh bg-[radial-gradient(70%_48%_at_88%_14%,color-mix(in_srgb,var(--tech-accent)_11%,transparent),transparent_70%)] px-6 pt-[clamp(112px,13vh,160px)] pb-[100px] max-[760px]:px-[18px] max-[760px]:pt-[104px] max-[760px]:pb-[72px]" style={{ '--tech-accent': tech.color }}>
    <div className="mx-auto w-full max-w-[1240px]">
      <div className="flex items-center justify-between gap-5 max-[420px]:items-start">
        <Link className="inline-flex items-center gap-[9px] font-mono text-[11px] leading-[1.4] font-medium text-text-secondary no-underline transition-colors duration-200 hover:text-[var(--tech-accent,var(--accent-pink))]" to="/"><ArrowLeft size={15} /> Back to the portfolio</Link>
        <span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-text-tertiary max-[420px]:text-[8px]">TOOLKIT / {index} OF {String(techStack.length).padStart(2, '0')}</span>
      </div>

      <section className="tech-hero-card relative mt-[30px] grid min-h-[480px] grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] items-center overflow-hidden rounded-[32px] border border-border-default bg-[radial-gradient(70%_90%_at_90%_50%,color-mix(in_srgb,var(--tech-accent)_15%,var(--surface-1)),transparent_70%),var(--surface-1)] p-[clamp(32px,6vw,76px)] shadow-[var(--shadow-card)] grain-card max-[760px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:gap-[18px] max-[760px]:rounded-3xl max-[760px]:px-6 max-[760px]:pt-7 max-[760px]:pb-[66px] max-[420px]:px-5" aria-labelledby="tech-title">
        <div className="relative z-[2] max-w-[660px] max-[760px]:row-start-1">
          <span className="inline-flex items-center gap-[9px] rounded-full border border-[color-mix(in_srgb,var(--tech-accent)_36%,var(--border-default))] px-3 py-2 font-mono text-[10px] leading-[1.2] tracking-[0.08em] text-text-secondary uppercase"><i className="size-[7px] rounded-full bg-[var(--tech-accent)] shadow-[0_0_16px_color-mix(in_srgb,var(--tech-accent)_70%,transparent)]" /> {tech.category.replace(/([A-Z])/g, ' $1')}</span>
          <h1 id="tech-title" className="mt-6 mb-[18px] font-[var(--font-bold)] text-[clamp(52px,8vw,104px)] leading-[0.9] tracking-[-0.075em] font-extrabold text-text-primary [overflow-wrap:anywhere] max-[420px]:text-[clamp(42px,14vw,60px)]">{tech.label}<span className="text-[var(--tech-accent)]">.</span></h1>
          <p className="m-0 max-w-[55ch] text-[clamp(15px,1.35vw,18px)] leading-[1.65] text-text-secondary">{tech.purpose}</p>
          <div className="mt-7 flex flex-wrap gap-[10px]">
            <Button href={tech.url} target="_blank" rel="noreferrer" kind="primary">Official docs <ExternalLink size={15} /></Button>
            <Button href="#how-i-use-it" kind="secondary">How I use it <ArrowUpRight size={15} /></Button>
          </div>
        </div>
        <div className="relative isolate grid min-h-[310px] place-items-center max-[760px]:row-start-2 max-[760px]:min-h-[230px]" aria-hidden="true">
          <span className="absolute -z-10 aspect-square w-[88%] max-w-[390px] rotate-[-24deg] scale-y-[.56] rounded-full border border-[color-mix(in_srgb,var(--tech-accent)_22%,transparent)]" /><span className="absolute -z-10 aspect-square w-[72%] max-w-[390px] rotate-[28deg] scale-y-[.58] rounded-full border border-dashed border-[color-mix(in_srgb,var(--tech-accent)_22%,transparent)] opacity-60" />
          <span className="absolute -z-10 aspect-square w-[min(74%,300px)] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--tech-accent)_22%,transparent),transparent_69%)] blur-[10px]" />
          <TechLamp tech={tech} decorative className="!h-[clamp(194px,23vw,276px)] !w-[clamp(160px,19vw,230px)] ![filter:drop-shadow(0_18px_28px_color-mix(in_srgb,var(--tech-accent)_20%,transparent))] [&_.tech-lamp-logo]:!size-[54%] [&_.tech-lamp-logo>svg]:!size-[78%] max-[760px]:!h-[182px] max-[760px]:!w-[150px]" />
          <span className="absolute right-0 bottom-0 flex items-center gap-[7px] font-mono text-[9px] leading-[1.4] tracking-[0.08em] text-text-tertiary max-[760px]:right-[6px]"><Layers3 size={13} /> {tech.category.toUpperCase()}</span>
        </div>
        <div className="absolute right-[clamp(32px,6vw,76px)] bottom-[22px] left-[clamp(32px,6vw,76px)] flex justify-between gap-4 border-t border-border-subtle pt-[14px] font-mono text-[9px] leading-[1.4] tracking-[0.07em] text-text-tertiary uppercase max-[760px]:right-6 max-[760px]:left-6 max-[760px]:text-[8px] max-[420px]:right-5 max-[420px]:left-5 max-[420px]:flex-col max-[420px]:gap-[3px]"><span>ASHOK KUMAR · TOOLBOX NOTES</span><span>{tech.headline}</span></div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-[14px] max-[760px]:grid-cols-1" aria-label={`${tech.label} explanation`}>
        <article className="grain-card relative min-h-[260px] overflow-hidden rounded-[26px] border border-border-default bg-surface-1 p-[clamp(25px,4vw,42px)] max-[760px]:min-h-0">
          <span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-[var(--tech-accent,var(--accent-pink))] uppercase">01 / WHAT IT DOES</span>
          <h2 className="mt-5 mb-3 font-[var(--font-bold)] text-[clamp(24px,3.3vw,38px)] leading-[1.04] tracking-[-0.045em] font-bold text-text-primary">{tech.headline}</h2>
          <p className="m-0 max-w-[58ch] text-[15px] leading-[1.72] text-text-secondary">{tech.purpose}</p>
        </article>
        <article className="tech-practice-card grain-card relative min-h-[260px] overflow-hidden rounded-[26px] border border-border-default bg-surface-1 p-[clamp(25px,4vw,42px)] max-[760px]:min-h-0" id="how-i-use-it">
          <span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-[var(--tech-accent,var(--accent-pink))] uppercase">02 / HOW I USE IT</span>
          <h2 className="mt-5 mb-3 font-[var(--font-bold)] text-[clamp(24px,3.3vw,38px)] leading-[1.04] tracking-[-0.045em] font-bold text-text-primary">In my workflow</h2>
          <p className="m-0 max-w-[58ch] text-[15px] leading-[1.72] text-text-secondary">{tech.practice}</p>
        </article>
      </section>

      {usedIn.length > 0 && <section className="mt-[68px]">
        <div className="flex items-center justify-between gap-5 mb-5 max-[760px]:items-start max-[760px]:flex-col"><div><span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-[var(--tech-accent,var(--accent-pink))] uppercase">03 / PROOF IN PRACTICE</span><h2 className="mt-[9px] mb-0 font-[var(--font-bold)] text-[clamp(26px,3.5vw,42px)] leading-[1.04] tracking-[-0.045em] font-bold text-text-primary">Projects using {tech.short}</h2></div><span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-text-tertiary">{String(usedIn.length).padStart(2, '0')} PROJECT{usedIn.length === 1 ? '' : 'S'}</span></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3">{usedIn.map((project) => <Link className="tech-project-card grain-card flex min-h-[120px] min-w-0 items-center gap-4 rounded-[20px] border border-border-default bg-surface-1 p-[21px] text-text-primary no-underline transition-[transform,border-color] duration-[250ms] hover:-translate-y-[3px] max-[420px]:p-[15px]" key={project.slug} to={`/projects/${project.slug}`}>
          <span className="grid size-10 flex-none place-items-center rounded-full border border-[color-mix(in_srgb,var(--tech-accent)_40%,var(--border-default))] font-mono text-[11px] text-[var(--tech-accent)]">{project.index}</span><span className="grid min-w-0 gap-1.5"><strong className="font-[var(--font-bold)] text-base leading-[1.2] font-semibold">{project.title}</strong><small className="line-clamp-2 overflow-hidden text-xs leading-[1.45] text-text-tertiary">{project.oneLiner}</small></span><ArrowUpRight className="ml-auto flex-none text-[var(--tech-accent)]" size={18} />
        </Link>)}</div>
      </section>}

      <section className="tech-related-tools mt-[68px]">
        <div className="flex items-center justify-between gap-5 mb-5 max-[760px]:items-start max-[760px]:flex-col"><div><span className="font-mono text-[10px] leading-[1.4] tracking-[0.1em] text-[var(--tech-accent,var(--accent-pink))] uppercase">0{usedIn.length ? 4 : 3} / KEEP EXPLORING</span><h2 className="mt-[9px] mb-0 font-[var(--font-bold)] text-[clamp(26px,3.5vw,42px)] leading-[1.04] tracking-[-0.045em] font-bold text-text-primary">More from the toolbox</h2></div><Link className="inline-flex items-center gap-[9px] font-mono text-[11px] leading-[1.4] font-medium text-text-secondary no-underline transition-colors hover:text-[var(--tech-accent,var(--accent-pink))]" to="/#play">View the physics field <ArrowUpRight size={14} /></Link></div>
        <div className="grid grid-cols-4 gap-[10px] max-[760px]:grid-cols-2">{related.map((item) => <Link className="tech-tool-card grain-card flex min-h-[105px] min-w-0 items-center justify-between gap-2 rounded-[18px] border border-border-default bg-surface-1 px-[14px] py-[10px] text-text-primary no-underline transition-[transform,border-color] duration-[250ms] hover:-translate-y-[3px] max-[420px]:gap-[5px] max-[420px]:p-2" key={item.id} to={`/tech/${item.id}`}>
          <TechLamp tech={item} compact decorative className="!h-[70px] !w-[58px] shrink-0 max-[420px]:!h-[58px] max-[420px]:!w-12" /><span className="mr-auto min-w-0 text-[13px] font-medium [overflow-wrap:anywhere] max-[420px]:text-[11px]">{item.label}</span><ArrowUpRight className="flex-none text-text-tertiary" size={14} />
        </Link>)}</div>
      </section>
    </div>
  </div>
}
