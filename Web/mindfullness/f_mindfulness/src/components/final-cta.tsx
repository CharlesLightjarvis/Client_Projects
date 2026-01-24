import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-muted/30 mt-32 py-24 md:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border-2 bg-card shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            {/* Content */}
            <div className="relative space-y-8 p-8 text-center md:p-12 lg:p-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span>Open for new members</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Commencez aujourd'hui votre chemin vers un
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {''} bien-être énergétique
                  </span>
                  ?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Rejoignez notre studio et transformez votre quotidien avec nos
                  outils de pleine conscience.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Create Votre Compte
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg"
                >
                  Decouvrir Nos Formations
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
