import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import CursorGlow from './components/CursorGlow/CursorGlow'
import Footer from './components/Footer/Footer'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { LanguageProvider } from './context/LanguageContext'
import './App.scss'

const AnimatedBackground = lazy(() =>
  import('./components/AnimatedBackground/AnimatedBackground').catch(() => ({ default: () => null })),
)
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'))
const Resurse = lazy(() => import('./pages/Resurse'))
const Contact = lazy(() => import('./pages/Contact'))
const Consultanta = lazy(() => import('./pages/Consultanta'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

function BackgroundFallback({ isHidden }) {
  return (
    <div className={`dr-site-bg${isHidden ? ' is-hidden' : ''}`} aria-hidden="true">
      <div className="dr-site-bg-layer dr-site-bg-layer-one" />
      <div className="dr-site-bg-layer dr-site-bg-layer-two" />
      <div className="dr-site-bg-grid" />
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

function DeferredAnimatedBackground({ onReady }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const smallViewport = window.matchMedia('(max-width: 760px)').matches

    if (prefersReducedMotion || coarsePointer || smallViewport || !supportsWebGL()) {
      return undefined
    }

    const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1800))
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout
    const idleId = scheduleIdle(() => setReady(true), { timeout: 3000 })

    return () => cancelIdle(idleId)
  }, [])

  if (!ready) return null

  return (
    <Suspense fallback={null}>
      <AnimatedBackground onReady={onReady} />
    </Suspense>
  )
}

function App() {
  const [hasShaderBackground, setHasShaderBackground] = useState(false)
  const markShaderBackgroundReady = useCallback(() => {
    setHasShaderBackground(true)
  }, [])

  return (
    <LanguageProvider>
      <ScrollToTop />
      <BackgroundFallback isHidden={hasShaderBackground} />
      <DeferredAnimatedBackground onReady={markShaderBackgroundReady} />

      <div className="app-content">
        <CursorGlow />
        <Navbar />

        <div className="app-page">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicii" element={<Services />} />
              <Route path="/portofoliu" element={<Portfolio />} />
              <Route path="/portofoliu/:slug" element={<CaseStudyDetail />} />
              <Route path="/resurse" element={<Resurse />} />
              <Route path="/resurse/:slug" element={<BlogPost />} />
              <Route path="/blog" element={<Navigate to="/resurse" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/consultanta" element={<Consultanta />} />
              <Route path="/politica-de-confidentialitate" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Footer />
        </div>
      </div>

      <LanguageSwitcher />
      <ScrollToTopButton />
      <CookieConsent />
    </LanguageProvider>
  )
}

export default App
