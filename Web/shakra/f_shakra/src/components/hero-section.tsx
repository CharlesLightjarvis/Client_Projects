import { Button } from '@/components/ui/button'
// import { Link } from '@tanstack/react-router'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden ">
      {/* Background Map with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/80 to-background z-10" />
        <div className="scale-110 ">
          <DotLottieReact
            src="https://lottie.host/8af73863-ce75-4c9d-82e0-a0166e4720d0/VO4Wfi4Y2n.lottie"
            loop
            autoplay
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Votre énergie.
            <br />
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              La clé de votre équilibre
            </span>
          </h1>
          {/* Subheading */}
          <p className="mx-auto  text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Des formations guidées pour libérer vos blocages émotionnels,
            retrouver la paix intérieure et renforcer votre énergie au
            quotidien.
          </p>
          {/* Value Props */}
          <div className="mx-auto flex   items-center justify-center gap-4 text-sm text-muted-foreground sm:text-base md:gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Équilibrer vos chakras</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span>Renforcez votre énergie vitale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Atteindre votre plein potentiel</span>
            </div>
          </div>
          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4  sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-lg sm:h-14 sm:px-10"
            >
              <a href="#">Commencer </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
