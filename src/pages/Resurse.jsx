import ResourcesHero from '../components/ResourcesHero/ResourcesHero'
// import EbooksSection from '../components/EbooksSection/EbooksSection'
import ResourcesBlog from '../components/ResourcesBlog/ResourcesBlog'
import NewsletterSection from '../components/NewsletterSection/NewsletterSection'
import Roadmap from '../components/Roadmap/Roadmap'
import './Resurse.scss'

export default function Resurse() {
  return (
    <main className="dr-resurse-page">
      <ResourcesHero />
      {/* Ebook section paused until the PDFs are ready. */}
      {/* <EbooksSection /> */}
      <ResourcesBlog />
      <Roadmap />
      <NewsletterSection />
    </main>
  )
}
