import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveRight, Gem } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedTooltip } from './animated-tooltip'
import { useNavigate } from '@tanstack/react-router'

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const navigate = useNavigate()
  const titles = useMemo(
    () => ['Équilibre', 'Bien-être', 'Harmonie', 'Prospérité', 'Plénitude'],
    [],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2500)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  const people = [
    {
      id: 1,
      name: 'John Doe',
      designation: 'Software Engineer',
      image:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
    },
    {
      id: 2,
      name: 'Robert Johnson',
      designation: 'Product Manager',
      image:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 3,
      name: 'Jane Smith',
      designation: 'Data Scientist',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 4,
      name: 'Emily Davis',
      designation: 'UX Designer',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 5,
      name: 'Tyler Durden',
      designation: 'Soap Developer',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
    },
    {
      id: 6,
      name: 'Dora',
      designation: 'The Explorer',
      image:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80',
    },
  ]

  return (
    <div className="relative">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-8 px-6 lg:px-12 xl:px-20 overflow-hidden -mt-20">
        {/* Background Image - extends behind header */}
        <div className="absolute inset-0 top-0 -z-10">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMktJfcKGoET94DnMa_iA7tOBhh3hfnwHTvDpp09QfTEUK_fch7kBKQ47lXEETxydg9csLinFjWN_06r79hER_dT-yTZJ5qEmwu1J7eSAuT7sL7xrj1y_1X9uBhM9wn6_z9YS5_I4z17Lf2EmJlVb_WA_22-gx8b56zkG1RaSZkoY5g5_5N-qqcQqXP51-g99whU0CfHS-snP_n2GWagMAsM6C55u7AvgNotI7XH4Bcijeu-2J8Qv77avSfpePPjlpBVuKjRNfr7mH"
            alt="Méditation et chakras"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for premium look */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-slate-900/50 to-slate-900/70" />
        </div>

        {/* Centered Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col gap-6 sm:gap-8 text-center max-w-4xl"
        >
          {/* Badge */}
          <div className="self-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
              <Gem size={12} className="shrink-0" />
              <span className="text-center">
                Nouveauté : Formation Lithothérapie
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
              <span className="block">Votre énergie la clé</span>
              <span className="block">
                de votre{' '}
                <span className="relative inline-block h-[1.15em] align-bottom">
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-black italic whitespace-nowrap"
                      initial={{ opacity: 0, y: 50 }}
                      animate={
                        titleNumber === index
                          ? { y: 0, opacity: 1 }
                          : { y: titleNumber > index ? -50 : 50, opacity: 0 }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 80,
                        damping: 12,
                      }}
                    >
                      {title}
                    </motion.span>
                  ))}
                  <span className="invisible font-black italic">Plénitude</span>
                </span>
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md px-2 sm:px-0">
              Découvrez le pouvoir vibratoire des pierres et maîtrisez les soins
              énergétiques pour harmoniser votre quotidien.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center">
            <Button
              size="lg"
              className="gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-xl w-full sm:w-auto"
              onClick={() => navigate({ to: '/formations' })}
            >
              <span>Découvrir nos formations</span>
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <AnimatedTooltip items={people} />
            <div className="text-sm font-semibold text-white/80">
              Rejoignez{' '}
              <span className="text-cyan-300 font-black text-base">1,500+</span>{' '}
              <br />
              étudiants passionnés
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export { Hero }
