import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PageMotion from '../components/layout/PageMotion.jsx'

const HomePage = lazy(() => import('../features/home/HomePage.jsx'))
const ProjectsPage = lazy(() => import('../features/projects/ProjectsPage.jsx'))
const ProjectPage = lazy(() => import('../features/projects/ProjectPage.jsx'))
const TechPage = lazy(() => import('../features/tech/TechPage.jsx'))
const AboutPage = lazy(() => import('../features/home/InfoPages.jsx').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('../features/home/InfoPages.jsx').then((m) => ({ default: m.ContactPage })))
const NotFoundPage = lazy(() => import('../features/home/InfoPages.jsx').then((m) => ({ default: m.NotFoundPage })))

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-[var(--text-tertiary)]" role="status">LOADING…</div>}>
      <Routes>
        <Route path="/" element={<PageMotion><HomePage /></PageMotion>} />
        {/* Support both /work and /projects */}
        <Route path="/work" element={<PageMotion><ProjectsPage /></PageMotion>} />
        <Route path="/projects" element={<PageMotion><ProjectsPage /></PageMotion>} />
        <Route path="/work/:slug" element={<PageMotion><ProjectPage /></PageMotion>} />
        <Route path="/projects/:slug" element={<PageMotion><ProjectPage /></PageMotion>} />
        <Route path="/tech/:slug" element={<PageMotion><TechPage /></PageMotion>} />
        <Route path="/about" element={<PageMotion><AboutPage /></PageMotion>} />
        <Route path="/contact" element={<PageMotion><ContactPage /></PageMotion>} />
        <Route path="*" element={<PageMotion><NotFoundPage /></PageMotion>} />
      </Routes>
    </Suspense>
  )
}
