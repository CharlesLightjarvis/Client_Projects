import React from 'react'

const galleryItems = [
  {
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    title: 'Yoga Vinyasa',
    tag: 'Pratique',
  },
  {
    img: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=800&auto=format&fit=crop',
    title: 'Méditation Zen',
    tag: 'Esprit',
  },
  {
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    title: 'Lithothérapie',
    tag: 'Énergie',
  },
  {
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    title: 'Pleine Conscience',
    tag: 'Focus',
  },
  {
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    title: 'Rééquilibrage',
    tag: 'Chakras',
  },
  {
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    title: 'Sérénité',
    tag: 'Bien-être',
  },
]

export const StudioGallery: React.FC = () => {
  return (
    <section className="py-10 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Plongez dans l'univers du{' '}
              <span className="text-indigo-500 italic">studio</span>
            </h2>
          </div>
          <p className=" text-lg font-medium max-w-sm text-center lg:text-right">
            Une expérience pédagogique pensée pour l'éveil des sens et la clarté
            de l'esprit.
          </p>
        </div>

        {/* 3D PERSPECTIVE GRID */}
        <div className="perspective-container ">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 transform-3d-grid">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-800 border border-white/5 shadow-2xl transition-all duration-700 hover:scale-110 hover:-translate-y-4 hover:z-20 hover:rotate-0"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'float 6s ease-in-out infinite',
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                    {item.tag}
                  </span>
                  <h4 className="text-xl font-black text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </h4>
                </div>

                {/* Glass Glint Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        
        .transform-3d-grid {
          transform: rotateX(25deg) rotateY(-10deg) rotateZ(5deg);
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .transform-3d-grid:hover {
          transform: rotateX(10deg) rotateY(-5deg) rotateZ(2deg);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .transform-3d-grid {
            transform: rotateX(15deg) rotateY(-5deg) rotateZ(2deg);
          }
        }
      `}</style>
    </section>
  )
}
