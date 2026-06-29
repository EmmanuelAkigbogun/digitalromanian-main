import { lazy, Suspense, useEffect, useState } from 'react'
import Hero from '../components/Hero/Hero'
import NewsletterSection from '../components/NewsletterSection/NewsletterSection'

const LogosBar = lazy(() => import('../components/LogosBar/LogosBar'))
const ServicesShowcase = lazy(() => import('../components/ServicesShowcase/ServicesShowcase'))
const Roadmap = lazy(() => import('../components/Roadmap/Roadmap'))
const TemplatesShowcase = lazy(() => import('../components/TemplatesShowcase/TemplatesShowcase'))
const CaseStudiesShowcase = lazy(() => import('../components/CaseStudiesShowcase/CaseStudiesShowcase'))
const BlogSection = lazy(() => import('../components/BlogSection/BlogSection'))

function DeferredHomeSections() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 900))
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout
    const idleId = scheduleIdle(() => setReady(true), { timeout: 1600 })

    return () => cancelIdle(idleId)
  }, [])

  if (!ready) return null

  return (
    <Suspense fallback={null}>
      <LogosBar />
      <ServicesShowcase />
      <Roadmap />
      <TemplatesShowcase limit={6} />
      <CaseStudiesShowcase />
      <BlogSection />
    </Suspense>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <DeferredHomeSections />
      <NewsletterSection />
    </>
  )
}

export default Home
