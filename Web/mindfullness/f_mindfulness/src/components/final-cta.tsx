import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 md:py-32">
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
                  Ready to stop talking and{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    start shipping
                  </span>
                  ?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Join developers and designers who are tired of working alone.
                  Find your partner. Build something real. Ship in 30 days.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Create Your Account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg"
                >
                  Browse Projects
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-purple-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Start building today</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Warning/Call-out */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <div className="mx-auto inline-flex max-w-2xl flex-col gap-4 rounded-xl border bg-background/50 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="font-semibold">Not for everyone</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Bridge is only for devs and designers who commit to finishing
                what they start. If you're looking for "maybe later" or
                "flexible deadlines", this isn't your place.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
