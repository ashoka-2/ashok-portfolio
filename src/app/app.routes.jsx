import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const HomePage = lazy(() => import('../features/home/HomePage.jsx'))
const ProjectsPage = lazy(() => import('../features/projects/ProjectsPage.jsx'))
const ProjectPage = lazy(() => import('../features/projects/ProjectPage.jsx'))
const TechPage = lazy(() => import('../features/tech/TechPage.jsx'))
const AboutPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.ContactPage })))
const NotFoundPage = lazy(() => import('../features/home/InfoPages.jsx').then((module) => ({ default: module.NotFoundPage })))

export default function AppRoutes() {
  return <Suspense fallback={<div className="route-loader" role="status">Loading the next page…</div>}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:slug" element={<ProjectPage />} />
    <Route path="/tech/:slug" element={<TechPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>
}
