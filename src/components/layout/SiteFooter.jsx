import { ArrowUpRight, GitBranch, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../../utils/profile.js'

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><Link className="wordmark" to="/"><span className="wordmark-mark">A<span>.</span></span><span>ASHOK<br /><small>DEVELOPER & DESIGNER</small></span></Link><p>Thoughtful software, with a little<br />extra feeling in the details.</p><div className="footer-socials"><a href={profile.contact.github} target="_blank" rel="noreferrer"><GitBranch size={17} /> GitHub <ArrowUpRight size={13} /></a><a href={`mailto:${profile.contact.email}`}><Mail size={17} /> Email <ArrowUpRight size={13} /></a></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Ashok Kumar · Kerala, India</span><a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>BACK TO TOP ↑</a></div>
  </footer>
}
