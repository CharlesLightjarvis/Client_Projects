import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqData = [
  {
    question: "Comment se déroulent les formations ?",
    answer:
      "Nos formations sont dispensées en présentiel ou en distanciel selon vos besoins. Elles combinent théorie et pratique avec des projets concrets. Les sessions sont limitées à de petits groupes pour garantir un suivi personnalisé.",
  },
  {
    question: "Les formations sont-elles certifiantes ?",
    answer:
      "Oui, toutes nos formations préparent à des certifications reconnues internationalement. Le coût de la certification est inclus dans le prix de la formation.",
  },
  {
    question: "Quels sont les prérequis pour suivre une formation ?",
    answer:
      "Les prérequis varient selon les formations. Pour les formations débutantes, aucune expérience n'est requise. Pour les formations avancées, une expérience préalable ou des connaissances de base sont nécessaires.",
  },
  {
    question: "Comment financer ma formation ?",
    answer:
      "Plusieurs options de financement sont possibles : CPF, OPCO, Pôle Emploi, financement personnel. Notre équipe vous accompagne dans les démarches administratives pour obtenir le financement adapté.",
  },
  {
    question: "Proposez-vous un accompagnement post-formation ?",
    answer:
      "Oui, nous offrons un suivi post-formation de 3 mois incluant un accès à notre plateforme de ressources, des sessions de questions/réponses et un accompagnement pour la préparation aux certifications.",
  },
  {
    question: "Quel est le taux de réussite aux certifications ?",
    answer:
      "Notre taux de réussite aux certifications est de 95%. Ce résultat est obtenu grâce à notre méthode pédagogique éprouvée et à l'accompagnement personnalisé de nos formateurs experts.",
  },
];

export function FAQ() {
  return (
    <section className="container bg-[#F5F5F5] py-12 md:py-16 lg:py-20">
      <motion.div
        className="mx-auto max-w-[800px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <span className="text-primary font-semibold mb-4 block">FAQ</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Questions fréquentes
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Retrouvez les réponses aux questions les plus courantes sur nos
            formations
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <Button asChild variant="outline">
            <Link to="/contact">Contactez-nous</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
