import {
  Brain,
  Compass,
  Gem,
  Heart,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react'

export const HeroBanner: React.FC = () => {
  const items = [
    { label: 'Mindfulness', icon: Brain },
    { label: 'Lithothérapie', icon: Gem },
    { label: 'Équilibrage Énergétique', icon: Zap },
    { label: 'Radiesthésie', icon: Compass },
    { label: 'Chakras', icon: Activity },
    { label: 'Bien-être Holistique', icon: Heart },
    { label: 'Pleine Conscience', icon: Sparkles },
  ]

  const scrollItems = [...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-border py-10 bg-background">
      <div className="flex whitespace-nowrap animate-infinite-scroll">
        {scrollItems.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="flex items-center gap-6 mx-12 group cursor-default"
            >
              <div className="text-primary transition-transform duration-300 group-hover:scale-125">
                <Icon size={20} />
              </div>

              <span className="text-2xl font-black uppercase tracking-tighter text-foreground transition-colors group-hover:text-primary">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
