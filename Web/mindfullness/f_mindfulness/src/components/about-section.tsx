import { Heart, Infinity, Target, Zap } from 'lucide-react'

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Approche Holistique',
      desc: "Le bien-être inclut l'énergie, la conscience et l'harmonie intérieure.",
    },
    {
      icon: <Infinity className="w-7 h-7" />,
      title: 'Respect du Rythme',
      desc: 'Chaque élève avance à son propre rythme, selon sa propre sensibilité.',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Autonomie & Pratique',
      desc: 'Des outils concrets pour une application immédiate dans votre vie.',
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: 'Bienveillance',
      desc: "Un accompagnement structuré mais ancré dans le respect de l'autre.",
    },
  ]

  return (
    <section id="a-propos" className="py-24  overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img
                  src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl shadow-lg w-full aspect-square object-cover"
                  alt="Zen"
                />
                <img
                  src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl shadow-lg w-full aspect-[3/4] object-cover"
                  alt="Relaxation"
                />
              </div>
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl shadow-lg w-full aspect-[3/4] object-cover"
                  alt="Meditation course"
                />
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
                  className="rounded-3xl shadow-lg w-full aspect-square object-cover"
                  alt="Stones"
                />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -z-10 -top-20 -left-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">
                Notre Vision
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Une approche globale du bien-être et de l’énergétique
              </h3>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              Le bien-être ne se limite pas au mental ou au corps. Il inclut
              également l’énergie, la conscience et l’harmonie intérieure.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Nos formations associent la{' '}
              <span className="text-indigo-600 font-bold">mindfulness</span>{' '}
              (pleine conscience) à des pratiques énergétiques reconnues, afin
              de favoriser un mieux-être durable, une meilleure gestion du
              stress et un alignement profond.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="feature-card hover-lift reveal"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:from-indigo-600 group-hover:to-indigo-700 group-hover:text-white transition-all">
                    {v.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-snug font-medium">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
