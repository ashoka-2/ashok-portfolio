import { Link } from 'react-router-dom'

const variants = { primary: 'ref-primary', secondary: 'ref-secondary', tertiary: 'ref-tertiary' }

/** Shared portfolio action. Use kind="primary", "secondary", or "tertiary" across every route. */
export default function Button({ children, to, href, kind = 'primary', className = '', type = 'button', ...props }) {
  const classes = `ref-button ${variants[kind] || variants.primary} ${className}`.trim()
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>
  if (href) return <a className={classes} href={href} {...props}>{children}</a>
  return <button type={type} className={classes} {...props}>{children}</button>
}
