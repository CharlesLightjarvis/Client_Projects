import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Card, CardContent, CardFooter } from "./ui/card";
import user from "../assets/user.png";

const testimonials = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Développeuse Full-Stack",
    company: "TechInnovate",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "La formation DevOps a complètement transformé ma façon de travailler. Les compétences acquises m'ont permis d'obtenir une promotion dans mon entreprise.",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Ingénieur QA",
    company: "TestPro Solutions",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "La certification en Test Automation a été un véritable tremplin pour ma carrière. La formation était pratique et directement applicable à mon travail quotidien.",
    rating: 5,
  },
  {
    id: 3,
    name: "Émilie Leclerc",
    role: "Développeuse Backend",
    company: "DataSys",
    image: "/placeholder.svg?height=100&width=100",
    testimonial:
      "J'ai suivi la formation sur le langage C et je suis impressionnée par la qualité du contenu et la pédagogie des formateurs. Je recommande vivement !",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted py-12 md:py-16 lg:py-20">
      <div className="container">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-1 bg-orange-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ce que disent nos étudiants
          </h2>
          <p className="mt-4 text-muted-foreground">
            Découvrez les témoignages de nos anciens étudiants
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <CardContent className="pt-8">
                  <div className="flex items-center space-x-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-600"
                            : "fill-muted-foreground/20 text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="relative">
                    <div className="absolute -top-4 -left-2 text-6xl text-primary opacity-20">
                      "
                    </div>
                    <p className="relative z-10 text-lg italic leading-relaxed">
                      {testimonial.testimonial}
                    </p>
                  </blockquote>
                </CardContent>
                <CardFooter className="border-t bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <img
                        src={user}
                        alt={testimonial.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
