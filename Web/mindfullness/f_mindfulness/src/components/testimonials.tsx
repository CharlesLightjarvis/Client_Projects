import { motion } from 'motion/react'
import { TestimonialsColumn } from './testimonials-column'

const testimonials = [
  {
    text: 'La formation en lithothérapie a transformé ma relation avec les pierres. Je comprends maintenant comment les utiliser au quotidien pour équilibrer mes chakras.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    name: 'Marie Laurent',
    role: 'Praticienne Reiki',
  },
  {
    text: "Les techniques de mindfulness m'ont permis de gérer mon stress de manière efficace. Je dors mieux et je me sens plus connectée à moi-même.",
    image:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
    name: 'Sophie Martin',
    role: 'Enseignante',
  },
  {
    text: "La formation sur les chakras et l'équilibre énergétique est complète et bien structurée. J'ai pu intégrer ces pratiques dans ma vie professionnelle.",
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    name: 'Thomas Dubois',
    role: 'Ostéopathe',
  },
  {
    text: "Grâce à cette plateforme, j'ai découvert la radiesthésie et développé mon intuition. Les supports pédagogiques sont excellents.",
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    name: 'Claire Renard',
    role: 'Coach de vie',
  },
  {
    text: "L'approche holistique des formations m'a permis d'approfondir ma pratique de la méditation. Les exercices pratiques sont très bénéfiques.",
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    name: 'Pierre Leroy',
    role: 'Consultant',
  },
  {
    text: "La communauté d'apprenants est très bienveillante. J'ai pu échanger avec des passionnés et progresser ensemble dans mon parcours.",
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
    name: 'Julie Moreau',
    role: 'Thérapeute',
  },
  {
    text: "Les formations sont accessibles à vie, ce qui me permet de revenir sur les concepts quand j'en ai besoin. Excellent rapport qualité-prix.",
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100&h=100&fit=crop&crop=face',
    name: 'Nicolas Bernard',
    role: 'Entrepreneur',
  },
  {
    text: "J'ai appris à travailler avec l'énergie et les minéraux de manière professionnelle. Cette formation a changé ma carrière.",
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop&crop=face',
    name: 'Isabelle Petit',
    role: 'Guérisseuse',
  },
  {
    text: "Le support technique et pédagogique est réactif et efficace. Je recommande vivement ces formations à tous ceux qui s'intéressent au bien-être.",
    image:
      'https://images.unsplash.com/photo-1536622296737-0306394bf61c?w=100&h=100&fit=crop&crop=face',
    name: 'David Garnier',
    role: 'Coach sportif',
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export const Testimonials = () => {
  return (
    <section className="bg-background  relative">
      <div className="container z-10 mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            Ce que disent nos étudiants
          </h2>
          <p className="text-center mt-5 opacity-75">
            Découvrez ce que les membres de notre communauté disent de leur
            expérience.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
