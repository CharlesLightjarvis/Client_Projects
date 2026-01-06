import { HeroSection } from '@/components/hero-section'
import { Pricing } from '@/components/pricing'
import { Testimonials } from '@/components/testimonials'
import { createFileRoute } from '@tanstack/react-router'
import { Pencil, Sparkles, Star } from 'lucide-react'

export const Route = createFileRoute('/_layout/')({
  component: App,
})

interface PricingTier {
  name: string
  icon: React.ReactNode
  price: number
  description: string
  features: string[]
  popular?: boolean
  color: string
}

const sampleTiers: PricingTier[] = [
  {
    name: 'Creator',
    icon: <Pencil className="w-6 h-6" />,
    price: 29,
    description: 'Perfect for short video beginners',
    color: 'amber',
    features: [
      '60-second Video Export',
      '10 Trending Templates',
      'Auto Text-to-Speech',
      'Basic Transitions',
    ],
  },
  {
    name: 'Influencer',
    icon: <Star className="w-6 h-6" />,
    price: 79,
    description: 'For serious content creators',
    color: 'blue',
    features: [
      '3-minute Video Export',
      'Voice Effects & Filters',
      'Trending Sound Library',
      'Auto Captions & Subtitles',
    ],
    popular: true,
  },
  {
    name: 'Pro Studio',
    icon: <Sparkles className="w-6 h-6" />,
    price: 149,
    description: 'For viral content masters',
    color: 'purple',
    features: [
      'Multi-clip Editing',
      'Green Screen Effects',
      'Viral Sound Detection',
      'Engagement Analytics',
    ],
  },
]

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* <Features /> */}
      {/* <HowItWorks /> */}
      {/* <Stats /> */}
      <Testimonials />
      <Pricing tiers={sampleTiers} />
      {/* <FinalCTA /> */}
    </div>
  )
}
