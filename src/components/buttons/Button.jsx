import { useId, useMemo } from 'react'
import { Link } from 'react-router-dom'
import mainArtwork from './mainbtn.svg?raw'
import linkArtwork from './link.svg?raw'

export default function Button({ children, to, href, kind = 'primary', className = '', ...props }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const svg = useMemo(() => (kind === 'primary' ? mainArtwork : linkArtwork)
    .replace(/\bid="([^"]+)"/g, (_, value) => `id="${value}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, value) => `url(#${value}-${id})`)
    .replace(/href="#([^"]+)"/g, (_, value) => `href="#${value}-${id}"`), [kind, id])
  const content = <><span className="button-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} /><span className="button-label">{children}</span></>
  const classes = `button button-${kind} ${className}`
  if (to) return <Link className={classes} to={to} {...props}>{content}</Link>
  if (href) return <a className={classes} href={href} {...props}>{content}</a>
  return <button type="button" className={classes} {...props}>{content}</button>
}
