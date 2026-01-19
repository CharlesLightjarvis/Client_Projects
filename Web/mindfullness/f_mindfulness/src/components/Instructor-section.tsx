import React from 'react'
import { Award, Heart, Sparkles, MapPin, Quote } from 'lucide-react'

export const InstructorSection: React.FC = () => {
  const certifications = [
    {
      year: '2016',
      title: 'Reiki Usui 1er Degré',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      year: '2017',
      title: 'Aromathérapie Holistique',
      color: 'bg-[#eef5f8] text-[#7fa7b9]',
    },
    {
      year: '2021',
      title: 'Radiesthésie & Géobiologie',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      year: '2023',
      title: 'Maître Praticienne Lahochi',
      color: 'bg-[#eef5f8] text-[#7fa7b9]',
    },
  ]

  return (
    <section id="fondatrice" className="py-32  overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          {/* Bloc Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                alt="Fabienne Dizy-Olliveaud"
                className="w-full aspect-[4/5] object-cover hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent"></div>

              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#a2c4d3]" />
                  <span className="font-bold text-sm tracking-wide">
                    Lintot, Normandie & Monde
                  </span>
                </div>
              </div>
            </div>

            {/* Éléments flottants décoratifs */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-indigo-600/5 blur-3xl -z-10 animate-pulse"></div>
            <div
              className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#a2c4d3]/20 blur-3xl -z-10 animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>

            <div className="absolute top-10 -right-8 bg-white p-5 rounded-3xl shadow-2xl z-20 animate-bounce-slow">
              <Sparkles className="text-indigo-600" size={28} />
            </div>
          </div>

          {/* Contenu Texte */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-[#a2c4d3]"></div>
                <span className="text-[10px] font-black text-[#7fa7b9] uppercase tracking-[0.3em]">
                  LA FONDATRICE
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                Fabienne <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-[#a2c4d3]">
                  Dizy-Olliveaud
                </span>
              </h2>

              <div className="relative pl-10 border-l-4 border-[#a2c4d3]/30">
                <Quote
                  className="absolute top-0 left-2 text-[#a2c4d3]/20"
                  size={40}
                />
                <p className="text-2xl font-medium text-slate-700 italic leading-relaxed">
                  "Je ne soigne pas, je vous aide à vous souvenir que vous êtes
                  déjà entier(e)."
                </p>
              </div>
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium max-w-2xl">
              <p>
                Praticienne holistique et énergéticienne intuitive, j'accompagne
                depuis 2014 les âmes en quête de sens, de lumière et de
                transformation intérieure.
              </p>
              <p>
                Mon parcours a été marqué par une profonde reconnexion à
                l'essentiel, ouvrant la voie à une mission de vie :{' '}
                <strong>transmettre la paix et la clarté.</strong>
              </p>
            </div>

            {/* Grille de certifications mieux intégrée */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cert.color}`}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">
                      {cert.year}
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      {cert.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <button className="px-10 py-5 rounded-2xl text-white font-black text-lg transition-all shadow-xl hover:shadow-indigo-200 bg-indigo-600 hover:scale-105 active:scale-95">
                Mon parcours complet
              </button>
              <button className="px-8 py-5 rounded-2xl font-black text-lg transition-all border-2 border-[#a2c4d3] text-[#7fa7b9] hover:bg-[#eef5f8] flex items-center gap-2">
                <Heart size={20} />
                Témoignages
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
