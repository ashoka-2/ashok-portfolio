import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { siteConfig } from '../../utils/site.js'
import Button from '../buttons/Button.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header">
    <div className="nav-wrap">
      <Link className="wordmark" to="/" onClick={close}><span className="wordmark-mark">A<span>.</span></span><span>ASHOK<br /><small>DEVELOPER & DESIGNER</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {siteConfig.navLinks.map((item) => <NavLink key={item.href} to={item.href} end={item.href === '/'}>{item.label}</NavLink>)}
      </nav>
      <ThemeToggle />
      <Button kind="link" to="/contact" className="nav-contact">Let’s talk <ArrowUpRight size={14} /></Button>
      <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">
      {siteConfig.navLinks.map((item) => <NavLink key={item.href} to={item.href} end={item.href === '/'} onClick={close}><span>{item.index}</span>{item.label}<ArrowUpRight size={17} /></NavLink>)}
      <ThemeToggle className="mobile-theme-toggle" />
      <a className="mobile-mail" href={`mailto:${siteConfig.socials[1].href.replace('mailto:', '')}`} onClick={close}>Start a conversation ↗</a>
    </nav>}
  </header>
}
