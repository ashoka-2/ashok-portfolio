import { Link } from 'react-router-dom'
import lampSvg from './tech-emblem.svg?raw'
import TechMark from './TechMark.jsx'

function hueOf(hex) {
  const value = hex.replace('#', '')
  const rgb = value.length === 3 ? value.split('').map((part) => parseInt(part + part, 16) / 255) : [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255)
  const [r, g, b] = rgb
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
  if (!delta) return 0
  const hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return ((hue * 60) + 360) % 360
}

export default function TechLamp({ tech, compact = false, decorative = false, className = '' }) {
  const color = tech.color || '#62A8E8'
  const hueRotation = hueOf(color) - 205
  const Lamp = decorative ? 'span' : Link
  const linkProps = decorative ? {} : { to: `/tech/${tech.id}`, 'aria-label': `Learn more about ${tech.label}`, title: `${tech.label} — open details` }
  return <Lamp className={`tech-lamp group relative isolate inline-grid h-[112px] w-[92px] flex-[0_0_auto] place-items-center text-text-primary no-underline transition-transform duration-[250ms] ease-[cubic-bezier(.2,0,0,1)] hover:-translate-y-1 hover:scale-[1.04]${compact ? ' compact h-[98px] w-[82px]' : ''}${className ? ` ${className}` : ''}`} style={{ '--lamp-color': color, '--lamp-hue': `${hueRotation}deg` }} {...linkProps}>
    <span className="tech-lamp-art pointer-events-none absolute inset-0 z-0 block size-full opacity-[0.92] transition-[filter,opacity] duration-300 ease-[ease]" aria-hidden="true" dangerouslySetInnerHTML={{ __html: lampSvg }} />
    <span className={`tech-lamp-logo absolute left-1/2 top-[48%] z-[2] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center bg-transparent${compact ? ' size-[42px]' : ''}`}><TechMark tech={tech} className={`block overflow-visible ${compact ? 'size-[34px]' : 'size-10'}`} /></span>
    {!compact && <span className="tech-lamp-label absolute bottom-1 z-[2] w-full text-center font-mono text-[8px] leading-[1.2] text-text-primary [text-shadow:0_1px_5px_rgba(0,0,0,0.65)]">{tech.short}</span>}
  </Lamp>
}
