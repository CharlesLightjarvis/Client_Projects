import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Leaf,
  Target,
  Diamond,
  Snowflake,
  ArrowRight,
  Quote,
  Star,
} from 'lucide-react'

const certifications = [
  {
    icon: Sparkles,
    title: 'Master Reiki Practitioner',
    description: 'Advanced Energy Attunement and Usui System lineage.',
  },
  {
    icon: Leaf,
    title: 'Certified Aromatherapist',
    description:
      'Clinical application of essential oil therapy for holistic health.',
  },
  {
    icon: Target,
    title: 'Chakra Specialist',
    description: 'Advanced vibrational alignment and meridian balancing.',
  },
  {
    icon: Diamond,
    title: 'Crystal Healing Expert',
    description: 'Mineral energy work and sacred geometric grid placement.',
  },
]

export const InstructorSection = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20 dark:opacity-10 pointer-events-none">
        <Sparkles className="w-[120px] h-[120px] text-primary" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 dark:opacity-10 pointer-events-none">
        <Star className="w-[80px] h-[80px] text-primary" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 relative group">
            {/* Floating Crystals */}
            <div className="absolute -top-6 -right-6 z-10 animate-bounce">
              <Diamond className="w-10 h-10 text-primary/40" />
            </div>
            <div className="absolute bottom-12 -left-8 z-10 animate-pulse">
              <Sparkles className="w-12 h-12 text-primary/30" />
            </div>

            <div className="relative z-0">
              <div
                className="w-full aspect-[4/5] bg-cover bg-center overflow-hidden border-8 border-background
                           rounded-[60%_40%_70%_30%/40%_50%_60%_70%] 
                           shadow-[0_0_40px_10px_rgba(62,79,126,0.08)]
                           transition-[border-radius] duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQUhCUR-AFN8hJ1nh29dCN1rw1uyOSWk1sAO-4Zr_au-5i1KhAfVEkQC0IZfTHcEkZlZbUOGtVPAUfAFDnDSWGa1dgmG28pf0LSAqwvFnZUtqhr8CBe22yvxxEI2AphK81khkeCpIzdBuqVPJJalkijeP4-nZ1A05t_IOMoIu5_uvbHjPI0uV3N_zCnxmLYcSgYUvwDpo4QYGnFHfAQwyPbWZHFhCC16cCWcZt0lA-oh_N56856sHb-lpa1ecf1rGERwJ3E2UBOkhl")`,
                }}
              />
              <div className="absolute inset-0 rounded-[60%_40%_70%_30%/40%_50%_60%_70%] bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary/60">
                The Visionary
              </h2>
              <h1
                className="text-5xl md:text-7xl font-bold leading-tight 
                             bg-gradient-to-br from-[#3e4f7e] to-[#7b9ec7] 
                             bg-clip-text text-transparent"
              >
                Fabienne <br /> Dizy-Olliveaud
              </h1>
              <p className="text-xl italic text-muted-foreground">
                Energy Healing Practitioner & Holistic Guide
              </p>
            </div>

            {/* Quote Block */}
            <div className="relative py-8 px-10 bg-primary/5 dark:bg-primary/10 rounded-xl border-l-4 border-primary">
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary opacity-20" />
              <p className="text-2xl leading-relaxed">
                "Harmonizing the unseen energies to illuminate your unique path
                to wellness and internal resonance."
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                With over two decades of experience in vibrational medicine,
                Fabienne bridges the gap between ancient wisdom and contemporary
                energetic practices. Her approach is rooted in the belief that
                true healing starts at the subtle level, where every frequency
                tells a story of balance or block.
              </p>
            </div>

            <button className="flex items-center gap-2 group text-primary font-bold tracking-wide">
              <span className="border-b-2 border-primary/30 group-hover:border-primary transition-all">
                Explore My Journey
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
