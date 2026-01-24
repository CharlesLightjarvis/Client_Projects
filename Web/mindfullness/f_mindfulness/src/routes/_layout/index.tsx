import { AboutSection } from '@/components/about-section'
import { FaqsSection } from '@/components/faq-tabs'
import { FeaturesSection } from '@/components/features-section'
import { FinalCTA } from '@/components/final-cta'
import { FormationsGrid } from '@/components/formations-grid'
import { Hero } from '@/components/hero'
import { HeroBanner } from '@/components/scroll-banner'
import { StudioGallery } from '@/components/studio-gallery'
import { Testimonials } from '@/components/testimonials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HeroBanner />
      <AboutSection />
      {/* <HowItWorks /> */}
      {/* <Stats /> */}
      <StudioGallery />
      <FormationsGrid />
      <FeaturesSection />
      <Testimonials />
      <FaqsSection />
      <FinalCTA />
    </div>
  )
}
