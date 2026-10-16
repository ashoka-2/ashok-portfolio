import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/buttons/Button.jsx'
import { profile } from '../../utils/profile.js'
import { techStack } from '../../utils/tech.js'
import TechLamp from '../../components/tech/TechLamp.jsx'

export function AboutPage() {
  return <div className="info-page section-wrap"><span className="section-kicker">A BIT ABOUT ME</span><div className="info-title"><h1>Still learning.<br /><em>Always building.</em></h1><img src="/images/ashok-character.png" alt="Illustrated portrait of Ashok Kumar" /></div><div className="info-columns"><p>{profile.statement}</p><div><h2>How I work</h2><p>{profile.philosophy}</p><h2>What I’m curious about</h2><ul>{profile.focusAreas.slice(0, 5).map((area) => <li key={area}>{area}</li>)}</ul><p>{profile.education.degree}<br />{profile.education.institution} · {profile.education.period}</p><Button to="/contact" kind="secondary">Get in touch</Button></div></div><div className="about-tech"><h2>A few tools I reach for</h2><div className="emblem-grid">{techStack.slice(0, 9).map((tech) => <TechLamp key={tech.id} tech={tech} />)}</div></div></div>
}

export function ContactPage() {
  return <div className="info-page contact-page section-wrap"><span className="section-kicker">OPEN TO A GOOD CONVERSATION</span><h1>Let’s talk<br /><em>about what’s next.</em></h1><p>Projects, opportunities, collaborations—or a question about something I’ve built. My inbox is open.</p><a className="contact-email" href={`mailto:${profile.contact.email}`}><Mail />{profile.contact.email}<ArrowUpRight /></a><Link className="back-link" to="/"><ArrowLeft size={15} /> Back home</Link></div>
}

export function NotFoundPage() {
  return <div className="info-page not-found section-wrap"><span className="section-kicker">404 / NOT QUITE HERE</span><h1>Looks like<br /><em>we took a wrong turn.</em></h1><Button to="/" kind="secondary">Back to the homepage</Button></div>
}
