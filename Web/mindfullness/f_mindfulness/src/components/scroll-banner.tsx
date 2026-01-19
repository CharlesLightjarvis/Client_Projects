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
    { label: 'Mindfulness', icon: <Brain size={20} /> },
    { label: 'Lithothérapie', icon: <Gem size={20} /> },
    { label: 'Équilibrage Énergétique', icon: <Zap size={20} /> },
    { label: 'Radiesthésie', icon: <Compass size={20} /> },
    { label: 'Chakras', icon: <Activity size={20} /> },
    { label: 'Bien-être Holistique', icon: <Heart size={20} /> },
    { label: 'Pleine Conscience', icon: <Sparkles size={20} /> },
  ]
  const scrollItems = [...items, ...items, ...items]

  return (
    <div className="py-10  border-y  overflow-hidden relative">
      <div className="flex animate-infinite-scroll whitespace-nowrap">
        {scrollItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 mx-12 group cursor-default"
          >
            <div className="text-indigo-600 transform group-hover:scale-125 transition-transform duration-300">
              {item.icon}
            </div>
            <span className="text-2xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
