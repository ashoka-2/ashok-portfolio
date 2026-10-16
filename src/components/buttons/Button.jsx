import { Link } from 'react-router-dom'

export default function Button({ children, to, href, kind = 'primary', className = '', ...props }) {
  const content = <span>{children}</span>
  const classes = `button button-${kind} ${className}`
  if (to) return <Link className={classes} to={to} {...props}>{content}</Link>
  if (href) return <a className={classes} href={href} {...props}>{content}</a>
  return <button className={classes} {...props}>{content}</button>
}
