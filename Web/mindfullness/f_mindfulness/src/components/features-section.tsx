import { motion } from 'framer-motion'
import { CheckCircle, Clock, Home, Lock, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      icon: Clock,
      title: 'À votre rythme',
      desc: 'Plus de pression, étudiez quand vous voulez.',
    },
    {
      icon: Home,
      title: 'Depuis chez vous',
      desc: 'Disponible sur ordinateur, tablette et mobile.',
    },
    {
      icon: Lock,
      title: 'Accès illimité',
      desc: 'Reprenez vos cours aussi souvent que nécessaire.',
    },
  ]

  return (
    <section
      id="public"
      className="py-20 md:py-28 overflow-hidden relative bg-muted/30"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Profils & Public
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              À qui s'adressent nos{' '}
              <span className="text-indigo-500 italic">formations</span> ?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
              Nos formations en mindfulness et bien-être énergétique s'adaptent
              à votre parcours, quel qu'il soit. Aucune capacité particulière
              n'est requise.
            </p>

            <ul className="space-y-3">
              {targets.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl sm:text-3xl">
                  Apprendre à son rythme, où que vous soyez
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                {benefits.map((benefit, i) => {
                  const IconComponent = benefit.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex gap-5 items-start"
                    >
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Quote Card */}
                <div className="mt-10 p-6 bg-muted/50 rounded-2xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Notre Objectif
                    </p>
                  </div>
                  <p className="text-foreground italic leading-relaxed">
                    "Rendre les pratiques énergétiques et la mindfulness
                    accessibles, tout en conservant une approche sérieuse,
                    structurée et de qualité."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
