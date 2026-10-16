import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import lampSvg from './tech-emblem.svg?raw'

function hueOf(hex) {
  const value = hex.replace('#', '')
  const rgb = value.length === 3 ? value.split('').map((part) => parseInt(part + part, 16) / 255) : [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255)
  const [r, g, b] = rgb
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
  if (!delta) return 0
  const hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return ((hue * 60) + 360) % 360
}

export default function TechLamp({ tech, compact = false }) {
  const color = tech.color || '#62A8E8'
  const hueRotation = hueOf(color) - 205
  return <Link className={`tech-lamp${compact ? ' compact' : ''}`} style={{ '--lamp-color': color, '--lamp-hue': `${hueRotation}deg` }} to={`/tech/${tech.id}`} aria-label={`Learn more about ${tech.label}`} title={`${tech.label} — open details`}>
    <span className="tech-lamp-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: lampSvg }} />
    <span className="tech-lamp-logo"><Icon icon={tech.icon} color={color} aria-hidden="true" /><span className="lamp-fallback" aria-hidden="true">{tech.short.slice(0, 2)}</span></span>
    {!compact && <span className="tech-lamp-label">{tech.short}</span>}
  </Link>
}
