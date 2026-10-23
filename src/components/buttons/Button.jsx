import { Link } from 'react-router-dom'

const variants = { primary: 'ref-primary', secondary: 'ref-secondary', tertiary: 'ref-tertiary' }

/** Shared portfolio action. Use kind="primary", "secondary", or "tertiary" across every route. */
export default function Button({ children, to, href, kind = 'primary', className = '', type = 'button', ...props }) {
  const classes = `ref-button ${variants[kind] || variants.primary} ${className}`.trim()
  const isSymbiote = className.includes('symbiote-trigger')
  const content = (
    <>
      {isSymbiote && <span className="symbiote-backplate" aria-hidden="true" />}
      <span className={isSymbiote ? 'symbiote-label' : undefined}>{children}</span>
    </>
  )
  if (to) return <Link className={classes} to={to} {...props}>{content}</Link>
  if (href) return <a className={classes} href={href} {...props}>{content}</a>
  return <button type={type} className={classes} {...props}>{content}</button>
}

