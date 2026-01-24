import { Heart, Infinity, Target, Zap } from 'lucide-react'

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Approche Holistique',
      desc: 'Le bien-être intègre le corps, l’esprit, l’énergie et la conscience.',
    },
    {
      icon: Infinity,
      title: 'Respect du Rythme',
      desc: 'Chaque parcours est unique, progressif et profondément personnel.',
    },
    {
      icon: Zap,
      title: 'Autonomie & Pratique',
      desc: 'Des outils concrets pour une intégration réelle dans le quotidien.',
    },
    {
      icon: Heart,
      title: 'Bienveillance',
      desc: 'Un cadre structuré, respectueux et profondément humain.',
    },
  ]

  return (
    <section id="a-propos" className="py-11 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER CENTRÉ */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Notre vision
          </p>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Une vision <span className="text-indigo-500 italic">moderne</span>,
            consciente et profondément humaine
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Une approche du bien-être qui dépasse les méthodes superficielles
            pour reconnecter l’individu à son équilibre intérieur.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* IMAGES GRID */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img
                  src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl w-full aspect-square object-cover shadow-lg"
                  alt="Zen"
                />
                <img
                  src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl w-full aspect-[3/4] object-cover shadow-lg"
                  alt="Relaxation"
                />
              </div>

              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=600&auto=format&fit=crop"
                  className="rounded-3xl w-full aspect-[3/4] object-cover shadow-lg"
                  alt="Meditation course"
                />
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
                  className="rounded-3xl w-full aspect-square object-cover shadow-lg"
                  alt="Stones"
                />
              </div>
            </div>

            {/* Subtle glow */}
            <div className="absolute -z-10 -bottom-16 -left-16 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          </div>

          {/* TEXT + VALUES */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6 max-w-xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nos formations associent la{' '}
                <span className="text-primary font-semibold">
                  pleine conscience
                </span>
                , les pratiques énergétiques et l’autonomie personnelle pour un
                cheminement durable, aligné et profondément transformateur.
              </p>
            </div>

            {/* VALUES */}
            <div className="pt-10 border-t border-border space-y-6 max-w-xl">
              {values.map((v, i) => {
                const Icon = v.icon
                return (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="mt-1 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {v.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
