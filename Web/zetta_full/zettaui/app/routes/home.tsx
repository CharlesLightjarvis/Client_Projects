"use client";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { MainNav } from "~/components/main-nav";
import { HeroSlider } from "~/components/hero-slider";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FeaturedCourses } from "~/components/featured-courses";
import { Testimonials } from "~/components/testimonials";
import { Footer } from "~/components/footer";
import UpperNav from "~/components/upper-nav";
import learning from "../assets/Learning-bro.png";
import learning2 from "../assets/Learning2.png";
import mission from "../assets/mission.png";
import { FAQ } from "~/components/faq";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <UpperNav />
        <div className="container border-b">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <HeroSlider />

        {/* first section  */}
        <section className="container py-8 md:py-12 border-b">
          <div className="mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Colonne du texte - côté droit */}
            <div className="w-full md:w-1/2">
              <motion.div
                className="flex flex-col items-start mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-1 bg-orange-500 mb-2"></div>
                <h3 className="text-lg font-semibold text-orange-500 uppercase tracking-wide">
                  ALIMENTEZ VOTRE AVENIR
                </h3>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Zetta Training & Consulting
              </motion.h2>

              <motion.p
                className="text-muted-foreground md:text-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Centre de formation et de consulting que nous, enseignants
                universitaires, avons fondé en 2023 en collaboration avec des
                experts de l'industrie. Nous croyons que l'éducation est la clé
                du succès et en particulier dans le domaine des Technologies de
                l'Information et de la Communication.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button asChild size="lg">
                  <Link to="/about">En savoir plus</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={learning}
                alt="Zetta Training"
                className="rounded-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </section>

        {/* Second section - Qui sommes nous */}
        <section className="bg-slate-50 dark:bg-slate-900/30 border-y py-8 md:py-12">
          <div className="container">
            <div className="mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img
                  src={learning2}
                  alt="Qui sommes nous"
                  className="rounded-lg w-full h-auto"
                />
              </motion.div>

              <div className="w-full md:w-1/2">
                <motion.div
                  className="flex flex-col items-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-1 bg-orange-500 mb-2"></div>
                  <h3 className="text-lg font-semibold text-orange-500 uppercase tracking-wide">
                    QUI SOMMES NOUS ?
                  </h3>
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Zetta Training & Consulting
                </motion.h2>

                <motion.p
                  className="text-muted-foreground md:text-lg mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Zetta Training est un centre de formation et de consulting que
                  nous, enseignants universitaires, avons fondé en 2023 en
                  collaboration avec des experts de l'industrie. Nous croyons
                  que l'éducation est la clé du succès et en particulier dans le
                  domaine des Technologies de l'Information et de la
                  Communication, et nous nous efforçons de préparer nos
                  apprenants à un avenir numérique prometteur.
                </motion.p>

                <motion.ul
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {[
                    "Excellence Académique",
                    "Formation Pratique",
                    "Accompagnement Individualisé",
                    "Réseautage et Opportunités Professionnelles",
                    "Formation en Éthique et Sécurité Informatique",
                    "Adaptabilité",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <ChevronRight className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section Mission */}
        <section className="container py-8 md:py-12">
          <div className="mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Colonne du texte - côté gauche */}
            <div className="w-full md:w-1/2">
              <motion.div
                className="flex flex-col items-start mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-1 bg-orange-500 mb-2"></div>
                <h3 className="text-lg font-semibold text-orange-500 uppercase tracking-wide">
                  MISSION
                </h3>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Mission et Objectifs
              </motion.h2>

              <motion.p
                className="text-muted-foreground md:text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Notre mission est de former la prochaine génération de
                professionnels des TIC, en fournissant une éducation de qualité,
                pertinente et à jour dans le domaine en constante évolution des
                technologies de l'information et de la communication et qui
                s'aligne avec les besoins actuels de marché du travail.
              </motion.p>

              <motion.p
                className="text-muted-foreground md:text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Notre engagement est de préparer nos apprenants à exceller dans
                un monde numérique en constante évolution, en leur fournissant
                les compétences, les connaissances et la confiance nécessaires
                pour réussir.
              </motion.p>
            </div>

            {/* Colonne de l'image - côté droit */}
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src={mission} // Assurez-vous d'importer cette image
                alt="Notre mission"
                className="rounded-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-muted py-8 md:py-12">
          <div className="container">
            <motion.div
              className="flex flex-col items-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-1 bg-orange-600 mb-2"></div>
              <h3 className="text-lg font-semibold text-orange-600 uppercase tracking-wide mb-4">
                Expertise
              </h3>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
                Nos domaines d'expertise
              </h2>
              <p className="mt-4 text-muted-foreground text-center max-w-2xl">
                Des formations adaptées aux besoins du marché, conçues pour vous
                propulser vers l'excellence
              </p>
            </motion.div>

            <Tabs defaultValue="web" className="w-full">
              <TabsList className="mx-auto mb-8 flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TabsTrigger
                  value="web"
                  className="data-[state=active]:bg-orange-600/90 data-[state=active]:text-white"
                >
                  Développement Web
                </TabsTrigger>
                <TabsTrigger
                  value="devops"
                  className="data-[state=active]:bg-orange-600/90 data-[state=active]:text-white"
                >
                  DevOps
                </TabsTrigger>
                <TabsTrigger
                  value="testing"
                  className="data-[state=active]:bg-orange-600/90 data-[state=active]:text-white"
                >
                  Testing
                </TabsTrigger>
                <TabsTrigger
                  value="langc"
                  className="data-[state=active]:bg-orange-600/90 data-[state=active]:text-white"
                >
                  Langage C
                </TabsTrigger>
              </TabsList>

              <TabsContent value="web" className="space-y-4">
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        React & TypeScript
                      </CardTitle>
                      <CardDescription className="text-base">
                        Maîtrisez le développement d'applications modernes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Apprenez à créer des interfaces utilisateur dynamiques
                        et performantes avec React et TypeScript.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Node.js & Express
                      </CardTitle>
                      <CardDescription className="text-base">
                        Développez des API robustes et évolutives
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Créez des applications backend performantes avec Node.js
                        et le framework Express.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Full-Stack JavaScript
                      </CardTitle>
                      <CardDescription className="text-base">
                        Maîtrisez le développement de bout en bout
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Développez des applications complètes en utilisant
                        JavaScript côté client et serveur.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="devops" className="space-y-4">
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Docker & Kubernetes
                      </CardTitle>
                      <CardDescription className="text-base">
                        Conteneurisation et orchestration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Apprenez à déployer et gérer des applications
                        conteneurisées à grande échelle.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        CI/CD Pipeline
                      </CardTitle>
                      <CardDescription className="text-base">
                        Automatisation du déploiement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Mettez en place des pipelines d'intégration et de
                        déploiement continus.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Infrastructure as Code
                      </CardTitle>
                      <CardDescription className="text-base">
                        Terraform & Ansible
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Gérez votre infrastructure comme du code pour plus
                        d'efficacité et de fiabilité.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="testing" className="space-y-4">
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Test Automation
                      </CardTitle>
                      <CardDescription className="text-base">
                        Selenium & Cypress
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Automatisez vos tests fonctionnels et d'interface
                        utilisateur pour garantir la qualité.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Tests Unitaires
                      </CardTitle>
                      <CardDescription className="text-base">
                        Jest & Mocha
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Maîtrisez les techniques de tests unitaires pour
                        garantir la fiabilité de votre code.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Performance Testing
                      </CardTitle>
                      <CardDescription className="text-base">
                        JMeter & Gatling
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Évaluez et optimisez les performances de vos
                        applications sous charge.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="langc" className="space-y-4">
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        C pour Débutants
                      </CardTitle>
                      <CardDescription className="text-base">
                        Fondamentaux du langage C
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Apprenez les bases du langage C et la programmation
                        procédurale.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        C Avancé
                      </CardTitle>
                      <CardDescription className="text-base">
                        Structures de données et algorithmes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Maîtrisez les concepts avancés du langage C pour des
                        applications performantes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-orange-600">
                        Programmation Système
                      </CardTitle>
                      <CardDescription className="text-base">
                        Développement bas niveau
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Développez des applications système et embarquées avec
                        le langage C.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <FeaturedCourses />
        <Testimonials />
        <FAQ />

        <section className="container py-12 md:py-16 lg:py-20">
          <motion.div
            className="mx-auto max-w-[800px] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-1 bg-orange-600 mx-auto mb-6" />
            <span className="text-primary font-semibold mb-4 block">
              Passez à l'action
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Make your dreams come true!
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Vous voulez donner une deuxième chance à votre carrière? Optez
              pour une reconversion de qualité avec Zetta.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full md:w-auto bg-orange-600 hover:bg-orange-700"
              >
                <Link to="/formations">Voir toutes nos formations</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Demander des informations</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
