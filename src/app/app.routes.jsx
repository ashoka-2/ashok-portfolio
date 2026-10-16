import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PageMotion from '../components/layout/PageMotion.jsx'

const HomePage = lazy(() => import('../features/home/HomePage.jsx'))
const ProjectsPage = lazy(() => import('../features/projects/ProjectsPage.jsx'))
const ProjectPage = lazy(() => import('../features/projects/ProjectPage.jsx'))
const TechPage = lazy(() => import('../features/tech/TechPage.jsx'))
const AboutPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.ContactPage })))
const NotFoundPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.NotFoundPage })))

export default function AppRoutes() {
  return <Suspense fallback={<div className="route-loader" role="status">Loading the next page…</div>}><Routes>
    <Route path="/" element={<PageMotion><HomePage /></PageMotion>} />
    <Route path="/projects" element={<PageMotion><ProjectsPage /></PageMotion>} />
    <Route path="/projects/:slug" element={<PageMotion><ProjectPage /></PageMotion>} />
    <Route path="/tech/:slug" element={<PageMotion><TechPage /></PageMotion>} />
    <Route path="/about" element={<PageMotion><AboutPage /></PageMotion>} />
    <Route path="/contact" element={<PageMotion><ContactPage /></PageMotion>} />
    <Route path="*" element={<PageMotion><NotFoundPage /></PageMotion>} />
  </Routes></Suspense>
}
