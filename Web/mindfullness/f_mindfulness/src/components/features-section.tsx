import { CheckCircle, Clock, Home, Lock } from 'lucide-react'
import React from 'react'

export const FeaturesSection: React.FC = () => {
  const targets = [
    "Personnes en quête de bien-être, d'équilibre et de sens",
    'Passionnés de chakras, radiesthésie, pendule et minéraux',
    "Souhaitant apprendre à travailler avec l'énergie",
    "Personnes désireuses d'un changement professionnel",
    'Professionnels du bien-être souhaitant approfondir',
  ]

  const benefits = [
    {
      icon: <Clock />,
      title: 'À votre rythme',
      desc: 'Plus de pression, étudiez quand vous voulez.',
    },
    {
      icon: <Home />,
      title: 'Depuis chez vous',
      desc: 'Disponible sur ordinateur, tablette et mobile.',
    },
    {
      icon: <Lock />,
      title: 'Accès illimité',
      desc: 'Reprenez vos cours aussi souvent que nécessaire.',
    },
  ]

  return (
    <section id="public" className="py-24  overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96  rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96  rounded-full blur-[120px] opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-indigo-300 font-bold uppercase tracking-widest text-sm mb-4">
              Profils & Public
            </h2>
            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              À qui s'adressent nos formations ?
            </h3>
            <p className="text-indigo-100/80 mb-10 leading-relaxed text-lg">
              Nos formations en mindfulness et bien-être énergétique s'adaptent
              à votre parcours, quel qu'il soit. Aucune capacité particulière
              n’est requise.
            </p>

            <ul className="space-y-4">
              {targets.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover-lift"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <CheckCircle size={18} />
                  </div>
                  <span className="text-lg text-indigo-50 font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-slate-900 shadow-3xl">
            <h3 className="text-3xl font-black mb-10 text-center">
              Apprendre à son rythme, où que vous soyez
            </h3>

            <div className="space-y-10">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    {/* Fix: cast to React.ReactElement<any> to resolve 'size' property error during cloning */}
                    {React.cloneElement(b.icon as React.ReactElement<any>, {
                      size: 32,
                    })}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{b.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Notre Objectif
              </p>
              <p className="text-lg font-medium text-slate-700 italic leading-relaxed">
                "Rendre les pratiques énergétiques et la mindfulness
                accessibles, tout en conservant une approche sérieuse,
                structurée et de qualité."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
