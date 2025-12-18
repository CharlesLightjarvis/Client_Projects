"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./ui/button";
import cLogo from "~/assets/c-logo.png";
import devOps from "~/assets/devOps.png";
import istqb from "~/assets/istqbLogoTest.png";
import devWeb from "~/assets/devweb.png";

const slides = [
  {
    id: 1,
    title: "Formations DevOps",
    description:
      "Maîtrisez les outils et pratiques DevOps pour accélérer vos déploiements",
    image: devOps,
    link: "/formations/devops-professionnel",
  },
  {
    id: 2,
    title: "Certifications Testing",
    description:
      "Devenez un expert en tests logiciels avec nos formations certifiantes",
    image: istqb,
    link: "/formations/test-automation-expert",
  },
  {
    id: 3,
    title: "Développement Web",
    description:
      "Apprenez à créer des applications web modernes et performantes",
    image: devWeb,
    link: "/formations/fullstack-javascript",
  },
  {
    id: 4,
    title: "Langage C",
    description:
      "Maîtrisez le langage C pour le développement système et embarqué",
    image: cLogo,
    link: "/formations/c-debutants",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current, autoplay]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slides[current].image})`,
            backgroundSize: "contain",
            backgroundColor: "#fafafa",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 max-w-[700px] text-lg sm:text-xl md:text-2xl"
            >
              {slides[current].description}
            </motion.p>
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to={slides[current].link}>En savoir plus</Link>
              </Button>
            </motion.div> */}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40"
        onClick={prevSlide}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Précédent</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40"
        onClick={nextSlide}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Suivant</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrent(index)}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          />
        ))}
      </div>
    </div>
  );
}
